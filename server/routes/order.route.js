const { Router } = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByEmail,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  initiateEsewaPayment,
  esewaSuccess, // add this
} = require("../controller/order.controller");

const orderRouter = Router();

// COD route
orderRouter.route("/create").post(createOrder);

// eSewa initiation
orderRouter.route("/esewa/initiate").post(initiateEsewaPayment);
orderRouter.route("/esewa/success").get(esewaSuccess);

// other routes
orderRouter.route("/all").get(getAllOrders);
orderRouter.route("/:id").get(getOrderById);
orderRouter.route("/customer/:email").get(getOrdersByEmail);
orderRouter.route("/status/:id").put(updateOrderStatus);
orderRouter.route("/cancel/:id").put(cancelOrder);
orderRouter.route("/delete/:id").delete(deleteOrder);

module.exports = orderRouter;
