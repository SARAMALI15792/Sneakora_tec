// Global State
let allProducts = [];

// Fetch and display featured products (Home Page)
async function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    try {
        const res = await fetch('/api/products');
        allProducts = await res.json();

        // Show first 4 items as featured
        renderProducts(allProducts.slice(0, 4), container);
    } catch (e) {
        console.error('Failed to load products', e);
    }
}

// Load Products for Category Page
async function loadCategoryProducts() {
    const container = document.getElementById('category-products');
    if (!container) return;

    try {
        const res = await fetch('/api/products');
        allProducts = await res.json();
        renderProducts(allProducts, container);
    } catch (e) {
        console.error('Failed to load products', e);
    }
}

// Render Product Grid
function renderProducts(products, container) {
    container.innerHTML = products.map(p => `
        <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'" style="cursor:pointer;">
            <img src="${p.image}" alt="${p.name}" style="width:100%; height:200px; object-fit:cover; background:#333; border-radius:10px;">
            <h3>${p.name}</h3>
            <p style="color:#aaa;">${p.category}</p>
            <p style="font-size:18px; font-weight:bold;">$${p.price}</p>
            <button onclick="event.stopPropagation(); addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Filter Logic
function applyFilters() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    const selectedCats = Array.from(checkboxes).map(cb => cb.value);
    const maxPrice = document.getElementById('priceRange').value;
    const searchTerm = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : '';

    const filtered = allProducts.filter(p => {
        const catMatch = selectedCats.length === 0 || selectedCats.includes(p.category);
        const priceMatch = p.price <= maxPrice;
        const searchMatch = p.name.toLowerCase().includes(searchTerm);
        return catMatch && priceMatch && searchMatch;
    });

    renderProducts(filtered, document.getElementById('category-products'));
}

function searchProducts() {
    applyFilters();
}

// Load Product Details
async function loadProductDetails(id) {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        const product = products.find(p => p.id == id);

        if (product) {
            document.getElementById('p-name').textContent = product.name;
            document.getElementById('p-category').textContent = product.category;
            document.getElementById('p-price').textContent = '$' + product.price;

            // Update Add to Cart button
            const btn = document.getElementById('addToCartBtn');
            btn.onclick = () => addToCart(product.id);
        }
    } catch (e) {
        console.error('Error loading product details', e);
    }
}

// Cart Logic
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Show toast notification
    showToast('Product added to cart successfully!', 'success');

    // Button animation
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = "✓ Added!";
    btn.style.background = "#28a745";
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.style.transform = "";
    }, 1000);
}

function updateCartCount() {
    const count = JSON.parse(localStorage.getItem('cart') || '[]').length;
    const el = document.getElementById('cartCount');
    if (el) el.textContent = count;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on
    if (document.getElementById('featured-products')) loadFeaturedProducts();
    updateCartCount();
});
