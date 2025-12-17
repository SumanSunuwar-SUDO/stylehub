const { Router } = require("express");
const {
  createUser,
  readAllUser,
  readSpecificUser,
  updateUser,
  deleteUser,
  verifyEmail,
  login,
} = require("../controller/user.controller");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { isAuthorization } = require("../middleware/isAuthorization");

const userRouter = Router();
userRouter.route("/create").post(createUser);
userRouter.route("/verify-mail").post(verifyEmail);

userRouter
  .route("/read")
  .get(isAuthenticated, isAuthorization("admin"), readAllUser);
userRouter.route("/login").post(login);
// dynamic routes
userRouter.route("/update/:id").patch(updateUser);
userRouter.route("/delete/:id").delete(deleteUser);
userRouter.route("/:id").get(readSpecificUser);

module.exports = userRouter;
