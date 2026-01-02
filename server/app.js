var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
const connectMongoDB = require("./config/db/database");
const productRouter = require("./routes/product.routes");
const userRouter = require("./routes/user.routes");
const orderRouter = require("./routes/order.route");
const dashboardRouter = require("./routes/dashboard.route");
const categoryRoute = require("./routes/category.route");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ origin: "*" }));

// DB connect
connectMongoDB();

// Routes
app.use("/", indexRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/file", require("./routes/file.route").fileRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/categories", categoryRoute);

// 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
