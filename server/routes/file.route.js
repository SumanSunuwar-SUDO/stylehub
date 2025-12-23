const { Router } = require("express");
const { fileUpload } = require("../controller/file.controller");
const upload = require("../utils/sendFile");

const fileRouter = Router();
fileRouter.route("/upload").post(upload.single("document"), fileUpload);

exports.fileRouter = fileRouter;
