const { Router } = require("express");
const {
  createUser,
  readAllUser,
  readSpecificUser,
  updateUser,
  deleteUser,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
} = require("../controller/user.controller");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { isAuthorization } = require("../middleware/isAuthorization");

const userRouter = Router();
userRouter.route("/create").post(createUser);
userRouter.route("/verify-mail").get(verifyEmail);
userRouter.route("/reset-passowrd").post(isAuthenticated, resetPassword);

userRouter
  .route("/read")
  .get(isAuthenticated, isAuthorization("admin"), readAllUser);
userRouter.route("/login").post(login);
userRouter.route("/forgot-password").post(forgotPassword);
// dynamic routes
userRouter
  .route("/update/:id")
  .patch(isAuthenticated, isAuthorization("admin"), updateUser);
userRouter.route("/delete/:id").delete(deleteUser);
userRouter
  .route("/:id")
  .get(isAuthenticated, isAuthorization("admin"), readSpecificUser);

module.exports = userRouter;
