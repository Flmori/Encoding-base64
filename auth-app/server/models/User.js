const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profileImage TEXT
  )
`;

const dropUsersTable = `
  DROP TABLE IF EXISTS users
`;

module.exports = {
  createUsersTable,
  dropUsersTable
};
