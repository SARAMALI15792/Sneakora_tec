# Sneakora — Complete MySQL Setup & Developer Guide

---

## What This Guide Covers

```
SECTION 0  →  Why Node.js? Why Not PHP? (Read This First)
SECTION 1  →  What You Need Installed
SECTION 2  →  Setup — Only ONE Step Now (Tables Auto-Create)
SECTION 3  →  HOW THE CONNECTION WORKS (Code Explained Line by Line)
SECTION 4  →  Connect This Project to YOUR MySQL
SECTION 5  →  Run the Project — Step by Step with Details
SECTION 6  →  View Your Tables (3 Ways)
SECTION 7  →  ALL Queries Used in This Project — Fully Explained
SECTION 8  →  CRUD Operations at Specific Points (Scenarios)
SECTION 9  →  How to Change a Query and Re-Apply It
SECTION 10 →  Troubleshooting — Every Error Explained
```

---

## SECTION 0 — Why Node.js? Why Not PHP?

This is a fair question. You may have seen other projects that paste SQL into
PHP files. Here is why this project is different and why that is fine.

---

### PHP vs Node.js — Simple Comparison

| Thing                   | PHP Approach           | This Project (Node.js)      |
|-------------------------|------------------------|-----------------------------|
| Language                | PHP                    | JavaScript (Node.js)        |
| Server software         | Apache or Nginx + PHP  | Node.js itself              |
| How it connects to MySQL| mysqli or PDO          | mysql2 package              |
| Files it uses           | .php files             | server.js + database.js     |
| Runs on                 | XAMPP, WAMP, LAMP      | Node.js installed directly  |

**They do the exact same job — just in different languages.**
Both connect to MySQL. Both run SQL queries. Both send data to the browser.
This project just chose JavaScript (Node.js) instead of PHP.

---

### Why does this project paste SQL into Workbench at the start?

The SQL you paste (CREATE TABLE...) is **setup code** — it runs **once** to
create the structure. Think of it like building shelves before putting items on them.

```
ONE-TIME SETUP (you do manually)     AUTOMATIC (Node.js does every time)
────────────────────────────────     ────────────────────────────────────
Build the shelves (CREATE TABLE)  →  Put items on shelves (INSERT)
                                     Read items from shelves (SELECT)
                                     Change items (UPDATE)
                                     Remove items (DELETE)
```

**Good news: this project now auto-creates everything.**
You no longer paste any SQL manually. Just change your password and run
`node server.js`. The code does the rest. (See Section 2.)

---

### What is a "migration" and does this project use one?

A **migration** is code that automatically creates or changes your database
structure when the app starts. Big frameworks like Laravel (PHP), Django (Python),
and Ruby on Rails all have built-in migration systems.

This project now has its own simple version built into `backend/database.js`:

```
node server.js starts
    ↓
database.js connects to MySQL
    ↓
database.js runs: CREATE DATABASE IF NOT EXISTS sneakora_db
    ↓
database.js runs: USE sneakora_db
    ↓
database.js creates all 5 tables (only if they don't exist yet)
    ↓
"All tables ready" printed in terminal
    ↓
server.js starts handling requests
```

`IF NOT EXISTS` means: if the table already exists, skip it.
So this runs every startup safely — it never deletes your existing data.

---

## SECTION 1 — What You Need Installed

| Tool                       | Why You Need It                   | How to Check                     |
|----------------------------|-----------------------------------|----------------------------------|
| Node.js                    | Runs the backend server           | `node -v` → shows version number |
| npm                        | Installs packages like mysql2     | `npm -v` → shows version number  |
| MySQL Server               | The database engine itself        | Open Services → MySQL80 = Running|
| MySQL Workbench (optional) | View and manage your data visually| Just open the app                |

**How to install MySQL (if not installed):**
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download "MySQL Installer for Windows"
3. Run the installer
4. Choose: **MySQL Server** + **MySQL Workbench** + **MySQL Shell**
5. During setup — set a root password. **Write it down.** You will need it.

---

## SECTION 2 — Setup — Only ONE Step Now

Because the code now auto-creates the database and all tables, setup is simple.

### The only thing you need to do:

**Open `backend/database.js` and change the password to yours.**

```js
password: 'saram'   ← change this to YOUR MySQL root password
```

That's it. Run `node server.js` and everything else is automatic.

---

### What the terminal will show on first run:

```
Connected to MySQL.
Database sneakora_db ready.
  Table "users" ready.
  Table "products" ready.
  Table "orders" ready.
  Table "order_items" ready.
  Table "cart_items" ready.
Server running on http://localhost:3000
```

On second and every run after, the same messages appear — but since
`IF NOT EXISTS` is used, tables are never recreated. Your data is always safe.

---

### Alternative: Manual Setup (if you prefer)

If you want to create everything yourself in MySQL Workbench, you can still
run this SQL manually. Copy it all, paste in Workbench, press F5:

```sql
CREATE DATABASE IF NOT EXISTS sneakora_db;
USE sneakora_db;

CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    category    VARCHAR(100),
    image       VARCHAR(500),
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    total      DECIMAL(10,2) NOT NULL,
    status     VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    order_id   INT NOT NULL,
    product_id INT NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    product_id INT NOT NULL,
    added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Sample Products (run this in Workbench after tables are created)

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

This is the most important section. Every single line of `backend/database.js`
is explained in plain English below.

---

### The Full File with Every Line Explained

```js
const mysql = require('mysql2');
```
**What this does:**
Loads the `mysql2` package — a library that lets Node.js talk to MySQL.
You installed it by running `npm install`. It lives in `node_modules/mysql2/`.
Think of it as the USB cable between Node.js and MySQL.

---

```js
const db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'saram'
});
```
**What this does:**
Creates a connection object called `db`. This does NOT connect yet —
it just prepares the settings. Like writing down a phone number before calling.

Breakdown of each field:

| Field      | Value        | What It Means                                        |
|------------|--------------|------------------------------------------------------|
| `host`     | `'localhost'`| MySQL is on THIS computer (not a remote server)      |
| `user`     | `'root'`     | The MySQL admin username (default after install)     |
| `password` | `'saram'`    | The password YOU set when installing MySQL           |

Notice there is no `database` field here anymore.
That is intentional — we create the database in the next step via code.

---

```js
db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed: ' + err.message);
        console.error('Fix: make sure MySQL is running and your password is correct in backend/database.js');
        return;
    }
    console.log('Connected to MySQL.');
    createDatabase();
});
```
**What this does:**
Actually makes the connection happen — like pressing "call."
The `(err) =>` part is a callback function that runs after the attempt.

```
db.connect called
    ↓
MySQL receives the connection request
    ↓
MySQL checks: is the username correct? is the password correct?
    ↓
If wrong →  err is set → "MySQL connection failed" printed → stops
If correct → err is null → "Connected to MySQL." printed → createDatabase() called
```

---

```js
function createDatabase() {
    db.query('CREATE DATABASE IF NOT EXISTS sneakora_db', (err) => {
        if (err) {
            console.error('Could not create database: ' + err.message);
            return;
        }
        db.query('USE sneakora_db', (err) => {
            if (err) {
                console.error('Could not select database: ' + err.message);
                return;
            }
            console.log('Database sneakora_db ready.');
            setupTables();
        });
    });
}
```
**What this does:**
Two queries run back to back inside callbacks:

Step 1 — `CREATE DATABASE IF NOT EXISTS sneakora_db`
> "Create a database called sneakora_db.
>  If it already exists, do nothing — don't error, just skip."

Step 2 — `USE sneakora_db`
> "From now on, all queries on this connection go to sneakora_db."
> Without this, MySQL doesn't know WHICH database your queries are for.

The `IF NOT EXISTS` part is important:
- First run → database doesn't exist → creates it → moves on
- Second run → database already exists → skips creation → moves on
- Your data is never lost

---

```js
function setupTables() {
    const tables = [
        ['users',       `CREATE TABLE IF NOT EXISTS users (...)`],
        ['products',    `CREATE TABLE IF NOT EXISTS products (...)`],
        ['orders',      `CREATE TABLE IF NOT EXISTS orders (...)`],
        ['order_items', `CREATE TABLE IF NOT EXISTS order_items (...)`],
        ['cart_items',  `CREATE TABLE IF NOT EXISTS cart_items (...)`]
    ];

    tables.forEach(([name, sql]) => {
        db.query(sql, (err) => {
            if (err) console.error(`  Table "${name}" error: ${err.message}`);
            else     console.log(`  Table "${name}" ready.`);
        });
    });
}
```
**What this does:**
Creates all 5 tables, one at a time, in order.

`tables` is an array where each item is `[tableName, createSQL]`.

`tables.forEach(([name, sql]) => { ... })` loops through each one and runs
`db.query(sql)` on it.

**Why does order matter?**
`orders` has a foreign key pointing to `users`.
If `orders` is created before `users`, MySQL will error.
The array is written in the correct dependency order:
```
users       ← no dependencies
products    ← no dependencies
orders      ← needs users
order_items ← needs orders AND products
cart_items  ← needs users AND products
```

mysql2 connections execute queries one at a time in the order you call them,
so even though the loop runs instantly, the actual SQL runs in the correct sequence.

---

```js
module.exports = db;
```
**What this does:**
Makes the `db` connection available to `server.js` (and any other file that needs it).

In `server.js`, line 7:
```js
const db = require('./backend/database');
```
This imports the same `db` object. Every `db.query(...)` in `server.js` uses
the same connection you configured here.

---

### How a Browser Request Flows Through the App

```
User clicks "Add to Cart" in the browser
        ↓
Browser sends:  POST http://localhost:3000/api/cart
Body:           { "user_id": 2, "product_id": 5 }
        ↓
server.js receives the request at app.post('/api/cart', ...)
        ↓
server.js calls:
    db.query('INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)', [2, 5])
        ↓
db (from database.js) sends the SQL to MySQL
        ↓
MySQL inserts the row and returns success
        ↓
server.js sends back:  { "id": 12, "user_id": 2, "product_id": 5 }
        ↓
Browser receives the response
Browser shows "Added to cart!" notification
```

---

### What the `?` Means in Every Query

Every query in `server.js` uses `?` as a placeholder:

```js
db.query(`SELECT * FROM users WHERE email = ?`, [email], ...)
```

The `?` is replaced safely with the actual value. Never write:
```js
// DANGEROUS — do not do this:
db.query(`SELECT * FROM users WHERE email = '${email}'`)
```

Why? If a user types this into the login form:
```
' OR '1'='1
```

The dangerous version becomes:
```sql
SELECT * FROM users WHERE email = '' OR '1'='1'
```
Which returns ALL users — a SQL injection attack.

The `?` version escapes the input so it can never be treated as SQL code.
The `mysql2` library handles this automatically.

---

## SECTION 4 — Connect This Project to YOUR MySQL

Only **one line** controls the whole connection. Open `backend/database.js`:

```js
password: 'saram'   ← change 'saram' to your MySQL root password
```

### Examples:

**If your password is "admin123":**
```js
password: 'admin123',
```

**If MySQL has no password (blank):**
```js
password: '',
```

**If you use a custom MySQL user:**
```js
user:     'sneakora_user',
password: 'mypass',
```

After saving, restart the server: `Ctrl+C` → `node server.js`

---

## SECTION 5 — Run the Project — Step by Step with Details

### Step 1 — Confirm MySQL is Running

```
Windows Start Menu → type "Services" → open "Services" app
```

Look for `MySQL80` in the list:

```
Name          Status    Startup Type
──────────────────────────────────────
MySQL80       Running   Automatic     ← this is what you want
```

If Status is blank or says "Stopped":
- Right-click `MySQL80`
- Click **Start**
- Wait 5 seconds for status to update to "Running"

---

### Step 2 — Open Terminal in the Project Folder

**Method A — From File Explorer:**
```
Navigate to the Sneakora_tec folder in File Explorer
Right-click on empty space inside the folder
Click "Open in Terminal"
```

**Method B — From VS Code:**
```
Open VS Code
Open the Sneakora_tec folder (File → Open Folder)
Press Ctrl + ` (backtick) to open the built-in terminal
```

**Method C — From Command Prompt:**
```
Press Win + R → type cmd → press Enter
Type: cd C:\path\to\Sneakora_tec
Press Enter
```

---

### Step 3 — Install Dependencies (First Time Only)

```bash
npm install
```

This reads `package.json` and downloads these packages into `node_modules/`:

| Package       | Purpose                                        |
|---------------|------------------------------------------------|
| `express`     | The web server framework — handles routes      |
| `mysql2`      | Connects Node.js to MySQL                      |
| `bcrypt`      | Hashes passwords before saving to database     |
| `body-parser` | Reads JSON data from request bodies            |
| `cors`        | Allows browser to call the API                 |

You only run this once. If `node_modules/` already exists, skip this step.

---

### Step 4 — Open `backend/database.js` and Change Your Password

```js
password: 'saram'   ← this is the original password, change it to yours
```

Save the file.

---

### Step 5 — Start the Server

```bash
node server.js
```

---

### Step 6 — Read the Terminal Output

**Success (what you want to see):**
```
Connected to MySQL.
Database sneakora_db ready.
  Table "users" ready.
  Table "products" ready.
  Table "orders" ready.
  Table "order_items" ready.
  Table "cart_items" ready.
Server running on http://localhost:3000
```

**If you see an error instead** → see Section 10 (Troubleshooting).

---

### Step 7 — Open the App in Your Browser

```
http://localhost:3000
```

The homepage should load. Products will be empty until you add them via the
Admin panel (`http://localhost:3000/admin.html`) or via SQL (see Section 2).

---

### Step 8 — Add Sample Products

Go to `http://localhost:3000/admin.html` and add products using the form.

OR run this SQL in MySQL Workbench:
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

## SECTION 6 — View Your Tables (3 Ways)

### Way 1: MySQL Workbench (Easiest — Visual)

```
1. Open MySQL Workbench
2. On the home screen, click "Local instance MySQL80"
3. A password prompt appears → type your root password → click OK
4. The main editor opens
5. On the LEFT side panel, look for "SCHEMAS"
6. Click the arrow (▶) next to "sneakora_db" to expand it
7. Click the arrow next to "Tables"
8. You see: cart_items, order_items, orders, products, users
9. Right-click any table name
10. Click "Select Rows - Limit 1000"
11. A grid appears showing all data in that table
```

To run your own SQL:
```
Click the SQL editor area (top section)
Type your query
Press Ctrl+Enter (runs just the line your cursor is on)
OR press F5 (runs everything selected or all if nothing selected)
```

---

### Way 2: MySQL Command Line

Open a terminal and type:

```bash
mysql -u root -p
```

When it asks for a password, type it and press Enter.
The prompt changes to `mysql>` — you are now inside MySQL.

```sql
-- Switch to our database
USE sneakora_db;

-- See what tables exist
SHOW TABLES;

-- See columns of a table
DESCRIBE products;

-- See all rows
SELECT * FROM products;
SELECT * FROM users;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM cart_items;

-- Exit MySQL
EXIT;
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

---

### Way 3: VS Code Extension

```
1. Open VS Code
2. Press Ctrl+Shift+X (Extensions panel)
3. Search: "Database Client JDBC" by cweijan
4. Click Install
5. A database icon appears in the left sidebar — click it
6. Click the + button at the top
7. Select "MySQL"
8. Fill in: Host = localhost, Username = root, Password = yours
9. Click Connect
10. Expand sneakora_db → Tables → click any table
11. Data shows up in a tab inside VS Code
```

---

## SECTION 7 — ALL Queries Used in This Project — Fully Explained

Every database query in this project lives in `server.js`. Below is every
single one, explained in plain English.

---

### ── USERS ──────────────────────────────────────────────────────────────

#### Query 1 — Register a New User
**Location in code:** `server.js` line ~22
**Triggered when:** User fills the Register form and clicks Register

```js
db.query(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [name, email, hash, role],
    (err, result) => { ... }
);
```

**SQL plain English:**
> "Add a new row to the users table with name, email, hashed password, and role."

**What fills each `?`:**
| `?` Position | Variable | Example Value                   |
|--------------|----------|---------------------------------|
| 1st          | `name`   | `'Hamza'`                       |
| 2nd          | `email`  | `'hamza@email.com'`             |
| 3rd          | `hash`   | `'$2b$10$xyz...'` (bcrypt hash) |
| 4th          | `role`   | `'user'`                        |

**What `hash` is:**
The real password is never stored. `bcrypt.hashSync(password, 10)` converts
`'mypassword'` into something like `'$2b$10$AbCdEfGhIj...'`.
This cannot be reversed — even if someone steals the database, they cannot
recover the original password.

**What comes back:**
`result.insertId` — the new user's auto-generated ID (e.g. `3`)

---

#### Query 2 — Login (Find User by Email)
**Location in code:** `server.js` line ~34
**Triggered when:** User types email and password and clicks Login

```js
db.query(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    (err, rows) => { ... }
);
```

**SQL plain English:**
> "Find the user whose email matches. Return all their columns."

**What comes back:**
`rows` is an array. `rows[0]` is the matching user.
If no user found: `rows[0]` is `undefined` → server returns 404.
If found: `bcrypt.compareSync(password, user.password)` checks if the
password the user typed matches the stored hash.

---

### ── PRODUCTS ────────────────────────────────────────────────────────────

#### Query 3 — Get ALL Products
**Location in code:** `server.js` line ~50
**Triggered when:** Category page loads

```js
db.query(`SELECT * FROM products`, (err, rows) => { ... });
```

**SQL plain English:**
> "Give me every row and every column from the products table."

**What comes back:**
```json
[
  { "id": 1, "name": "Skechers D-Lites", "price": 89.99, "category": "Men", ... },
  { "id": 2, "name": "Skechers Go Walk 7", "price": 79.99, "category": "Women", ... }
]
```

---

#### Query 4 — Get ONE Product by ID
**Location in code:** `server.js` line ~57
**Triggered when:** User opens a product detail page

```js
db.query(
    `SELECT * FROM products WHERE id = ?`,
    [req.params.id],
    (err, rows) => { ... }
);
```

**SQL plain English:**
> "Give me the one product whose ID matches the number in the URL."

**Example:** URL `/api/products/3` → `req.params.id` = `'3'` → returns product with `id = 3`

---

#### Query 5 — Add a New Product (Admin)
**Location in code:** `server.js` line ~65
**Triggered when:** Admin fills the Add Product form

```js
db.query(
    `INSERT INTO products (name, price, category, image, description) VALUES (?, ?, ?, ?, ?)`,
    [name, price, category, image, description || ''],
    (err, result) => { ... }
);
```

**SQL plain English:**
> "Add a new product row with the given details."

**What `description || ''` means:**
If description is not provided (undefined), use an empty string instead
so the query doesn't fail.

---

#### Query 6 — Update a Product (Admin)
**Location in code:** `server.js` line ~78
**Triggered when:** Admin edits a product and saves

```js
db.query(
    `UPDATE products SET name=?, price=?, category=?, image=?, description=? WHERE id=?`,
    [name, price, category, image, description, req.params.id],
    (err) => { ... }
);
```

**SQL plain English:**
> "Change the details of the product whose ID matches."

**Why `WHERE id=?` is critical:**
Without the `WHERE`, this would update EVERY product. The `WHERE` limits the
change to exactly one row.

---

#### Query 7 — Delete a Product (Admin)
**Location in code:** `server.js` line ~89
**Triggered when:** Admin clicks Delete on a product

```js
db.query(
    `DELETE FROM products WHERE id = ?`,
    [req.params.id],
    (err) => { ... }
);
```

**SQL plain English:**
> "Remove the product whose ID matches."

**Warning:** If this product exists in any `order_items` or `cart_items` rows,
MySQL will reject the delete (foreign key constraint). Remove those rows first.

---

### ── CART ────────────────────────────────────────────────────────────────

#### Query 8 — Get a User's Cart
**Location in code:** `server.js` line ~98
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
> "Find this user's cart items, and for each item also bring in the product
>  name, price, category, and image from the products table."

**Why JOIN is needed:**
`cart_items` only stores `user_id` and `product_id` numbers. It doesn't store
product names or prices — those live in the `products` table. The JOIN connects
the two tables on the matching product ID.

**Visualized:**
```
cart_items                 products
───────────────────        ─────────────────────────────────
id | user_id | product_id  id | name               | price
───┼─────────┼──────────── ───┼────────────────────┼───────
7  |    2    |     3   ───→ 3 | Skechers Afterburn | 94.99
8  |    2    |     1   ───→ 1 | Skechers D-Lites   | 89.99
```

---

#### Query 9 — Add Item to Cart
**Location in code:** `server.js` line ~113
**Triggered when:** User clicks "Add to Cart"

```js
db.query(
    `INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)`,
    [user_id, product_id],
    (err, result) => { ... }
);
```

**SQL plain English:**
> "Record that this user added this product to their cart."

---

#### Query 10 — Remove ONE Item from Cart
**Location in code:** `server.js` line ~123
**Triggered when:** User clicks remove on a single cart item

```js
db.query(
    `DELETE FROM cart_items WHERE id = ?`,
    [req.params.id],
    (err) => { ... }
);
```

**SQL plain English:**
> "Delete this specific cart entry by its own cart ID."

Note: uses `cart_items.id` — not `product_id` or `user_id`.

---

#### Query 11 — Clear Entire Cart
**Location in code:** `server.js` line ~131
**Triggered when:** User checks out (all cart items removed after order placed)

```js
db.query(
    `DELETE FROM cart_items WHERE user_id = ?`,
    [req.params.userId],
    (err) => { ... }
);
```

**SQL plain English:**
> "Delete ALL cart rows belonging to this user."

---

### ── ORDERS ──────────────────────────────────────────────────────────────

#### Query 12 — Create an Order
**Location in code:** `server.js` line ~141
**Triggered when:** User clicks Checkout

```js
db.query(
    `INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')`,
    [user_id, total],
    (err, result) => { ... }
);
```

**SQL plain English:**
> "Create a new order record for this user with the total amount. Status = pending."

`'pending'` is hardcoded (not a `?`) because it is always pending at creation.
`result.insertId` gives the new order's ID, used in the next query.

---

#### Query 13 — Save Each Product in the Order
**Location in code:** `server.js` line ~149
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
> "Insert multiple rows into order_items at once — one per product in the order."

**What `items.map(...)` produces:**
If the cart had 3 products, `itemValues` becomes:
```js
[
  [5, 2, 89.99],    // [orderId, product_id, price]
  [5, 4, 109.99],
  [5, 7, 74.99]
]
```
MySQL inserts all 3 rows with one query using `VALUES ?`.

---

#### Query 14 — Clear Cart After Order
**Location in code:** `server.js` line ~154
**Triggered when:** Immediately after Query 13 succeeds

```js
db.query(`DELETE FROM cart_items WHERE user_id = ?`, [user_id], () => { ... });
```

Same as Query 11 — empties the cart automatically after checkout.

---

#### Query 15 — Get Order History
**Location in code:** `server.js` line ~163
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
> "Get all orders for this user, with the name and image of each product
>  in each order. Sort newest first."

**Why 2 JOINs?**
Data is spread across 3 tables:
```
orders → has total, status, date
order_items → links orders to products
products → has name, image
```
Join all three to get everything in one query instead of 3 separate queries.

**What comes back:**
Same order ID repeats — once per product in that order:
```json
[
  { "id": 5, "total": 274.97, "product_name": "Skechers Go Walk 7",  "price": 79.99  },
  { "id": 5, "total": 274.97, "product_name": "Skechers Skech-Air",  "price": 109.99 },
  { "id": 5, "total": 274.97, "product_name": "Skechers Relaxed Fit","price": 74.99  }
]
```
The frontend groups them by `id` to display as one order with 3 items.

---

## SECTION 8 — CRUD Operations at Specific Points (Scenarios)

Run these in MySQL Workbench or terminal after connecting.
Always start with: `USE sneakora_db;`

---

### Scenario A — Change the price of product ID 3

```sql
USE sneakora_db;
SELECT id, name, price FROM products WHERE id = 3;   -- check before
UPDATE products SET price = 129.99 WHERE id = 3;
SELECT id, name, price FROM products WHERE id = 3;   -- verify after
```

---

### Scenario B — Increase ALL prices by 10%

```sql
USE sneakora_db;
-- Preview first (no changes made):
SELECT id, name, price, ROUND(price * 1.10, 2) AS new_price FROM products;
-- Apply:
UPDATE products SET price = ROUND(price * 1.10, 2);
```

---

### Scenario C — Safely delete product ID 7

```sql
USE sneakora_db;
-- Check if referenced:
SELECT * FROM cart_items  WHERE product_id = 7;
SELECT * FROM order_items WHERE product_id = 7;
-- If both empty, safe to delete:
DELETE FROM products WHERE id = 7;
-- If cart_items has rows, clear those first:
DELETE FROM cart_items WHERE product_id = 7;
DELETE FROM products WHERE id = 7;
```

---

### Scenario D — See all orders placed today

```sql
USE sneakora_db;
SELECT o.id, u.name AS customer, o.total, o.status, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE DATE(o.created_at) = CURDATE()
ORDER BY o.created_at DESC;
```

---

### Scenario E — Mark all pending orders as processing

```sql
USE sneakora_db;
SELECT id, user_id, total, status FROM orders WHERE status = 'pending';  -- preview
UPDATE orders SET status = 'processing' WHERE status = 'pending';
```

---

### Scenario F — Delete a user and ALL their data

Run in this exact order (foreign keys require child records deleted first):

```sql
USE sneakora_db;
-- Replace 3 with the actual user ID
DELETE FROM cart_items  WHERE user_id = 3;
DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = 3);
DELETE FROM orders      WHERE user_id = 3;
DELETE FROM users       WHERE id = 3;
```

---

### Scenario G — Reset products table and start fresh

```sql
USE sneakora_db;
-- WARNING: deletes all products and their cart/order references
DELETE FROM cart_items;
DELETE FROM order_items;
DELETE FROM products;
ALTER TABLE products AUTO_INCREMENT = 1;
-- Now re-insert your products
```

---

### Scenario H — Find which user has the most orders

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

## SECTION 9 — How to Change a Query and Re-Apply It

### The Process Every Time

```
1. Open server.js in your editor
2. Find the query using the map below
3. Edit the SQL string inside the backticks ( ` )
4. Save the file (Ctrl+S)
5. In terminal: press Ctrl+C to stop the server
6. Type: node server.js to restart
7. Test the change in the browser
```

### Query Location Map in `server.js`

```
server.js
│
├── Line 17  POST /api/register
│            INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)
│
├── Line 32  POST /api/login
│            SELECT * FROM users WHERE email = ?
│
├── Line 49  GET /api/products
│            SELECT * FROM products
│
├── Line 56  GET /api/products/:id
│            SELECT * FROM products WHERE id = ?
│
├── Line 64  POST /api/products
│            INSERT INTO products (...) VALUES (?, ?, ?, ?, ?)
│
├── Line 76  PUT /api/products/:id
│            UPDATE products SET name=?, price=?, ... WHERE id=?
│
├── Line 88  DELETE /api/products/:id
│            DELETE FROM products WHERE id = ?
│
├── Line 97  GET /api/cart/:userId
│            SELECT ... FROM cart_items JOIN products WHERE user_id = ?
│
├── Line 111 POST /api/cart
│            INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)
│
├── Line 122 DELETE /api/cart/:id
│            DELETE FROM cart_items WHERE id = ?
│
├── Line 130 DELETE /api/cart/user/:userId
│            DELETE FROM cart_items WHERE user_id = ?
│
├── Line 139 POST /api/orders
│            INSERT INTO orders → INSERT INTO order_items → DELETE cart
│
└── Line 163 GET /api/orders/:userId
             SELECT ... JOIN order_items JOIN products WHERE user_id = ?
```

---

### Example Changes

**Add search filter to GET /api/products:**
```js
// Find line ~49 and replace with:
app.get('/api/products', (req, res) => {
    const search = req.query.search;
    if (search) {
        db.query(`SELECT * FROM products WHERE name LIKE ?`, [`%${search}%`], (err, rows) => {
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
// Usage: GET /api/products?search=walk
```

**Sort products by price:**
```js
// Change line ~50 from:
db.query(`SELECT * FROM products`, ...
// To:
db.query(`SELECT * FROM products ORDER BY price ASC`, ...
```

**Filter products by category:**
```js
db.query(`SELECT * FROM products WHERE category = ?`, [req.query.category], ...
// Usage: GET /api/products?category=Women
```

---

## SECTION 10 — Troubleshooting — Every Error Explained

### Error: `MySQL connection failed: Access denied for user 'root'`

**Cause:** Wrong password in `backend/database.js`

**Fix:**
1. Open `backend/database.js`
2. Find: `password: 'saram'`
3. Change it to your actual MySQL root password
4. Save → restart server

**How to find your MySQL password:**
If you forgot it, open MySQL Workbench → try connecting with different passwords.
If completely forgotten, MySQL password reset requires stopping the service and
using `--skip-grant-tables` mode (search "reset MySQL root password Windows").

---

### Error: `MySQL connection failed: connect ECONNREFUSED 127.0.0.1:3306`

**Cause:** MySQL server is not running

**Fix:**
1. Press Win key → search "Services"
2. Find `MySQL80`
3. Right-click → Start
4. Wait 10 seconds
5. Try `node server.js` again

---

### Error: `MySQL connection failed: Unknown database 'sneakora_db'`

**Cause:** This should not happen anymore — the code creates it automatically.
But if it does, it means the `CREATE DATABASE` query failed silently.

**Fix:**
Open MySQL Workbench and run:
```sql
CREATE DATABASE sneakora_db;
```
Then restart the server.

---

### Error: `Cannot find module 'mysql2'`

**Cause:** `npm install` was not run

**Fix:**
```bash
npm install
```

---

### Error: `Port 3000 already in use`

**Cause:** An old `node server.js` process is still running in the background

**Fix:**
```bash
taskkill /f /im node.exe
```
Then restart: `node server.js`

---

### Error: `ER_NO_REFERENCED_ROW_2`

**Cause:** You tried to insert a row that references a non-existent parent.
Example: adding a cart item for `user_id = 99` but user 99 doesn't exist.

**Fix:** Create the parent record first.
- For cart: user must exist (register first)
- For order_items: order must exist first
- For orders: user must exist first

---

### Error: `ER_ROW_IS_REFERENCED_2`

**Cause:** You tried to delete a row that other rows are pointing to.
Example: deleting a product that exists in `order_items`.

**Fix:** Delete the child rows first (see Scenario F and C in Section 8).

---

### Problem: Products page is empty

**Cause:** Products table has no rows

**Fix:** Add products via Admin panel at `http://localhost:3000/admin.html`
or run the INSERT SQL from Section 2.

---

### Problem: Login fails with correct password

**Cause:** User was added manually via SQL with a plain-text password.
The app expects bcrypt-hashed passwords.

**Fix:** Always register users through the app's Register form, not raw SQL.
The app hashes passwords before saving them.

---

### Problem: Server starts but only one line appears

```
Server running on http://localhost:3000
(nothing else)
```

**Cause:** Database connection is failing silently or hasn't completed yet.
Look for a line below it — there may be a delayed error message.

**Fix:** Check that:
1. MySQL is running
2. Password in `database.js` is correct
3. Run `node server.js` again and watch closely for the "Connected to MySQL." line

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

---

## Quick Reference Card

```
═══════════════════════════════════════════════════
  FIRST TIME SETUP
═══════════════════════════════════════════════════
  1. Install MySQL Server + Workbench
  2. Open backend/database.js
  3. Change password: 'saram' to your password
  4. Run: npm install
  5. Run: node server.js
  → Tables create automatically

═══════════════════════════════════════════════════
  EVERY TIME YOU START
═══════════════════════════════════════════════════
  1. Check MySQL80 is Running (Services)
  2. node server.js
  3. Open http://localhost:3000

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

═══════════════════════════════════════════════════
  MODIFY A QUERY IN CODE
═══════════════════════════════════════════════════
  1. Open server.js → find the route (Section 9 map)
  2. Edit the SQL in backticks
  3. Save → Ctrl+C → node server.js

═══════════════════════════════════════════════════
  SAFE DELETE ORDER
═══════════════════════════════════════════════════
  USE sneakora_db;
  DELETE FROM cart_items WHERE user_id = X;
  DELETE FROM order_items WHERE order_id IN
    (SELECT id FROM orders WHERE user_id = X);
  DELETE FROM orders WHERE user_id = X;
  DELETE FROM users WHERE id = X;
═══════════════════════════════════════════════════
```
