const mongoose = require("mongoose");
const Product = require("../schema/product.model");
const Order = require("../schema/order.models");

// CREATE ORDER
exports.createOrder = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      items,
      subTotal,
      total,
      paymentMethod = "cod",
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const orderItems = [];

    for (const item of items) {
      const productId = item._id;

      if (!item.size) {
        return res.status(400).json({
          success: false,
          message: `Size is required for product ${item.productName}`,
        });
      }

      // Reduce stock atomically
      const product = await Product.findOneAndUpdate(
        { _id: productId, in_stuck: { $gte: item.quantity } },
        { $inc: { in_stuck: -item.quantity } },
        { new: true }
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product out of stock: ${item.productName}`,
        });
      }

      orderItems.push({
        product: productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
        subTotal: item.price * item.quantity,
      });
    }

    const order = new Order({
      user: req.userId || null,
      fullName,
      email: email.toLowerCase(),
      phone,
      address,
      items: orderItems,
      subTotal: Number(subTotal),
      total: Number(total),
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL ORDERS (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Order read successfullt.",
      result: orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ORDER BY ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ORDERS BY EMAIL
exports.getOrdersByEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const orders = await Order.find({ email });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false });

    order.orderStatus = status;
    await order.save();

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// CANCEL ORDER + RESTORE STOCK
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { in_stuck: item.quantity },
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
