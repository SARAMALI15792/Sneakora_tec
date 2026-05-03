# Sneakora — Complete MySQL Setup & Developer Guide

---

## What This Guide Covers

```
SECTION 1  →  What You Need Installed
SECTION 2  →  Create the MySQL Database (First Time)
SECTION 3  →  HOW THE CONNECTION WORKS (Code Explained Line by Line)
SECTION 4  →  Connect This Project to YOUR MySQL
SECTION 5  →  Run the Project
SECTION 6  →  View Your Tables (3 Ways)
SECTION 7  →  ALL Queries Used in This Project — Fully Explained
SECTION 8  →  CRUD Operations at Specific Points (Scenarios)
SECTION 9  →  How to Change a Query and Re-Apply It
SECTION 10 →  Troubleshooting
```

---

## SECTION 1 — What You Need Installed

Before anything, make sure you have these on your computer:

| Tool                       | Why You Need It             | How to Check                     |
|----------------------------|-----------------------------|----------------------------------|
| Node.js                    | Runs the backend server     | `node -v` → should show version  |
| npm                        | Installs packages           | `npm -v` → should show version   |
| MySQL Server               | The actual database         | Open Services → look for MySQL80 |
| MySQL Workbench (optional) | Visual table viewer         | Just open the app                |

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
4. Click the SQL editor (the lightning bolt icon at the top)

**Option B: Using Terminal / Command Prompt**
```bash
mysql -u root -p
```
Then type your password and press Enter.

---

### Step 2B — Run This SQL to Create Everything

Copy and paste ALL of this into the SQL editor, then run it (F5 or the lightning bolt):

```sql
-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS sneakora_db;

-- Step 2: Switch to using it
USE sneakora_db;

-- Step 3: Create the users table
CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20) DEFAULT 'user',
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

**You should see "Query OK" for each step.**

---

### Step 2C — Add Sample Products (Optional but Recommended)

```sql
USE sneakora_db;

INSERT INTO products (name, price, category, image, description) VALUES
('Skechers D-Lites',      89.99,  'Men',    'images/shoe_cyan.png',   'Classic chunky sole with memory foam'),
('Skechers Go Walk 7',    79.99,  'Women',  'images/shoe_pink.png',   'Ultra-light walking shoe'),
('Skechers Afterburn',    94.99,  'Men',    'images/shoe_purple.png', 'Athletic training shoe'),
('Skechers Skech-Air',    109.99, 'Women',  'images/shoe_green.png',  'Air-cushioned comfort'),
('Skechers Kids Twinkle', 59.99,  'Kids',   'images/shoe_cyan.png',   'Light-up kids shoe'),
('Skechers Sport Active', 84.99,  'Sports', 'images/shoe_pink.png',   'High-performance sport shoe'),
('Skechers Relaxed Fit',  74.99,  'Casual', 'images/shoe_purple.png', 'Wide fit everyday comfort');
```

---

## SECTION 3 — HOW THE CONNECTION WORKS (Code Explained Line by Line)

This is the most important section. Understanding this tells you exactly how
the app talks to MySQL.

---

### 3A — The Connection File: `backend/database.js`

Open the file `backend/database.js`. Here is the full code with every single
line explained:

```js
// LINE 1
const mysql = require('mysql2');
```
**What this does:**
This loads the `mysql2` package (a library) into the file.
Think of it like plugging in a USB cable — `mysql2` is the cable that lets
Node.js speak to MySQL.
You installed this library by running `npm install`. It lives in the
`node_modules` folder.

---

```js
// LINES 3-8
const db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'saram',
    database: 'sneakora_db'
});
```
**What this does:**
This creates a connection object called `db`.
Think of it like dialing a phone number to MySQL — you are saying:

```
"Hello MySQL, I am at localhost (this same computer),
 my username is root,
 my password is saram,
 please connect me to the sneakora_db database."
```

Breaking down each field:

| Field        | Value          | What It Means                                      |
|--------------|----------------|----------------------------------------------------|
| `host`       | `'localhost'`  | MySQL is on THIS computer (not a remote server)    |
| `user`       | `'root'`       | The MySQL admin username (default after install)   |
| `password`   | `'saram'`      | The password you set when you installed MySQL      |
| `database`   | `'sneakora_db'`| The specific database to use inside MySQL          |

> This is where you change the password when someone else runs the project.
> Only the `password` field needs to change (and `user` if they use a different one).

---

```js
// LINES 10-16
db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed: ' + err.message);
        return;
    }
    console.log('Connected to MySQL database.');
});
```
**What this does:**
This actually makes the connection happen (like pressing "call" after dialing).

Step by step:
1. `db.connect(...)` → tries to connect using the settings above
2. `(err) =>` → a callback function that runs after the attempt
3. `if (err)` → if something went wrong (wrong password, MySQL not running, etc.)
4. `console.error(...)` → prints the error to the terminal in red
5. `return` → stops here, does not continue
6. `console.log('Connected to MySQL database.')` → if no error, prints success

This is why you see either:
```
Connected to MySQL database.         ← success
```
or:
```
MySQL connection failed: Access denied for user 'root'   ← failure
```
in the terminal when you run `node server.js`.

---

```js
// LINE 18
module.exports = db;
```
**What this does:**
This makes the `db` connection available to other files.

When `server.js` writes:
```js
const db = require('./backend/database');
```
It gets back this same `db` object. That means every query in `server.js`
uses the exact same connection you configured here.

---

### 3B — How `server.js` Uses the Connection

The flow every time you use the app:

```
You click something in the browser
        ↓
Browser sends a request to the Node.js server
  e.g.  GET http://localhost:3000/api/products
        ↓
server.js receives the request
        ↓
server.js calls db.query("SELECT * FROM products", ...)
        ↓
db (from database.js) sends the SQL to MySQL
        ↓
MySQL runs the query and returns the data
        ↓
server.js sends the data back as JSON
        ↓
Browser receives JSON and shows it on screen
```

**Every single route in `server.js` follows this exact pattern:**
```js
app.METHOD('/route', (req, res) => {
    db.query(`SQL QUERY HERE`, [values], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
```

| Part                        | Meaning                                              |
|-----------------------------|------------------------------------------------------|
| `app.METHOD`                | GET, POST, PUT, or DELETE                            |
| `'/route'`                  | The URL path (e.g. `/api/products`)                  |
| `req`                       | The incoming request (contains body, params, query)  |
| `res`                       | The response you send back                           |
| `db.query(...)`             | Run a SQL command on MySQL                           |
| `` `SQL QUERY HERE` ``      | The actual SQL — uses backticks so it can span lines |
| `[values]`                  | The `?` placeholders are filled with these values    |
| `(err, result)`             | Callback: err = any error, result = MySQL data       |
| `res.status(500).json(...)` | Send error back if something went wrong              |
| `res.json(result)`          | Send data back on success                            |

---

### 3C — What the `?` Means in Queries

You will notice queries like:
```js
db.query(`SELECT * FROM users WHERE email = ?`, [email], ...)
```

The `?` is a **placeholder**. It gets replaced safely with the actual value.

**Why not just write the value directly?**
```js
// DANGEROUS — never do this:
db.query(`SELECT * FROM users WHERE email = '${email}'`)

// SAFE — always do this:
db.query(`SELECT * FROM users WHERE email = ?`, [email])
```

The `?` approach protects against SQL Injection — a type of attack where someone
types SQL code into your login form to steal data. The `mysql2` library
automatically escapes the value so it cannot be treated as SQL code.

---

## SECTION 4 — Connect This Project to YOUR MySQL

Only **one file** controls the database connection:

```
backend/database.js
```

Open that file. Change only the `password` field:

```js
const db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'YOUR_PASSWORD_HERE',   ← change this
    database: 'sneakora_db'
});
```

### Examples for different people:

**If your MySQL password is "admin123":**
```js
password: 'admin123',
```

**If your MySQL has no password (blank):**
```js
password: '',
```

**If you created a non-root user called "sneakora_user" with password "mypass":**
```js
user:     'sneakora_user',
password: 'mypass',
```

> After changing this file, save it and restart the server (`node server.js`).
> The whole app uses this one file — nothing else needs changing.

---

## SECTION 5 — Run the Project

### Step 1 — Make sure MySQL is running

```
Windows:
  Press Windows key → type "Services" → open it
  Find "MySQL80" in the list
  The Status column must say "Running"
  If it says Stopped → right-click it → Start
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

This downloads all packages listed in `package.json`:
`express`, `mysql2`, `bcrypt`, `body-parser`, `cors`

### Step 4 — Start the server

```bash
node server.js
```

### Step 5 — Confirm both lines appear in terminal

```
Server running on http://localhost:3000
Connected to MySQL database.
```

Both lines must appear. If only the first one appears, the database connection
failed → go to Troubleshooting (Section 10).

### Step 6 — Open the app

```
http://localhost:3000
```

---

## SECTION 6 — View Your Tables (3 Ways)

### Way 1: MySQL Workbench (Easiest — Visual)

```
1. Open MySQL Workbench
2. Click on "Local instance MySQL80"
3. Enter your root password
4. On the LEFT panel → expand "sneakora_db"
5. Click the arrow next to "Tables"
6. You see all 5 tables listed: users, products, orders, order_items, cart_items
7. Right-click any table → "Select Rows - Limit 1000"
   → Opens a spreadsheet-like view of all the data
```

### Way 2: MySQL Command Line

```bash
mysql -u root -p
```
Type your password, press Enter. Then:

```sql
USE sneakora_db;

-- See all tables
SHOW TABLES;

-- See the columns of each table
DESCRIBE users;
DESCRIBE products;
DESCRIBE orders;
DESCRIBE order_items;
DESCRIBE cart_items;

-- See all rows in each table
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM cart_items;
```

Expected output of `SHOW TABLES`:
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

### Way 3: VS Code Extension

```
1. Open VS Code
2. Press Ctrl+Shift+X → search "Database Client" by cweijan
3. Install it
4. Click the database icon in the left sidebar
5. Click + → MySQL → host: localhost, user: root, password: yours
6. Browse and click any table to see its data inside VS Code
```

---

## SECTION 7 — ALL Queries Used in This Project — Fully Explained

Every database query in this project lives in `server.js`. Below is every
single one, explained in plain English.

---

### ── USERS ──────────────────────────────────────────────────────────────

#### Query 1 — Register a New User
**Where in code:** `server.js` line ~22
**Triggered when:** User fills the Register form and clicks Register

```js
db.query(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [name, email, hash, role],
    (err, result) => { ... }
);
```

**SQL plain English:**
> "Add a new row to the users table.
>  Put the user's name, email, hashed password, and role into it."

**What the `?` values are:**
| Position | Variable | Example Value                  |
|----------|----------|--------------------------------|
| 1st `?`  | `name`   | `'Hamza'`                      |
| 2nd `?`  | `email`  | `'hamza@email.com'`            |
| 3rd `?`  | `hash`   | `'$2b$10$xyz...'` (bcrypt hash)|
| 4th `?`  | `role`   | `'user'`                       |

**What comes back:**
`result.insertId` — the auto-generated ID of the new user (e.g. `3`)

**After running this, your users table looks like:**
```
id | name   | email            | password     | role | created_at
---+--------+------------------+--------------+------+-----------
1  | Hamza  | hamza@email.com  | $2b$10$xyz.. | user | 2025-05-03
```

---

#### Query 2 — Login (Find User by Email)
**Where in code:** `server.js` line ~34
**Triggered when:** User types email and password and clicks Login

```js
db.query(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    (err, rows) => { ... }
);
```

**SQL plain English:**
> "Find ALL columns from the users table where the email matches."

**What comes back:**
`rows` is an array. `rows[0]` is the first (and only) matching user.

If the email does not exist: `rows` is empty → `rows[0]` is `undefined`
→ server returns `404 User not found`

If email exists: bcrypt then checks if the password matches the stored hash.

---

### ── PRODUCTS ────────────────────────────────────────────────────────────

#### Query 3 — Get ALL Products
**Where in code:** `server.js` line ~50
**Triggered when:** Category page loads, or homepage loads products

```js
db.query(`SELECT * FROM products`, (err, rows) => { ... });
```

**SQL plain English:**
> "Give me every row and every column from the products table."

**What comes back:**
An array of product objects like:
```json
[
  { "id": 1, "name": "Skechers D-Lites", "price": 89.99, "category": "Men", ... },
  { "id": 2, "name": "Skechers Go Walk 7", "price": 79.99, "category": "Women", ... }
]
```

---

#### Query 4 — Get ONE Product by ID
**Where in code:** `server.js` line ~57
**Triggered when:** User opens a product detail page (e.g. `/product.html?id=3`)

```js
db.query(
    `SELECT * FROM products WHERE id = ?`,
    [req.params.id],
    (err, rows) => { ... }
);
```

**SQL plain English:**
> "Give me the product whose ID matches the number in the URL."

**Example:** If URL is `/api/products/3` → `req.params.id` = `3`
→ Returns only the product with `id = 3`

---

#### Query 5 — Add a New Product (Admin Panel)
**Where in code:** `server.js` line ~65
**Triggered when:** Admin fills the Add Product form and clicks Save

```js
db.query(
    `INSERT INTO products (name, price, category, image, description) VALUES (?, ?, ?, ?, ?)`,
    [name, price, category, image, description || ''],
    (err, result) => { ... }
);
```

**SQL plain English:**
> "Add a new product row with the given name, price, category, image path, and description."

**What `description || ''` means:**
If description is not provided, use an empty string instead of `null`.

**What comes back:**
`result.insertId` — the new product's auto-generated ID

---

#### Query 6 — Update a Product (Admin Panel)
**Where in code:** `server.js` line ~78
**Triggered when:** Admin edits a product and saves changes

```js
db.query(
    `UPDATE products SET name=?, price=?, category=?, image=?, description=? WHERE id=?`,
    [name, price, category, image, description, req.params.id],
    (err) => { ... }
);
```

**SQL plain English:**
> "Change the name, price, category, image, and description of the product
>  whose ID matches."

**IMPORTANT — the `WHERE id=?` at the end:**
Without the `WHERE`, this would update EVERY product in the table.
The `WHERE id=?` limits the update to only one specific product.

---

#### Query 7 — Delete a Product (Admin Panel)
**Where in code:** `server.js` line ~89
**Triggered when:** Admin clicks Delete on a product

```js
db.query(
    `DELETE FROM products WHERE id = ?`,
    [req.params.id],
    (err) => { ... }
);
```

**SQL plain English:**
> "Remove the row from products where the ID matches."

**WARNING:** If this product is in someone's order_items or cart_items,
the delete will fail because of foreign key constraints.
You must remove the product from those tables first.

---

### ── CART ────────────────────────────────────────────────────────────────

#### Query 8 — Get a User's Cart
**Where in code:** `server.js` line ~98
**Triggered when:** User opens the Cart page

```js
db.query(
    `SELECT c.id, p.id as product_id, p.name, p.price, p.category, p.image
     FROM cart_items c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [req.params.userId],
    (err, rows) => { ... }
);
```

**SQL plain English:**
> "Find all cart items belonging to this user, but also bring in the
>  product name, price, category, and image from the products table."

**What JOIN means here:**
`cart_items` only stores `user_id` and `product_id`.
It does NOT store the product name or price.
`JOIN products p ON c.product_id = p.id` means:
"For each cart row, go look up the matching product and bring its data along."

**Visualized:**

```
cart_items table             products table
─────────────────            ──────────────────────────────
id | user_id | product_id    id | name              | price
───┼─────────┼────────────   ───┼───────────────────┼───────
1  |    2    |     3    ───→  3 | Skechers Afterburn| 94.99
2  |    2    |     1    ───→  1 | Skechers D-Lites  | 89.99
```

**What comes back:**
```json
[
  { "id": 1, "product_id": 3, "name": "Skechers Afterburn", "price": 94.99, ... },
  { "id": 2, "product_id": 1, "name": "Skechers D-Lites",   "price": 89.99, ... }
]
```

---

#### Query 9 — Add Item to Cart
**Where in code:** `server.js` line ~113
**Triggered when:** User clicks "Add to Cart" on a product (and is logged in)

```js
db.query(
    `INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)`,
    [user_id, product_id],
    (err, result) => { ... }
);
```

**SQL plain English:**
> "Add a new row to cart_items saying user X has product Y in their cart."

---

#### Query 10 — Remove ONE Item from Cart
**Where in code:** `server.js` line ~123
**Triggered when:** User clicks the remove (X) button on one cart item

```js
db.query(
    `DELETE FROM cart_items WHERE id = ?`,
    [req.params.id],
    (err) => { ... }
);
```

**SQL plain English:**
> "Delete the cart row with this specific cart entry ID."

Note: This uses the **cart_items.id** (not the product id, not the user id).
Each cart row has its own unique id.

---

#### Query 11 — Clear Entire Cart
**Where in code:** `server.js` line ~131
**Triggered when:** User checks out (all items removed after order is placed)

```js
db.query(
    `DELETE FROM cart_items WHERE user_id = ?`,
    [req.params.userId],
    (err) => { ... }
);
```

**SQL plain English:**
> "Delete ALL cart rows that belong to this user."

This uses `user_id` instead of `id`, so ALL items for the user are removed at once.

---

### ── ORDERS ──────────────────────────────────────────────────────────────

#### Query 12 — Place an Order (Part 1 of 3)
**Where in code:** `server.js` line ~141
**Triggered when:** User clicks Checkout

```js
db.query(
    `INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')`,
    [user_id, total],
    (err, result) => { ... }
);
```

**SQL plain English:**
> "Create a new order row for this user with the given total amount.
>  Set the status as 'pending'."

**What comes back:**
`result.insertId` — the new order's ID, needed for Part 2.

---

#### Query 13 — Place an Order (Part 2 of 3 — Save Each Product)
**Where in code:** `server.js` line ~149
**Triggered when:** Immediately after Query 12 succeeds

```js
const itemValues = items.map(item => [orderId, item.product_id, item.price]);

db.query(
    `INSERT INTO order_items (order_id, product_id, price) VALUES ?`,
    [itemValues],
    (err2) => { ... }
);
```

**SQL plain English:**
> "Add multiple rows to order_items at once — one row per product in the order."

**What `items.map(...)` does:**
Converts the list of cart items from the browser into the format MySQL needs.

Example: if the cart has 3 products, `itemValues` becomes:
```js
[
  [5, 2, 89.99],   // [orderId, product_id, price]
  [5, 4, 109.99],
  [5, 7, 74.99]
]
```
All 3 rows are inserted with one single query using `VALUES ?`.

---

#### Query 14 — Place an Order (Part 3 of 3 — Clear Cart)
**Where in code:** `server.js` line ~154
**Triggered when:** Immediately after Query 13 succeeds

```js
db.query(
    `DELETE FROM cart_items WHERE user_id = ?`,
    [user_id],
    () => { ... }
);
```

**SQL plain English:**
> "Now that the order is saved, empty the user's cart."

This is the same as Query 11 but called automatically after a successful order.

---

#### Query 15 — Get Order History
**Where in code:** `server.js` line ~163
**Triggered when:** User opens the Profile page

```js
db.query(
    `SELECT o.id, o.total, o.status, o.created_at,
            p.name as product_name, p.image, oi.price
     FROM orders o
     JOIN order_items oi ON o.id         = oi.order_id
     JOIN products    p  ON oi.product_id = p.id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC`,
    [req.params.userId],
    (err, rows) => { ... }
);
```

**SQL plain English:**
> "Get all orders for this user.
>  For each order, also bring in the product name and image.
>  Sort them newest first."

**Why 2 JOINs?**
The data is spread across 3 tables:
- `orders` → has the order total, status, date
- `order_items` → links orders to products
- `products` → has the product name and image

To get everything in one go, you JOIN all three:

```
orders table         order_items table    products table
─────────────────    ─────────────────    ──────────────────────
id | user_id | total  order_id | product_id  id | name
───┼─────────┼──────  ─────────┼───────────  ───┼────────────────
5  |    2    | 274.97     5    |     2         2 | Skechers Go Walk 7
                            5    |     4         4 | Skechers Skech-Air
```

**What comes back:**
```json
[
  { "id": 5, "total": 274.97, "status": "pending", "product_name": "Skechers Go Walk 7",  "price": 79.99, ... },
  { "id": 5, "total": 274.97, "status": "pending", "product_name": "Skechers Skech-Air",  "price": 109.99, ... }
]
```

Note: The same order ID (5) appears twice — once per product in that order.
The frontend groups them by order ID to display them as one order with 2 items.

---

## SECTION 8 — CRUD Operations at Specific Points (Scenarios)

These are real examples of things you might want to do at specific moments,
with the exact SQL to run them in MySQL Workbench or terminal.

---

### Scenario A — "I want to change the price of product ID 3"

```sql
USE sneakora_db;

-- First, check what product ID 3 is:
SELECT id, name, price FROM products WHERE id = 3;

-- Change the price:
UPDATE products SET price = 129.99 WHERE id = 3;

-- Verify the change:
SELECT id, name, price FROM products WHERE id = 3;
```

---

### Scenario B — "I want to update ALL product prices by 10% increase"

```sql
USE sneakora_db;

-- Preview what the new prices will be (does NOT change anything):
SELECT id, name, price, ROUND(price * 1.10, 2) AS new_price FROM products;

-- Apply the increase:
UPDATE products SET price = ROUND(price * 1.10, 2);

-- Verify all prices changed:
SELECT id, name, price FROM products;
```

---

### Scenario C — "I want to delete product ID 7 safely"

First check if the product is referenced in any orders or carts:

```sql
USE sneakora_db;

-- Check if it's in anyone's cart:
SELECT * FROM cart_items WHERE product_id = 7;

-- Check if it's in any orders:
SELECT * FROM order_items WHERE product_id = 7;
```

If both return empty — safe to delete:
```sql
DELETE FROM products WHERE id = 7;
```

If cart_items has rows — remove from cart first, then delete:
```sql
DELETE FROM cart_items WHERE product_id = 7;
DELETE FROM products WHERE id = 7;
```

If order_items has rows — you cannot safely delete (it's in order history).
Instead, you can rename it:
```sql
UPDATE products SET name = '[Discontinued] Skechers Relaxed Fit' WHERE id = 7;
```

---

### Scenario D — "I want to see all orders placed today"

```sql
USE sneakora_db;

SELECT o.id, u.name AS customer, o.total, o.status, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE DATE(o.created_at) = CURDATE()
ORDER BY o.created_at DESC;
```

---

### Scenario E — "I want to mark all 'pending' orders as 'processing'"

```sql
USE sneakora_db;

-- Preview which orders will change:
SELECT id, user_id, total, status FROM orders WHERE status = 'pending';

-- Apply the update:
UPDATE orders SET status = 'processing' WHERE status = 'pending';
```

---

### Scenario F — "I want to delete a specific user and all their data"

This must be done in the correct order because of foreign keys.
Delete the child records first, then the parent.

```sql
USE sneakora_db;

-- Replace 3 with the user's actual ID

-- Step 1: Delete their cart
DELETE FROM cart_items WHERE user_id = 3;

-- Step 2: Delete their order items (find their order IDs first)
DELETE FROM order_items
WHERE order_id IN (SELECT id FROM orders WHERE user_id = 3);

-- Step 3: Delete their orders
DELETE FROM orders WHERE user_id = 3;

-- Step 4: Delete the user
DELETE FROM users WHERE id = 3;
```

---

### Scenario G — "I want to add a new product category called 'Sale'"

Just insert a product with that category — categories are free-text:
```sql
USE sneakora_db;

INSERT INTO products (name, price, category, image, description)
VALUES ('Skechers Summer Sale', 49.99, 'Sale', 'images/shoe_pink.png', 'Limited time offer');
```

---

### Scenario H — "I want to find which user placed the most orders"

```sql
USE sneakora_db;

SELECT u.id, u.name, u.email, COUNT(o.id) AS total_orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
ORDER BY total_orders DESC
LIMIT 5;
```

---

### Scenario I — "I want to reset the products table and start fresh"

```sql
USE sneakora_db;

-- WARNING: This deletes ALL products permanently.
-- First clear tables that reference products:
DELETE FROM cart_items;
DELETE FROM order_items;
DELETE FROM products;

-- Reset the auto-increment counter back to 1:
ALTER TABLE products AUTO_INCREMENT = 1;

-- Now re-insert fresh products:
INSERT INTO products (name, price, category, image, description) VALUES
('Skechers D-Lites', 89.99, 'Men', 'images/shoe_cyan.png', 'Classic chunky sole');
-- ... add more as needed
```

---

## SECTION 9 — How to Change a Query and Re-Apply It

### Step-by-Step Process

```
1. Open server.js in your editor
2. Find the query you want to change (use the map below)
3. Edit the SQL string inside the backticks
4. Save the file (Ctrl+S)
5. Stop the running server: press Ctrl+C in the terminal
6. Restart the server: node server.js
7. Test your change in the browser or with a tool like Postman
```

### Query Location Map in `server.js`

```
server.js
│
├── Line 17  ──  POST /api/register
│                INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)
│
├── Line 32  ──  POST /api/login
│                SELECT * FROM users WHERE email = ?
│
├── Line 49  ──  GET /api/products
│                SELECT * FROM products
│
├── Line 56  ──  GET /api/products/:id
│                SELECT * FROM products WHERE id = ?
│
├── Line 64  ──  POST /api/products
│                INSERT INTO products (...) VALUES (?, ?, ?, ?, ?)
│
├── Line 76  ──  PUT /api/products/:id
│                UPDATE products SET name=?, price=?, ... WHERE id=?
│
├── Line 88  ──  DELETE /api/products/:id
│                DELETE FROM products WHERE id = ?
│
├── Line 97  ──  GET /api/cart/:userId
│                SELECT ... FROM cart_items JOIN products ... WHERE user_id = ?
│
├── Line 111 ──  POST /api/cart
│                INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)
│
├── Line 122 ──  DELETE /api/cart/:id
│                DELETE FROM cart_items WHERE id = ?
│
├── Line 130 ──  DELETE /api/cart/user/:userId
│                DELETE FROM cart_items WHERE user_id = ?
│
├── Line 139 ──  POST /api/orders
│                INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')
│                INSERT INTO order_items (order_id, product_id, price) VALUES ?
│                DELETE FROM cart_items WHERE user_id = ?
│
└── Line 163 ──  GET /api/orders/:userId
                 SELECT o.id, o.total ... JOIN order_items ... JOIN products ... WHERE o.user_id = ?
```

---

### Example Change 1 — Add Search by Name to GET /api/products

**Find this (line ~49):**
```js
app.get('/api/products', (req, res) => {
    db.query(`SELECT * FROM products`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
```

**Change it to support `?search=skechers` in the URL:**
```js
app.get('/api/products', (req, res) => {
    const search = req.query.search;
    if (search) {
        db.query(
            `SELECT * FROM products WHERE name LIKE ?`,
            [`%${search}%`],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    } else {
        db.query(`SELECT * FROM products`, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
});
```

Now `GET /api/products?search=walk` returns only products with "walk" in the name.

---

### Example Change 2 — Add Category Filter

```js
app.get('/api/products', (req, res) => {
    const category = req.query.category;
    if (category) {
        db.query(
            `SELECT * FROM products WHERE category = ?`,
            [category],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    } else {
        db.query(`SELECT * FROM products`, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
});
```

Now `GET /api/products?category=Women` returns only Women's shoes.

---

### Example Change 3 — Return Products Sorted by Price

**Find (line ~49):**
```js
db.query(`SELECT * FROM products`, (err, rows) => {
```

**Change to:**
```js
db.query(`SELECT * FROM products ORDER BY price ASC`, (err, rows) => {
```

Cheapest products appear first. Change `ASC` to `DESC` for most expensive first.

---

### Example Change 4 — Update Order Status API

Add a new route that lets you change an order's status.
Add this AFTER the existing order routes in `server.js`:

```js
app.put('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    db.query(
        `UPDATE orders SET status = ? WHERE id = ?`,
        [status, req.params.id],
        (err) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: req.params.id, status });
        }
    );
});
```

To use it, send:
```
PUT http://localhost:3000/api/orders/5/status
Body: { "status": "delivered" }
```

---

## SECTION 10 — Troubleshooting

| Problem                            | What It Means                          | Fix                                              |
|------------------------------------|----------------------------------------|--------------------------------------------------|
| `MySQL connection failed`          | MySQL server not running               | Open Services → Start MySQL80                    |
| `Access denied for user 'root'`    | Wrong password in database.js          | Update `password` in `backend/database.js`       |
| `Unknown database 'sneakora_db'`   | Database not created yet               | Run the CREATE DATABASE SQL from Section 2B      |
| `Table 'sneakora_db.users' doesn't exist` | Tables not created yet         | Run the full CREATE TABLE SQL from Section 2B    |
| `Cannot find module 'mysql2'`      | npm install not done                   | Run `npm install`                                |
| `Port 3000 already in use`         | Old server still running               | Run: `taskkill /f /im node.exe` then restart     |
| Products page is empty             | Products table is empty                | Run the INSERT from Section 2C                   |
| `ER_NO_REFERENCED_ROW`             | Foreign key violation                  | Add parent record first (user before cart item)  |
| `ER_ROW_IS_REFERENCED`             | Trying to delete a referenced record   | Delete child records first (see Scenario F)      |
| Login fails after manual SQL insert| Password not bcrypt hashed             | Register via the app form, not raw SQL           |
| Only one terminal line appears     | DB connected but server crashed        | Check terminal for error message below it        |

---

## Database Relationships — Visual Map

```
┌──────────┐         ┌─────────────┐         ┌──────────────┐
│  users   │────────>│   orders    │────────>│ order_items  │
│          │  1:many │             │  1:many │              │
│ id  ◄────┼─────────┤ user_id     │         │ id           │
│ name     │         │ id  ◄───────┼─────────┤ order_id     │
│ email    │         │ total       │         │ product_id ──┼──┐
│ password │         │ status      │         │ price        │  │
│ role     │         │ created_at  │         └──────────────┘  │
└──────────┘         └─────────────┘                           │
     │                                                          │
     │  1:many        ┌─────────────┐         ┌───────────────┘
     └───────────────>│ cart_items  │         │
                      │             │    ┌────┘  ┌──────────────┐
                      │ id          │    │       │   products   │
                      │ user_id ────┘    └──────>│              │
                      │ product_id ────────────> │ id           │
                      │ added_at                 │ name         │
                      └─────────────┘            │ price        │
                                                 │ category     │
                                                 │ image        │
                                                 │ description  │
                                                 └──────────────┘
```

**Reading the arrows:**
- `──>` means "refers to" (foreign key)
- `1:many` means one user can have many orders/cart items
- Products are referenced by both order_items and cart_items

---

## Quick Reference Card

```
═══════════════════════════════════════════════════
  START PROJECT
═══════════════════════════════════════════════════
  1. Open Services → MySQL80 must say "Running"
  2. cd into Sneakora_tec folder
  3. npm install              (first time only)
  4. node server.js
  5. Open http://localhost:3000

═══════════════════════════════════════════════════
  CHANGE YOUR DATABASE PASSWORD
═══════════════════════════════════════════════════
  Open:  backend/database.js
  Edit:  password: 'YOUR_PASSWORD'
  Save → restart server

═══════════════════════════════════════════════════
  VIEW DATA
═══════════════════════════════════════════════════
  MySQL Workbench → sneakora_db → Tables
  → Right-click any table → Select Rows

═══════════════════════════════════════════════════
  QUICK QUERIES
═══════════════════════════════════════════════════
  USE sneakora_db;
  SELECT * FROM products;
  SELECT * FROM users;
  SELECT * FROM orders;
  SELECT * FROM order_items;
  SELECT * FROM cart_items;

═══════════════════════════════════════════════════
  MODIFY A QUERY IN CODE
═══════════════════════════════════════════════════
  1. Open server.js → find the route
  2. Edit the SQL string in backticks
  3. Save → Ctrl+C → node server.js

═══════════════════════════════════════════════════
  SAFE DELETE ORDER
═══════════════════════════════════════════════════
  DELETE FROM cart_items  WHERE user_id = X;
  DELETE FROM order_items WHERE order_id IN
    (SELECT id FROM orders WHERE user_id = X);
  DELETE FROM orders WHERE user_id = X;
  DELETE FROM users  WHERE id = X;
═══════════════════════════════════════════════════
```
