const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/FeedbackController");

router.post("/feedback", feedbackController.createFeedback);
router.get("/getfeedback", feedbackController.getFeedbackList);
router.put("/updatefeedback/:id", feedbackController.updateFeedback);
router.delete("/deletefeedback/:id", feedbackController.deleteFeedback);

module.exports = router;
