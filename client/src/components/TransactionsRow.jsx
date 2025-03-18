// client/src/components/TransactionsRow.jsx
import { Trash2 } from 'lucide-react';

export const TransactionsRow = ({ transaction, index, onDelete, formatDate }) => (
  <tr>
    <td>{transaction.id || `TR-${Date.now().toString().slice(-6)}-${index}`}</td>
    <td>{transaction.itemId}</td>
    <td>{transaction.itemName}</td>
    <td>{transaction.category}</td>
    <td>{transaction.quantity}</td>
    <td>₹{transaction.totalAmount}</td>
    <td>{formatDate(transaction.transactionDate)}</td>
    <td>
      <div className="action-buttons">
        <button
          className="delete-btn"
          onClick={() => onDelete(transaction.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);