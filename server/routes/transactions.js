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

module.exports = router;