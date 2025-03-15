/*const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true}, 
    phone: { type: Number, required: true },
    season: { type: String, required: true },
    yieldPerAcre: { type: Number, required: true },
    weatherDependency: { type: String, required: false },
    pestControl: { type: String, required: false },
    fertilizerSchedule: { type: String, required: false },
    fertilizerType: { type: String, required: false },
    wateringSchedule: { type: String, required: false },
    soilType: { type: String, required: false },
    expectedHarvestDate: { type: Date, required: false },
    plantingDate: { type: Date, required: false }
});

module.exports = mongoose.model('Crop', cropSchema);
*/

const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, 
    phone: { type: String, required: true },  // ✅ Ensure phone is a String
    season: { type: String, required: true },
    yieldPerAcre: { type: Number, required: true },
    weatherDependency: { type: String, required: false },
    pestControl: { type: String, required: false },
    fertilizerSchedule: { type: String, required: false },
    fertilizerType: { type: String, required: false },
    wateringSchedule: { type: String, required: false },
    soilType: { type: String, required: false },
    expectedHarvestDate: { type: Date, required: false },
    plantingDate: { type: Date, required: false }
});

module.exports = mongoose.model('Crop', cropSchema);
