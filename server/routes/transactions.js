// server/routes/transactions.js
const router = require("express").Router();
const Transaction = require("../models/Transaction");
const PDFDocument = require("pdfkit");
const InventoryItem = require("../models/InventoryItem");

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: 1 },
      order: [["transactionDate", "DESC"]],
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new transaction
router.post("/", async (req, res) => {
  const { itemId, quantity } = req.body;

  try {
    // Fetch the inventory item
    const item = await InventoryItem.findOne({
      where: { id: itemId, userId: 1 },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if there is enough stock
    if (item.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock to sell" });
    }

    // Update the stock
    const newStock = item.stock - quantity;
    const updatedItem = { stock: newStock };

    // Update status if necessary
    if (newStock === 0) {
      updatedItem.status = "Out of Stock";
    } else if (newStock <= 5) {
      updatedItem.status = "Low Stock";
    }

    await InventoryItem.update(updatedItem, {
      where: { id: itemId, userId: 1 },
    });

    // Record the transaction
    const newTransaction = await Transaction.create({
      ...req.body,
      userId: 1,
    });

    // If stock is 0, delete all transactions and generate a PDF
    if (newStock === 0) {
      const transactions = await Transaction.findAll({
        where: { itemId },
      });

      if (transactions.length > 0) {
        // Generate a PDF with transaction details
        const doc = new PDFDocument();

        // Set response headers for PDF download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="transaction_report_item_${itemId}.pdf"`
        );

        // Pipe the PDF document to the response
        doc.pipe(res);

        doc
          .fontSize(16)
          .text(`Transaction Report for Item ID: ${itemId}`, {
            underline: true,
          });
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
            where: { itemId },
          });
        });

        return; // Ensure no further code runs after sending the PDF
      }
    }

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete transaction
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: {
        id: req.params.id,
        userId: 1,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
