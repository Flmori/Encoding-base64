const db = require('../db');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const userExists = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (userExists) {
      return res.status(400).json({ 
        success: false,
        error: 'Username already exists' 
      });
    }

    // Encode password with base64
    const encodedPassword = Buffer.from(password).toString('base64');
    
    // Create user
    const { lastID } = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, encodedPassword],
        function(err) {
          if (err) reject(err);
          resolve(this);
        }
      );
    });

    // Generate token
    const token = jwt.sign(
      { userId: lastID },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ 
      success: true,
      token, 
      user: { id: lastID, username } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Check password (compare base64 encoded)
    const encodedPassword = Buffer.from(password).toString('base64');
    if (encodedPassword !== user.password) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ 
      success: true,
      token, 
      user: { id: user.id, username: user.username } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { register, login };
