// server/routes/inventory.js
const router = require("express").Router();
const InventoryItem = require("../models/InventoryItem");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const Transaction = require("../models/Transaction");
const { Op } = require("sequelize");

// Get all inventory items for a user
router.get("/", async (req, res) => {
  try {
    const items = await InventoryItem.findAll({
      where: { userId: 1 },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inventory stats
router.get("/stats", async (req, res) => {
  try {
    const items = await InventoryItem.findAll({
      where: { userId: 1 },
    });

    // Calculate stats
    const totalItems = items.reduce((sum, item) => sum + item.stock, 0);
    const totalValue = items.reduce(
      (sum, item) => sum + item.price * item.stock,
      0
    );

    const lowStockItems = await InventoryItem.count({
      where: {
        userId: 1,
        status: "Low Stock",
      },
    });

    res.json({
      totalItems,
      totalValue,
      lowStockAlerts: lowStockItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new inventory item
router.post("/", async (req, res) => {
  try {
    // Check if an item with the same name already exists for the user
    const existingItem = await InventoryItem.findOne({
      where: {
        name: req.body.name,
        userId: 1, // Assuming userId is 1 for now
      },
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Item with this name already exists." });
    }

    // Create the new inventory item
    const newItem = await InventoryItem.create({
      ...req.body,
      lastUpdated: new Date(),
      userId: 1,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating inventory item:", error);
    res.status(400).json({ message: error.message });
  }
});

// Update inventory item
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await InventoryItem.update(
      { ...req.body, lastUpdated: new Date() },
      {
        where: {
          id: req.params.id,
          userId: 1,
        },
        returning: true,
      }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    const updatedItem = await InventoryItem.findOne({
      where: { id: req.params.id },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete inventory item
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  console.log(`Deleting item with ID: ${id}`);

  try {
    // Fetch all transactions linked to the item
    const transactions = await Transaction.findAll({
      where: { itemId: id },
    });

    if (transactions.length > 0) {
      // Generate a PDF with transaction details
      const doc = new PDFDocument();

      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="transaction_report_item_${id}.pdf"`
      );

      // Pipe the PDF document to the response
      doc.pipe(res);

      doc
        .fontSize(16)
        .text(`Transaction Report for Item ID: ${id}`, { underline: true });
      doc.moveDown();

      transactions.forEach((transaction, index) => {
        doc.fontSize(12).text(
          `Transaction ${index + 1}:
          - ID: ${transaction.id}
          - Item Name: ${transaction.itemName}
          - Category: ${transaction.category}
          - Quantity: ${transaction.quantity}
          - Total Amount: ${transaction.totalAmount}
          - Date: ${transaction.transactionDate}`
        );
        doc.moveDown();
      });

      doc.end();

      // Wait for the PDF to finish streaming before proceeding
      doc.on("end", async () => {
        // Delete all transactions linked to the item
        await Transaction.destroy({
          where: { itemId: id },
        });

        // Delete the inventory item
        const deleted = await InventoryItem.destroy({
          where: {
            id,
            userId: 1,
          },
        });

        console.log(`Deleted ${deleted} item(s) with ID: ${id}`);

        if (deleted === 0) {
          return res.status(404).json({ message: "Item not found" });
        }

        console.log("Item and associated transactions deleted successfully");
      });

      return; // Ensure no further code runs after sending the PDF
    }

    // If no transactions exist, delete the inventory item directly
    await InventoryItem.destroy({
      where: {
        id,
        userId: 1,
      },
    });

    console.log(`Deleted item with ID: ${id}`);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item and transactions:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
