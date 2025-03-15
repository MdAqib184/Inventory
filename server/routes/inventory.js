// server/routes/inventory.js
const router = require('express').Router();
const InventoryItem = require('../models/InventoryItem');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
};

// Apply authentication to all inventory routes
router.use(isAuthenticated);

// Get all inventory items for a user
router.get('/', async (req, res) => {
    try {
        const items = await InventoryItem.find({ userId: req.user._id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get inventory stats
router.get('/stats', async (req, res) => {
    try {
        const items = await InventoryItem.find({ userId: req.user._id });
        // Calculate stats
        const totalItems = items.reduce((sum, item) => sum + item.stock, 0);
        const totalValue = items.reduce((sum, item) => sum + (item.price * item.stock), 0);
        const lowStockAlerts = items.filter(item => item.status === 'Low Stock').length;
        res.json({
            totalItems,
            totalValue,
            lowStockAlerts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new inventory item
router.post('/', async (req, res) => {
    const item = new InventoryItem({
        ...req.body,
        userId: req.user._id,
        lastUpdated: new Date()
    });
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update inventory item
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await InventoryItem.findOneAndUpdate(
            { id: req.params.id, userId: req.user._id },
            { ...req.body, lastUpdated: new Date() },
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
    try {
        const item = await InventoryItem.findOneAndDelete({
            id: req.params.id,
            userId: req.user._id
        });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
