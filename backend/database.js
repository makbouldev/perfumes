const path = require('path');

const isProduction = !!process.env.DATABASE_URL;
let db;

if (isProduction) {
  console.log('Using PostgreSQL database in production.');
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Helper to convert SQLite syntax to Postgres syntax
  function convertSql(sql) {
    let index = 1;
    return sql.replace(/\?/g, () => `$${index++}`);
  }

  function convertTableSql(sql) {
    return sql
      .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY')
      .replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/gi, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
      .replace(/REAL/gi, 'DOUBLE PRECISION');
  }

  db = {
    run: function(sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      if (!Array.isArray(params)) {
        params = params === undefined ? [] : [params];
      }

      let pgSql = convertSql(sql);
      const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT');
      if (isInsert) {
        pgSql += ' RETURNING id';
      }

      pool.query(pgSql, params, function(err, res) {
        if (err) {
          if (callback) callback(err);
          return;
        }
        const context = {
          lastID: isInsert && res.rows[0] ? res.rows[0].id : null,
          changes: res.rowCount
        };
        if (callback) {
          callback.call(context, null);
        }
      });
    },

    all: function(sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      if (!Array.isArray(params)) {
        params = params === undefined ? [] : [params];
      }

      let pgSql = convertSql(sql);
      pool.query(pgSql, params, (err, res) => {
        if (err) {
          if (callback) callback(err);
          return;
        }
        if (callback) callback(null, res.rows);
      });
    },

    get: function(sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      if (!Array.isArray(params)) {
        params = params === undefined ? [] : [params];
      }

      let pgSql = convertSql(sql);
      pool.query(pgSql, params, (err, res) => {
        if (err) {
          if (callback) callback(err);
          return;
        }
        if (callback) callback(null, res.rows[0] || null);
      });
    },

    prepare: function(sql, callback) {
      const pgSql = convertSql(sql);
      const stmt = {
        run: function(...args) {
          let cb = null;
          let params = args;
          if (typeof args[args.length - 1] === 'function') {
            cb = args[args.length - 1];
            params = args.slice(0, -1);
          }
          pool.query(pgSql, params, (err) => {
            if (cb) cb(err);
          });
          return stmt;
        },
        finalize: function(cb) {
          if (cb) cb();
        }
      };
      if (callback) callback(stmt);
      return stmt;
    }
  };

  // Initialize Tables
  const initDb = async () => {
    try {
      const client = await pool.connect();
      await client.query(convertTableSql(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        notes TEXT NOT NULL,
        price REAL NOT NULL,
        imagePath TEXT NOT NULL
      )`));

      await client.query(convertTableSql(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT NOT NULL,
        customerEmail TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        items TEXT,
        status TEXT DEFAULT 'Pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`));
      
      // Attempt to upgrade existing tables
      try { await client.query('ALTER TABLE orders ADD COLUMN items TEXT'); } catch (e) {}

      console.log('PostgreSQL tables initialized.');
      client.release();

      // Seed initial data if empty
      db.get('SELECT count(*) as count FROM products', (err, row) => {
        if (err) {
          console.error('Error checking product count for seeding:', err);
          return;
        }
        if (row && parseInt(row.count) === 0) {
          console.log('Seeding initial products in PostgreSQL...');
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
    } catch (err) {
      console.error('Error initializing PostgreSQL tables:', err);
    }
  };
  initDb();

} else {
  console.log('Using local SQLite database.');
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.resolve(__dirname, 'ecommerce.db');
  const localDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database', err.message);
    } else {
      console.log('Connected to the SQLite database.');
      localDb.run(`CREATE TABLE IF NOT EXISTS products (
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
          localDb.get('SELECT count(*) as count FROM products', (err, row) => {
            if (row && parseInt(row.count) === 0) {
              console.log('Seeding initial products...');
              const stmt = localDb.prepare('INSERT INTO products (name, notes, price, imagePath) VALUES (?, ?, ?, ?)');
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

      localDb.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT NOT NULL,
        customerEmail TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        items TEXT,
        status TEXT DEFAULT 'Pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, () => {
        // Attempt to upgrade existing table
        localDb.run('ALTER TABLE orders ADD COLUMN items TEXT', () => {});
      });
    }
  });
  db = localDb;
}

module.exports = db;
