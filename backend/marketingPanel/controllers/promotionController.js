const Promotion = require("../models/Promotion");
const nodemailer = require("nodemailer");

// Controller function to create a promotion
exports.createPromotion = async (req, res) => {
  const {
    promotionName,
    promotionKey,
    startDate,
    endDate,
    userEmail,
    number,
    promotionType,
    description,
    imageBase64,
    
    // New fields for algorithm-based discounts
    discountApplyType,
    tiers,
    products,
    globalDiscountValue,
    globalDiscountUnit
  } = req.body;

  try {
    if (!promotionType) {
      return res.status(400).json({ message: "Promotion type is required" });
    }

    // Create a new promotion object
    const newPromotion = new Promotion({
      promotionName,
      promotionKey,
      startDate,
      endDate,
      userEmail: promotionType === "Individual" ? userEmail : "",
      number,
      promotionType,
      description,
      imageBase64,

      // New fields included (optional)
      discountApplyType,
      tiers,
      products,
      globalDiscountValue,
      globalDiscountUnit
    });

    const savedPromotion = await newPromotion.save();

    // If Individual promotion, send email
    if (promotionType === "Individual" && userEmail) {
      sendPromotionEmail(userEmail, promotionName, imageBase64);
    }

    return res.status(201).json(savedPromotion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating promotion" });
  }
};

// Get all promotions (admin)
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json(promotions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching promotions" });
  }
};

// Get a single promotion by ID
exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json(promotion);
  } catch (err) {
    res.status(500).json({ message: "Error fetching promotion" });
  }
};

// Get all group promotions (for homepage)
exports.getCommonPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({ promotionType: "Group" });
    res.status(200).json(promotions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching group promotions" });
  }
};

// Delete promotion
exports.deletePromotion = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPromotion = await Promotion.findByIdAndDelete(id);
    if (!deletedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting promotion" });
  }
};

// Update promotion
exports.updatePromotion = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedPromotion = await Promotion.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json(updatedPromotion);
  } catch (err) {
    res.status(500).json({ message: "Error updating promotion" });
  }
};

// Helper function to send email
const sendPromotionEmail = (email, promotionName, imageBase64) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "inspiretech26@gmail.com",
      pass: "nymx ghht szou fdxo",
    },
  });

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Promotion Available!</h2>
      <p style="color: #666; font-size: 16px;">Hello, there is a new promotion available: <strong>${promotionName}</strong></p>
      ${imageBase64 ? `
        <div style="margin: 20px 0;">
          <img src="data:image/jpeg;base64,${imageBase64}" 
               alt="${promotionName}" 
               style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        </div>
      ` : ''}
    </div>
  `;

  const mailOptions = {
    from: "inspiretech26@gmail.com",
    to: email,
    subject: "New Promotion: " + promotionName,
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
