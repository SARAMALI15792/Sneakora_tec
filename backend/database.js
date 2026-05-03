const mysql = require('mysql2');

// Connect to MySQL itself (no database selected yet — we create it below)
const db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'saram'   // <-- change this to YOUR MySQL password
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed: ' + err.message);
        console.error('Fix: make sure MySQL is running and your password is correct in backend/database.js');
        return;
    }
    console.log('Connected to MySQL.');
    createDatabase();
});

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

function setupTables() {
    const tables = [
        ['users', `
            CREATE TABLE IF NOT EXISTS users (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                name       VARCHAR(100) NOT NULL,
                email      VARCHAR(100) UNIQUE NOT NULL,
                password   VARCHAR(255) NOT NULL,
                role       VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `],
        ['products', `
            CREATE TABLE IF NOT EXISTS products (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                name        VARCHAR(200) NOT NULL,
                price       DECIMAL(10,2) NOT NULL,
                category    VARCHAR(100),
                image       VARCHAR(500),
                description TEXT,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `],
        ['orders', `
            CREATE TABLE IF NOT EXISTS orders (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                user_id    INT NOT NULL,
                total      DECIMAL(10,2) NOT NULL,
                status     VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `],
        ['order_items', `
            CREATE TABLE IF NOT EXISTS order_items (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                order_id   INT NOT NULL,
                product_id INT NOT NULL,
                price      DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id)   REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `],
        ['cart_items', `
            CREATE TABLE IF NOT EXISTS cart_items (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                user_id    INT NOT NULL,
                product_id INT NOT NULL,
                added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id)    REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `]
    ];

    tables.forEach(([name, sql]) => {
        db.query(sql, (err) => {
            if (err) console.error(`  Table "${name}" error: ${err.message}`);
            else     console.log(`  Table "${name}" ready.`);
        });
    });
}

module.exports = db;
