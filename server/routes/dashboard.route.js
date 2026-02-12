const { Router } = require("express");
const {
  getDashboardStats,
  getMonthlySales,
  categorySales,
} = require("../controller/dashboard.controller");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { isAuthorization } = require("../middleware/isAuthorization");

const dashboardRouter = Router();

dashboardRouter.get("/stats", getDashboardStats);
dashboardRouter.get("/monthly-sales", getMonthlySales);
dashboardRouter.get("/category-sales", categorySales);

module.exports = dashboardRouter;
