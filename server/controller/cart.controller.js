const CartModule = require("../schema/cart.model");

exports.addCart = async (req, res, next) => {
  try {
    const cart = await CartModule.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product added to shopping cart",
      result: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: "Failed to add the product into shopping cart.",
      error: error.message,
    });
  }
};
