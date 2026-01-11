const ProductModel = require("../schema/product.model");

// CREATE PRODUCT
exports.createProduct = async (req, res, next) => {
  try {
    const { mainCategory, gender, subCategory, sizes } = req.body;

    // Basic validation
    if (!mainCategory || !gender || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "Main category, gender, and subcategory are required.",
      });
    }

    if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one size with quantity and price is required.",
      });
    }

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

// READ ALL PRODUCTS
exports.readAllProduct = async (req, res, next) => {
  try {
    // Get query params
    const search = req.query.search || "";
    const category = req.query.category || ""; // men/women from query
    const subCategory = req.query.subCategory || "";

    // Build filter object
    let filter = {};

    // Filter by gender/category (case-insensitive)
    if (category) {
      filter.gender = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Filter by subCategory (case-insensitive)
    if (subCategory) {
      filter.subCategory = { $regex: new RegExp(`^${subCategory}$`, "i") };
    }

    // Filter by search term (name, description, subCategory, gender)
    if (search.trim() !== "") {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
        { gender: { $regex: search, $options: "i" } },
      ];
    }

    const products = await ProductModel.find(filter);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      result: products,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// READ SPECIFIC PRODUCT
exports.readSpecific = async (req, res, next) => {
  try {
    let product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Specific product retrieved successfully.",
      result: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res, next) => {
  try {
    const { mainCategory, gender, subCategory, sizes } = req.body;

    if (sizes && (!Array.isArray(sizes) || sizes.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Sizes array cannot be empty.",
      });
    }

    let product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

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

// DELETE PRODUCT
exports.deleteProduct = async (req, res, next) => {
  try {
    let product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

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
