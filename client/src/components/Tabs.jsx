export const Tabs = ({ activeTab, setActiveTab }) => (
    <div className="dashboard-tabs">
      <button
        className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => setActiveTab('inventory')}
      >
        Inventory
      </button>
      <button
        className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
        onClick={() => setActiveTab('transactions')}
      >
        Transactions
      </button>
    </div>
  );