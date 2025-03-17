import { TransactionsActions } from './TransactionsActions';
import { TransactionsTable } from './TransactionsTable';

export const TransactionsSection = ({
  transactionSearchTerm,
  setTransactionSearchTerm,
  filteredTransactions,
  handleDeleteTransaction,
  formatDate
}) => (
  <div className="transactions-section">
    <h2>Transaction History</h2>
    <TransactionsActions
      searchTerm={transactionSearchTerm}
      setSearchTerm={setTransactionSearchTerm}
    />
    <TransactionsTable
      transactions={filteredTransactions}
      onDelete={handleDeleteTransaction}
      formatDate={formatDate}
    />
  </div>
);