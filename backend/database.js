const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      notes TEXT NOT NULL,
      price REAL NOT NULL,
      imagePath TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating products table', err);
      } else {
        // Seed initial data if empty
        db.get('SELECT count(*) as count FROM products', (err, row) => {
          if (row.count === 0) {
            console.log('Seeding initial products...');
            const stmt = db.prepare('INSERT INTO products (name, notes, price, imagePath) VALUES (?, ?, ?, ?)');
            stmt.run('Noir Éternel', 'Oud • Leather • Bergamot', 245, 'perfume_1.png');
            stmt.run('Lumière d\'Or', 'Saffron • Rose • Vanilla', 320, 'perfume_2.png');
            stmt.run('Océan Nocturne', 'Ambergris • Sea Salt • Cedar', 195, 'perfume_3.png');
            stmt.run('Aura Blanche', 'White Musk • Peony • Lily', 180, 'perfume_4.png');
            stmt.run('Éclat Matinal', 'Jasmine • Green Tea • Citrus', 210, 'perfume_5.png');
            stmt.run('Soie Pétillante', 'Champagne • Pear • Vanilla', 265, 'perfume_6.png');
            stmt.finalize();
          }
        });
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      totalAmount REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

module.exports = db;
