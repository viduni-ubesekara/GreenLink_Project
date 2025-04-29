const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');

// Get all crops
router.get('/', async (req, res) => {
    try {
        const crops = await Crop.find();  // Get all crops from the database
        res.json(crops);  // Send back all crops as JSON
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific crop by ID
router.get('/:id', async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);  // Fetch the crop by ID
        if (!crop) {
            return res.status(404).json({ error: 'Crop not found' });  // Return 404 if not found
        }
        res.json(crop);  // Return the specific crop
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/*
router.post('/', async (req, res) => {
    const {
        name, type, season, yieldPerAcre, weatherDependency,
        pestControl, fertilizerSchedule, fertilizerType,
        wateringSchedule, soilType, expectedHarvestDate, plantingDate
    } = req.body;

    console.log('Received data:', req.body); // Add this to log the data sent

    // Check if all required fields are provided
    if (!name || !type || !season || !yieldPerAcre) {
        return res.status(400).json({ error: 'Missing required fields. Name, type, season, and yield per acre are required.' });
    }

    try {
        // Create a new crop with the provided data
        const newCrop = new Crop({
            name,
            type,
            season,
            yieldPerAcre,
            weatherDependency,
            pestControl,
            fertilizerSchedule,
            fertilizerType,
            wateringSchedule,
            soilType,
            expectedHarvestDate,
            plantingDate
        });

        // Save the crop to the database
        await newCrop.save();

        // Respond with a success message
        res.status(201).json({ message: 'Crop added successfully' });
    } catch (err) {
        // Log the error and respond with a more detailed error message
        console.error('Error adding crop:', err); // Logs the error for debugging
        res.status(500).json({ error: `Internal Server Error: ${err.message}` });
    }
});
*/
// Add a new crop
router.post('/', async (req, res) => {
    const {
        name, type, phone, season, yieldPerAcre, weatherDependency,
        pestControl, fertilizerSchedule, fertilizerType,
        wateringSchedule, soilType, expectedHarvestDate, plantingDate
    } = req.body;

    console.log('Received data:', req.body); // Debugging: Logs incoming request data

    // Ensure phone number is provided
    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required.' });
    }

    // Check if all required fields are provided
    if (!name || !type || !season || !yieldPerAcre) {
        return res.status(400).json({ error: 'Missing required fields. Name, type, season, and yield per acre are required.' });
    }

    try {
        // Create a new crop with the provided data
        const newCrop = new Crop({
            name,
            type,
            phone,  // ✅ Ensure phone is included
            season,
            yieldPerAcre,
            weatherDependency,
            pestControl,
            fertilizerSchedule,
            fertilizerType,
            wateringSchedule,
            soilType,
            expectedHarvestDate,
            plantingDate
        });

        // Save the crop to the database
        await newCrop.save();

        // Respond with a success message
        res.status(201).json({ message: 'Crop added successfully', crop: newCrop });
    } catch (err) {
        // Log the error and respond with a detailed error message
        console.error('Error adding crop:', err);
        res.status(500).json({ error: `Internal Server Error: ${err.message}` });
    }
});





// Update a crop
router.put('/:id', async (req, res) => {
    const {
        name, type, season, yieldPerAcre, weatherDependency,
        pestControl, fertilizerSchedule, fertilizerType,
        wateringSchedule, soilType, expectedHarvestDate, plantingDate
    } = req.body;

    try {
        const updatedCrop = await Crop.findByIdAndUpdate(req.params.id, {
            name,
            type,
            season,
            yieldPerAcre,
            weatherDependency,
            pestControl,
            fertilizerSchedule,
            fertilizerType,
            wateringSchedule,
            soilType,
            expectedHarvestDate,
            plantingDate
        }, { new: true });

        if (!updatedCrop) {
            return res.status(404).json({ error: 'Crop not found' });
        }

        res.json({ message: 'Crop updated successfully', crop: updatedCrop });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a crop
router.delete('/:id', async (req, res) => {
    try {
        const deletedCrop = await Crop.findByIdAndDelete(req.params.id);

        if (!deletedCrop) {
            return res.status(404).json({ error: 'Crop not found' });
        }

        res.json({ message: 'Crop deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
