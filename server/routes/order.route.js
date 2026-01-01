const { Router } = require("express");
const {
  createOrder,
  getMyOrders, // ✅ use this
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

// ================= USER ROUTES =================

// create order (COD)
orderRouter.post("/create", isAuthenticated, createOrder);

// my orders (logged-in user only)
orderRouter.get("/my-orders", isAuthenticated, getMyOrders);

orderRouter.get(
  "/all",
  isAuthenticated,
  isAuthorization(["admin"]),
  getAllOrders
);

// get single order
orderRouter.get("/:id", isAuthenticated, getOrderById);

// cancel order
orderRouter.put("/cancel/:id", isAuthenticated, cancelOrder);

// ================= PAYMENT ROUTES =================

orderRouter.post("/esewa/initiate", isAuthenticated, initiateEsewaPayment);
orderRouter.get("/esewa/success", esewaSuccess);

// ================= ADMIN ROUTES =================

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
