const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  orderReceipt: { type: String }, // file path or URL
  paymentSlip: { type: String },  // file path or URL
  paymentStatus: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
