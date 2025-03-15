import React, { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import AddItemModal from '../components/AddItemModal';
import EditItemModal from '../components/EditItemModal';
import SellModal from '../components/SellModal';

const Dashboard = () => {
    const { user, logout } = React.useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('inventory');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalItems: 0,
        totalValue: 0,
        lowStockAlerts: 0
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [sellingItem, setSellingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [transactionSearchTerm, setTransactionSearchTerm] = useState('');

    useEffect(() => {
        fetchInventory();
        fetchStats();
        fetchTransactions();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await axios.get('/api/inventory');
            setInventoryItems(res.data);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/inventory/stats');
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };
    
    const fetchTransactions = async () => {
        try {
            const res = await axios.get('/api/transactions');
            setTransactions(res.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    const handleAddItem = async (newItem) => {
        try {
            await axios.post('/api/inventory', newItem);
            fetchInventory();
            fetchStats();
            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    const handleUpdateItem = async (id, updatedItem) => {
        try {
            await axios.put(`/api/inventory/${id}`, updatedItem);
            fetchInventory();
            fetchStats();
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`/api/inventory/${id}`);
                fetchInventory();
                fetchStats();
            } catch (error) {
                console.error('Failed to delete item:', error);
            }
        }
    };

    // Updated to handle multi-quantity sales
    const handleSellItem = async (id, quantity) => {
        try {
            // Find the item details to record in the transaction
            const itemToSell = inventoryItems.find(item => item.id === id);
            if (!itemToSell) return;
            
            // Calculate new stock
            const newStock = itemToSell.stock - quantity;
            
            // Update inventory stock
            const updatedItem = { stock: newStock };
            // Update status if necessary
            if (newStock === 0) {
                updatedItem.status = 'Out of Stock';
            } else if (newStock <= 5) {
                updatedItem.status = 'Low Stock';
            }
            await axios.put(`/api/inventory/${id}`, updatedItem);
            
            // Record the transaction
            const transaction = {
                itemId: itemToSell.id,
                itemName: itemToSell.name,
                category: itemToSell.category,
                quantity: quantity,
                price: itemToSell.price,
                totalAmount: itemToSell.price * quantity,
                transactionType: 'Sale',
                transactionDate: new Date().toISOString()
            };
            
            await axios.post('/api/transactions', transaction);
            
            // Refresh data
            fetchInventory();
            fetchStats();
            fetchTransactions();
        } catch (error) {
            console.error('Failed to update stock or record transaction:', error);
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setShowEditModal(true);
    };

    const handleSellClick = (item) => {
        setSellingItem(item);
        setShowSellModal(true);
    };

    const filteredItems = inventoryItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const filteredTransactions = transactions.filter(transaction =>
        transaction.itemName.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
        transaction.itemId.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(transactionSearchTerm.toLowerCase())
    );

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };
    
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Mama Inventory Management</h1>
                <div className="user-info">
                    {user && (
                        <>
                            <img src={user.picture} alt={user.name} className="user-avatar" />
                            <span>{user.name}</span>
                            <button onClick={logout} className="logout-btn">Logout</button>
                        </>
                    )}
                </div>
            </header>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>TOTAL ITEMS IN STOCK</h3>
                    <p className="stat-value">{stats.totalItems}</p>
                </div>
                <div className="stat-card">
                    <h3>TOTAL INVENTORY AMOUNT</h3>
                    <p className="stat-value">₹{stats.totalValue.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>LOW STOCK ALERTS</h3>
                    <p className="stat-value">{stats.lowStockAlerts}</p>
                </div>
            </div>
            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    Inventory
                </button>
                <button
                    className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                >
                    Transactions
                </button>
            </div>
            {activeTab === 'inventory' && (
                <div className="inventory-section">
                    <div className="inventory-actions">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button
                            className="add-item-btn"
                            onClick={() => setShowAddModal(true)}
                        >
                            Add New Item
                        </button>
                    </div>
                    <div className="inventory-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>CATEGORY</th>
                                    <th>PRICE</th>
                                    <th>STOCK</th>
                                    <th>STATUS</th>
                                    <th>LAST UPDATED</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>₹{item.price}</td>
                                        <td>
                                            <div className="stock-control">
                                                <div
                                                    onClick={() => handleUpdateItem(item.id, { stock: Math.max(0, item.stock - 1) })}
                                                >
                                                </div>
                                                <span className="stock-value">{item.stock}</span>
                                                <div
                                                    onClick={() => handleUpdateItem(item.id, { stock: item.stock + 1 })}
                                                >
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="sell-btn"
                                                    onClick={() => handleSellClick(item)}
                                                    disabled={item.stock <= 0}
                                                >
                                                    Sell
                                                </button>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleEditClick(item)}
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {activeTab === 'transactions' && (
                <div className="transactions-section">
                    <h2>Transaction History</h2>
                    <div className="transaction-actions">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={transactionSearchTerm}
                            onChange={(e) => setTransactionSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="transaction-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>TRANSACTION ID</th>
                                    <th>ITEM ID</th>
                                    <th>ITEM NAME</th>
                                    <th>CATEGORY</th>
                                    <th>QUANTITY</th>
                                    <th>PRICE</th>
                                    <th>TOTAL AMOUNT</th>
                                    <th>TRANSACTION TYPE</th>
                                    <th>DATE & TIME</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction, index) => (
                                        <tr key={transaction.id || index}>
                                            <td>{transaction.id || `TR-${Date.now().toString().slice(-6)}-${index}`}</td>
                                            <td>{transaction.itemId}</td>
                                            <td>{transaction.itemName}</td>
                                            <td>{transaction.category}</td>
                                            <td>{transaction.quantity}</td>
                                            <td>₹{transaction.price}</td>
                                            <td>₹{transaction.totalAmount}</td>
                                            <td>
                                                <span className={`status-badge ${transaction.transactionType.toLowerCase()}`}>
                                                    {transaction.transactionType}
                                                </span>
                                            </td>
                                            <td>{formatDate(transaction.transactionDate)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="no-data">No transactions found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {showAddModal && (
                <AddItemModal
                    onClose={() => setShowAddModal(false)}
                    onAddItem={handleAddItem}
                />
            )}
            {showEditModal && editingItem && (
                <EditItemModal
                    item={editingItem}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingItem(null);
                    }}
                    onSaveItem={handleUpdateItem}
                />
            )}
            {showSellModal && sellingItem && (
                <SellModal
                    item={sellingItem}
                    onClose={() => {
                        setShowSellModal(false);
                        setSellingItem(null);
                    }}
                    onSell={handleSellItem}
                />
            )}
        </div>
    );
};

export default Dashboard;