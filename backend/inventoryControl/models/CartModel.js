const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    itemPrice: { type: Number, required: true },
    itemCount: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true },
});

const Cart = mongoose.model("Cart", CartItemSchema);

module.exports = Cart;
