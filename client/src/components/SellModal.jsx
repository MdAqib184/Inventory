// client/src/components/SellModal.jsx
import React, { useState } from 'react';
import '../styles/Modal.css';

const SellModal = ({ item, onClose, onSell }) => {
  const [quantity, setQuantity] = useState(1);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSell(item.id, parseInt(quantity));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Sell Item</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item: {item.name}</label>
          </div>
          <div className="form-group">
            <label>Available Stock: {item.stock}</label>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity to Sell:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={item.stock}
              required
            />
          </div>
          <div className="form-group">
            <label>Total Amount: ₹{(item.price * quantity).toFixed(2)}</label>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={quantity > item.stock}
            >
              Confirm Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellModal;