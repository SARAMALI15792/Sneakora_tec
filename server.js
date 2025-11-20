const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./backend/database');
const { getProducts, saveProducts } = require('./backend/products-db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.')));

// --- Auth Routes ---

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const role = 'user'; // Default role

    db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, hash, role],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ id: this.lastID, name, email, role });
        }
    );
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
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
    res.json(getProducts());
});

app.post('/api/products', (req, res) => {
    const products = getProducts();
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    saveProducts(products);
    res.json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id == req.params.id);
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        saveProducts(products);
        res.json(products[index]);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    let products = getProducts();
    products = products.filter(p => p.id != req.params.id);
    saveProducts(products);
    res.json({ message: 'Deleted' });
});

// --- Serve Frontend ---
// --- Serve Frontend ---
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
