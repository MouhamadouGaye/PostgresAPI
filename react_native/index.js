const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyToken = require('./mddleware/authMiddleware.js'); // Import the middleware


const app = express();
const pool = new Pool({
  user: 'gaye',
  host: 'localhost',
  database: 'crudbackend',
  password: 'Postgres.2424',
  port: 5433,
});

if (pool) {
  console.log("Database is running")
}

app.use(cors());
app.use(bodyParser.json());


// Example route using the middleware
app.get('/users', verifyToken, async (req, res) => {
  const { userId } = req.user; // Now req.user should be available after token verification
  try {
    const result = await pool.query('SELECT id, username, email FROM users WHERE id != $1', [userId]);
    res.json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign up endpoint
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body; // Include email
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' }); // Validate input
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword] // Include email in the query
    );
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign in endpoint
app.post('/signin', async (req, res) => {
  const { email, password } = req.body; // Use email for sign-in
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]); // Fix typo in table name
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/add-friend', async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    // Add friendship relation (bi-directional)
    await pool.query('INSERT INTO friends (user_id_1, user_id_2) VALUES ($1, $2), ($2, $1)', [senderId, receiverId]);
    res.json({ message: 'Friend added successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.get("/search-users", verifyToken, async (req, res) => {
  const { query } = req.query; // Get the search query (username)

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, username FROM users WHERE username ILIKE $1 LIMIT 10", // Search using ILIKE for case-insensitive matching
      [`%${query}%`]
    );
    res.json({ users: result.rows }); // Return matched users
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Get messages between two users
app.get("/messages", verifyToken, async (req, res) => {
  const { user_id_1, user_id_2 } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at ASC",
      [user_id_1, user_id_2]
    );
    res.json({ messages: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post a message
app.post("/message", verifyToken, async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *",
      [sender_id, receiver_id, message]
    );
    res.json({ message: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
