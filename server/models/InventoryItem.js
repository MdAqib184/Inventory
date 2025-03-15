// server/models/InventoryItem.js
const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
    id: {
    type: String,
    required: true,
    unique: true
    },
    name: {
    type: String,
    required: true
    },
    category: {
    type: String,
    required: true
    },
    price: {
    type: Number,
    required: true
    },
    stock: {
    type: Number,
    required: true,
    default: 0
    },
    status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
    },
    lastUpdated: {
    type: Date,
    default: Date.now
    },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    }
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);