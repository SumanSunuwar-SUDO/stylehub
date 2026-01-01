const UserModel = require("../schema/user.model");

exports.isAuthorization = (roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id; // ✅ use req.user._id from auth middleware
      const user = await UserModel.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (roles.includes(user.role)) {
        next();
      } else {
        return res
          .status(403)
          .json({ success: false, message: "User not authorized" });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error during authorization",
        error: error.message,
      });
    }
  };
};
