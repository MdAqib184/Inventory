// server/routes/inventory.js
const router = require('express').Router();
const InventoryItem = require('../models/InventoryItem');
const { Op } = require('sequelize');

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
    const items = await InventoryItem.findAll({
      where: { userId: req.user.id }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inventory stats
router.get('/stats', async (req, res) => {
  try {
    const items = await InventoryItem.findAll({
      where: { userId: req.user.id }
    });
    
    // Calculate stats
    const totalItems = items.reduce((sum, item) => sum + item.stock, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.stock), 0);
    
    const lowStockItems = await InventoryItem.count({
      where: {
        userId: req.user.id,
        status: 'Low Stock'
      }
    });
    
    res.json({
      totalItems,
      totalValue,
      lowStockAlerts: lowStockItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new inventory item
router.post('/', async (req, res) => {
  try {
    const newItem = await InventoryItem.create({
      ...req.body,
      userId: req.user.id,
      lastUpdated: new Date()
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await InventoryItem.update(
      { ...req.body, lastUpdated: new Date() },
      { 
        where: { 
          id: req.params.id, 
          userId: req.user.id 
        },
        returning: true
      }
    );
    
    if (updated === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    const updatedItem = await InventoryItem.findOne({
      where: { id: req.params.id }
    });
    
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await InventoryItem.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;