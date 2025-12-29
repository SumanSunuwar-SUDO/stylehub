const crypto = require("crypto");
const Product = require("../schema/product.model");
const Order = require("../schema/order.models");
const { esewa_secret_key } = require("../utils/constant");

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

    if (paymentMethod === "esewa") {
      return res.status(400).json({
        success: false,
        message: " Use esewa initiate API,",
      });
    }

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

exports.initiateEsewaPayment = async (req, res) => {
  try {
    const { fullName, email, phone, address, items, subTotal, total } =
      req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const order = await Order.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      address,
      items,
      subTotal,
      total,
      paymentMethod: "esewa",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    const transaction_uuid = order._id.toString();
    const product_code = "EPAYTEST";

    const amount = Number(subTotal).toFixed(2); // subtotal
    const delivery = Number(total - subTotal).toFixed(2); // shipping
    const total_amount = (Number(amount) + Number(delivery)).toFixed(2);

    const data = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = crypto
      .createHmac("sha256", esewa_secret_key)
      .update(data)
      .digest("base64");

    res.json({
      success: true,
      paymentData: {
        total_amount, // must equal amount + delivery + tax + service
        amount, // subtotal only
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

// eSewa Success Verification
exports.esewaSuccess = async (req, res) => {
  try {
    const decoded = JSON.parse(
      Buffer.from(req.query.data, "base64").toString("utf-8")
    );
    const { transaction_uuid, total_amount, product_code, signature } = decoded;

    const data = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const expectedSignature = crypto
      .createHmac("sha256", esewa_secret_key)
      .update(data)
      .digest("base64");

    if (signature !== expectedSignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const order = await Order.findById(transaction_uuid);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (order.paymentStatus === "completed") {
      return res.json({ success: true });
    }

    // Reduce stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { in_stuck: -item.quantity },
      });
    }

    order.paymentStatus = "completed";
    order.orderStatus = "processing";
    await order.save();

    res.json({ success: true });
  } catch (error) {
    console.error("ESWEA SUCCESS ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
