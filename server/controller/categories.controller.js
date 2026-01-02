const Product = require("../schema/product.model");

// Get all main categories and their subcategories
exports.getCategories = async (req, res) => {
  try {
    // Aggregate unique mainCategory and their subCategories
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$mainCategory",
          subCategories: { $addToSet: "$subCategory" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
