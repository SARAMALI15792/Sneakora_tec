# Sneakora — Complete MySQL Setup & Developer Guide

---

## What This Guide Covers

```
SECTION 1  →  What You Need Installed
SECTION 2  →  Create the MySQL Database (First Time)
SECTION 3  →  Connect This Project to Your MySQL
SECTION 4  →  Run the Project
SECTION 5  →  View Your Tables (3 Ways)
SECTION 6  →  Run CRUD Queries (Create, Read, Update, Delete)
SECTION 7  →  Change Queries in the Code
SECTION 8  →  Troubleshooting
```

---

## SECTION 1 — What You Need Installed

Before anything, make sure you have these on your computer:

| Tool         | Why You Need It             | How to Check                    |
|--------------|-----------------------------|---------------------------------|
| Node.js      | Runs the backend server     | `node -v` → should show version |
| npm          | Installs packages           | `npm -v` → should show version  |
| MySQL Server | The actual database         | Open Services → look for MySQL80|
| MySQL Workbench (optional) | Visual table viewer | Just open the app   |

> If MySQL is not installed → Download from: https://dev.mysql.com/downloads/installer/
> Choose "MySQL Community Server" + "MySQL Workbench" in the installer.

---

## SECTION 2 — Create the MySQL Database (First Time Setup)

This step is done **once**. It creates the database and all 5 tables.

### Step 2A — Open MySQL Command Line

**Option A: Using MySQL Workbench**
1. Open MySQL Workbench
2. Click on "Local instance MySQL80"
3. Enter your root password
4. Click the SQL editor (lightning bolt icon)

**Option B: Using Terminal / Command Prompt**
```bash
mysql -u root -p
```
Then type your password and press Enter.

---

### Step 2B — Run This SQL to Create Everything

Copy and paste ALL of this into the SQL editor, then run it:

```sql
-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS sneakora_db;

-- Step 2: Switch to using it
USE sneakora_db;

-- Step 3: Create the users table
CREATE TABLE IF NOT EXISTS users (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role     VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create the products table
CREATE TABLE IF NOT EXISTS products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    category    VARCHAR(100),
    image       VARCHAR(500),
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Create the orders table
CREATE TABLE IF NOT EXISTS orders (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    total      DECIMAL(10,2) NOT NULL,
    status     VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Step 6: Create the order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    order_id   INT NOT NULL,
    product_id INT NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Step 7: Create the cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    product_id INT NOT NULL,
    added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**Run it. You should see: "Query OK" for each step.**

---

### Step 2C — Add Sample Products (Optional but Recommended)

```sql
USE sneakora_db;

INSERT INTO products (name, price, category, image, description) VALUES
('Skechers D-Lites',        89.99,  'Men',    'images/shoe_cyan.png',   'Classic chunky sole with memory foam'),
('Skechers Go Walk 7',      79.99,  'Women',  'images/shoe_pink.png',   'Ultra-light walking shoe'),
('Skechers Afterburn',      94.99,  'Men',    'images/shoe_purple.png', 'Athletic training shoe'),
('Skechers Skech-Air',      109.99, 'Women',  'images/shoe_green.png',  'Air-cushioned comfort'),
('Skechers Kids Twinkle',   59.99,  'Kids',   'images/shoe_cyan.png',   'Light-up kids shoe'),
('Skechers Sport Active',   84.99,  'Sports', 'images/shoe_pink.png',   'High-performance sport shoe'),
('Skechers Relaxed Fit',    74.99,  'Casual', 'images/shoe_purple.png', 'Wide fit everyday comfort');
```

---

## SECTION 3 — Connect This Project to YOUR MySQL

Only **one file** controls the database connection:

```
backend/database.js
```

Open that file. You will see this:

```js
const db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'saram',       ← CHANGE THIS to your MySQL password
    database: 'sneakora_db'
});
```

### What to Change

| Field      | What to Put                                    |
|------------|------------------------------------------------|
| `host`     | Keep as `localhost` (MySQL is on your machine) |
| `user`     | Keep as `root` (default MySQL admin user)      |
| `password` | **Your** MySQL root password                   |
| `database` | Keep as `sneakora_db` (what we created above)  |

### Example — If your password is "mypassword123":

```js
const db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'mypassword123',
    database: 'sneakora_db'
});
```

> That's it. One change. The whole app uses this connection.

---

## SECTION 4 — Run the Project

### Step 1 — Make sure MySQL is running

```
Windows:
  Press Windows key → search "Services" → open it
  Find "MySQL80" in the list
  Status column should say "Running"
  If not → right-click → Start
```

### Step 2 — Open terminal in the project folder

```
Right-click inside the Sneakora_tec folder
→ "Open in Terminal"  (or "Git Bash Here")
```

### Step 3 — Install dependencies (first time only)

```bash
npm install
```

This downloads: `express`, `mysql2`, `bcrypt`, `body-parser`, `cors`

### Step 4 — Start the server

```bash
node server.js
```

### Step 5 — Look for this in the terminal

```
Server running on http://localhost:3000
Connected to MySQL database.
```

Both lines must appear. If only the first line appears, the database connection failed.

### Step 6 — Open the app

Open your browser and go to:
```
http://localhost:3000
```

---

## SECTION 5 — View Your Tables (3 Ways)

### Way 1: MySQL Workbench (Easiest — Visual)

```
1. Open MySQL Workbench
2. Connect to Local instance
3. On the left panel → expand "sneakora_db"
4. Click "Tables" → you see all 5 tables listed
5. Right-click any table → "Select Rows - Limit 1000"
   → This shows all data in a spreadsheet-like view
```

### Way 2: MySQL Command Line

```bash
mysql -u root -p
```

Then run these commands one by one:

```sql
USE sneakora_db;

SHOW TABLES;
```

Output will look like:
```
+---------------------+
| Tables_in_sneakora_db |
+---------------------+
| cart_items          |
| order_items         |
| orders              |
| products            |
| users               |
+---------------------+
```

To see the structure (columns) of a table:
```sql
DESCRIBE products;
DESCRIBE users;
DESCRIBE orders;
DESCRIBE order_items;
DESCRIBE cart_items;
```

To see all data inside a table:
```sql
SELECT * FROM products;
SELECT * FROM users;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM cart_items;
```

### Way 3: VS Code Extension

```
1. Open VS Code
2. Press Ctrl+Shift+X → search "MySQL" by cweijan
3. Install it
4. Click the database icon in the left sidebar
5. Add connection → host: localhost, user: root, password: yours
6. Browse tables visually inside VS Code
```

---

## SECTION 6 — Run CRUD Queries (Create, Read, Update, Delete)

CRUD = the 4 basic database operations. Here are ready-to-run examples.

---

### CREATE — Add new data

**Add a new product:**
```sql
USE sneakora_db;

INSERT INTO products (name, price, category, image, description)
VALUES ('Skechers Arch Fit', 119.99, 'Men', 'images/shoe_cyan.png', 'Podiatrist certified arch support');
```

**Add a test user manually:**
```sql
INSERT INTO users (name, email, password, role)
VALUES ('Test User', 'test@example.com', 'hashed_password_here', 'user');
```
> Note: In the real app, passwords are hashed by bcrypt. Only use raw passwords for testing.

---

### READ — Get / view data

**See all products:**
```sql
SELECT * FROM products;
```

**See only Men's shoes:**
```sql
SELECT * FROM products WHERE category = 'Men';
```

**See products sorted by price (cheapest first):**
```sql
SELECT name, price, category FROM products ORDER BY price ASC;
```

**See a specific product by ID:**
```sql
SELECT * FROM products WHERE id = 1;
```

**See all users (without passwords):**
```sql
SELECT id, name, email, role, created_at FROM users;
```

**See all orders with product names:**
```sql
SELECT
    o.id          AS order_id,
    u.name        AS customer,
    p.name        AS product,
    oi.price,
    o.status,
    o.created_at
FROM orders o
JOIN users       u  ON o.user_id    = u.id
JOIN order_items oi ON o.id         = oi.order_id
JOIN products    p  ON oi.product_id = p.id
ORDER BY o.created_at DESC;
```

---

### UPDATE — Change existing data

**Change the price of a product:**
```sql
UPDATE products
SET price = 99.99
WHERE id = 1;
```

**Change a product's category:**
```sql
UPDATE products
SET category = 'Sports'
WHERE name = 'Skechers Afterburn';
```

**Mark an order as delivered:**
```sql
UPDATE orders
SET status = 'delivered'
WHERE id = 1;
```

**Update a user's name:**
```sql
UPDATE users
SET name = 'New Name'
WHERE email = 'test@example.com';
```

---

### DELETE — Remove data

**Delete a specific product:**
```sql
DELETE FROM products WHERE id = 7;
```

**Delete all cart items for a user:**
```sql
DELETE FROM cart_items WHERE user_id = 1;
```

**Delete all orders (careful — this also breaks order_items):**
```sql
DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = 1);
DELETE FROM orders WHERE user_id = 1;
```

> Always delete child records (order_items) BEFORE parent records (orders) because of foreign keys.

---

## SECTION 7 — Change Queries in the Code

All API queries live in `server.js`. Here is a map of where to find them:

```
server.js
│
├── Line ~17   POST /api/register     → INSERT INTO users
├── Line ~32   POST /api/login        → SELECT * FROM users WHERE email = ?
│
├── Line ~49   GET  /api/products     → SELECT * FROM products
├── Line ~56   GET  /api/products/:id → SELECT * FROM products WHERE id = ?
├── Line ~64   POST /api/products     → INSERT INTO products
├── Line ~76   PUT  /api/products/:id → UPDATE products SET ...
├── Line ~88   DELETE /api/products/:id → DELETE FROM products WHERE id = ?
│
├── Line ~97   GET  /api/cart/:userId → SELECT with JOIN
├── Line ~111  POST /api/cart         → INSERT INTO cart_items
├── Line ~122  DELETE /api/cart/:id   → DELETE FROM cart_items WHERE id = ?
├── Line ~130  DELETE /api/cart/user/:userId → DELETE FROM cart_items WHERE user_id = ?
│
├── Line ~139  POST /api/orders       → INSERT INTO orders + order_items
└── Line ~163  GET  /api/orders/:userId → SELECT with 3-table JOIN
```

### How to Change a Query — Example

Say you want to also return the `description` field when getting products.

**Find this in server.js (line ~49):**
```js
app.get('/api/products', (req, res) => {
    db.query(`SELECT * FROM products`, (err, rows) => {
```

`SELECT *` already returns all columns including description — so no change needed here.

**But say you want only name and price:**
```js
db.query(`SELECT id, name, price FROM products`, (err, rows) => {
```

**Or filter by category via URL query param** (`/api/products?category=Men`):
```js
app.get('/api/products', (req, res) => {
    const category = req.query.category;
    if (category) {
        db.query(`SELECT * FROM products WHERE category = ?`, [category], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    } else {
        db.query(`SELECT * FROM products`, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
});
```

After any change to `server.js`, stop the server (Ctrl+C) and restart:
```bash
node server.js
```

---

## SECTION 8 — Troubleshooting

| Problem | What It Means | Fix |
|---------|--------------|-----|
| `MySQL connection failed` | MySQL server not running | Open Services → Start MySQL80 |
| `Access denied for user 'root'` | Wrong password in database.js | Update password field in `backend/database.js` |
| `Unknown database 'sneakora_db'` | Database not created yet | Run the CREATE DATABASE SQL from Section 2 |
| `Cannot find module 'mysql2'` | npm install not done | Run `npm install` |
| `Port 3000 already in use` | Old server still running | Run: `taskkill /f /im node.exe` then restart |
| Products page is empty | Products table is empty | Run the INSERT sample products from Section 2C |
| `ER_NO_REFERENCED_ROW` | Foreign key violation | Add the parent record first (e.g. user before cart) |
| Login fails | User not in database | Register first via the app, not manually via SQL |

---

## Database Relationships — Visual Map

```
┌──────────┐         ┌─────────────┐         ┌──────────────┐
│  users   │────────>│   orders    │────────>│ order_items  │
│          │  1:many │             │  1:many │              │
│ id       │         │ id          │         │ id           │
│ name     │         │ user_id ────┘         │ order_id ────┘
│ email    │         │ total                 │ product_id ──┐
│ password │         │ status                │ price        │
│ role     │         │ created_at            └──────────────┘
└──────────┘         └─────────────┘                        │
     │                                                       │
     │               ┌─────────────┐         ┌──────────────┘
     │               │ cart_items  │         │
     └──────────────>│             │    ┌────┘
           1:many    │ id          │    │    ┌──────────────┐
                     │ user_id ────┘    └───>│   products   │
                     │ product_id ───────────│              │
                     │ added_at              │ id           │
                     └─────────────┘         │ name         │
                                             │ price        │
                                             │ category     │
                                             │ image        │
                                             │ description  │
                                             └──────────────┘
```

**Reading the map:**
- One user can have many orders
- One order can have many order_items
- Each order_item points to one product
- One user can have many cart_items
- Each cart_item points to one product

---

## Quick Reference Card

```
START PROJECT
─────────────
1. Check MySQL80 is Running (Services)
2. cd into project folder
3. npm install         (first time only)
4. node server.js
5. Open http://localhost:3000

VIEW DATA
─────────
MySQL Workbench → sneakora_db → Tables → Right-click → Select Rows

QUICK QUERIES (run in MySQL Workbench or terminal)
───────────────────────────────────────────────────
USE sneakora_db;
SELECT * FROM products;       ← see all products
SELECT * FROM users;          ← see all users
SELECT * FROM orders;         ← see all orders
SELECT * FROM cart_items;     ← see all cart items

CHANGE SOMETHING IN THE API
─────────────────────────────
1. Open server.js
2. Find the route you want (see Section 7 map)
3. Edit the SQL query string
4. Save → Ctrl+C to stop server → node server.js to restart
```
