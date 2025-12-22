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
    address: {
      type: String,
      required: [true, "Address field is required."],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
