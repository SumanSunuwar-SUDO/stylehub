require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  dbUrl: process.env.MONGO_URI,
  secretKey: process.env.SECRET_KEY,
};
