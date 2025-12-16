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
      isVerifiedEmail: false,
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
      html: `<h1>Your account has been registered successfully.</h1>
      <a href="http://localhost:9000/api/users/verify-mail?token=${token}">
      http://localhost:9000/api/users/verify-mail?token=${token}</a>`,
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

exports.verifyEmail = async (req, res, next) => {
  try {
    // get token
    let tokenString = req.headers.authorization;
    let tokenArray = tokenString.split(" ");
    let token = tokenArray[1];

    // verify token
    let infoObj = await jwt.verify(token, secretKey);
    let userId = infoObj.id;

    // make isVerified is true
    let user = await UserModel.findByIdAndUpdate(userId, {
      isVerifiedEmail: true,
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      result: user,
    });
  } catch (error) {
    res.status(400).json({
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
    res.stauts(400).json({
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
