import sqlite3 from 'sqlite3';

const database_url = "./database.db"

const db = new sqlite3.Database(database_url, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

export default db;
