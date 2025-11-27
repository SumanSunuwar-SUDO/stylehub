const mongoose = require("mongoose");
const { dbUrl } = require("../../utils/constant");

function connectMongoDB() {
  mongoose
    .connect(dbUrl)
    .then(() => console.log("DB connected successfully.."))
    .catch((error) => console.log(error));
}

module.exports = connectMongoDB;
