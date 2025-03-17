export const InventoryActions = ({ searchTerm, setSearchTerm, setShowAddModal }) => (
    <div className="inventory-actions">
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button className="add-item-btn" onClick={() => setShowAddModal(true)}>
        Add New Item
      </button>
    </div>
  );