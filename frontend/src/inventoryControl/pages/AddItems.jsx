import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Alert, Paper } from '@mui/material';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import SlideBar from '../Components/SlideBar';

function AddItems() {
  const [itemImage, setItemImage] = useState(null);
  const [itemID, setItemID] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [stockCount, setStockCount] = useState('');
  const [catagory, setcatagory] = useState('');
  const [warranty, setWarranty] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    // Ensure that catagory is provided
    if (!catagory || catagory.trim() === '') errors.catagory = "Category is required.";

    // Ensure that an image is uploaded
    if (!itemImage) errors.imgURL = "Item image is required.";

    // Validate other fields
    if (!itemID || itemID.length < 3) errors.itemID = "Item ID must be at least 3 characters.";
    if (!itemName || itemName.length < 3) errors.itemName = "Item Name must be at least 3 characters.";
    if (!itemBrand) errors.itemBrand = "Item Brand is required.";
    if (!itemPrice || itemPrice <= 0) errors.itemPrice = "Item Price must be a positive number.";
    if (!stockCount || stockCount <= 0) errors.stockCount = "Stock Count must be a positive number.";
    if (itemDescription.length > 200) errors.itemDescription = "Description must be under 200 characters.";

    // Validate expireDate
    if (expireDate && new Date(expireDate) <= new Date()) {
      errors.expireDate = "Expire date must be in the future.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const imgURL = await imageUpload();
    if (!imgURL) {
      setValidationErrors(prev => ({ ...prev, imgURL: "Image upload failed or is missing." }));
      return;
    }

    const newItem = { itemID, itemName, itemBrand, itemPrice, stockCount, catagory, warranty, itemDescription, imgURL, expireDate };

    const response = await fetch('/inventoryPanel/addItems', {
      method: 'POST',
      body: JSON.stringify(newItem),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const json = await response.json();
      setError(json.error);
    } else {
      setSuccessMsg("Item added successfully!");
      resetForm();
    }
  };

  const handleImageCheck = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (file && allowedTypes.includes(file.type)) {
      setItemImage(file);
    } else {
      alert('Please upload a valid JPEG or PNG image file!');
    }
  };

  const imageUpload = async () => {
    if (!itemImage) return '';
    const imageRef = ref(storage, `images/${itemImage.name + v4()}`);
    try {
      await uploadBytes(imageRef, itemImage);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      return '';
    }
  };

  const resetForm = () => {
    setItemImage(null);
    setItemID('');
    setItemName('');
    setItemBrand('');
    setItemPrice('');
    setStockCount('');
    setcatagory('');
    setWarranty('');
    setItemDescription('');
    setExpireDate('');
    setError(null);
    setSuccessMsg(null);
    setValidationErrors({});
  };

  return (
    <>
      <SlideBar />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" align="center" color="success.main" gutterBottom>
            Add an Item
          </Typography>

          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
          {successMsg && <Alert severity="success" sx={{ my: 2 }}>{successMsg}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Button variant="contained" component="label" sx={{ bgcolor: 'success.main', color: 'white', mb: 2, borderRadius: 2 }}>
              Upload Image
              <input type="file" hidden onChange={handleImageCheck} />
            </Button>

            {validationErrors.imgURL && (
              <Alert severity="error" sx={{ my: 2 }}>
                {validationErrors.imgURL}
              </Alert>
            )}
            <TextField fullWidth label="Item ID *" value={itemID} onChange={(e) => setItemID(e.target.value)} required sx={{ mb: 2 }} />
            {validationErrors.itemID && <Alert severity="error" sx={{ mb: 2 }}>{validationErrors.itemID}</Alert>}

            <TextField fullWidth label="Item Name *" value={itemName} onChange={(e) => setItemName(e.target.value)} required sx={{ mb: 2 }} />
            {validationErrors.itemName && <Alert severity="error" sx={{ mb: 2 }}>{validationErrors.itemName}</Alert>}

            <TextField fullWidth label="Item Brand *" value={itemBrand} onChange={(e) => setItemBrand(e.target.value)} required sx={{ mb: 2 }} />
            {validationErrors.itemBrand && <Alert severity="error" sx={{ mb: 2 }}>{validationErrors.itemBrand}</Alert>}

            <TextField fullWidth label="Item Price *" type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} required sx={{ mb: 2 }} />
            {validationErrors.itemPrice && <Alert severity="error" sx={{ mb: 2 }}>{validationErrors.itemPrice}</Alert>}

            <TextField fullWidth label="Stock Count *" type="number" value={stockCount} onChange={(e) => setStockCount(e.target.value)} required sx={{ mb: 2 }} />
            {validationErrors.stockCount && <Alert severity="error" sx={{ mb: 2 }}>{validationErrors.stockCount}</Alert>}

            <TextField
              fullWidth
              label="Category *"
              value={catagory}
              onChange={(e) => setcatagory(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            {validationErrors.catagory && <Alert severity="error" sx={{ mb: 2 }}>{validationErrors.catagory}</Alert>}

            <TextField
              fullWidth
              label="Item Description"
              multiline
              rows={3}
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              sx={{ mb: 3 }}
            />
            {validationErrors.itemDescription && <Alert severity="error" sx={{ mb: 2 }}>{validationErrors.itemDescription}</Alert>}

            <TextField
              fullWidth
              label="Expire Date"
              type="datetime-local"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              sx={{ mb: 2 }}
            />
            {validationErrors.expireDate && <Alert severity="error" sx={{ mb: 2 }}>{validationErrors.expireDate}</Alert>}

            <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: 'success.main', color: 'white', borderRadius: 2 }}>
              Add Item
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default AddItems;
