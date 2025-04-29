import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getCropById, deleteCrop } from '../services/api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import html2pdf from 'html2pdf.js';
import HomeIcon from '@mui/icons-material/Home';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const CropDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [crop, setCrop] = useState(null);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // To control the dialog visibility

    useEffect(() => {
        const loadCrop = async () => {
            try {
                const response = await getCropById(id);
                setCrop(response.data);
                setError(null);
            } catch (err) {
                setError('Unable to fetch crop details. Please try again later.');
            }
        };
        loadCrop();
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!crop) return <div>Loading...</div>;

    const calculateGrowthStatus = (plantingDate, harvestingDate) => {
        const now = new Date();
        const planting = new Date(plantingDate);
        const harvesting = new Date(harvestingDate);
        const totalGrowthTime = harvesting - planting;
        const elapsedTime = now - planting;
        const growthPercentage = Math.min((elapsedTime / totalGrowthTime) * 100, 100);

        if (now < planting) {
            return { status: 'Not Planted', progress: 0 };
        } else if (now >= planting && now <= harvesting) {
            return { status: 'Growing', progress: growthPercentage };
        } else {
            return { status: 'Harvested', progress: 100 };
        }
    };

    const { status, progress } = calculateGrowthStatus(crop.plantingDate, crop.expectedHarvestDate);

    const pieChartData = {
        labels: ['Growth Progress', 'Remaining Time'],
        datasets: [
            {
                data: [progress, 100 - progress],
                backgroundColor: ['#4caf50', '#e0e0e0'],
                borderColor: ['#4caf50', '#e0e0e0'],
                borderWidth: 1,
            },
        ],
    };

    const handleDelete = async () => {
        try {
            await deleteCrop(id);
            navigate('/crop-list');
        } catch (err) {
            console.error('Error deleting crop:', err);
        }
    };

    const handleGenerateReport = () => {
        // Exclude the action buttons by targeting only the crop details container
        const element = document.getElementById('crop-details-container');
        
        // Options for the PDF generation
        const options = {
            filename: `${crop.name}-report.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        
        // Use html2pdf to convert the selected content into a PDF
        html2pdf().from(element).set(options).save();
    };

    const openDeleteDialog = () => setOpenDialog(true);
    const closeDeleteDialog = () => setOpenDialog(false);

    return (
        <Container maxWidth="lg" sx={{ padding: 0 }}>
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }} id="crop-details-container">
                {/* Home Icon Button in the top-right corner */}
                <IconButton 
                    onClick={() => navigate('/')} 
                    sx={{ position: 'absolute', top: 16, right: 16, color: '#388e3c' }}
                >
                    <HomeIcon />
                </IconButton>

                {/* Page Title as Crop Name with Centering and Styling */}
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{
                        textAlign: 'center', // Center the text
                        fontWeight: 'bold', // Bold the text
                        color: '#388e3c', // Use a dark green color
                        textTransform: 'uppercase', // Make the text uppercase
                        letterSpacing: '1px', // Add some letter spacing
                        marginBottom: 3, // Add space below the title
                    }}
                >
                   🌱 {crop.name} 🌿
                </Typography>

                {/* Stylish Crop Details Table */}
                <TableContainer component={Paper} sx={{ marginBottom: 4, borderRadius: 2, boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#388e3c' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Detail</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Information</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Type</TableCell>
                                <TableCell>{crop.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Season</TableCell>
                                <TableCell>{crop.season}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Yield per Acre</TableCell>
                                <TableCell>{crop.yieldPerAcre}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Weather Dependency</TableCell>
                                <TableCell>{crop.weatherDependency || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Pest Control</TableCell>
                                <TableCell>{crop.pestControl || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Fertilizer Schedule</TableCell>
                                <TableCell>{crop.fertilizerSchedule || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Fertilizer Type</TableCell>
                                <TableCell>{crop.fertilizerType || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Watering Schedule</TableCell>
                                <TableCell>{crop.wateringSchedule || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Soil Type</TableCell>
                                <TableCell>{crop.soilType || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Expected Harvest Date</TableCell>
                                <TableCell>{crop.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toLocaleDateString() : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Planting Date</TableCell>
                                <TableCell>{crop.plantingDate ? new Date(crop.plantingDate).toLocaleDateString() : 'N/A'}</TableCell>
                            </TableRow>
                            {/* Added Phone Number Row */}
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Phone Number</TableCell>
                                <TableCell>{crop.phone}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                
                {/* Adding Page Break for Second Page */}
                <div style={{ pageBreakAfter: 'always' }}></div>

                {/* Growth Status & Pie Chart */}
                <Paper elevation={2} sx={{ padding: 2, marginTop: 4 }}>
                    <Typography variant="h6" gutterBottom>Growth Status</Typography>
                    <Typography variant="body1" gutterBottom>Status: {status}</Typography>
                    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
                        <Pie data={pieChartData} />
                    </div>
                </Paper>
            </Paper>

            {/* Action Buttons */}
            <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 4 }}>
                <Grid item>
                    <Button variant="contained" color="success" onClick={handleGenerateReport}>
                        Generate Report
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="error" onClick={openDeleteDialog}>
                        Delete Crop
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="success" onClick={() => navigate(`/edit-crop/${id}`)}>
                        Edit Crop
                    </Button>
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={closeDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this crop?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => { handleDelete(); closeDeleteDialog(); }} 
                        color="secondary" 
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CropDetails;
