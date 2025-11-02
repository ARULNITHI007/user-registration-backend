// Import packages
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Initialize express
const app = express();

// Middleware
app.use(cors()); // Allow frontend (Neocities) access
app.use(express.json()); // Parse JSON body

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: true } // Required for Render + Cloud MySQL
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL Database');
  }
});

// Default route to test if backend is live
app.get('/', (req, res) => {
  res.send('✅ Backend is live and running on Render!');
});

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert into database
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, hashed], (err, result) => {
      if (err) {
        console.error(err);

        // Handle duplicate email
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).send('Email already registered');
        }

        return res.status(500).send('Error saving user');
      }

      return res.send('✅ Successfully Registered');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(🚀 Server running on http://localhost:${PORT}));
