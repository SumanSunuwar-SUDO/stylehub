const Order = require("../schema/order.models");
const User = require("../schema/user.model");

exports.getDashboardStats = async (req, res, next) => {
  try {
    //total orders
    const totalOrders = await Order.countDocuments();

    //total customers
    const totalCustomers = await User.countDocuments({
      role: "customer",
      isVerifiedEmail: true,
    });

    //pending payments
    const pendignPayments = await Order.countDocuments({
      paymentStatus: "pending",
    });

    //total sales
    const completedOrders = await Order.find({ paymentStatus: "completed" });

    const totalSales = completedOrders.reduce(
      (sum, order) => sum + order.total,
      0,
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

exports.getMonthlySales = async (req, res, next) => {
  try {
    const sales = await Order.aggregate([
      {
        $match: { paymentStatus: "completed" },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Monthly sales fetch failed.",
      error: error.message,
    });
  }
};

exports.categorySales = async (req, res, next) => {
  try {
    const categorySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "completed",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.category",
          totalRevenue: {
            $sum: {
              $multiply: ["$products.price", "$products.quantity"],
            },
          },
        },
      },
      {
        $project: {
          name: "$_id",
          value: "$totalRevenue",
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: categorySales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
