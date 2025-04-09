const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
const { createUsersTable } = require('./models/User');

// Initialize database with schema
db.serialize(() => {
  db.run(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table initialized with profileImage column');
    }
  });
});

// Verify schema exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
  if (!row) {
    console.error('Users table does not exist!');
  }
});

module.exports = db;
