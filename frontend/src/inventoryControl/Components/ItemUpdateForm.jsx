import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    TextareaAutosize,
    Typography,
    FormHelperText,
    Snackbar,
    Alert,
    TextField
} from '@mui/material'
import dayjs from 'dayjs'

function ItemUpdateForm({ item }) {
    const pageNavigation = useNavigate()

    // Format expiry date as YYYY-MM-DD
    const formattedExpiry = item.expiryDate ? dayjs(item.expiryDate).format('YYYY-MM-DD') : ''

    // States
    const [itemValues, setItemValues] = useState({
        itemName: item.itemName || '',
        itemPrice: item.itemPrice || 0,
        stockCount: item.stockCount || 0,
        itemDescription: item.itemDescription || '',
        warranty: item.warranty || '',
        category: item.category || '',
        expiryDate: formattedExpiry
    })

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { itemName, itemPrice, stockCount, itemDescription, warranty, category, expiryDate } = itemValues

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newItemDetails = { itemName, itemPrice, stockCount, itemDescription, warranty, category, expiryDate }
        setIsSubmitting(true)

        try {
            const response = await fetch(`/inventoryPanel/${item.itemID}`, {
                method: 'PATCH',
                body: JSON.stringify(newItemDetails),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()

            if (response.ok) {
                console.log(response.status + ': Update is successful', json)
                setOpenSnackbar(true)
                pageNavigation('/inventoryPanel')
            } else {
                console.log(response.status + ': Update is unsuccessful')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdatePrice = (e) => {
        const value = e.target.value
        if (value < 0) {
            alert('Please enter a non-negative value for price')
            e.target.value = item.itemPrice
        } else {
            setItemValues({ ...itemValues, itemPrice: value })
        }
    }

    const handleUpdateStock = (e) => {
        const value = e.target.value
        if (value < 0) {
            alert('Please enter a non-negative value for stock')
            e.target.value = item.stockCount
        } else {
            setItemValues({ ...itemValues, stockCount: value })
        }
    }

    const handleExpiryDateChange = (e) => {
        setItemValues({ ...itemValues, expiryDate: e.target.value })
    }

    // Check expiry status
    const today = dayjs()
    const expiry = dayjs(itemValues.expiryDate)
    const isExpired = expiry.isBefore(today, 'day')
    const isExpiringSoon = expiry.diff(today, 'day') <= 14 && !isExpired

    const handleBackNavigate = () => {
        pageNavigation('/inventoryPanel')
    }

    return (
        <>
            <Container>
                <Typography variant="h4" paddingTop="24px">Edit {item.itemID} item</Typography>
                <Typography variant="body2" color="textSecondary">Some fields are restricted to change</Typography>

                <Box maxWidth="480px" marginBottom="44px" paddingTop="24px" paddingBottom="24px">
                    <div className="update-form-img-preview">
                        <img
                            src={item.imgURL}
                            alt="Item"
                            style={{ width: '200px', objectFit: 'cover' }}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Item ID</FormLabel>
                            <Input type="text" name="itemID" value={item.itemID} readOnly />
                            <FormHelperText>You can't change Item ID</FormHelperText>
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Item Name</FormLabel>
                            <Input
                                type="text"
                                name="itemName"
                                value={itemValues.itemName}
                                onChange={(e) => setItemValues({ ...itemValues, itemName: e.target.value })}
                            />
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Item Brand</FormLabel>
                            <Input type="text" name="itemBrand" value={item.itemBrand} readOnly />
                            <FormHelperText>You can't change Item Brand</FormHelperText>
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Item Price</FormLabel>
                            <Input
                                type="number"
                                name="itemPrice"
                                value={itemValues.itemPrice}
                                onChange={handleUpdatePrice}
                                required
                            />
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Stock Count</FormLabel>
                            <Input
                                type="number"
                                name="stockCount"
                                value={itemValues.stockCount}
                                onChange={handleUpdateStock}
                                required
                            />
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Item Category</FormLabel>
                            <Input
                                type="text"
                                name="category"
                                value={itemValues.category}
                                readOnly
                            />
                            <FormHelperText>You can't change Item Category</FormHelperText>
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Expiration Date</FormLabel>
                            <TextField
                                type="date"
                                name="expiryDate"
                                value={itemValues.expiryDate}
                                onChange={handleExpiryDateChange}
                                fullWidth
                                required
                                error={isExpired}
                            />
                            {isExpired && (
                                <FormHelperText error>
                                    Warning: This product has expired!
                                </FormHelperText>
                            )}
                            {isExpiringSoon && !isExpired && (
                                <FormHelperText style={{ color: '#ed6c02' }}>
                                    Warning: This product will expire soon (within 2 weeks)!
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Item Description</FormLabel>
                            <TextareaAutosize
                                minRows={3}
                                placeholder="Enter detailed description about the item"
                                value={itemValues.itemDescription}
                                onChange={(e) => setItemValues({ ...itemValues, itemDescription: e.target.value })}
                                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            color="error"
                            variant="contained"
                            disabled={isSubmitting}
                            fullWidth
                            style={{ marginBottom: '16px' }}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>

                        <Button
                            type="button"
                            color="success"
                            variant="contained"
                            onClick={handleBackNavigate}
                            fullWidth
                        >
                            Back To Inventory
                        </Button>
                    </form>
                </Box>
            </Container>

            {/* Snackbar for success notification */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Item updated successfully!
                </Alert>
            </Snackbar>
        </>
    )
}

export default ItemUpdateForm
