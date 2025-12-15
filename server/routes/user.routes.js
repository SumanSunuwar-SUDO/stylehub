const { Router } = require("express");
const {
  createUser,
  readAllUser,
  readSpecificUser,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");

const userRouter = Router();
userRouter.route("/create").post(createUser);
userRouter.route("/read").get(readAllUser);

// dynamic routes
userRouter.route("/update/:id").patch(updateUser);
userRouter.route("/delete/:id").delete(deleteUser);
userRouter.route("/:id").get(readSpecificUser);

module.exports = userRouter;
