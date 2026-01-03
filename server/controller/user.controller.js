const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../schema/user.model");
const { secretKey } = require("../utils/constant");
const { sendEmail } = require("../utils/sendEmail");

exports.createUser = async (req, res, next) => {
  try {
    let data = req.body;
    let email = data.email;
    let hashedPassword = await bcrypt.hash(data.password, 10);
    data = {
      ...data,
      password: hashedPassword,
    };

    let existingEmail = await UserModel.findOne({ email: email });

    if (existingEmail) {
      throw new Error("Email already used");
    }

    const user = await UserModel.create(data);

    // create token
    let infoObj = {
      id: user._id,
    };

    let expiryInfo = {
      expiresIn: "1d",
    };

    let token = await jwt.sign(infoObj, secretKey, expiryInfo);
    // console.log(token);

    // send email
    await sendEmail({
      to: data.email,
      subject: "Account Registration",
      html: `
    <h2>Welcome to StyleHub </h2>
    <p>Please verify your email to continue</p>
    <a href="http://localhost:3000/verify-email?token=${token}">
      Verify Email
    </a>
  `,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    // Get token from header OR query
    const authHeader = req.headers.authorization;
    const tokenFromQuery = req.query.token;

    const token = authHeader?.split(" ")[1] || tokenFromQuery;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Verification token missing",
      });
    }

    const infoObj = jwt.verify(token, secretKey);
    const userId = infoObj.id;

    await UserModel.findByIdAndUpdate(userId, { isVerifiedEmail: true });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerifiedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // Generate new token
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1d" });

    // Send verification email
    await sendEmail({
      to: email,
      subject: "Resend Verification Email",
      html: `
        <h2>Verify your email</h2>
        <p>Please click the link below to verify your email:</p>
        <a href="http://localhost:3000/verify-email?token=${token}">
          Verify Email
        </a>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid dentials");
    }

    if (user.isVerifiedEmail === false) {
      throw new Error("Email is not verified");
    }

    let isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Passowrd is not valid");
    }
    let infoObj = {
      id: user._id,
    };
    let expiryInfo = {
      expiresIn: "100d",
    };
    let token = await jwt.sign(infoObj, secretKey, expiryInfo);

    res.status(200).json({
      success: true,
      message: "webuser login successfully",
      data: user,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User login failed",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body?.email;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1d" });

    await sendEmail({
      to: email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <a href="http://localhost:3000/reset-password?token=${token}">
          Reset your password
        </a>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset link sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    let password = req.body.password;
    let hashedPassword = await bcrypt.hash(password, 10);
    let user = await UserModel.findByIdAndUpdate(
      req._id,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      result: user,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

exports.readAllUser = async (req, res, next) => {
  try {
    let user = await UserModel.find({});

    res.status(200).json({
      success: true,
      message: "User read successfully.",
      result: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.readSpecificUser = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Specific user read successfully.",
      result: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      result: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let user = await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      result: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
