const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  promotionName: {
    type: String,
    required: true,
  },
  promotionKey: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  userEmail: {
    type: String,
    default: '',
  },
  number: {
    type: Number,
  },
  promotionType: {
    type: String,
    required: true,
    enum: ["Individual", "Group"], // only allow these two
  },
  description: {
    type: String,
  },
  imageBase64: {
    type: String,
  },

  // New fields you are trying to save
  discountApplyType: {
    type: String, // e.g., "tiered" or "global"
  },
  tiers: {
    type: [Object], // array of objects
    default: [],
  },
  products: {
    type: [String], // array of product IDs or names
    default: [],
  },
  globalDiscountValue: {
    type: Number,
  },
  globalDiscountUnit: {
    type: String, // "%" or "Rs" or whatever unit you use
  }
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);
