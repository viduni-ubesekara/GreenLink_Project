const express = require("express");
const Cart = require("../models/CartModel");

const router = express.Router();

// Get all cart items
router.get("/", async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add an item to the cart
router.post("/add", async (req, res) => {
    const { itemName, itemPrice } = req.body;

    try {
        let cartItem = await Cart.findOne({ itemName });

        if (cartItem) {
            // If item exists, increase count and update total price
            cartItem.itemCount += 1;
            cartItem.totalPrice = cartItem.itemCount * itemPrice;
        } else {
            // If new item, add to cart
            cartItem = new Cart({
                itemName,
                itemPrice,
                itemCount: 1,
                totalPrice: itemPrice,
            });
        }

        await cartItem.save();
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update item quantity in cart
router.put("/update/:id", async (req, res) => {
    const { itemCount } = req.body;

    try {
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) return res.status(404).json({ message: "Item not found" });

        cartItem.itemCount = itemCount;
        cartItem.totalPrice = itemCount * cartItem.itemPrice;

        await cartItem.save();
        res.json(cartItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove item from cart
router.delete("/remove/:id", async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Clear the cart
router.delete("/clear", async (req, res) => {
    try {
        await Cart.deleteMany({});
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
