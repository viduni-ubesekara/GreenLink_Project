import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// MUI Components
import { 
  Container, 
  CircularProgress, 
  Box, 
  Typography, 
  Paper, 
  Divider 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

// Components
import ItemUpdateForm from '../Components/ItemUpdateForm';

function UpdateItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemById = async () => {
      try {
        const response = await fetch(`/inventoryPanel/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const json = await response.json();
        setItem(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemById();
  }, [id]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        bgcolor: '#f4f6f8', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            width: '100%' 
          }}
        >
          {/* Heading */}
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <EditIcon sx={{ fontSize: 32, color: 'success.main', mr: 1 }} /> 
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              color="success.main" 
              textAlign="center"
              sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
            >
              Update Shop Promotion
            </Typography>
          </Box>
          <Divider sx={{ mb: 3, width: '100%' }} />

          {loading ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="50vh">
              <CircularProgress />
              <Typography variant="body1" mt={2} color="textSecondary">
                Loading item details...
              </Typography>
            </Box>
          ) : error ? (
            <Typography variant="h6" color="error" align="center">
              {error}
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" width="100%">
              {/* Pass all item data including promotionEnable and promotionDescription */}
              <ItemUpdateForm item={item} />
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default UpdateItemPage;
