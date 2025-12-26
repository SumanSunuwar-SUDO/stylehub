const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productName: String,
  price: Number,
  quantity: Number,
  size: { type: String, required: true },
  image: String,
  subTotal: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // order level ma matra user
    fullName: { type: String, trim: true, required: true },
    email: { type: String, lowercase: true, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    items: [orderItemSchema],

    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["cod"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    deliveredDate: Date,
  },
  { timestamps: true }
);

orderSchema.methods.updateStatus = function (status) {
  this.orderStatus = status;
  if (status === "delivered") this.deliveredDate = new Date();
  return this.save();
};

module.exports = mongoose.model("Order", orderSchema);
