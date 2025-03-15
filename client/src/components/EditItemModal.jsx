import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const EditItemModal = ({ item, onClose, onSaveItem }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        category: '',
        price: '',
        stock: '',
        status: 'In Stock'
    });

    // Initialize form data with the current item values
    useEffect(() => {
        if (item) {
            setFormData({
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price,
                stock: item.stock,
                status: item.status
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Set status based on stock
        let status = 'In Stock';
        if (formData.stock <= 0) {
            status = 'Out of Stock';
        } else if (formData.stock <= 5) {
            status = 'Low Stock';
        }
        onSaveItem(item.id, { ...formData, status });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Edit Item</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="id">Item ID</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            disabled // ID should not be editable
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price (₹)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock">Stock</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditItemModal;