const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const inventoryRoutes = require("./inventoryControl/inventoryRoutes/routes");
const feedbackRoter = require('./feedbackPanel/routes/FeedbackRoute.js');
const questionRouter = require('./feedbackPanel/routes/questionRoute.js');
const promotionRoute = require("./marketingPanel/routes/promotionRoute.js");
const cartRoutes = require("./inventoryControl/inventoryRoutes/cartRoutes");
const cropRoutes = require('./cropManagement/routes/cropRoutes');
const paymentRoutes = require('./PaymentManagement/route/paymentRoute');

// Set port and MongoDB URI
const PORT = process.env.PORT || 5000; // If port 5001 is taken, try switching to 5002 or 5003
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://nipunasachintha0022:mongotech123@inspiredtech.t0szwrd.mongodb.net/inspiredTech?retryWrites=true&w=majority";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware section
app.use(cors()); // Ensure this is working well with React running on a different port
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/inventoryPanel', inventoryRoutes);
app.use("/cart", cartRoutes);
app.use("/api/user", feedbackRoter);
app.use("/api/question", questionRouter);
app.use("/api/userpromo", promotionRoute);
app.use(promotionRoute); 
app.use('/crops', cropRoutes);
app.use('/api/payment', paymentRoutes);

// MongoDB connection implementation
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
