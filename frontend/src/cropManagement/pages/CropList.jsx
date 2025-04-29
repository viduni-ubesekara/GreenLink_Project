import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Grid, Button, CircularProgress, Alert, TextField } from '@mui/material';
import { getCrops } from '../services/api';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import GrainIcon from '@mui/icons-material/Grain';

const CropList = () => {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    const [filteredCrops, setFilteredCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const response = await getCrops();
                if (!response || !response.data) {
                    throw new Error("Invalid API response");
                }
                setCrops(response.data);
                setFilteredCrops(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching crops:", err);
                setError("Unable to fetch crops. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchCrops();
    }, []);

    useEffect(() => {
        setFilteredCrops(
            crops.filter(crop =>
                crop.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, crops]);

    const handleGenerateCSV = () => {
        const header = ['Name', 'Type', 'Season', 'Yield per Acre', 'Weather Dependency', 'Pest Control', 'Fertilizer Schedule', 'Fertilizer Type', 'Watering Schedule', 'Soil Type', 'Planting Date', 'Expected Harvest Date'];
        const rows = crops.map(crop => [crop.name, crop.type, crop.season, crop.yieldPerAcre, crop.weatherDependency || 'N/A', crop.pestControl || 'N/A', crop.fertilizerSchedule || 'N/A', crop.fertilizerType || 'N/A', crop.wateringSchedule || 'N/A', crop.soilType || 'N/A', crop.plantingDate ? new Date(crop.plantingDate).toLocaleDateString() : 'N/A', crop.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toLocaleDateString() : 'N/A']);
        const csvContent = [header.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Crop_Report.csv';
        link.click();
    };

    const getCropIcon = () => {
        return <GrainIcon sx={{ fontSize: 40, color: '#388e3c' }} />;
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', marginTop: 4 }}>
                <CircularProgress />
                <Typography>Loading crops...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ textAlign: 'center', marginTop: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ marginTop: 4, textAlign: 'center', position: 'relative' }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} style={{ position: 'absolute', top: 0, right: 0, margin: '10px' }}>
                <Button variant="contained" color="success" onClick={handleGenerateCSV}>
                    Generate Report
                </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32', fontFamily: 'cursive' }}>
                    🌿 Farm Tracker 🌾
                </Typography>

                <TextField 
                    label="Search Crops" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ marginBottom: 3, borderRadius: '20px', overflow: 'hidden', border: '1px solid #ccc' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                    <Grid item xs={12} sm={4} md={4}>
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Paper 
                                elevation={3} 
                                sx={{
                                    padding: 3, 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    cursor: 'pointer', 
                                    minHeight: '180px',
                                    backgroundColor: '#e8f5e9',
                                    textAlign: 'center'
                                }}
                                onClick={() => navigate('/add-crop')}
                            >
                                <AddIcon sx={{ fontSize: 40, color: '#388e3c' }} />
                                <Typography variant="subtitle1" sx={{ color: '#388e3c' }}>
                                    Add New Crop
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    {filteredCrops.length > 0 ? (
                        filteredCrops.map((crop) => (
                            <Grid item xs={12} sm={4} md={4} key={crop._id}>
                                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Paper 
                                        elevation={3} 
                                        sx={{ 
                                            padding: 2, 
                                            textAlign: 'center',
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            minHeight: '180px'
                                        }}
                                    >
                                        <div>{getCropIcon()}</div>
                                        <Typography variant="h6" sx={{ marginTop: 1 }}>{crop.name}</Typography>
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            sx={{ marginTop: 1 }}
                                            onClick={() => navigate(`/crop/${crop._id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body1">No crops found.</Typography>
                        </Grid>
                    )}
                </Grid>
            </motion.div>
        </Container>
    );
};

export default CropList;
