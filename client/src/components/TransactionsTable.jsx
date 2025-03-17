import { TransactionsRow } from './TransactionsRow';

export const TransactionsTable = ({ transactions, onDelete, formatDate }) => (
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
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <TransactionsRow
              key={transaction.id || index}
              transaction={transaction}
              index={index}
              onDelete={onDelete}
              formatDate={formatDate}
            />
          ))
        ) : (
          <tr>
            <td colSpan="10" className="no-data">
              No transactions found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);