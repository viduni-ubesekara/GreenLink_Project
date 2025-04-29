import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Link, CircularProgress, 
  Snackbar, Alert, Paper
} from '@mui/material';
import axios from 'axios';

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/payment/${id}`);
        setPayment(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching payment:', err);
        if (err.response?.status === 404) {
          setError('Payment not found');
        } else {
          setError('Error loading payment details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const handleApprove = async () => {
    try {
      await axios.post(`http://localhost:5000/api/payment/approve/${id}`);

      const message = encodeURIComponent(
        `Hi ${payment.name}, your payment has been successfully received. Your order will be delivered within 7 working days. Thank you!`
      );
      const formattedPhone = `94${payment.phoneNumber.slice(-9)}`;
      window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');

      setSnackbarMessage('Payment approved and WhatsApp opened');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      const updated = await axios.get(`http://localhost:5000/api/payment/${id}`);
      setPayment(updated.data);
    } catch (err) {
      console.error('Error approving payment:', err);
      setSnackbarMessage('Error approving payment');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`http://localhost:5000/api/payment/reject/${id}`);

      const message = encodeURIComponent(
        `Hi ${payment.name}, there's a fault in your payment. Please contact us for further assistance. Thank you!`
      );
      const formattedPhone = `94${payment.phoneNumber.slice(-9)}`;
      window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');

      setSnackbarMessage('Payment rejected and WhatsApp opened');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);

      const updated = await axios.get(`http://localhost:5000/api/payment/${id}`);
      setPayment(updated.data);
    } catch (err) {
      console.error('Error rejecting payment:', err);
      setSnackbarMessage('Error rejecting payment');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button variant="contained" onClick={() => navigate('/paymentview')}>
            Back to Payments
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Payment Details</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Name:</strong> {payment.name}</Typography>
          <Typography><strong>Phone:</strong> {payment.phoneNumber}</Typography>
          <Typography><strong>Email:</strong> {payment.email}</Typography>
          <Typography>
            <strong>Order Receipt:</strong>{' '}
            <Link href={`http://localhost:5000/${payment.orderReceipt}`} target="_blank">
              View File
            </Link>
          </Typography>
          <Typography>
            <strong>Payment Slip:</strong>{' '}
            <Link href={`http://localhost:5000/${payment.paymentSlip}`} target="_blank">
              View File
            </Link>
          </Typography>
          <Typography><strong>Status:</strong> {payment.paymentStatus}</Typography>
          <Typography><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</Typography>

          {payment.paymentStatus !== 'Approved' && payment.paymentStatus !== 'Rejected' && (
            <>
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2, mr: 1 }}
                onClick={handleApprove}
              >
                Approve & WhatsApp
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
                onClick={handleReject}
              >
                Reject & WhatsApp
              </Button>
            </>
          )}

          <Button
            variant="outlined"
            sx={{ mt: 2, ml: 2 }}
            onClick={() => navigate('/paymentview')}
          >
            Back to Payments
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentDetail;
