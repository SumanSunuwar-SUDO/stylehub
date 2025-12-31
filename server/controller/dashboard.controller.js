const Order = require("../schema/order.models");
const User = require("../schema/user.model");

exports.getDashboardStats = async (req, res, next) => {
  try {
    //total orders
    const totalOrders = await Order.countDocuments();

    //total customers
    const totalCustomers = await User.countDocuments();

    //pending payments
    const pendignPayments = await Order.countDocuments({
      paymentStatus: "pending",
    });

    //total sales
    const completedOrders = await Order.find({ paymentStatus: "completed" });

    const totalSales = completedOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    res.status(200).json({
      success: false,
      data: {
        totalSales,
        totalOrders,
        pendignPayments,
        totalCustomers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Dashboard stats fetch failed.",
      error: error.message,
    });
  }
};
