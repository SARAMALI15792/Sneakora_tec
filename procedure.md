# Sneakora — Complete MySQL Setup & Developer Guide

---

## What This Guide Covers

```
SECTION 0  →  Why Node.js? Why Not PHP?
SECTION 1  →  What You Need Installed
SECTION 2  →  Setup — Only ONE Step (Tables Auto-Create)
SECTION 3  →  HOW THE CONNECTION WORKS — Code Explained Line by Line
SECTION 4  →  Connect This Project to YOUR MySQL
SECTION 5  →  Run the Project — Detailed Steps
SECTION 6  →  WHERE Do Your Tables Appear After Running?
SECTION 7  →  WHAT HAPPENS When You Click Things on the Website?
SECTION 8  →  LIVE TEST RESULTS — Proven End-to-End
SECTION 9  →  ALL Queries in This Project — Fully Explained
SECTION 10 →  CRUD Scenarios — Real Examples
SECTION 11 →  How to Change a Query and Re-Apply It
SECTION 12 →  Troubleshooting — Every Error Explained
```

---

## SECTION 0 — Why Node.js? Why Not PHP?

This is a fair question. You may have seen other projects that use PHP files
to connect to MySQL. Here is exactly why this project does it differently —
and why that is completely fine.

---

### The Simple Answer

**PHP** and **Node.js** are both backend languages. They do the same job —
receive requests from the browser, talk to MySQL, send data back.
This project chose Node.js (JavaScript). Another project might choose PHP.
Both work. They just speak different syntax.

---

### Side-by-Side Comparison

| What                    | PHP Way                       | This Project (Node.js)         |
|-------------------------|-------------------------------|--------------------------------|
| Language                | PHP                           | JavaScript (Node.js)           |
| Server software         | Apache/Nginx + PHP module     | Node.js itself (no Apache)     |
| Connects to MySQL via   | `mysqli` or `PDO`             | `mysql2` npm package           |
| Code lives in           | `.php` files                  | `server.js` + `database.js`    |
| Run on your machine via | XAMPP / WAMP / LAMP           | `node server.js` in terminal   |
| Queries look like       | `$conn->query("SELECT ...")`  | `db.query("SELECT ...", ...)`  |

---

### Why Did We Paste SQL into Workbench Before?

The SQL (CREATE TABLE...) is **one-time setup code** that builds the
empty structure of the database — like building shelves before putting things
on them.

```
ONE-TIME (build the shelves)          EVERY TIME APP RUNS (use the shelves)
─────────────────────────────         ─────────────────────────────────────
CREATE TABLE users          →         INSERT INTO users (register)
CREATE TABLE products       →         SELECT * FROM products (load page)
CREATE TABLE orders         →         INSERT INTO orders (checkout)
CREATE TABLE cart_items     →         DELETE FROM cart_items (clear cart)
```

**Good news: this project now does that setup automatically.**
The code in `backend/database.js` creates the database and all 5 tables
every time you start the server. If they already exist, it skips them safely.
You never need to paste SQL manually.

---

### What is a "Migration"?

A **migration** is code that creates or updates your database structure
automatically when the app starts. Frameworks like Laravel (PHP), Django (Python),
and Rails (Ruby) have this built in.

This project now has its own simple migration built into `backend/database.js`:

```
You run: node server.js
         ↓
database.js connects to MySQL
         ↓
Runs: CREATE DATABASE IF NOT EXISTS sneakora_db
         ↓
Runs: USE sneakora_db
         ↓
Runs: CREATE TABLE IF NOT EXISTS users (...)
Runs: CREATE TABLE IF NOT EXISTS products (...)
Runs: CREATE TABLE IF NOT EXISTS orders (...)
Runs: CREATE TABLE IF NOT EXISTS order_items (...)
Runs: CREATE TABLE IF NOT EXISTS cart_items (...)
         ↓
All 5 tables confirmed ready
         ↓
Server starts accepting requests
```

`IF NOT EXISTS` = if the table is already there, skip it. Your data is NEVER
deleted or overwritten by this.

---

## SECTION 1 — What You Need Installed

| Tool                       | Why You Need It                      | How to Check                      |
|----------------------------|--------------------------------------|-----------------------------------|
| Node.js                    | Runs the backend server              | Open terminal → `node -v`         |
| npm                        | Installs packages (mysql2, express…) | Open terminal → `npm -v`          |
| MySQL Server               | The actual database engine           | Services app → MySQL80 = Running  |
| MySQL Workbench (optional) | Browse your tables visually          | Just open the app                 |

**If MySQL is not installed yet:**
1. Download from: https://dev.mysql.com/downloads/installer/
2. Run the installer
3. Choose: **MySQL Server** + **MySQL Workbench** + **MySQL Shell**
4. During install — set a root password. Write it down — you will need it.

**If Node.js is not installed yet:**
Download from: https://nodejs.org — choose the LTS version.

---

## SECTION 2 — Setup — Only ONE Step Now

Because the code auto-creates everything, setup is just one line.

### The Only Thing You Need to Do

Open `backend/database.js` and change the password field to YOUR MySQL password:

```js
password: 'saram'   ← change this to your MySQL root password
```

That's it. Save the file. Run the server. Everything else is automatic.

---

### What You Will See in the Terminal on First Run

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

On every run after that — same output, but tables already exist so they
are just confirmed, never recreated. Your data stays safe.

---

### Manual Setup (Alternative — if you prefer doing it yourself)

You can still run this SQL in MySQL Workbench if you want to set up manually.
Select all → F5 to run:

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

### Add Sample Products (run in Workbench or terminal)

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

## SECTION 3 — HOW THE CONNECTION WORKS — Code Explained Line by Line

Open `backend/database.js`. Here is the complete file explained in plain English.

---

```js
const mysql = require('mysql2');
```

**Plain English:**
Load the `mysql2` library — the package that lets Node.js talk to MySQL.
Think of it as a USB cable between your Node.js app and MySQL.
It was installed when you ran `npm install` and lives in the `node_modules/` folder.

---

```js
const db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'saram'
});
```

**Plain English:**
Create a connection object called `db`. This does NOT connect yet —
it just stores the settings, like saving a phone number before calling.

| Setting    | Value         | What it means                                     |
|------------|---------------|---------------------------------------------------|
| `host`     | `'localhost'` | MySQL is on THIS same computer                    |
| `user`     | `'root'`      | The MySQL admin account created during install    |
| `password` | `'saram'`     | The root password you set during MySQL install    |

There is no `database` field here on purpose. We create the database in code next.

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

**Plain English:**
This line actually makes the connection happen — like pressing "call."

```
db.connect() fires
    ↓
MySQL checks: is user 'root' correct? is the password correct?
    ↓
WRONG  → err contains the error message → printed to terminal → stops
CORRECT → err is null → "Connected to MySQL." printed → createDatabase() runs
```

The `(err) =>` part is a callback function — it runs after the connection
attempt finishes. If something went wrong, `err` holds the reason.

---

```js
function createDatabase() {
    db.query('CREATE DATABASE IF NOT EXISTS sneakora_db', (err) => {
        if (err) { console.error('Could not create database: ' + err.message); return; }
        db.query('USE sneakora_db', (err) => {
            if (err) { console.error('Could not select database: ' + err.message); return; }
            console.log('Database sneakora_db ready.');
            setupTables();
        });
    });
}
```

**Plain English:**
Two queries run one after the other:

**Query 1:** `CREATE DATABASE IF NOT EXISTS sneakora_db`
> "Create a database called sneakora_db.
>  If it already exists — skip it, don't error."

**Query 2:** `USE sneakora_db`
> "Tell MySQL: all future queries on this connection belong to sneakora_db."
> Without this, MySQL doesn't know which database to use.

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

**Plain English:**
Creates all 5 tables in the correct order. Each item in the `tables` array is:
`[tableName, CREATE TABLE SQL]`

The `forEach` loop calls `db.query()` for each table.
Even though the loop runs instantly, mysql2 internally queues and runs each
query one at a time — so `orders` (which needs `users`) is always created
after `users` exists.

**Why order matters — dependency chain:**
```
users       ← no dependencies, created first
products    ← no dependencies, created second
orders      ← needs users.id (foreign key)
order_items ← needs orders.id AND products.id
cart_items  ← needs users.id AND products.id
```

---

```js
module.exports = db;
```

**Plain English:**
Share the `db` connection with any other file that needs it.
In `server.js` line 6: `const db = require('./backend/database')`
Now every route in server.js uses this exact same connection.

---

### The Full Request Journey — Browser to MySQL and Back

```
USER ACTION:  Opens the Category page

Browser sends GET http://localhost:3000/api/products
                    ↓
server.js receives it at: app.get('/api/products', ...)
                    ↓
server.js calls: db.query('SELECT * FROM products', callback)
                    ↓
db (from database.js) sends SQL to MySQL
                    ↓
MySQL runs: SELECT * FROM products
MySQL returns: 7 rows of data
                    ↓
callback receives: (err=null, rows=[7 products])
                    ↓
server.js sends: res.json(rows)
                    ↓
Browser receives: JSON array of 7 products
                    ↓
JavaScript renders product cards on screen
```

---

### Why `?` Is Used in Every Query

```js
db.query(`SELECT * FROM users WHERE email = ?`, [email], ...)
```

The `?` is a safe placeholder. The actual value from `[email]` replaces it —
but mysql2 escapes it first so it can never be treated as SQL code.

**Never do this (dangerous):**
```js
db.query(`SELECT * FROM users WHERE email = '${email}'`)
```

If someone types `' OR '1'='1` as their email, the dangerous version becomes:
```sql
SELECT * FROM users WHERE email = '' OR '1'='1'
```
This returns ALL users — a SQL injection attack.
The `?` version makes this impossible.

---

## SECTION 4 — Connect This Project to YOUR MySQL

One line in one file. That's it.

Open `backend/database.js`:

```js
password: 'saram'   ← replace 'saram' with your actual MySQL password
```

**Common examples:**

| Your situation                   | What to write                          |
|----------------------------------|----------------------------------------|
| Password is "admin123"           | `password: 'admin123',`                |
| No password set (blank)          | `password: '',`                        |
| Custom MySQL user "shopuser"     | `user: 'shopuser', password: 'pass',`  |
| Password has special characters  | `password: 'p@ss!word',`               |

After changing: save the file → stop server (Ctrl+C) → run `node server.js` again.

---

## SECTION 5 — Run the Project — Detailed Steps

### Step 1 — Confirm MySQL is Running

```
Press Windows key → type "Services" → open the Services app
Scroll to find "MySQL80"
Look at the Status column
```

```
Name        Status    Startup Type
──────────────────────────────────
MySQL80     Running   Automatic   ← what you want to see
```

If it says "Stopped" → right-click → Start → wait 10 seconds.

---

### Step 2 — Open Terminal in the Project Folder

**From File Explorer:**
```
Navigate to the Sneakora_tec folder
Right-click on empty space inside it
Click "Open in Terminal"
```

**From VS Code:**
```
Open VS Code → File → Open Folder → select Sneakora_tec
Press Ctrl + ` (the backtick key, top-left of keyboard)
Terminal opens at the bottom
```

**From Command Prompt manually:**
```
Win + R → type cmd → Enter
Type: cd C:\path\to\Sneakora_tec
Press Enter
```

---

### Step 3 — Install Dependencies (First Time Only)

```bash
npm install
```

Downloads these packages into `node_modules/`:

| Package       | What It Does                              |
|---------------|-------------------------------------------|
| `express`     | Web server — handles all the routes       |
| `mysql2`      | Lets Node.js talk to MySQL                |
| `bcrypt`      | Hashes passwords before storing them      |
| `body-parser` | Reads JSON from request body              |
| `cors`        | Lets browser call the API                 |

Skip this if `node_modules/` folder already exists.

---

### Step 4 — Change Your Password in database.js

Open `backend/database.js` → find `password: 'saram'` → change it → save.

---

### Step 5 — Start the Server

```bash
node server.js
```

---

### Step 6 — Confirm the Terminal Output

**You must see ALL of these lines:**

```
Connected to MySQL.                ← MySQL accepted the connection
Database sneakora_db ready.        ← database created/confirmed
  Table "users" ready.             ← table 1 of 5
  Table "products" ready.          ← table 2 of 5
  Table "orders" ready.            ← table 3 of 5
  Table "order_items" ready.       ← table 4 of 5
  Table "cart_items" ready.        ← table 5 of 5
Server running on http://localhost:3000
```

If you only see `Server running...` but nothing about MySQL → connection failed.
Go to Section 12 (Troubleshooting).

---

### Step 7 — Open the App

```
http://localhost:3000
```

The homepage loads with shoe images and navigation.

### Step 8 — Add Products

Products table is empty on first run. Add them via the Admin panel:
```
http://localhost:3000/admin.html
```
Or run the INSERT SQL from Section 2 in MySQL Workbench.

---

## SECTION 6 — WHERE Do Your Tables Appear After Running?

This section answers: "I ran the server and it said tables are ready — where do I actually SEE them?"

---

### In MySQL Workbench (Most Visual)

```
Step 1: Open MySQL Workbench
Step 2: On the home screen, double-click "Local instance MySQL80"
Step 3: Enter your root password → click OK
Step 4: The editor opens — look at the LEFT panel
Step 5: Find the section called "SCHEMAS"
Step 6: You will see "sneakora_db" listed there
Step 7: Click the ▶ arrow next to "sneakora_db" to expand it
Step 8: Click the ▶ arrow next to "Tables"
Step 9: You will see all 5 tables:
         - cart_items
         - order_items
         - orders
         - products
         - users
Step 10: Right-click any table → "Select Rows - Limit 1000"
         → A grid opens showing all rows in that table
```

**What the left panel looks like:**
```
SCHEMAS
  └── sneakora_db
        └── Tables
              ├── cart_items
              ├── order_items
              ├── orders
              ├── products
              └── users
```

---

### In MySQL Command Line

Open a terminal and type:
```bash
mysql -u root -p
```
Type your password → press Enter → prompt changes to `mysql>`

```sql
-- See all databases
SHOW DATABASES;

-- Switch to sneakora_db
USE sneakora_db;

-- See all 5 tables
SHOW TABLES;

-- See the columns of any table
DESCRIBE users;
DESCRIBE products;
DESCRIBE orders;
DESCRIBE order_items;
DESCRIBE cart_items;

-- See all data in any table
SELECT * FROM products;
SELECT * FROM users;
SELECT * FROM orders;
```

**Expected output of `SHOW TABLES`:**
```
+------------------------+
| Tables_in_sneakora_db  |
+------------------------+
| cart_items             |
| order_items            |
| orders                 |
| products               |
| users                  |
+------------------------+
```

---

### In VS Code (Without Leaving Your Editor)

```
1. Open VS Code
2. Press Ctrl+Shift+X → Extensions panel
3. Search: "Database Client" by cweijan → Install
4. A database icon (cylinder shape) appears in the left sidebar → click it
5. Click the + button at the top of that panel
6. Select "MySQL"
7. Fill in:
      Host:     localhost
      Username: root
      Password: (your password)
      Port:     3306
8. Click "Connect"
9. Expand sneakora_db → Tables
10. Click any table → its data opens in a tab in VS Code
```

---

### Via the API (in the Browser)

While the server is running, open your browser and go to:
```
http://localhost:3000/api/products
```
You will see raw JSON of all products from MySQL, directly in the browser.

---

## SECTION 7 — WHAT HAPPENS When You Click Things on the Website?

This section explains exactly what gets written to MySQL when you use the app.

---

### Overview: Two Types of Storage in This App

```
BROWSER (localStorage)              MySQL DATABASE
───────────────────────             ─────────────────────────────
Cart items before checkout    →     Users (register/login)
                                    Products (admin panel)
                                    Orders + Order Items (checkout)
```

**localStorage** = temporary storage in your browser tab.
Fast, no server needed, but disappears if you clear browser data.
MySQL = permanent storage, lives on disk, survives restarts.

The cart is kept in localStorage while you shop, then written to MySQL
when you click Checkout. This is why it is fast to add items without
needing a server request every time.

---

### Action 1 — You Click "Register"

```
YOU TYPE:  Name, Email, Password → click Register
               ↓
Browser sends: POST /api/register
Body: { name: "Hamza", email: "hamza@test.com", password: "mypass" }
               ↓
server.js runs: bcrypt.hashSync("mypass", 10)
Converts "mypass" → "$2b$10$AbCdEf..." (cannot be reversed)
               ↓
server.js runs:
INSERT INTO users (name, email, password, role)
VALUES ('Hamza', 'hamza@test.com', '$2b$10$AbCdEf...', 'user')
               ↓
MySQL adds a new row to the users table
               ↓
Server responds: { id: 1, name: "Hamza", email: "hamza@test.com" }
               ↓
Browser shows: Login modal (registration succeeded)
```

**What MySQL looks like after:**
```
users table
id | name  | email          | password      | role | created_at
───┼───────┼────────────────┼───────────────┼──────┼──────────────
1  | Hamza | hamza@test.com | $2b$10$AbCd.. | user | 2026-05-03
```

---

### Action 2 — You Click "Login"

```
YOU TYPE:  Email, Password → click Login
               ↓
Browser sends: POST /api/login
Body: { email: "hamza@test.com", password: "mypass" }
               ↓
server.js runs:
SELECT * FROM users WHERE email = 'hamza@test.com'
               ↓
MySQL returns the user row (with hashed password)
               ↓
server.js runs: bcrypt.compareSync("mypass", "$2b$10$AbCd..")
Compares the typed password to the stored hash
               ↓
MATCH  → responds with user data → browser saves to localStorage as "user"
NO MATCH → responds with 401 Invalid password
               ↓
Navbar changes "Login" button → "Logout" button
```

**MySQL is only READ here. Nothing is written during login.**

---

### Action 3 — You Click "Add to Cart"

```
YOU CLICK:  "Add to Cart" on any product
               ↓
js/app.js runs:
let cart = JSON.parse(localStorage.getItem('cart') || '[]')
cart.push(productId)
localStorage.setItem('cart', JSON.stringify(cart))
               ↓
Cart count in navbar updates (+1)
               ↓
Toast notification: "Product added to cart successfully!"
```

**NO MySQL query happens here.**
The product ID is saved in your browser's localStorage only.
This is why "Add to Cart" is instant — no server round-trip needed.

---

### Action 4 — You Open the Cart Page

```
YOU NAVIGATE TO:  cart.html
               ↓
JavaScript reads cart IDs from localStorage
Example: [1, 3, 7]
               ↓
For each product ID, browser sends:
GET /api/products/1  →  MySQL: SELECT * FROM products WHERE id = 1
GET /api/products/3  →  MySQL: SELECT * FROM products WHERE id = 3
GET /api/products/7  →  MySQL: SELECT * FROM products WHERE id = 7
               ↓
MySQL returns name, price, image for each product
               ↓
Cart page shows products with prices and total
```

**MySQL is READ here (SELECT). Nothing is written yet.**

---

### Action 5 — You Click "Checkout"

**This is where the most MySQL activity happens.**

```
YOU CLICK:  Checkout button
               ↓
JavaScript collects: cartIds from localStorage, user from localStorage
               ↓
Calculates total from product prices
               ↓
Browser sends: POST /api/orders
Body: {
  user_id: 1,
  total: 160.00,
  items: [
    { product_id: 1, price: 75.00 },
    { product_id: 2, price: 85.00 }
  ]
}
               ↓
server.js runs QUERY 1:
INSERT INTO orders (user_id, total, status)
VALUES (1, 160.00, 'pending')
→ MySQL creates order row, returns orderId = 1
               ↓
server.js runs QUERY 2:
INSERT INTO order_items (order_id, product_id, price)
VALUES (1, 1, 75.00), (1, 2, 85.00)
→ MySQL creates 2 rows in order_items
               ↓
server.js runs QUERY 3:
DELETE FROM cart_items WHERE user_id = 1
→ MySQL clears any server-side cart rows
               ↓
localStorage cart is also cleared
               ↓
Browser redirects to Profile page
               ↓
Profile page loads order history from MySQL
```

**What MySQL looks like after checkout:**
```
orders table
id | user_id | total  | status  | created_at
───┼─────────┼────────┼─────────┼──────────────
1  |    1    | 160.00 | pending | 2026-05-03

order_items table
id | order_id | product_id | price
───┼──────────┼────────────┼───────
1  |    1     |     1      | 75.00
2  |    1     |     2      | 85.00
```

---

### Action 6 — You Open the Profile Page (Order History)

```
YOU NAVIGATE TO:  profile.html
               ↓
JavaScript reads user from localStorage
               ↓
Browser sends: GET /api/orders/1
               ↓
server.js runs:
SELECT o.id, o.total, o.status, o.created_at,
       p.name as product_name, p.image, oi.price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = 1
ORDER BY o.created_at DESC
               ↓
MySQL joins 3 tables, returns order history with product names
               ↓
Profile page shows past orders with product names, prices, and status
```

---

### Action 7 — Admin Adds a Product

```
YOU GO TO:  http://localhost:3000/admin.html
Fill in product details → click Save
               ↓
Browser sends: POST /api/products
Body: { name: "...", price: ..., category: "...", ... }
               ↓
server.js runs:
INSERT INTO products (name, price, category, image, description)
VALUES (?, ?, ?, ?, ?)
               ↓
MySQL adds new row to products table
               ↓
Product appears on the website immediately
```

---

### Full Click-to-MySQL Summary Table

| What You Click         | MySQL Table Written   | MySQL Table Read       |
|------------------------|-----------------------|------------------------|
| Register               | `users` (INSERT)      | —                      |
| Login                  | —                     | `users` (SELECT)       |
| Add to Cart            | — (localStorage only) | —                      |
| Open Cart page         | —                     | `products` (SELECT)    |
| Checkout               | `orders` (INSERT)     | `products` (SELECT)    |
|                        | `order_items` (INSERT)| —                      |
|                        | `cart_items` (DELETE) | —                      |
| Open Profile           | —                     | `orders` + `order_items` + `products` |
| Admin: Add Product     | `products` (INSERT)   | —                      |
| Admin: Edit Product    | `products` (UPDATE)   | —                      |
| Admin: Delete Product  | `products` (DELETE)   | —                      |
| Open any product page  | —                     | `products` (SELECT)    |
| Open Category page     | —                     | `products` (SELECT)    |

---

## SECTION 8 — LIVE TEST RESULTS — Proven End-to-End

This section shows the actual results from a real test run of this project.
Every step below was tested and verified.

---

### Test 1 — Server Starts and Tables Auto-Create

**Command run:**
```bash
node server.js
```

**Terminal output (actual):**
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

**Result: PASS** — All 5 tables created automatically on first run.

---

### Test 2 — Products Load from MySQL

**API call:**
```
GET http://localhost:3000/api/products
```

**MySQL returned (actual data):**
```
id | name                   | price  | category
───┼────────────────────────┼────────┼─────────
1  | Skechers Go Walk       | 75.00  | Men
2  | Skechers D'Lites       | 85.00  | Women
3  | Skechers Energy        | 65.00  | Kids
4  | Skechers Max Cushioning| 95.00  | Men
5  | Skechers Arch Fit      | 80.00  | Women
6  | Skechers Go Run        | 110.00 | Sports
7  | Skechers Street        | 70.00  | Casual
```

**Result: PASS** — 7 products served directly from MySQL to the browser.

---

### Test 3 — Register a New User → Saved to MySQL

**Action:** Filled Register form with:
```
Name:     Test User
Email:    testuser@sneakora.com
Password: test1234
```

**MySQL users table after registering:**
```sql
SELECT id, name, email, role, created_at FROM users;
```
```
id | name      | email                 | role | created_at
───┼───────────┼───────────────────────┼──────┼──────────────────
1  | Test User | testuser@sneakora.com | user | 2026-05-03 22:03:09
```

**Result: PASS** — User saved to MySQL with bcrypt-hashed password.

---

### Test 4 — Place an Order → Written to MySQL

**API call:**
```
POST /api/orders
Body: { user_id: 1, total: 160.00,
        items: [{ product_id: 1, price: 75.00 },
                { product_id: 2, price: 85.00 }] }
```

**MySQL after checkout (3 tables joined):**
```sql
SELECT o.id AS order_id, u.name AS customer, o.total,
       o.status, p.name AS product, oi.price
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
```
```
order_id | customer  | total  | status  | product          | price
─────────┼───────────┼────────┼─────────┼──────────────────┼──────
1        | Test User | 160.00 | pending | Skechers Go Walk | 75.00
1        | Test User | 160.00 | pending | Skechers D'Lites | 85.00
```

**Result: PASS** — Order and 2 items written to MySQL across 2 tables.

---

### Summary — All Tests Passed

```
✓  node server.js   → tables auto-created in MySQL
✓  GET /api/products → 7 products served from MySQL
✓  Register user     → row inserted into users table
✓  Place order       → row in orders + 2 rows in order_items
✓  Data persists     → still there after restarting server
```

---

## SECTION 9 — ALL Queries in This Project — Fully Explained

Every SQL query that runs when you use the app. All live in `server.js`.

---

### USERS

#### Query 1 — Register (INSERT)
**Line ~22 | Triggered by: clicking Register**
```js
db.query(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [name, email, hash, 'user'],
    (err, result) => { ... }
);
```
> Adds a new user row. Password is pre-hashed by bcrypt before this runs.
> `result.insertId` = the new user's ID (e.g. 3).

---

#### Query 2 — Login (SELECT)
**Line ~34 | Triggered by: clicking Login**
```js
db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, rows) => { ... });
```
> Finds the user by email. Returns all columns.
> `rows[0]` = the user. If empty = no account with that email.
> bcrypt then checks if the password matches the hash.

---

### PRODUCTS

#### Query 3 — Get All Products (SELECT)
**Line ~50 | Triggered by: Category page loading**
```js
db.query(`SELECT * FROM products`, (err, rows) => { ... });
```
> Returns every product as an array. Frontend renders one card per item.

---

#### Query 4 — Get One Product (SELECT)
**Line ~57 | Triggered by: clicking on a product**
```js
db.query(`SELECT * FROM products WHERE id = ?`, [req.params.id], (err, rows) => { ... });
```
> Returns the single product matching the ID in the URL.
> `/api/products/3` → `req.params.id = '3'`

---

#### Query 5 — Add Product (INSERT) — Admin
**Line ~65 | Triggered by: Admin clicking Save**
```js
db.query(
    `INSERT INTO products (name, price, category, image, description) VALUES (?, ?, ?, ?, ?)`,
    [name, price, category, image, description || ''],
    (err, result) => { ... }
);
```
> Adds a new product. `description || ''` means if no description given, use empty string.

---

#### Query 6 — Update Product (UPDATE) — Admin
**Line ~78 | Triggered by: Admin editing a product**
```js
db.query(
    `UPDATE products SET name=?, price=?, category=?, image=?, description=? WHERE id=?`,
    [name, price, category, image, description, req.params.id],
    (err) => { ... }
);
```
> Changes one product's details. The `WHERE id=?` is critical — without it,
> EVERY product would be updated.

---

#### Query 7 — Delete Product (DELETE) — Admin
**Line ~89 | Triggered by: Admin clicking Delete**
```js
db.query(`DELETE FROM products WHERE id = ?`, [req.params.id], (err) => { ... });
```
> Removes the product row. Will fail if the product is in order_items or cart_items.

---

### CART

#### Query 8 — Get User's Cart (SELECT + JOIN)
**Line ~98 | Triggered by: Cart page loading**
```js
db.query(
    `SELECT c.id, p.id as product_id, p.name, p.price, p.category, p.image
     FROM cart_items c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [req.params.userId], (err, rows) => { ... }
);
```
> Gets cart items with product details. JOIN needed because cart_items only
> stores IDs — product names and prices live in the products table.

```
cart_items           products
──────────────────   ────────────────────────────
id | user | product  id | name              | price
───┼──────┼───────── ───┼───────────────────┼──────
7  |  2   |   3  ───→ 3 | Skechers Afterburn| 94.99
```

---

#### Query 9 — Add to Cart (INSERT)
**Line ~113 | Triggered by: clicking Add to Cart (server-side version)**
```js
db.query(`INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)`,
         [user_id, product_id], (err, result) => { ... });
```
> Saves a cart item to MySQL. In this app the homepage uses localStorage,
> but this API exists for direct cart management.

---

#### Query 10 — Remove One Cart Item (DELETE)
**Line ~123 | Triggered by: removing one item from cart**
```js
db.query(`DELETE FROM cart_items WHERE id = ?`, [req.params.id], (err) => { ... });
```
> Deletes one cart entry by its cart row ID (not the product ID).

---

#### Query 11 — Clear Entire Cart (DELETE)
**Line ~131 | Triggered by: after checkout completes**
```js
db.query(`DELETE FROM cart_items WHERE user_id = ?`, [req.params.userId], (err) => { ... });
```
> Removes ALL cart items for a specific user at once.

---

### ORDERS

#### Query 12 — Create Order Header (INSERT)
**Line ~141 | Triggered by: clicking Checkout — step 1 of 3**
```js
db.query(
    `INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')`,
    [user_id, total], (err, result) => { ... }
);
```
> Creates the order record. Status is hardcoded `'pending'`.
> `result.insertId` = the new order ID — passed to step 2.

---

#### Query 13 — Save Order Items (INSERT bulk)
**Line ~149 | Triggered by: checkout — step 2 of 3**
```js
const itemValues = items.map(item => [orderId, item.product_id, item.price]);
db.query(`INSERT INTO order_items (order_id, product_id, price) VALUES ?`,
         [itemValues], (err2) => { ... });
```
> Inserts ALL products from the order in one query.
> `items.map(...)` converts the cart array into `[[orderId, pid, price], ...]`.
> If cart had 3 items → 3 rows inserted in one shot.

---

#### Query 14 — Clear Cart After Order (DELETE)
**Line ~154 | Triggered by: checkout — step 3 of 3 (automatic)**
```js
db.query(`DELETE FROM cart_items WHERE user_id = ?`, [user_id], () => { ... });
```
> Automatically empties the cart after the order is saved.

---

#### Query 15 — Order History (SELECT + 2 JOINs)
**Line ~163 | Triggered by: opening Profile page**
```js
db.query(
    `SELECT o.id, o.total, o.status, o.created_at,
            p.name as product_name, p.image, oi.price
     FROM orders o
     JOIN order_items oi ON o.id         = oi.order_id
     JOIN products    p  ON oi.product_id = p.id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC`,
    [req.params.userId], (err, rows) => { ... }
);
```
> 2 JOINs needed because the data is spread across 3 tables:
> `orders` (date, total) + `order_items` (link) + `products` (name, image).

**Why the same order ID repeats:**
```
Result returned:
order_id | total  | product_name      | price
─────────┼────────┼───────────────────┼──────
1        | 160.00 | Skechers Go Walk  | 75.00   ← same order
1        | 160.00 | Skechers D'Lites  | 85.00   ← same order, 2 items
```
The frontend groups rows by order_id to display them as one order with 2 items.

---

## SECTION 10 — CRUD Scenarios — Real Examples

Run these in MySQL Workbench or terminal. Start each block with `USE sneakora_db;`

---

### Change the Price of One Specific Product

```sql
USE sneakora_db;

-- Check current price first
SELECT id, name, price FROM products WHERE id = 3;

-- Change it
UPDATE products SET price = 129.99 WHERE id = 3;

-- Verify the change happened
SELECT id, name, price FROM products WHERE id = 3;
```

---

### Increase ALL Prices by 10%

```sql
USE sneakora_db;

-- Preview the new prices BEFORE changing anything
SELECT id, name, price, ROUND(price * 1.10, 2) AS new_price FROM products;

-- Apply the increase
UPDATE products SET price = ROUND(price * 1.10, 2);
```

---

### Safely Delete a Product

```sql
USE sneakora_db;

-- Step 1: Check if product is in anyone's cart
SELECT * FROM cart_items WHERE product_id = 7;

-- Step 2: Check if product is in any order history
SELECT * FROM order_items WHERE product_id = 7;

-- Step 3a: If both are empty → safe to delete
DELETE FROM products WHERE id = 7;

-- Step 3b: If cart has rows → clear those first, then delete
DELETE FROM cart_items WHERE product_id = 7;
DELETE FROM products WHERE id = 7;

-- Step 3c: If order_items has rows → don't delete (it's in order history)
-- Instead, mark it discontinued:
UPDATE products SET name = '[Discontinued] Old Name' WHERE id = 7;
```

---

### Update an Order Status

```sql
USE sneakora_db;

-- Mark one order as delivered
UPDATE orders SET status = 'delivered' WHERE id = 1;

-- Mark ALL pending orders as processing
UPDATE orders SET status = 'processing' WHERE status = 'pending';

-- See all orders and their statuses
SELECT id, user_id, total, status, created_at FROM orders ORDER BY created_at DESC;
```

---

### See All Orders With Customer Names and Products

```sql
USE sneakora_db;

SELECT
    o.id          AS order_id,
    u.name        AS customer,
    u.email,
    p.name        AS product,
    oi.price,
    o.total,
    o.status,
    o.created_at
FROM orders o
JOIN users       u  ON o.user_id     = u.id
JOIN order_items oi ON o.id          = oi.order_id
JOIN products    p  ON oi.product_id = p.id
ORDER BY o.created_at DESC;
```

---

### Delete a User and ALL Their Data (Correct Order)

Foreign keys require deleting child records before the parent.

```sql
USE sneakora_db;
-- Replace 3 with the actual user ID

DELETE FROM cart_items  WHERE user_id = 3;
DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = 3);
DELETE FROM orders      WHERE user_id = 3;
DELETE FROM users       WHERE id = 3;
```

---

### Reset Products Table and Start Fresh

```sql
USE sneakora_db;

-- WARNING: permanent. Clears carts and order items too.
DELETE FROM cart_items;
DELETE FROM order_items;
DELETE FROM products;
ALTER TABLE products AUTO_INCREMENT = 1;

-- Re-insert fresh products
INSERT INTO products (name, price, category, image, description) VALUES
('Skechers Go Walk', 75.00, 'Men', 'images/shoe_cyan.png', 'Comfortable walking shoe');
```

---

### Find the Most Active Users

```sql
USE sneakora_db;

SELECT u.id, u.name, u.email, COUNT(o.id) AS total_orders,
       COALESCE(SUM(o.total), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
ORDER BY total_orders DESC
LIMIT 10;
```

---

## SECTION 11 — How to Change a Query and Re-Apply It

### The Steps Every Time

```
1. Open server.js in your editor (VS Code)
2. Find the route you want (use the map below)
3. Edit the SQL string — it is inside backticks ( ` )
4. Save the file: Ctrl+S
5. In terminal: press Ctrl+C to stop the server
6. Type: node server.js
7. Test in the browser or with the API
```

### Route and Query Map

```
server.js
│
├── Line 17   POST /api/register
│             INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)
│
├── Line 32   POST /api/login
│             SELECT * FROM users WHERE email = ?
│
├── Line 49   GET /api/products
│             SELECT * FROM products
│
├── Line 56   GET /api/products/:id
│             SELECT * FROM products WHERE id = ?
│
├── Line 64   POST /api/products         (admin: add)
│             INSERT INTO products (...) VALUES (?, ?, ?, ?, ?)
│
├── Line 76   PUT /api/products/:id      (admin: edit)
│             UPDATE products SET name=?, price=?, ... WHERE id=?
│
├── Line 88   DELETE /api/products/:id   (admin: delete)
│             DELETE FROM products WHERE id = ?
│
├── Line 97   GET /api/cart/:userId
│             SELECT ... FROM cart_items JOIN products WHERE user_id = ?
│
├── Line 111  POST /api/cart
│             INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)
│
├── Line 122  DELETE /api/cart/:id
│             DELETE FROM cart_items WHERE id = ?
│
├── Line 130  DELETE /api/cart/user/:userId
│             DELETE FROM cart_items WHERE user_id = ?
│
├── Line 139  POST /api/orders
│             INSERT INTO orders → INSERT INTO order_items → DELETE cart
│
└── Line 163  GET /api/orders/:userId
              SELECT + JOIN order_items + JOIN products WHERE user_id = ?
```

---

### Example — Add Product Search

Find line ~49 and replace the whole route:

```js
app.get('/api/products', (req, res) => {
    const { search, category } = req.query;
    let sql = 'SELECT * FROM products';
    const params = [];

    if (search) {
        sql += ' WHERE name LIKE ?';
        params.push(`%${search}%`);
    } else if (category) {
        sql += ' WHERE category = ?';
        params.push(category);
    }

    db.query(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
```

Now these URLs work:
```
/api/products?search=walk       → products with "walk" in the name
/api/products?category=Women    → only Women's products
/api/products                   → all products
```

---

### Example — Sort Products by Price

Change line ~50 from:
```js
db.query(`SELECT * FROM products`, ...
```
To:
```js
db.query(`SELECT * FROM products ORDER BY price ASC`, ...
```

---

## SECTION 12 — Troubleshooting — Every Error Explained

---

### `MySQL connection failed: Access denied for user 'root'`

**Cause:** Wrong password in `backend/database.js`

**Fix:**
1. Open `backend/database.js`
2. Find `password: 'saram'`
3. Change to your real MySQL root password
4. Save → restart server (`Ctrl+C` → `node server.js`)

**To check your password:** Open MySQL Workbench → try connecting.
If Workbench connects, that password is correct.

---

### `MySQL connection failed: connect ECONNREFUSED 127.0.0.1:3306`

**Cause:** MySQL server is not running at all

**Fix:**
1. Press Windows key → search "Services"
2. Find `MySQL80` in the list
3. Right-click → Start
4. Wait 10 seconds
5. Run `node server.js` again

---

### `Cannot find module 'mysql2'`

**Cause:** You haven't run `npm install` yet

**Fix:**
```bash
npm install
```

---

### `Port 3000 already in use`

**Cause:** An old `node server.js` is still running in the background

**Fix:**
```bash
taskkill /f /im node.exe
```
Then restart: `node server.js`

---

### `ER_NO_REFERENCED_ROW_2` (Cannot add or update a child row)

**Cause:** Foreign key violation. You tried to insert a row that references
a record that doesn't exist.

**Example:** Adding a cart item for `user_id = 99` but user 99 doesn't exist.

**Fix:** Create the parent record first.
- Cart item → user must exist first → register via app
- Order item → order must exist first → place order first
- Order → user must exist first → register first

---

### `ER_ROW_IS_REFERENCED_2` (Cannot delete or update a parent row)

**Cause:** You tried to delete a row that other rows are pointing to.

**Example:** Deleting a product that exists in `order_items`.

**Fix:** Delete the child rows first:
```sql
DELETE FROM cart_items  WHERE product_id = X;
DELETE FROM order_items WHERE product_id = X;
DELETE FROM products    WHERE id = X;
```

---

### Products Page is Empty

**Cause:** Products table has no rows.

**Fix:** Go to `http://localhost:3000/admin.html` and add products,
OR run the INSERT SQL from Section 2 in MySQL Workbench.

---

### Login Fails Even Though I Just Registered

**Cause 1:** User was added manually via SQL with a plain-text password.
bcrypt cannot match a plain-text password against a hashed one.

**Fix:** Register through the app's Register form — not via raw SQL.

**Cause 2:** Wrong email or password typed.

---

### Server Starts but No MySQL Lines Appear

```
Server running on http://localhost:3000
(nothing about MySQL)
```

**Cause:** The database connection is still failing silently or asynchronously.

**Fix:**
1. Wait 3 seconds — the MySQL messages sometimes appear after the server line
2. Check the password in `database.js`
3. Check MySQL80 is Running in Services
4. Look for an error message right after the server line

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
     │  1:many        ┌─────────────┐                          │
     └───────────────>│ cart_items  │         ┌────────────────┘
                      │             │         │  ┌──────────────┐
                      │ id          │         └─>│   products   │
                      │ user_id     │            │              │
                      │ product_id ─────────────>│ id           │
                      │ added_at    │            │ name         │
                      └─────────────┘            │ price        │
                                                 │ category     │
                                                 │ image        │
                                                 │ description  │
                                                 └──────────────┘
```

---

## Quick Reference Card

```
═══════════════════════════════════════════════════════
  FIRST TIME SETUP
═══════════════════════════════════════════════════════
  1. Install MySQL + Node.js
  2. Open backend/database.js
  3. Change: password: 'saram'  →  password: 'YOUR PASSWORD'
  4. Run: npm install
  5. Run: node server.js
  → Tables create automatically, no SQL needed

═══════════════════════════════════════════════════════
  EVERY TIME YOU START
═══════════════════════════════════════════════════════
  1. Services → MySQL80 must say "Running"
  2. node server.js
  3. Open http://localhost:3000

═══════════════════════════════════════════════════════
  WHERE ARE MY TABLES?
═══════════════════════════════════════════════════════
  MySQL Workbench
    → Local instance MySQL80
    → Left panel: SCHEMAS → sneakora_db → Tables
    → Right-click any table → Select Rows

═══════════════════════════════════════════════════════
  QUICK QUERIES
═══════════════════════════════════════════════════════
  USE sneakora_db;
  SELECT * FROM products;       ← all shoes
  SELECT * FROM users;          ← all accounts
  SELECT * FROM orders;         ← all purchases
  SELECT * FROM order_items;    ← items per order
  SELECT * FROM cart_items;     ← saved cart items

═══════════════════════════════════════════════════════
  WHAT WRITES TO MYSQL?
═══════════════════════════════════════════════════════
  Register        → INSERT users
  Add to Cart     → localStorage only (no MySQL)
  Checkout        → INSERT orders + INSERT order_items
  Admin add prod  → INSERT products

═══════════════════════════════════════════════════════
  CHANGE A QUERY
═══════════════════════════════════════════════════════
  server.js → find the route → edit SQL in backticks
  Save → Ctrl+C → node server.js

═══════════════════════════════════════════════════════
  SAFE DELETE (correct order)
═══════════════════════════════════════════════════════
  USE sneakora_db;
  DELETE FROM cart_items WHERE user_id = X;
  DELETE FROM order_items WHERE order_id IN
    (SELECT id FROM orders WHERE user_id = X);
  DELETE FROM orders WHERE user_id = X;
  DELETE FROM users WHERE id = X;
═══════════════════════════════════════════════════════
```
