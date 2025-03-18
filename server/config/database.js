// server/config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Create a new Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/inventory.sqlite'),
  logging: false // Set to console.log to see SQL queries
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to SQLite database successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Initialize database
const initDatabase = async () => {
  try {
    // Sync all defined models to the DB
    await sequelize.sync();
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('Database synchronization failed:', error);
  }
};

module.exports = { sequelize, testConnection, initDatabase };