// server/routes/transactions.js
const router = require('express').Router();
const Transaction = require('../models/Transaction');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Not authenticated' });
};

router.use(isAuthenticated);

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['transactionDate', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const newTransaction = await Transaction.create({
      ...req.body,
      userId: req.user.id
    });
    
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;