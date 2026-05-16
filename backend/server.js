const express = require('express');
const cors = require('cors');
const db = require('./database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Basic Authentication Middleware for Admin routes
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer admin-token-123') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// --- Products API ---

// GET all products (public)
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Simulate delay
    setTimeout(() => res.json(rows), 300);
  });
});

// POST new product (Admin)
app.post('/api/products', authenticate, upload.single('image'), (req, res) => {
  const { name, notes, price } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : 'perfume_1.png';
  
  db.run('INSERT INTO products (name, notes, price, imagePath) VALUES (?, ?, ?, ?)', 
    [name, notes, price, imagePath], 
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, name, notes, price, imagePath });
  });
});

// PUT update product (Admin)
app.put('/api/products/:id', authenticate, (req, res) => {
  const { name, notes, price, imagePath } = req.body;
  db.run('UPDATE products SET name = ?, notes = ?, price = ?, imagePath = ? WHERE id = ?', 
    [name, notes, price, imagePath, req.params.id], 
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ updated: this.changes });
  });
});

// DELETE product (Admin)
app.delete('/api/products/:id', authenticate, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', req.params.id, function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});


// --- Orders API ---

// POST new order (Public - from Cart Checkout)
app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, phone, address, totalAmount } = req.body;
  // In a real app we'd also store the order items
  db.run('INSERT INTO orders (customerName, customerEmail, phone, address, totalAmount) VALUES (?, ?, ?, ?, ?)', 
    [customerName || 'Guest', customerEmail || 'guest@example.com', phone, address, totalAmount], 
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, status: 'Success' });
  });
});

// GET all orders (Admin)
app.get('/api/orders', authenticate, (req, res) => {
  db.all('SELECT * FROM orders ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// PUT update order status (Admin)
app.put('/api/orders/:id', authenticate, (req, res) => {
  const { status } = req.body;
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ updated: this.changes });
  });
});

// Auth check endpoint (to verify token)
app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({ token: 'admin-token-123' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
