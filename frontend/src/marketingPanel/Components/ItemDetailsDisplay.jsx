import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

function ItemDetailsDisplay({ item }) {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    fetch('/inventoryPanel/' + item.itemID, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.reload(); // Refresh after deletion
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });

    setOpenDialog(false);
  };

  const formattedDate = new Date(item.createdAt).toLocaleDateString();

  return (
    <>
      <Box component={Paper} elevation={3} sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={3}>
          {/* Item Image */}
          <Box sx={{ flexShrink: 0, position: 'relative' }}>
            <img
              src={item.imgURL}
              alt={item.itemName}
              style={{ width: 200, height: 200, objectFit: 'cover' }}
            />
            {/* Promotion Badge */}
            {item.promotionEnable && (
              <Chip
                icon={<LocalOfferIcon />}
                label="Promo"
                color="secondary"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  fontWeight: 'bold',
                }}
              />
            )}
          </Box>

          {/* Item Details */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Item ID: {item.itemID}
            </Typography>
            <Typography variant="body1" paragraph>Name: {item.itemName}</Typography>
            <Typography variant="body1" paragraph>Brand: {item.itemBrand}</Typography>
            <Typography variant="body1" paragraph>Price: Rs.{item.itemPrice}</Typography>
            <Typography variant="body1" paragraph>Available Stocks: {item.stockCount}</Typography>
            <Typography variant="body1" paragraph>Warranty: {item.warranty}</Typography>
            <Typography variant="body1" paragraph>Category: {item.category}</Typography>
            <Typography variant="body1" paragraph>Added Date: {formattedDate}</Typography>

            {/* Promotion Description (if enabled) */}
            {item.promotionEnable && item.promotionDescription && (
              <Tooltip title="Promotion Description" arrow placement="top">
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: '#fff8e1',
                    borderLeft: '4px solid #ff9800',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" color="secondary">
                    🎉 {item.promotionDescription}
                  </Typography>
                </Box>
              </Tooltip>
            )}

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                color="success"
                variant="contained"
                size="small"
                sx={{
                  borderRadius: 1,
                  boxShadow: 2,
                  '&:hover': {
                    backgroundColor: 'green.600',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s ease-in-out',
                  },
                  '&:active': {
                    backgroundColor: 'green.700',
                    transform: 'scale(0.98)',
                  },
                }}
                onClick={() => navigate(`/marketingPanel/shopEdit/${item.itemID}`)}
              >
                Edit
              </Button>

              <Button
                color="error"
                variant="contained"
                size="small"
                sx={{
                  borderRadius: 1,
                  boxShadow: 2,
                  '&:hover': {
                    backgroundColor: 'red.600',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s ease-in-out',
                  },
                  '&:active': {
                    backgroundColor: 'red.700',
                    transform: 'scale(0.98)',
                  },
                }}
                onClick={handleDeleteClick}
              >
                Remove
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ItemDetailsDisplay;
