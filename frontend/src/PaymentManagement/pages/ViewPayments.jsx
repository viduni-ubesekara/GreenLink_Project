import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Badge,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = () => {
    axios
      .get('http://localhost:5000/api/payment')
      .then((res) => setPayments(res.data))
      .catch((err) => console.error('Error fetching payments:', err));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/payment/${id}`);
        fetchPayments(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  // Categorizing the payments based on their status
  const unreadPayments = payments.filter((payment) => payment.paymentStatus === 'Submitted');
  const approvedPayments = payments.filter((payment) => payment.paymentStatus === 'Approved');
  const rejectedPayments = payments.filter((payment) => payment.paymentStatus === 'Rejected');

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        All Submitted Payments
      </Typography>

      {/* Unread Payments Accordion */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography variant="h6">
            Unread Payments
            {/* Show Badge if there are unread payments */}
            {unreadPayments.length > 0 && (
              <Badge
                badgeContent="New"
                color="secondary"
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {unreadPayments.map((payment) => (
              <ListItem
                key={payment._id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(payment._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: 'inherit', // Default color for unread payments
                      }}
                      onClick={() => navigate(`/payment/${payment._id}`)}
                    >
                      {payment._id} - {payment.name}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ mt: 2 }} />

      {/* Approved Payments Accordion */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography variant="h6">Approved Payments</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {approvedPayments.map((payment) => (
              <ListItem
                key={payment._id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(payment._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 'normal', // Regular weight for approved payments
                        color: 'green', // Green color for approved payments
                      }}
                      onClick={() => navigate(`/payment/${payment._id}`)}
                    >
                      {payment._id} - {payment.name}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ mt: 2 }} />

      {/* Rejected Payments Accordion */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
          <Typography variant="h6">Rejected Payments</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {rejectedPayments.map((payment) => (
              <ListItem
                key={payment._id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(payment._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 'normal', // Regular weight for rejected payments
                        color: 'red', // Red color for rejected payments
                      }}
                      onClick={() => navigate(`/payment/${payment._id}`)}
                    >
                      {payment._id} - {payment.name}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default ViewPayments;
