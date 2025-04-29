const express = require('express');
const router = express.Router();

// Import functionalities to implement routes
const { createItem, readItems, deleteItem, updateItem, readItemById } = require('../controllers/inventoryController');


// Read Items
router.get('/', readItems)

// Read a item
router.get('/:id', readItemById)

// Create a new Item
router.post('/addItems', createItem)

// Delete a Item
router.delete('/:id', deleteItem)

// Update a Item
router.patch('/:id', updateItem)

module.exports = router;