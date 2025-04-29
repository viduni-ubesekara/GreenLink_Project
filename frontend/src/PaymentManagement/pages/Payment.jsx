import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Payment() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !phoneNumber || !email) {
      setSnackbar({ open: true, message: 'Please fill in all required fields.', severity: 'error' });
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setSnackbar({ open: true, message: 'Please enter a valid 10-digit phone number.', severity: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);
    if (orderReceipt) {
      formData.append('orderReceipt', orderReceipt);
    }
    if (paymentSlip) {
      formData.append('paymentSlip', paymentSlip);
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/payment', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setSnackbar({ open: true, message: 'Payment Successful! Thank you.', severity: 'success' });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setSnackbar({ open: true, message: result.message || 'Payment failed. Please try again.', severity: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      setSnackbar({ open: true, message: 'An error occurred while processing your payment.', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" mb={3}>
        Payment Information
      </Typography>

      <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
        <Typography mb={2}>
          Please fill in the details below to complete your purchase:
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Name"
            variant="outlined"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Phone Number"
            variant="outlined"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            variant="outlined"
            component="label"
          >
            Upload Order Receipt
            <input
              type="file"
              hidden
              accept="image/*, .pdf"
              onChange={(e) => setOrderReceipt(e.target.files[0])}
            />
          </Button>

          <Button
            variant="outlined"
            component="label"
          >
            Upload Payment Slip
            <input
              type="file"
              hidden
              accept="image/*, .pdf"
              onChange={(e) => setPaymentSlip(e.target.files[0])}
            />
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Payment'}
          </Button>
        </Stack>

        <Box mt={4}>
          <Typography variant="subtitle1" fontWeight="bold">
            Banking Details:
          </Typography>
          <Typography variant="body2">
            Name: Green Link Agriculture Pvt Limited <br />
            Account Number: 13422301 <br />
            Branch: Wallawaththa
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Payment;
