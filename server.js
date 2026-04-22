const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./backend/database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.')));

// --- Auth Routes ---

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const role = 'user';

    db.query(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, hash, role],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: result.insertId, name, email, role });
        }
    );
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const user = rows[0];
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (bcrypt.compareSync(password, user.password)) {
            res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
        } else {
            res.status(401).json({ error: 'Invalid password' });
        }
    });
});

// --- Product Routes ---

app.get('/api/products', (req, res) => {
    db.query(`SELECT * FROM products`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/products/:id', (req, res) => {
    db.query(`SELECT * FROM products WHERE id = ?`, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    });
});

app.post('/api/products', (req, res) => {
    const { name, price, category, image, description } = req.body;
    db.query(
        `INSERT INTO products (name, price, category, image, description) VALUES (?, ?, ?, ?, ?)`,
        [name, price, category, image, description || ''],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: result.insertId, name, price, category, image, description });
        }
    );
});

app.put('/api/products/:id', (req, res) => {
    const { name, price, category, image, description } = req.body;
    db.query(
        `UPDATE products SET name=?, price=?, category=?, image=?, description=? WHERE id=?`,
        [name, price, category, image, description, req.params.id],
        (err) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: req.params.id, name, price, category, image, description });
        }
    );
});

app.delete('/api/products/:id', (req, res) => {
    db.query(`DELETE FROM products WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Deleted' });
    });
});

// --- Cart Routes ---

app.get('/api/cart/:userId', (req, res) => {
    db.query(
        `SELECT c.id, p.id as product_id, p.name, p.price, p.category, p.image
         FROM cart_items c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = ?`,
        [req.params.userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

app.post('/api/cart', (req, res) => {
    const { user_id, product_id } = req.body;
    db.query(
        `INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)`,
        [user_id, product_id],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: result.insertId, user_id, product_id });
        }
    );
});

app.delete('/api/cart/:id', (req, res) => {
    db.query(`DELETE FROM cart_items WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Removed from cart' });
    });
});

app.delete('/api/cart/user/:userId', (req, res) => {
    db.query(`DELETE FROM cart_items WHERE user_id = ?`, [req.params.userId], (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Cart cleared' });
    });
});

// --- Order Routes ---

app.post('/api/orders', (req, res) => {
    const { user_id, items, total } = req.body;
    db.query(
        `INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')`,
        [user_id, total],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            const orderId = result.insertId;

            const itemValues = items.map(item => [orderId, item.product_id, item.price]);
            db.query(
                `INSERT INTO order_items (order_id, product_id, price) VALUES ?`,
                [itemValues],
                (err2) => {
                    if (err2) return res.status(400).json({ error: err2.message });
                    db.query(`DELETE FROM cart_items WHERE user_id = ?`, [user_id], () => {
                        res.json({ id: orderId, user_id, total, status: 'pending' });
                    });
                }
            );
        }
    );
});

app.get('/api/orders/:userId', (req, res) => {
    db.query(
        `SELECT o.id, o.total, o.status, o.created_at,
                p.name as product_name, p.image, oi.price
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN products p ON oi.product_id = p.id
         WHERE o.user_id = ?
         ORDER BY o.created_at DESC`,
        [req.params.userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// --- Serve Frontend ---
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
