const jwt = require("jsonwebtoken");
const { secretKey } = require("../utils/constant");

exports.isAuthenticated = async (req, res, next) => {
  try {
    // get token from header
    let tokenString = req.headers.authorization;
    let tokenArray = tokenString.split(" ");
    let token = tokenArray[1];

    //verify token
    let user = await jwt.verify(token, secretKey);
    req._id = user.id;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Token is not valid",
      error: error.message,
    });
  }
};
