const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name."],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name."],
    },
    email: {
      type: String,
      required: [true, "An email address is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    isVerifiedEmail: {
      type: String,
      required: [true, "isVerified Email is required."],
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
