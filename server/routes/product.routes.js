const { Router } = require("express");
const {
  createProduct,
  readAllProduct,
  readSpecific,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller");

const productRouter = Router();

productRouter.route("/create").post(createProduct);
productRouter.route("/read").get(readAllProduct);
productRouter.route("/read/:id").get(readSpecific);
productRouter.route("/update/:id").patch(updateProduct);
productRouter.route("/delete/:id").delete(deleteProduct);

module.exports = productRouter;
