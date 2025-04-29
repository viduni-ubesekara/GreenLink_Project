import React, { useEffect, useState } from "react";
import { Divider } from '@mui/material';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Box,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({ billId: "", paymentConfirmed: false });
  const [openDialog, setOpenDialog] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/cart");
      const data = await response.json();
      setCartItems(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const originalTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const discountedTotal = (originalTotal * (100 - discountPercent)) / 100;

  const handleApplyPromo = async () => {
    if (!promoCode) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/userpromo/getpromotion/${promoCode}`);
      const promo = response.data;

      const currentDate = new Date();
      const startDate = new Date(promo.startDate);
      const endDate = new Date(promo.endDate);

      if (currentDate < startDate || currentDate > endDate) {
        toast.error("This promotion is not currently valid.");
        return;
      }

      if (promo.promotionType !== "Group") {
        toast.error("This promo code is not a public offer.");
        return;
      }

      // Example logic: if promo description mentions percentage, extract it
      const match = promo.description.match(/(\d+)%/);
      if (match) {
        const percent = parseInt(match[1]);
        setDiscountPercent(percent);
        toast.success(`Promo applied! ${percent}% discount.`);
      } else {
        toast.error("Invalid promo description.");
      }

    } catch (error) {
      console.error("Promo code error:", error);
      toast.error("Invalid promo code.");
    }
  };

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Green Link Agriculture Pvt Limited", 14, 20);
    doc.setFontSize(18);
    doc.text("Receipt", 14, 30);
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 32, 195, 32);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    let yPosition = 40;
    cartItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.itemName} - Rs.${item.itemPrice} x ${item.itemCount} = Rs.${item.totalPrice}`, 14, yPosition);
      yPosition += 10;
    });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: Rs.${discountedTotal.toFixed(2)}`, 14, yPosition + 10);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    yPosition += 20;
    doc.text("Banking Details and Payment Instructions:", 14, yPosition);
    yPosition += 10;
    doc.text("Name: Green Link Agriculture Pvt Limited", 14, yPosition);
    doc.text("Account Number: 13422301", 14, yPosition + 5);
    doc.text("Branch: Wallawaththa", 14, yPosition + 10);
    doc.text("Please make the payment to the above account.", 14, yPosition + 15);
    doc.text("Mention the Bill ID (provided below) when making the payment.", 14, yPosition + 20);

    const billId = Math.floor(Math.random() * 100000);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Bill ID: ${billId}`, 14, yPosition + 35);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for shopping with us!", 14, yPosition + 50);

    doc.save("receipt.pdf");

    setPaymentDetails({ ...paymentDetails, billId: billId.toString() });
  };

  const handleGoToPayment = () => {
    if (!paymentDetails.billId) {
      setOpenDialog(true);
      return;
    }
    navigate("/payment");
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const handleBackToShop = () => {
    navigate("/inventoryPanel/shop");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ flexGrow: 1, mt: 5, position: 'relative' }}>
        <IconButton onClick={handleBackToCart} sx={{ position: 'absolute', left: 35, top: 16, zIndex: 1 }}>
          <ArrowBackIcon />
        </IconButton>

        <IconButton onClick={handleBackToShop} sx={{ position: 'absolute', right: 35, top: 16, zIndex: 1 }}>
          <StorefrontIcon />
        </IconButton>

        <Card sx={{ minHeight: '80vh' }}>
          <CardHeader
            title="Checkout"
            subheader="Review your items and complete the payment"
            sx={{ backgroundColor: '#f5f5f5', textAlign: 'center' }}
          />
          <CardContent>
            {cartItems.length === 0 ? (
              <Typography variant="body1">Your cart is empty. Please add items to the cart first.</Typography>
            ) : (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Item Name</strong></TableCell>
                        <TableCell><strong>Quantity</strong></TableCell>
                        <TableCell><strong>Price</strong></TableCell>
                        <TableCell><strong>Total</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.itemCount}</TableCell>
                          <TableCell>Rs.{item.itemPrice}</TableCell>
                          <TableCell>Rs.{item.totalPrice}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Stack spacing={2} sx={{ mt: 4 }}>
                  <TextField
                    label="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" color="primary" onClick={handleApplyPromo}>
                    Apply Promo Code
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6">
                    {discountPercent > 0
                      ? `Discounted Total: Rs.${discountedTotal.toFixed(2)}`
                      : `Grand Total: Rs.${originalTotal}`}
                  </Typography>

                  <Button variant="contained" color="success" onClick={handleDownloadReceipt}>
                    Download Receipt
                  </Button>
                  <Button variant="contained" color="warning" onClick={handleGoToPayment}>
                    Go to Payment
                  </Button>
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Notice</DialogTitle>
          <DialogContent>
            <Typography>Please download the receipt before proceeding to payment.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>OK</Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </Container>
    </Box>
  );
}

export default Checkout;
