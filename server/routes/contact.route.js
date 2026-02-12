const { Router } = require("express");
const { contactUs } = require("../controller/contact.controller");

const contactRouter = Router();
contactRouter.route("/send-message").post(contactUs);

module.exports = contactRouter;
