const mongoose = require('mongoose');

// Database schema definition for Item table
const itemSchema = new mongoose.Schema({
    itemID: {
        type: String,
        required: true,
        unique: true,
    },
    itemName: {
        type: String,
        required: true
    },
    itemBrand: {
        type: String,
        required: true
    },
    itemPrice: {
        type: Number,
        required: true
    },
    stockCount: {
        type: Number,
        required: true
    },
    itemDescription: {
        type: String,
        required: true
    },
    catagory: {
        type: String,
        required: true
    },
    warranty: {
        type: String
    },
    imgURL: {
        type: String,
        required: true
    },

    // ✅ Promotion fields
    promotionEnable: {
        type: Boolean,
        default: false
    },
    promotionDescription: {
        type: String,
        default: ''
    },
    expireDate: {
        type: Date,  // This will store the expiration date of the promotion
        default: null
    }

}, { timestamps: true });

const Items = mongoose.model('Items', itemSchema);

module.exports = Items;
