const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    // transactionType: {
    //     type: String,
    //     enum: ['Sale', 'Restock'],
    //     required: true
    // },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);