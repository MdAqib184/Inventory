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
        // Check if the ID is valid MongoDB ObjectId
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
        
        let transaction;
        if (isMongoId) {
            // If it's a valid MongoDB ObjectId, try to find by _id
            transaction = await Transaction.findOne({
                _id: req.params.id,
                userId: req.user._id
            });
        } else {
            // If it's not a valid MongoDB ObjectId, try to find by the custom id field
            transaction = await Transaction.findOne({
                id: req.params.id,
                userId: req.user._id
            });
        }
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        // Remove the transaction using the correct ID
        await Transaction.findByIdAndDelete(transaction._id);
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;