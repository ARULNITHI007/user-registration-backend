require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Load config from environment or defaults (for local MySQL)
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'root@123';
const DB_NAME = process.env.DB_NAME || 'user_db';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  port: DB_PORT
});

// Connect and ensure database + table exist
db.connect((err) => {
  if (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL server');

  db.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``, (err) => {
    if (err) { console.error('Create DB error:', err); process.exit(1); }
    db.changeUser({ database: DB_NAME }, (err) => {
      if (err) { console.error('Change DB error:', err); process.exit(1); }

      const createTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      db.query(createTable, (err) => {
        if (err) { console.error('Create table error:', err); process.exit(1); }
        console.log('✅ Database and users table ready');
      });
    });
  });
});

// Route
app.post('/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).send('Email and password are required');

  try {
    const hashed = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, hashed], (err, result) => {
      if (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).send('Email already registered');
        return res.status(500).send('Error saving user');
      }
      return res.send('✅ Successfully Registered');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
