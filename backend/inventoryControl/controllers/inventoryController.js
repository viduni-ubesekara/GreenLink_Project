const ItemSchema = require('../models/itemSchema');


// Create a new Item (POST)
const createItem = async (req, res) => {
    const {itemID, itemName, itemBrand, itemPrice,
        stockCount, itemDescription, catagory, warranty, imgURL} = req.body;

    try {
        const itemDocument = await ItemSchema.create({itemID, itemName,
            itemBrand, itemPrice, stockCount, itemDescription, catagory, warranty, imgURL})
        res.status(200).json(itemDocument);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Read items
const readItems = async (req, res) => {
    const items = await ItemSchema.aggregate([
        { $sort: {createdAt: -1} } // sort by created time (recently added one first return)
    ]);
    res.status(200).json(items);
}

// Read a Item by ID
const readItemById = async (req, res) => {
    const { id } = req.params;
    const item = await ItemSchema.findOne({itemID: id});

    if(!item) {
        return res.status(404).json({error: 'No such an item found :('});
    }
    res.status(200).json(item);
}

// Delete a Item
const deleteItem = async (req, res) => {
    const { id } = req.params;

    const item = await ItemSchema.findOneAndDelete({itemID: id});

    if(!item) {
        return res.status(404).json({error: 'No such an item found :('});
    }
    res.status(200).json(item);
}

// Update a Item
const updateItem = async (req, res) => {
    const { id } = req.params;

    const item = await ItemSchema.findOneAndUpdate({itemID: id}, {
        ...req.body
    })

    if(!item) {
        return res.status(404).json({error: 'No such an item found :('});
    }
    res.status(200).json(item);
}

// Export all the functionalities
module.exports = {
    createItem,
    readItems,
    deleteItem,
    updateItem,
    readItemById
}