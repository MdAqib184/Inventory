import { TransactionsRow } from './TransactionsRow';

export const TransactionsTable = ({ transactions, onDelete, formatDate }) => (
  <div className="transaction-table">
    <table>
      <thead>
        <tr>
          <th>TR_ID</th>
          <th>IT_ID</th>
          <th>NAME</th>
          <th>CATEGORY</th>
          <th>QUANTITY</th>
          <th>TOTAL AMOUNT</th>
          <th>DATE & TIME</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <TransactionsRow
              key={transaction._id || index}
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