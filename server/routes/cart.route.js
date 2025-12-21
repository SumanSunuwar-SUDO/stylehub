const { Router } = require("express");
const { addCart } = require("../controller/cart.controller");

const cartRouter = Router();
cartRouter.route("/add").post(addCart);

module.exports = cartRouter;
