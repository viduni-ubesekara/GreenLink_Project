import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography, 
  Divider, 
  Grid 
} from '@mui/material';
import axios from 'axios';

const AddPromotionPage = () => {
  const [promotionData, setPromotionData] = useState({
    promotionName: '',
    description: '',
    userEmail: '',
    promotionKey: '',
    number: '',
    startDate: '',
    endDate: '',
    promotionType: '',
    imageBase64: '',
    discountApplyType: '',
    tiers: [],
    products: [],
    globalDiscountValue: '',
    globalDiscountUnit: ''
  });

  const [tier, setTier] = useState({ minAmount: '', discountPercentage: '' });
  const [product, setProduct] = useState({ productId: '', discountValue: '', discountUnit: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotionData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPromotionData((prev) => ({
        ...prev,
        imageBase64: reader.result
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const addTier = () => {
    setPromotionData((prev) => ({
      ...prev,
      tiers: [...prev.tiers, tier]
    }));
    setTier({ minAmount: '', discountPercentage: '' });
  };

  const addProduct = () => {
    setPromotionData((prev) => ({
      ...prev,
      products: [...prev.products, product]
    }));
    setProduct({ productId: '', discountValue: '', discountUnit: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/promotions', promotionData); // <-- fixed URL
      alert('Promotion created successfully!');
    } catch (error) {
      console.error('Error creating promotion', error);
      alert('Failed to create promotion.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Create Promotion</Typography>
      <form onSubmit={handleSubmit}>

        {/* Basic fields */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Promotion Name" name="promotionName" fullWidth required value={promotionData.promotionName} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Promotion Key" name="promotionKey" fullWidth required value={promotionData.promotionKey} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Number" name="number" fullWidth required value={promotionData.number} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Description" name="description" fullWidth required value={promotionData.description} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="User Email" name="userEmail" fullWidth value={promotionData.userEmail} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Promotion Type</InputLabel>
              <Select name="promotionType" value={promotionData.promotionType} onChange={handleChange}>
                <MenuItem value="Individual">Individual</MenuItem>
                <MenuItem value="Group">Group</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Start Date" type="date" name="startDate" fullWidth InputLabelProps={{ shrink: true }} value={promotionData.startDate} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="End Date" type="date" name="endDate" fullWidth InputLabelProps={{ shrink: true }} value={promotionData.endDate} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
          </Grid>
        </Grid>

        <Divider style={{ margin: '20px 0' }} />

        {/* Discount Apply Type Section */}
        <Typography variant="h5" gutterBottom>Discount Settings</Typography>

        <FormControl fullWidth>
          <InputLabel>Discount Apply Type</InputLabel>
          <Select name="discountApplyType" value={promotionData.discountApplyType} onChange={handleChange}>
            <MenuItem value="tiered">Tiered</MenuItem>
            <MenuItem value="customize">Customize Products</MenuItem>
            <MenuItem value="global">Global Discount</MenuItem>
          </Select>
        </FormControl>

        {/* Conditional based on discount type */}
        {promotionData.discountApplyType === 'tiered' && (
          <div style={{ marginTop: 20 }}>
            <Typography variant="h6">Add Tier</Typography>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <TextField label="Minimum Amount" name="minAmount" value={tier.minAmount} onChange={(e) => setTier({...tier, minAmount: e.target.value})} fullWidth />
              </Grid>
              <Grid item xs={5}>
                <TextField label="Discount (%)" name="discountPercentage" value={tier.discountPercentage} onChange={(e) => setTier({...tier, discountPercentage: e.target.value})} fullWidth />
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" color="primary" onClick={addTier}>Add</Button>
              </Grid>
            </Grid>

            {promotionData.tiers.map((t, idx) => (
              <Typography key={idx}>Min {t.minAmount} - {t.discountPercentage}% off</Typography>
            ))}
          </div>
        )}

        {promotionData.discountApplyType === 'customize' && (
          <div style={{ marginTop: 20 }}>
            <Typography variant="h6">Add Product Discount</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField label="Product ID" name="productId" value={product.productId} onChange={(e) => setProduct({...product, productId: e.target.value})} fullWidth />
              </Grid>
              <Grid item xs={3}>
                <TextField label="Discount Value" name="discountValue" value={product.discountValue} onChange={(e) => setProduct({...product, discountValue: e.target.value})} fullWidth />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Discount Unit</InputLabel>
                  <Select name="discountUnit" value={product.discountUnit} onChange={(e) => setProduct({...product, discountUnit: e.target.value})}>
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="fixed">Fixed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" color="primary" onClick={addProduct}>Add</Button>
              </Grid>
            </Grid>

            {promotionData.products.map((p, idx) => (
              <Typography key={idx}>Product {p.productId}: {p.discountValue} ({p.discountUnit})</Typography>
            ))}
          </div>
        )}

        {promotionData.discountApplyType === 'global' && (
          <div style={{ marginTop: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Global Discount Value" name="globalDiscountValue" value={promotionData.globalDiscountValue} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Discount Unit</InputLabel>
                  <Select name="globalDiscountUnit" value={promotionData.globalDiscountUnit} onChange={handleChange}>
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="fixed">Fixed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        )}

        <Divider style={{ margin: '20px 0' }} />

        <Button type="submit" variant="contained" color="success" fullWidth>Create Promotion</Button>

      </form>
    </div>
  );
};

export default AddPromotionPage;
