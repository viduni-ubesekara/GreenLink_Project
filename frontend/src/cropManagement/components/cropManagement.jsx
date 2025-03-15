import React, { useState, useEffect } from 'react';
import { getCrops, addCrop, deleteCrop } from '../services/api';

const CropManagement = () => {
    const [crops, setCrops] = useState([]);
    const [form, setForm] = useState({
        name: '',
        type: '',
        season: '',
        yieldPerAcre: '',
        weatherDependency: '',
        pestControl: '',
        fertilizerSchedule: '',
        fertilizerType: '',
        wateringSchedule: '',
        soilType: '',
        expectedHarvestDate: '',
        plantingDate: ''
    });

    useEffect(() => {
        loadCrops();
    }, []);

    const loadCrops = async () => {
        try {
            const res = await getCrops();
            setCrops(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addCrop(form);
        loadCrops();
        setForm({ 
            name: '', 
            type: '', 
            season: '', 
            yieldPerAcre: '', 
            weatherDependency: '',
            pestControl: '',
            fertilizerSchedule: '',
            fertilizerType: '',
            wateringSchedule: '',
            soilType: '',
            expectedHarvestDate: '',
            plantingDate: ''
        }); // Reset form after submit
    };

    const handleDelete = async (id) => {
        await deleteCrop(id);
        loadCrops();
    };

    return (
        <div>
            <h2>Crop Management</h2>

            {/* Form to add a new crop */}
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    name="type"
                    placeholder="Type"
                    value={form.type}
                    onChange={handleChange}
                    required
                />
                <input
                    name="season"
                    placeholder="Season"
                    value={form.season}
                    onChange={handleChange}
                    required
                />
                <input
                    name="yieldPerAcre"
                    type="number"
                    placeholder="Yield per Acre"
                    value={form.yieldPerAcre}
                    onChange={handleChange}
                    required
                />
                <input
                    name="weatherDependency"
                    placeholder="Weather Dependency"
                    value={form.weatherDependency}
                    onChange={handleChange}
                />
                <input
                    name="pestControl"
                    placeholder="Pest Control"
                    value={form.pestControl}
                    onChange={handleChange}
                />
                <input
                    name="fertilizerSchedule"
                    placeholder="Fertilizer Schedule"
                    value={form.fertilizerSchedule}
                    onChange={handleChange}
                />
                <input
                    name="fertilizerType"
                    placeholder="Fertilizer Type"
                    value={form.fertilizerType}
                    onChange={handleChange}
                />
                <input
                    name="wateringSchedule"
                    placeholder="Watering Schedule"
                    value={form.wateringSchedule}
                    onChange={handleChange}
                />
                <input
                    name="soilType"
                    placeholder="Soil Type"
                    value={form.soilType}
                    onChange={handleChange}
                />
                <input
                    name="expectedHarvestDate"
                    type="date"
                    value={form.expectedHarvestDate}
                    onChange={handleChange}
                />
                <input
                    name="plantingDate"
                    type="date"
                    value={form.plantingDate}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Add Crop</button>
            </form>

            {/* Crop List */}
            <ul>
                {crops.map(crop => (
                    <li key={crop._id}>
                        {crop.name} - {crop.type} ({crop.season}) 
                        <button onClick={() => handleDelete(crop._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CropManagement;
