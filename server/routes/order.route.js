const { Router } = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByEmail,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} = require("../controller/order.controller");

const orderRouter = Router();

// Routes
orderRouter.route("/create").post(createOrder);
orderRouter.route("/all").get(getAllOrders);
orderRouter.route("/:id").get(getOrderById);
orderRouter.route("/customer/:email").get(getOrdersByEmail);
orderRouter.route("/status/:id").put(updateOrderStatus);
orderRouter.route("/cancel/:id").put(cancelOrder);
orderRouter.route("/delete/:id").delete(deleteOrder);

module.exports = orderRouter;
