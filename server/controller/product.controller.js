const ProductModel = require("../schema/product.model");

exports.createProduct = async (req, res, next) => {
  try {
    let product = await ProductModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product added to the database successfully.",
      result: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.readAllProduct = async (req, res, next) => {
  try {
    let product = await ProductModel.find();

    res.status(200).json({
      success: true,
      message: "Product read successfully.",
      result: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.readSpecific = async (req, res, next) => {
  try {
    let product = await ProductModel.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Specific product read successfully.",
      result: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      result: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    let product = await ProductModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      result: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
