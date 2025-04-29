import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Paper, Grid, Snackbar, Alert } from '@mui/material';
import { addCrop } from '../services/api';
import { motion } from 'framer-motion';
import CropIcon from '@mui/icons-material/Grain';

const AddCrop = () => {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        type: '',
        season: '',
        yieldPerAcre: '',
        weatherDependency: '',
        pestControl: '',
        fertilizerSchedule: '',
        fertilizerType: '',
        wateringSchedule: '',
        soilType: '',
        plantingDate: '',
        expectedHarvestDate: '',
    });

    const [errorMessages, setErrorMessages] = useState({});
    const [successMessage, setSuccessMessage] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Restrict phone input to exactly 10 digits
        if (name === 'phone') {
            newValue = value.replace(/\D/g, '').slice(0, 10); // Only allow numbers and limit to 10 digits
        }

        // Restrict non-numeric input for 'name', 'type', 'season', 'weatherDependency', 'soilType'
        if (
            ['name', 'type', 'season', 'weatherDependency', 'soilType'].includes(name) &&
            /\d/.test(value)
        ) {
            newValue = value.replace(/\d/g, ''); // Remove any numeric characters
        }

        // Convert yieldPerAcre to a number
        if (name === 'yieldPerAcre') {
            newValue = value ? parseFloat(value) : '';
        }

        setForm({ ...form, [name]: newValue });
    };

    const validateForm = () => {
        const errors = {};
        const plantingDate = new Date(form.plantingDate);
        const expectedHarvestDate = new Date(form.expectedHarvestDate);
        
        // Required fields validation
        const requiredFields = ['name', 'type', 'season', 'soilType', 'fertilizerSchedule', 'fertilizerType', 'wateringSchedule', 'pestControl', 'weatherDependency', 'plantingDate', 'expectedHarvestDate'];

        requiredFields.forEach(field => {
            if (!form[field]) errors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required`;
        });

        // Date validation
        if (expectedHarvestDate <= plantingDate) {
            errors.expectedHarvestDate = 'Expected Harvest Date must be after the Planting Date';
        }

        // Yield validation
        if (form.yieldPerAcre && (isNaN(form.yieldPerAcre) || form.yieldPerAcre < 0)) {
            errors.yieldPerAcre = 'Yield per Acre must be a valid positive number';
        }

        // Phone number validation: Must be exactly 10 digits
        const phoneRegex = /^[0-9]{10}$/;
        if (!form.phone) {
            errors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(form.phone)) {
            errors.phone = 'Phone number must be exactly 10 digits';
        }

        // Validation for 'name', 'type', 'season', 'weatherDependency', 'soilType': No numbers allowed
        ['name', 'type', 'season', 'weatherDependency', 'soilType'].forEach(field => {
            if (/\d/.test(form[field])) {
                errors[field] = `${field.replace(/([A-Z])/g, ' $1')} should not contain numbers`;
            }
        });

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
            await addCrop(form);
            setSuccessMessage(true);
            setTimeout(() => {
                navigate('/', { state: { crop: form } });
            }, 3000);
        } catch (error) {
            console.error('Error adding crop:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={6} sx={{ padding: 4, width: '100%', borderRadius: 2 }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        <CropIcon sx={{ marginRight: 1, backgroundColor: '#4caf50', color: '#fff', padding: 0.5, borderRadius: '50%' }} />
                        Add Crop
                    </Typography>
                </motion.div>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {Object.keys(form).map((key) => (
                            <Grid item xs={12} key={key}>
                                <TextField
                                    fullWidth
                                    type={key.includes('Date') ? 'date' : key === 'phone' ? 'tel' : key === 'yieldPerAcre' ? 'number' : 'text'}
                                    name={key}
                                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                    value={form[key]}
                                    onChange={handleChange}
                                    InputLabelProps={key.includes('Date') ? { shrink: true } : {}}
                                    error={!!errorMessages[key]}
                                    helperText={errorMessages[key] || (key === 'phone' ? 'Enter a 10-digit phone number' : '')}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button type="submit" variant="contained" color="success" fullWidth sx={{ marginTop: 3, fontWeight: 'bold' }}>
                            Add Crop
                        </Button>
                    </motion.div>
                </form>
            </Paper>
            <Snackbar open={successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage(false)}>
                <Alert severity="success">Crop added successfully!</Alert>
            </Snackbar>
        </Container>
    );
};

export default AddCrop;
