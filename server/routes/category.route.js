const { Router } = require("express");
const { getCategories } = require("../controller/categories.controller");

const categoryRoute = Router();
categoryRoute.get("/", getCategories);

module.exports = categoryRoute;
