const { Router } = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  initiateEsewaPayment,
  esewaSuccess,
  getAllOrders,
} = require("../controller/order.controller");

const { isAuthenticated } = require("../middleware/isAuthenticated");
const { isAuthorization } = require("../middleware/isAuthorization");

const orderRouter = Router();

orderRouter.post("/create", isAuthenticated, createOrder);

orderRouter.get("/my-orders", isAuthenticated, getMyOrders);

orderRouter.get(
  "/all",
  isAuthenticated,
  isAuthorization(["admin"]),
  getAllOrders
);

orderRouter.get("/:id", isAuthenticated, getOrderById);

orderRouter.put("/cancel/:id", isAuthenticated, cancelOrder);

orderRouter.post("/esewa/initiate", isAuthenticated, initiateEsewaPayment);
orderRouter.get("/esewa/success", esewaSuccess);

orderRouter.put(
  "/status/:id",
  isAuthenticated,
  isAuthorization(["admin"]),
  updateOrderStatus
);

orderRouter.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorization(["admin"]),
  deleteOrder
);

module.exports = orderRouter;
