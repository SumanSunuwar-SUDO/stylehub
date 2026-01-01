const jwt = require("jsonwebtoken");
const { secretKey } = require("../utils/constant");

exports.isAuthenticated = async (req, res, next) => {
  try {
    // Get token from header
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const tokenArray = tokenString.split(" ");
    const token = tokenArray[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, secretKey);
    req.user = { _id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token is not valid",
      error: error.message,
    });
  }
};
