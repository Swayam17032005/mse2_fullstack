const express = require('express');
const router = express.Router();
const {
    getItems,
    searchItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getItems).post(protect, createItem);
router.route('/search').get(searchItems);
router.route('/:id').get(getItemById).put(protect, updateItem).delete(protect, deleteItem);

module.exports = router;
