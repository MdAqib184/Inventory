import { InventoryRow } from './InventoryRow';

export const InventoryTable = ({ items, onSellClick, onEditClick, onDeleteClick }) => (
  <div className="inventory-table">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>CATEGORY</th>
          <th>PRICE</th>
          <th>STOCK</th>
          <th>STATUS</th>
          <th>LAST UPDATED</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <InventoryRow
            key={item.id}
            item={item}
            onSellClick={onSellClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </tbody>
    </table>
  </div>
);