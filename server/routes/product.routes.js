const { Router } = require("express");
const {
  createProduct,
  readAllProduct,
  readSpecific,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { isAuthorization } = require("../middleware/isAuthorization");

const productRouter = Router();

// Create a new product (only admin)
productRouter.post(
  "/create",
  isAuthenticated,
  isAuthorization("admin"),
  createProduct
);
productRouter.get("/read", readAllProduct);
productRouter.get("/read/:id", readSpecific);

// Update a product by ID (only admin)
productRouter.patch(
  "/update/:id",
  isAuthenticated,
  isAuthorization("admin"),
  updateProduct
);

// Delete a product by ID (only admin)
productRouter.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorization("admin"),
  deleteProduct
);

module.exports = productRouter;
