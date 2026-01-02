const mongoose = require("mongoose");
const crypto = require("crypto");
const Product = require("../schema/product.model");
const Order = require("../schema/order.models");
const { esewa_secret_key } = require("../utils/constant");

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
        message: "Use eSewa initiate API",
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

      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productName}`,
        });
      }

      // Check stock for selected size
      const sizeObj = product.sizes.find((s) => s.size === item.size);
      if (!sizeObj || sizeObj.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product out of stock: ${item.productName}, Size: ${item.size}`,
        });
      }

      // Reduce stock for that size
      sizeObj.quantity -= item.quantity;
      await product.save();

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

exports.initiateEsewaPayment = async (req, res) => {
  try {
    const { fullName, email, phone, address, items, subTotal, total } =
      req.body;

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

      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productName}`,
        });
      }

      const sizeObj = product.sizes.find((s) => s.size === item.size);
      if (!sizeObj || sizeObj.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product out of stock: ${item.productName}, Size: ${item.size}`,
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
    console.error("ESEWA INIT ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

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

    // Reduce stock for selected sizes
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      const sizeObj = product.sizes.find((s) => s.size === item.size);
      if (sizeObj) {
        sizeObj.quantity -= item.quantity;
        await product.save();
      }
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    console.error("ESEWA SUCCESS ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get my orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order by ID
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

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("items.product");

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

    // If cancelling, restore stock
    if (status === "cancelled") {
      for (let item of order.items) {
        const product = await Product.findById(item.product);
        if (!product) continue;
        const sizeObj = product.sizes.find((s) => s.size === item.size);
        if (sizeObj) {
          sizeObj.quantity += item.quantity;
          await product.save();
        }
      }
    }

    order.orderStatus = status;
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

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      const sizeObj = product.sizes.find((s) => s.size === item.size);
      if (sizeObj) {
        sizeObj.quantity += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "cancelled";
    await order.save();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res
      .status(200)
      .json({ success: true, message: "All orders fetched", result: orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
