import { Trash2, Edit } from 'lucide-react';

export const InventoryRow = ({ item, onSellClick, onEditClick, onDeleteClick }) => (
  <tr>
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.category}</td>
    <td>₹{item.price}</td>
    <td>
      <div className="stock-control">
        <span className="stock-value">{item.stock}</span>
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
          onClick={() => onSellClick(item)}
          disabled={item.stock <= 0}
        >
          Sell
        </button>
        <button className="edit-btn" onClick={() => onEditClick(item)}>
          <Edit size={16} />
        </button>
        <button className="delete-btn" onClick={() => onDeleteClick(item.id)}>
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);