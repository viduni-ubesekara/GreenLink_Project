import React, { useEffect, useState } from "react";
import { 
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Button, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch("http://localhost:5000/cart");
            if (!response.ok) throw new Error("Failed to fetch cart");
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const handleIncrease = async (id) => {
        try {
            await fetch(`http://localhost:5000/cart/increase/${id}`, { method: "PATCH" });
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item._id === id ? { ...item, itemCount: item.itemCount + 1, totalPrice: (item.itemCount + 1) * item.itemPrice } : item
                )
            );
        } catch (error) {
            console.error("Error increasing item:", error);
        }
    };

    const handleDecrease = async (id, count) => {
        try {
            if (count > 1) {
                await fetch(`http://localhost:5000/cart/decrease/${id}`, { method: "PATCH" });
                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        item._id === id ? { ...item, itemCount: item.itemCount - 1, totalPrice: (item.itemCount - 1) * item.itemPrice } : item
                    )
                );
            } else {
                handleOpenDialog(id);
            }
        } catch (error) {
            console.error("Error decreasing item:", error);
        }
    };

    const handleOpenDialog = (id) => {
        setSelectedItem(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };

    const handleRemove = async () => {
        if (!selectedItem) return;
        try {
            await fetch(`http://localhost:5000/cart/remove/${selectedItem}`, { method: "DELETE" });
            setCartItems((prevItems) => prevItems.filter((item) => item._id !== selectedItem));
            handleCloseDialog();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleClearCart = async () => {
        try {
            await fetch("http://localhost:5000/cart/clear", { method: "DELETE" });
            setCartItems([]);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    const handleBackToShop = () => {
        navigate("/inventoryPanel/shop");
    };

    return (
        <Container maxWidth="xl" sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 4 }}>
            {/* Clear Cart Button - Upper Right Corner */}
            <Box sx={{ position: "absolute", top: 20, right: 40 }}>
                <Button 
                    color="error" 
                    variant="contained" 
                    sx={{
                        backgroundColor: "#8B0000", 
                        color: "white", 
                        '&:hover': { backgroundColor: "#a52a2a" },
                        fontWeight: "bold",
                        padding: "8px 20px"
                    }} 
                    onClick={handleClearCart}
                >
                    Clear Cart
                </Button>
            </Box>

            <Typography variant="h3" gutterBottom sx={{ color: "#4CAF50", fontWeight: "bold", textAlign: "center", mb: 2 }}>
                🛒 Shopping Cart
            </Typography>

            {cartItems.length === 0 ? (
                <Typography variant="h5" sx={{ textAlign: "center", color: "#555" }}>
                    Your cart is empty. Browse our farm products! 🌾
                </Typography>
            ) : (
                <>
                    <TableContainer component={Paper} sx={{ width: "80%", borderRadius: 2, boxShadow: 3, overflowX: "auto" }}>
                        <Table sx={{ minWidth: "100%" }}>
                            <TableHead sx={{ backgroundColor: "#4CAF50" }}>
                                <TableRow>
                                    <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Item Name</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Quantity</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Price</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Total</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item._id} sx={{ '&:nth-of-type(even)': { backgroundColor: "#e8f5e9" } }}>
                                        <TableCell align="center">{item.itemName}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="success" onClick={() => handleDecrease(item._id, item.itemCount)}>
                                                <Remove />
                                            </IconButton>
                                            {item.itemCount}
                                            <IconButton color="success" onClick={() => handleIncrease(item._id)}>
                                                <Add />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="center">Rs.{item.itemPrice}</TableCell>
                                        <TableCell align="center">Rs.{item.totalPrice}</TableCell>
                                        <TableCell align="center">
                                            <Button 
                                                variant="outlined" 
                                                sx={{ color: "#8B4513", borderColor: "#8B4513", '&:hover': { backgroundColor: "#D2691E", color: "white" } }}
                                                onClick={() => handleOpenDialog(item._id)}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Checkout and Back to Shop Buttons */}
                    <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 3 }}>
                        <Button 
                            color="success" 
                            variant="contained" 
                            sx={{ 
                                fontSize: 18, 
                                fontWeight: "bold", 
                                backgroundColor: "#388E3C",
                                '&:hover': { backgroundColor: "#2E7D32" },
                            }} 
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </Button>

                        <Button 
                            variant="outlined" 
                            sx={{ 
                                fontSize: 16, 
                                borderColor: "#4CAF50", 
                                color: "#4CAF50", 
                                '&:hover': { backgroundColor: "#C8E6C9" } 
                            }} 
                            onClick={handleBackToShop}
                        >
                            Back to Shop
                        </Button>
                    </Box>
                </>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent><DialogContentText>Are you sure you want to remove this item?</DialogContentText></DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleRemove} color="error">Remove</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Cart;
