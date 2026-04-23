const Item = require('../models/Item');

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
    try {
        const items = await Item.find().populate('owner', 'name email');
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Search items
// @route   GET /api/items/search?name=xyz
// @access  Public
const searchItems = async (req, res) => {
    try {
        const { name } = req.query;
        let query = {};
        
        if (name) {
            query.itemName = { $regex: name, $options: 'i' };
        }
        
        const items = await Item.find(query).populate('owner', 'name email');
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('owner', 'name email');
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
    try {
        const { itemName, description, type, location, date, contactInfo } = req.body;

        if (!itemName || !description || !type || !location || !date || !contactInfo) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const item = await Item.create({
            itemName,
            description,
            type,
            location,
            date,
            contactInfo,
            owner: req.user.id,
        });

        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the item owner
        if (item.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the item owner
        if (item.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await item.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getItems,
    searchItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
};
