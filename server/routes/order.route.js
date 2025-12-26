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
orderRouter.post("/create", createOrder); // Create COD order
orderRouter.get("/all", getAllOrders); // Get all orders
orderRouter.get("/:id", getOrderById); // Get order by ID
orderRouter.get("/customer/:email", getOrdersByEmail); // Get orders by customer email
orderRouter.put("/status/:id", updateOrderStatus); // Update order status
orderRouter.put("/cancel/:id", cancelOrder); // Cancel order
orderRouter.delete("/delete/:id", deleteOrder); // Delete order

module.exports = orderRouter;
