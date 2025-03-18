import { Trash2 } from 'lucide-react';

export const TransactionsRow = ({ transaction, index, onDelete, formatDate }) => (
  <tr>
    <td>{transaction._id || `TR-${Date.now().toString().slice(-6)}-${index}`}</td>
    <td>{transaction.itemId}</td>
    <td>{transaction.itemName}</td>
    <td>{transaction.category}</td>
    <td>{transaction.quantity}</td>
    {/* <td>₹{transaction.price}</td> */}
    <td>₹{transaction.totalAmount}</td>
    {/* <td>
      <span className={`status-badge ${transaction.transactionType.toLowerCase()}`}>
        {transaction.transactionType}
      </span>
    </td> */}
    <td>{formatDate(transaction.transactionDate)}</td>
    <td>
      <div className="action-buttons">
        <button
          className="delete-btn"
          onClick={() => onDelete(transaction._id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);