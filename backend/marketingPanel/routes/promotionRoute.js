const express = require("express");
const router = express.Router();
const PromotionController = require("../controllers/promotionController");

// Route to create a promotion
router.post("/api/promotions", PromotionController.createPromotion);

// Route to get all promotions (admin)
router.get("/api/promotions", PromotionController.getAllPromotions);

// Route to get a single promotion by ID
router.get("/api/promotions/:id", PromotionController.getPromotionById);

// Route to get all group promotions (for homepage)
router.get("/api/promotions/group", PromotionController.getCommonPromotions);

// Route to delete a promotion
router.delete("/api/promotions/:id", PromotionController.deletePromotion);

// Route to update a promotion
router.put("/api/promotions/:id", PromotionController.updatePromotion);

module.exports = router;
