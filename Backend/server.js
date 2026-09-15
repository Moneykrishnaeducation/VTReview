const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Pool setup
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

// Test DB Connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to PostgreSQL database at:', result.rows[0].now);
  });
});

const path = require('path');

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ message: 'API is working!', status: 'success' });
});

// Serve frontend static files
const frontendDistPath = path.join(__dirname, 'static');
app.use(express.static(frontendDistPath));

// Catch-all route to serve React app for non-API requests
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Start Server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port: ${port}`);
});
