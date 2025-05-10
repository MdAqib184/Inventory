import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { StatCard } from "../components/StatCard";
import { Tabs } from "../components/Tabs";
import { InventorySection } from "../components/InventorySection";
import { TransactionsSection } from "../components/TransactionsSection";
import "../styles/Dashboard.css";
import AddItemModal from "../components/AddItemModal";
import EditItemModal from "../components/EditItemModal";
import SellModal from "../components/SellModal";

//const API_URL = "http://localhost:5000";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockAlerts: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sellingItem, setSellingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionSearchTerm, setTransactionSearchTerm] = useState("");

  useEffect(() => {
    fetchInventory();
    fetchStats();
    fetchTransactions();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get("/api/inventory");
      setInventoryItems(res.data);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/inventory/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      const response = await axios.post("/api/inventory", newItem);
      if (response.status !== 201) {
        throw new Error("Failed to add item");
      }
      fetchInventory();
      fetchStats();
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to add item:", error);
      window.alert(
        "Failed to add duplicate item. Please check the console for more details."
      );
    }
  };

  const handleUpdateItem = async (id, updatedItem) => {
    try {
      await axios.put(`/api/inventory/${id}`, updatedItem);
      fetchInventory();
      fetchStats();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(`/api/inventory/${id}`, {
          responseType: "blob", // Important: Set response type to blob for binary data
        });

        // Check if the response contains a PDF
        const contentType = response.headers["content-type"];
        if (contentType === "application/pdf") {
          // Create a blob from the response data
          const blob = new Blob([response.data], { type: "application/pdf" });

          // Create a download link
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = `transaction_report_item_${id}.pdf`; // Set the file name
          link.click();

          // Clean up the object URL
          window.URL.revokeObjectURL(link.href);
        }

        // Refresh inventory and stats after deletion
        fetchInventory();
        fetchStats();
        fetchTransactions();
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  // New function to handle transaction deletion
  const handleDeleteTransaction = async (id) => {
    if (!id) {
      console.error("Transaction ID is undefined!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`/api/transactions/${id}`);
        fetchTransactions();
        fetchStats();
      } catch (error) {
        console.error("Failed to delete transaction:", error);
      }
    }
  };

  // Updated to handle multi-quantity sales
  const handleSellItem = async (id, quantity) => {
    try {
      // Find the item details to record in the transaction
      const itemToSell = inventoryItems.find((item) => item.id === id);
      if (!itemToSell) return;

      const response = await axios.post(
        "/api/transactions",
        {
          itemId: itemToSell.id,
          itemName: itemToSell.name,
          category: itemToSell.category,
          quantity: quantity,
          price: itemToSell.price,
          totalAmount: itemToSell.price * quantity,
          transactionType: "Sale",
          transactionDate: new Date().toISOString(),
        },
        {
          responseType: "blob", // Important: Set response type to blob for binary data
        }
      );

      // Check if the response contains a PDF
      const contentType = response.headers["content-type"];
      if (contentType === "application/pdf") {
        // Create a blob from the response data
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create a download link
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `transaction_report_item_${id}.pdf`; // Set the file name
        link.click();

        // Clean up the object URL
        window.URL.revokeObjectURL(link.href);

        // Refresh inventory and stats after transaction
        fetchInventory();
        fetchStats();
        fetchTransactions();
      } else {
        // If no PDF, assume JSON response and refresh data
        fetchInventory();
        fetchStats();
        fetchTransactions();
      }
    } catch (error) {
      console.error("Failed to update stock or record transaction:", error);

      // Handle insufficient stock error
      if (error.response && error.response.data.message) {
        window.alert(error.response.data.message);
      }
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSellClick = (item) => {
    setSellingItem(item);
    setShowSellModal(true);
  };

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.itemName
        .toLowerCase()
        .includes(transactionSearchTerm.toLowerCase()) ||
      transaction.itemId
        .toLowerCase()
        .includes(transactionSearchTerm.toLowerCase()) ||
      transaction.category
        .toLowerCase()
        .includes(transactionSearchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="dashboard">
      <Header />
      {/* <div className="dashboard-stats">
        <StatCard title="TOTAL ITEMS IN STOCK" value={stats.totalItems} />
        <StatCard
          title="TOTAL INVENTORY AMOUNT"
          value={stats.totalValue}
          isCurrency
        />
        <StatCard title="LOW STOCK ALERTS" value={stats.lowStockAlerts} />
      </div> */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "inventory" && (
        <InventorySection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowAddModal={setShowAddModal}
          filteredItems={filteredItems}
          handleSellClick={handleSellClick}
          handleEditClick={handleEditClick}
          handleDeleteItem={handleDeleteItem}
          formatDate={formatDate}
        />
      )}

      {activeTab === "transactions" && (
        <TransactionsSection
          transactionSearchTerm={transactionSearchTerm}
          setTransactionSearchTerm={setTransactionSearchTerm}
          filteredTransactions={filteredTransactions}
          handleDeleteTransaction={handleDeleteTransaction}
          formatDate={formatDate}
        />
      )}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onAddItem={handleAddItem}
        />
      )}
      {showEditModal && editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
          onSaveItem={handleUpdateItem}
        />
      )}
      {showSellModal && sellingItem && (
        <SellModal
          item={sellingItem}
          onClose={() => {
            setShowSellModal(false);
            setSellingItem(null);
          }}
          onSell={handleSellItem}
        />
      )}
    </div>
  );
};

export default Dashboard;
