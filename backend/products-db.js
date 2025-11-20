const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data/products.json');

// Ensure data directory exists
const dataDir = path.dirname(dataPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Initialize if not exists
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
}

const getProducts = () => {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

const saveProducts = (products) => {
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
};

module.exports = { getProducts, saveProducts };
