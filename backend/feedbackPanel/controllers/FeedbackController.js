const Feedback = require("../models/Feedback");

exports.createFeedback = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone_no,
      description,
      date,
      category,
      rating,
      recommend,
    } = req.body;
    const feedback = new Feedback({
      firstName,
      lastName,
      email,
      phone_no,
      description,
      date,
      category,
      rating,
      recommend,
    });
    await feedback.save();
    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getFeedbackList = async (req, res) => {
  try {
    const feedbackList = await Feedback.find();
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone_no,
      description,
      date,
      category,
      rating,
      recommend,
    } = req.body;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        phone_no,
        description,
        date,
        category,
        rating,
        recommend,
      },
      { new: true }
    );
    res.json({ success: true, data: updatedFeedback });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
