const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name required."],
    },
    price: {
      type: Number,
      required: [true, "Price required"],
    },
    in_stuck: {
      type: Number,
      required: [true, "Stock value is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    image: {
      type: String,
      required: [true, "Image field is required."],
    },
    description: {
      type: String,
      required: [true, "Description field is required"],
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
