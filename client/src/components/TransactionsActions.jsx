export const TransactionsActions = ({ searchTerm, setSearchTerm }) => (
    <div className="transaction-actions">
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );