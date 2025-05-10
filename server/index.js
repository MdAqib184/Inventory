// server/index.js
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

// Load models
const User = require("./models/User");
const inventoryRoutes = require("./routes/inventory");
const transactionRoutes = require("./routes/transactions");
const authRoutes = require("./routes/auth");
const {
  sequelize,
  testConnection,
  initDatabase,
} = require("./config/database");

dotenv.config();
const app = express();

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize database
testConnection();
initDatabase();

// Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/auth", authRoutes);

// Protected route example
app.get("/api/user", (req, res) => {
  res.json(req.user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
