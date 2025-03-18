const router = require('express').Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: 'Not authenticated' });
};

router.use(isAuthenticated);

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new transaction
router.post('/', async (req, res) => {
    try {
        const newTransaction = new Transaction({
            ...req.body,
            userId: req.user._id
        });
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete transaction

router.delete('/:id', async (req, res) => {
    try {
      
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
      }
      
      const query = {
        _id: req.params.id,
        userId: req.user._id
      };
      
      const deletedTransaction = await Transaction.findOneAndDelete(query);
      
      if (!deletedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });


module.exports = router;