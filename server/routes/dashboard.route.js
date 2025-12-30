const { Router } = require("express");
const { getDashboardStats } = require("../controller/dashboard.controller");

const dashboardRouter = Router();

dashboardRouter.get("/stats", getDashboardStats);

module.exports = dashboardRouter;
