const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Error handling
db.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = db;
