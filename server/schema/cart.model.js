const mongoose = require("mongoose");

const cartModule = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "User id is also required"],
  },
});

const CartModule = mongoose.model("Cart", cartModule);

module.exports = CartModule;
