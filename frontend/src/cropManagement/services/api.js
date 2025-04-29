import axios from "axios";

const API_URL = "http://localhost:3000/crops"; // Adjust if needed

// Fetch all crops
export const getCrops = async () => await axios.get(API_URL);

// Add a new crop
export const addCrop = async (crop) => await axios.post(API_URL, crop);

// Update a crop by ID
export const updateCrop = async (id, crop) => await axios.put(`${API_URL}/${id}`, crop);

// Delete a crop by ID
export const deleteCrop = async (id) => await axios.delete(`${API_URL}/${id}`);

// Fetch a single crop by ID
export const getCropById = async (id) => {
    try {
        return await axios.get(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Error fetching crop details:", error);
        throw error; // Rethrow the error so that it can be caught in the calling function
    }


};
