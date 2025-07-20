import React, { useState } from "react";
import "../styles/Modal.css";

const RestockModal = ({ item, onClose, onRestock }) => {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRestock(item.id, Number(quantity));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Restock Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="form-group">
              <label>Item Name:</label>
              <span>{item.name}</span>
            </div>
            <div className="form-group">
              <label>Current Stock:</label>
              <span>{item.quantity}</span>
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Restock Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="confirm-btn">
              Restock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;
