const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express(); // ✅ Define app FIRST

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  }
});

connection.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// ✅ Example API route
app.post('/register', (req, res) => {
  const { userid, password } = req.body;
  const sql = 'INSERT INTO users (userid, password) VALUES (?, ?)';
  connection.query(sql, [userid, password], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database error');
    } else {
      res.send('Successfully submitted!');
    }
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(🚀 Server running on port ${PORT});
});
