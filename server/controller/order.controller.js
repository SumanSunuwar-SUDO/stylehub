const mongoose = require("mongoose");
const crypto = require("crypto");
const Product = require("../schema/product.model");
const Order = require("../schema/order.models");
const { esewa_secret_key } = require("../utils/constant");

// CREATE ORDER (COD)
exports.createOrder = async (req, res) => {
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

    if (paymentMethod === "esewa") {
      return res.status(400).json({
        success: false,
        message: "Use esewa initiate API",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const orderItems = [];

    for (const item of items) {
      if (!item.size) {
        return res.status(400).json({
          success: false,
          message: `Size is required for product ${item.productName}`,
        });
      }

      // Reduce stock atomically
      const product = await Product.findOneAndUpdate(
        { _id: item._id, in_stuck: { $gte: item.quantity } },
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
        product: item._id,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
        subTotal: item.price * item.quantity,
      });
    }

    const order = new Order({
      user: req.user._id,
      fullName,
      email: email.toLowerCase(),
      phone,
      address,
      items: orderItems,
      subTotal: Number(subTotal),
      total: Number(total),
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ORDERS BY LOGGED-IN USER
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET ORDER BY ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE ORDER STATUS (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("items.product"); // populate product to access stock

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (["delivered", "cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status after '${order.orderStatus}'`,
      });
    }

    // If cancelling, restore product stock
    if (status === "cancelled") {
      for (let item of order.items) {
        if (item.product) {
          item.product.in_stuck += item.quantity; // increase stock
          await item.product.save();
        }
      }
    }

    order.orderStatus = status;

    // COD logic
    if (order.paymentMethod === "cod") {
      if (status === "processing") order.paymentStatus = "pending";
      else if (status === "delivered") order.paymentStatus = "completed";
      else if (status === "cancelled") order.paymentStatus = "failed";
    }

    await order.save();

    res.json({ success: true, message: "Order updated successfully", order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ESEWA INITIATE
exports.initiateEsewaPayment = async (req, res) => {
  try {
    const { fullName, email, phone, address, items, subTotal, total } =
      req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product || product.in_stuck < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product out of stock: ${item.productName}`,
        });
      }

      orderItems.push({
        product: item._id,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
        subTotal: item.price * item.quantity,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      fullName,
      email: email.toLowerCase(),
      phone,
      address,
      items: orderItems,
      subTotal,
      total,
      paymentMethod: "esewa",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    const transaction_uuid = order._id.toString();
    const product_code = "EPAYTEST";
    const amount = Number(subTotal).toFixed(2);
    const delivery = Number(total - subTotal).toFixed(2);
    const total_amount = (Number(amount) + Number(delivery)).toFixed(2);

    const data = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = crypto
      .createHmac("sha256", esewa_secret_key)
      .update(data)
      .digest("base64");

    res.json({
      success: true,
      paymentData: {
        total_amount,
        amount,
        tax_amount: "0",
        product_service_charge: "0",
        product_delivery_charge: delivery,
        transaction_uuid,
        product_code,
        success_url: "http://localhost:3000/payment/success",
        failure_url: "http://localhost:3000/payment/failure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (error) {
    console.error("ESWEA INIT ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ESEWA SUCCESS
exports.esewaSuccess = async (req, res) => {
  try {
    if (!req.query.data)
      return res.status(400).json({ success: false, message: "Data missing" });

    let decoded;
    try {
      decoded = JSON.parse(
        Buffer.from(req.query.data, "base64").toString("utf-8")
      );
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data format" });
    }

    const { transaction_uuid } = decoded;
    const order = await Order.findById(transaction_uuid);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (order.paymentStatus === "completed")
      return res.json({ success: true, order });

    order.paymentStatus = "completed";
    order.orderStatus = "delivered";

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { in_stuck: -item.quantity },
      });
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    console.error("ESWEA SUCCESS ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const order = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.status(200).json({
      success: true,
      message: "All order found successfully.",
      result: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
