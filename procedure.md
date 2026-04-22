# Sneakora — MySQL Setup & Working Procedure

---

## Database Status: All Correct ✅

| Table        | Records         | Foreign Keys | Status |
|--------------|-----------------|--------------|--------|
| users        | grows on signup | —            | ✅     |
| products     | 7 shoes         | —            | ✅     |
| orders       | grows on checkout | users.id   | ✅     |
| order_items  | grows on checkout | orders.id, products.id | ✅ |
| cart_items   | grows on add to cart | users.id, products.id | ✅ |

---

## How the Database is Connected

**File:** `backend/database.js`

```js
host:     'localhost'
user:     'root'
password: 'saram'
database: 'sneakora_db'
```

All 5 routes in `server.js` use this connection: users, products, cart, orders.

---

## Step-by-Step: How to Run This Project

### Step 1 — Make sure MySQL is running
- Open **Services** on Windows (search "Services" in Start menu)
- Find **MySQL80** → make sure it says **Running**
- Or open MySQL Workbench — if it connects, MySQL is running

### Step 2 — Open terminal in the project folder
```
Right-click inside the Sneakora_tec folder → "Open in Terminal"
```

### Step 3 — Install dependencies (first time only)
```bash
npm install
```

### Step 4 — Start the server
```bash
node server.js
```

You should see:
```
Server running on http://localhost:3000
Connected to MySQL database.
```

### Step 5 — Open the app
Open your browser and go to:
```
http://localhost:3000
```

---

## How Each Feature Works

### Register / Login
1. Click **Login** button on the navbar
2. Switch to Register tab → fill name, email, password → click Register
3. Your account is saved in the `users` table in MySQL
4. Login with same email and password

### Browse Products
- Products load from the `products` table in MySQL
- Filter by category or price on the Category page
- All 7 shoes are pre-loaded

### Add to Cart
- Click **Add to Cart** on any product
- Cart is stored in your browser (localStorage)
- Must be logged in to checkout and save to database

### Checkout (Place Order)
1. Go to Cart page
2. Click **Checkout**
3. Order is saved to `orders` table
4. Each product in order is saved to `order_items` table
5. Cart is cleared
6. You are redirected to Profile page

### View Order History
- Go to **Profile** page
- Your past orders are loaded from the `orders` and `order_items` tables
- Shows order ID, date, total, status, and products

### Admin Panel
- Go to `http://localhost:3000/admin.html`
- Add new products (saved to `products` table in MySQL)
- Delete products (removed from `products` table)

---

## All MySQL Queries Used in This Project

### Users
```sql
-- Register new user
INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user');

-- Login (find user by email)
SELECT * FROM users WHERE email = ?;
```

### Products
```sql
-- Get all products
SELECT * FROM products;

-- Get one product
SELECT * FROM products WHERE id = ?;

-- Add product (Admin)
INSERT INTO products (name, price, category, image, description) VALUES (?, ?, ?, ?, ?);

-- Update product (Admin)
UPDATE products SET name=?, price=?, category=?, image=?, description=? WHERE id=?;

-- Delete product (Admin)
DELETE FROM products WHERE id = ?;
```

### Cart
```sql
-- Get user's cart with product details
SELECT c.id, p.id as product_id, p.name, p.price, p.category, p.image
FROM cart_items c
JOIN products p ON c.product_id = p.id
WHERE c.user_id = ?;

-- Add item to cart
INSERT INTO cart_items (user_id, product_id) VALUES (?, ?);

-- Remove one item
DELETE FROM cart_items WHERE id = ?;

-- Clear entire cart
DELETE FROM cart_items WHERE user_id = ?;
```

### Orders
```sql
-- Create new order
INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending');

-- Add products to order
INSERT INTO order_items (order_id, product_id, price) VALUES ?;

-- Get order history (with product names)
SELECT o.id, o.total, o.status, o.created_at,
       p.name as product_name, p.image, oi.price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = ?
ORDER BY o.created_at DESC;
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `MySQL connection failed` | Start MySQL service (see Step 1) |
| `Cannot find module 'mysql2'` | Run `npm install` |
| `Port 3000 already in use` | Kill old server: `taskkill /f /im node.exe` then restart |
| Products not showing | Check MySQL is running and `sneakora_db` exists |
| Orders not saving | Must be logged in before checkout |

---

## Database Diagram

```
users
  └── orders (user_id → users.id)
        └── order_items (order_id → orders.id)
                └── products (product_id → products.id)

users
  └── cart_items (user_id → users.id)
        └── products (product_id → products.id)
```
