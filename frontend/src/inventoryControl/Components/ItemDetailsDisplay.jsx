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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
        window.location.reload();
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
          <Box sx={{ flexShrink: 0 }}>
            <img
              src={item.imgURL}
              alt={item.itemName}
              style={{ width: 200, height: 200, objectFit: 'cover' }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Item ID: {item.itemID}
            </Typography>
            <Typography variant="body1" paragraph>
              Name: {item.itemName}
            </Typography>
            <Typography variant="body1" paragraph>
              Brand: {item.itemBrand}
            </Typography>
            <Typography variant="body1" paragraph>
              Price: Rs.{item.itemPrice}
            </Typography>
            <Typography variant="body1" paragraph>
              Available Stocks: {item.stockCount}
            </Typography>
            <Typography variant="body1" paragraph>
              Added Date: {formattedDate}
            </Typography>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                color="success"
                variant="contained"
                size="small"
                onClick={() => navigate(`/inventoryPanel/item/${item.itemID}`)}
              >
                Edit
              </Button>

              <Button
                color="error"
                variant="contained"
                size="small"
                onClick={handleDeleteClick}
              >
                Remove
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>

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
