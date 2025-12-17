const UserModel = require("../schema/user.model");

exports.isAuthorization = (roles) => {
  return async (req, res, next) => {
    try {
      let userId = req._id;
      let result = await UserModel.findById(userId);

      let tokenRole = result.role;

      if (roles.includes(tokenRole)) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "User not authorized",
        });
      }
    } catch (error) {
      res.status(400).json({
        success: true,
        message: "User not authorized",
        error: error.message,
      });
    }
  };
};
