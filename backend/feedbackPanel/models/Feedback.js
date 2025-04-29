const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["complement", "complaint", "suggetions"],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  recommend: {
    type: String,
    required: true,
    enum: ["yes", "no"],
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
