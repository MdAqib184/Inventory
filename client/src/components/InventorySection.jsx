import { InventoryActions } from './InventoryActions';
import { InventoryTable } from './InventoryTable';

export const InventorySection = ({
  searchTerm,
  setSearchTerm,
  setShowAddModal,
  filteredItems,
  handleSellClick,
  handleEditClick,
  handleDeleteItem
}) => (
  <div className="inventory-section">
    <InventoryActions
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      setShowAddModal={setShowAddModal}
    />
    <InventoryTable
      items={filteredItems}
      onSellClick={handleSellClick}
      onEditClick={handleEditClick}
      onDeleteClick={handleDeleteItem}
    />
  </div>
);