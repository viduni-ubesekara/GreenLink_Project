import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  Snackbar,
  Alert,
  Divider,
  IconButton,
  Grid
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; // 🔥 For promo icon

function ItemDetailPage() {
  const { itemID } = useParams();
  const [item, setItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemDetails = async () => {
      const response = await fetch(`/inventoryPanel/${itemID}`);
      const json = await response.json();
      if (response.ok) setItem(json);
    };
    fetchItemDetails();
  }, [itemID]);

  if (!item) return <Typography>Loading...</Typography>;

  const handleAddToCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName: item.itemName, itemPrice: item.itemPrice }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: "Item added to cart", severity: "success" });
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: errorData.message || "Error adding item", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Network Error. Try again later.", severity: "error" });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* Back Button */}
      <IconButton onClick={() => navigate("/inventoryPanel/shop")} sx={{ position: 'absolute', top: 40, left: 40 }}>
        <ArrowBack fontSize="large" />
      </IconButton>

      <Card sx={{ borderRadius: 2, boxShadow: 3, p: 3 }}>
        <Grid container spacing={3}>
          {/* Item Image */}
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={item.imgURL}
              alt={item.itemName}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
            />
          </Grid>

          {/* Item Details */}
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {item.itemName}
              </Typography>

              <Typography><strong>Category:</strong> {item.catagory}</Typography>
              <Divider sx={{ my: 2 }} />

              <Typography><strong>Brand:</strong> {item.itemBrand}</Typography>
              <Divider sx={{ my: 2 }} />

              <Typography><strong>Price:</strong> Rs.{item.itemPrice}</Typography>
              <Divider sx={{ my: 2 }} />

              <Typography><strong>Available Stocks:</strong> {item.stockCount}</Typography>
              <Divider sx={{ my: 2 }} />

              {/* ✅ Promotion Section */}
              {item.promotionEnable && item.promotionDescription && (
                <>
                  <Typography variant="body1" color="secondary" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LocalOfferIcon sx={{ mr: 1 }} /> Promotional Offer
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 2,
                      p: 2,
                      bgcolor: '#fff3e0',
                      borderLeft: '4px solid #ff9800',
                      borderRadius: 1,
                    }}
                  >
                    {item.promotionDescription}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              <Typography><strong>Item Description:</strong> {item.itemDescription || "No description available"}</Typography>
              <Divider sx={{ my: 2 }} />

              <Typography><strong>Added Date:</strong> {new Date(item.createdAt).toLocaleDateString()}</Typography>

              <Stack direction="row" spacing={2} mt={3}>
                <Button variant="contained" color="success" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <Button variant="contained" color="primary" startIcon={<ShoppingCart />} onClick={() => navigate("/cart")}>
                  Go to Cart
                </Button>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ItemDetailPage;
