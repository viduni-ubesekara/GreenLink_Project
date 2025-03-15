const express = require('express');
const router = express.Router();
const multer = require('multer');
const Payment = require('../model/Payment');
const path = require('path');
const fs = require('fs');

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ✅ POST - Upload form and files
router.post(
  '/',
  upload.fields([
    { name: 'orderReceipt', maxCount: 1 },
    { name: 'paymentSlip', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { name, phoneNumber, email } = req.body;
      const orderReceipt = req.files['orderReceipt']?.[0]?.path;
      const paymentSlip = req.files['paymentSlip']?.[0]?.path;

      const newPayment = new Payment({
        name,
        phoneNumber,
        email,
        orderReceipt,
        paymentSlip,
        paymentStatus: 'Submitted'
      });

      await newPayment.save();
      res.status(201).json({ message: 'Payment submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error while saving payment' });
    }
  }
);

// ✅ GET - View all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST - Approve a payment by ID
router.post('/approve/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.paymentStatus = 'Approved';
    await payment.save();

    res.status(200).json({ message: 'Payment approved successfully' });
  } catch (err) {
    console.error('Error approving payment:', err);
    res.status(500).json({ message: 'Server error while approving payment' });
  }
});
// ✅ DELETE - Delete a payment by ID
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).json({ message: 'Server error while deleting payment' });
  }
});
// ✅ POST - Reject a payment by ID
router.post('/reject/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.paymentStatus = 'Rejected';
    await payment.save();

    res.status(200).json({ message: 'Payment rejected successfully' });
  } catch (err) {
    console.error('Error rejecting payment:', err);
    res.status(500).json({ message: 'Server error while rejecting payment' });
  }
});


// Add GET route for single payment
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    console.error('Error fetching payment:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid payment ID format' });
    }
    res.status(500).json({ message: 'Server error while fetching payment' });
  }
});

module.exports = router;
