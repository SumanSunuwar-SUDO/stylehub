const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name required."],
    },
    mainCategory: {
      type: String,
      required: [true, "Main category is required."],
    },
    gender: {
      type: String,
      required: [true, "Gender is required."],
      enum: ["Men", "Women"],
    },
    subCategory: {
      type: String,
      required: [true, "Subcategory is required."],
    },
    sizes: [
      {
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
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
