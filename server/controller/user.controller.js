const bcrypt = require("bcrypt");
const UserModel = require("../schema/user.model");

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
