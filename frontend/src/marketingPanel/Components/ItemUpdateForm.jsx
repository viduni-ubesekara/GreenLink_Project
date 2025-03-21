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
    Switch,
    FormControlLabel
} from '@mui/material'

function ItemUpdateForm({ item }) {
    const pageNavigation = useNavigate()

    // State
    const [itemValues, setItemValues] = useState({
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        stockCount: item.stockCount,
        itemDescription: item.itemDescription,
        warranty: item.warranty || '',
        category: item.category,
        promotionEnable: item.promotionEnable || false,
        promotionDescription: item.promotionDescription || ''
    })
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        itemName,
        itemPrice,
        stockCount,
        itemDescription,
        warranty,
        category,
        promotionEnable,
        promotionDescription
    } = itemValues

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newItemDetails = {
            itemName,
            itemPrice,
            stockCount,
            itemDescription,
            warranty,
            category,
            promotionEnable,
            promotionDescription
        }
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
                pageNavigation('')
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
            alert("Please enter a non-negative value for price")
            e.target.value = item.itemPrice
        } else {
            setItemValues({ ...itemValues, itemPrice: value })
        }
    }

    const handleUpdateStock = (e) => {
        const value = e.target.value
        if (value < 0) {
            alert("Please enter a non-negative value for stock")
            e.target.value = item.stockCount
        } else {
            setItemValues({ ...itemValues, stockCount: value })
        }
    }

    const handleBackNavigate = () => {
        pageNavigation('/marketingPanel/Home')
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
                                value={itemName}
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
                                value={itemPrice}
                                onChange={handleUpdatePrice}
                                required
                            />
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Stock Count</FormLabel>
                            <Input 
                                type="number" 
                                name="stockCount" 
                                value={stockCount}
                                onChange={handleUpdateStock}
                                required
                            />
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Item Category</FormLabel>
                            <Input 
                                type="text" 
                                name="category" 
                                value={category}
                                readOnly
                            />
                            <FormHelperText>You can't change Item Category</FormHelperText>
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Item Description</FormLabel>
                            <TextareaAutosize
                                minRows={3}
                                placeholder="Enter detailed description about the item"
                                value={itemDescription}
                                onChange={(e) => setItemValues({ ...itemValues, itemDescription: e.target.value })}
                                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                            />
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <FormLabel>Warranty</FormLabel>
                            <Input 
                                type="text" 
                                name="warranty" 
                                value={warranty}
                                onChange={(e) => setItemValues({ ...itemValues, warranty: e.target.value })}
                            />
                        </FormControl>

                        {/* NEW FIELDS */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={promotionEnable}
                                    onChange={(e) =>
                                        setItemValues({ ...itemValues, promotionEnable: e.target.checked })
                                    }
                                    color="primary"
                                />
                            }
                            label="Enable Promotion"
                        />

                        {promotionEnable && (
                            <FormControl margin="normal" fullWidth>
                                <FormLabel>Promotion Description</FormLabel>
                                <TextareaAutosize
                                    minRows={2}
                                    placeholder="Enter promotion details..."
                                    value={promotionDescription}
                                    onChange={(e) =>
                                        setItemValues({ ...itemValues, promotionDescription: e.target.value })
                                    }
                                    style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                                />
                            </FormControl>
                        )}

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

            {/* Snackbar */}
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

export default ItemUpdateForm;
