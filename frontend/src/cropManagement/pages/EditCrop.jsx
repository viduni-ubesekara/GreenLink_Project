import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCropById, updateCrop } from '../services/api';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box, TextField } from '@mui/material';

const EditCrop = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [crop, setCrop] = useState({
        name: '',
        type: '',
        season: '',
        yieldPerAcre: '',
        soilType: '',
        weatherDependency: '',
        pestControl: '',
        fertilizerSchedule: '',
        fertilizerType: '',
        wateringSchedule: '',
        plantingDate: '',
        expectedHarvestDate: ''
    });
    const [errorMessages, setErrorMessages] = useState({});
    const [error, setError] = useState(null);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

    useEffect(() => {
        const loadCrop = async () => {
            try {
                const res = await getCropById(id);
                setCrop(res.data);
            } catch (err) {
                console.error("Error fetching crop details:", err);
                setError('Unable to fetch crop details. Please try again later.');
            }
        };
        loadCrop();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCrop({ ...crop, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        const plantingDate = new Date(crop.plantingDate);
        const expectedHarvestDate = new Date(crop.expectedHarvestDate);

        if (!crop.name) errors.name = 'Crop Name is required';
        if (!crop.type) errors.type = 'Crop Type is required';
        if (!crop.season) errors.season = 'Season is required';
        if (!crop.soilType) errors.soilType = 'Soil Type is required';
        if (!crop.fertilizerSchedule) errors.fertilizerSchedule = 'Fertilizer Schedule is required';
        if (!crop.fertilizerType) errors.fertilizerType = 'Fertilizer Type is required';
        if (!crop.wateringSchedule) errors.wateringSchedule = 'Watering Schedule is required';
        if (!crop.pestControl) errors.pestControl = 'Pest Control information is required';
        if (!crop.weatherDependency) errors.weatherDependency = 'Weather Dependency is required';
        if (!crop.plantingDate) errors.plantingDate = 'Planting Date is required';
        if (!crop.expectedHarvestDate) errors.expectedHarvestDate = 'Expected Harvest Date is required';
        if (expectedHarvestDate <= plantingDate) errors.expectedHarvestDate = 'Expected Harvest Date must be after the Planting Date';

        if (crop.yieldPerAcre && isNaN(crop.yieldPerAcre)) {
            errors.yieldPerAcre = 'Yield per Acre must be a valid number';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        try {
            await updateCrop(id, crop);
            setOpenSuccessDialog(true);
            setTimeout(() => {
                navigate(`/crop/${id}`);
            }, 2000);
        } catch (err) {
            console.error("Error updating crop:", err);
            setError('Unable to update crop details. Please try again later.');
        }
    };

    const handleCloseDialog = () => {
        setOpenSuccessDialog(false);
    };

    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>{error}</div>;

    return (
        <Box sx={{ padding: '30px', maxWidth: '900px', margin: '0 auto', border: '1px solid #e0e0e0', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
            <Typography variant="h3" sx={{
                textAlign: 'center',
                fontWeight: 600,
                marginBottom: '20px',
                background: 'linear-gradient(to right, #4CAF50, #8BC34A)', 
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
                textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
            }}>
                Edit Crop Details
            </Typography>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <TextField
                    label="Crop Name"
                    name="name"
                    value={crop.name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.name}
                    helperText={errorMessages.name}
                />
                <TextField
                    label="Crop Type"
                    name="type"
                    value={crop.type}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.type}
                    helperText={errorMessages.type}
                />
                <TextField
                    label="Season"
                    name="season"
                    value={crop.season}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.season}
                    helperText={errorMessages.season}
                />
                <TextField
                    label="Yield per Acre"
                    name="yieldPerAcre"
                    value={crop.yieldPerAcre}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                    error={!!errorMessages.yieldPerAcre}
                    helperText={errorMessages.yieldPerAcre}
                />
                <TextField
                    label="Soil Type"
                    name="soilType"
                    value={crop.soilType}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.soilType}
                    helperText={errorMessages.soilType}
                />
                <TextField
                    label="Weather Dependency"
                    name="weatherDependency"
                    value={crop.weatherDependency || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.weatherDependency}
                    helperText={errorMessages.weatherDependency}
                />
                <TextField
                    label="Pest Control"
                    name="pestControl"
                    value={crop.pestControl || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.pestControl}
                    helperText={errorMessages.pestControl}
                />
                <TextField
                    label="Fertilizer Schedule"
                    name="fertilizerSchedule"
                    value={crop.fertilizerSchedule || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.fertilizerSchedule}
                    helperText={errorMessages.fertilizerSchedule}
                />
                <TextField
                    label="Fertilizer Type"
                    name="fertilizerType"
                    value={crop.fertilizerType || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.fertilizerType}
                    helperText={errorMessages.fertilizerType}
                />
                <TextField
                    label="Watering Schedule"
                    name="wateringSchedule"
                    value={crop.wateringSchedule || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.wateringSchedule}
                    helperText={errorMessages.wateringSchedule}
                />
                <TextField
                    label="Planting Date"
                    name="plantingDate"
                    type="date"
                    value={crop.plantingDate ? crop.plantingDate.split('T')[0] : ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.plantingDate}
                    helperText={errorMessages.plantingDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Expected Harvest Date"
                    name="expectedHarvestDate"
                    type="date"
                    value={crop.expectedHarvestDate ? crop.expectedHarvestDate.split('T')[0] : ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errorMessages.expectedHarvestDate}
                    helperText={errorMessages.expectedHarvestDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

<Button variant="contained" color="success" type="submit" sx={{ padding: '12px 25px', fontSize: '16px' }}>
    Update Crop
</Button>
            </form>

            <Dialog open={openSuccessDialog} onClose={handleCloseDialog}>
                <DialogTitle>Success!</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Crop details updated successfully.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditCrop;
