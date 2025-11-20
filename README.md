# 🏃‍♂️ Skechers Shoes Store

A modern, full-stack e-commerce web application for browsing and purchasing Skechers shoes. Built with Node.js, Express, and vanilla JavaScript with a beautiful, responsive UI.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 🎨 Frontend Features
- **Modern UI Design** - Light theme with gradient accents and smooth animations
- **Responsive Design** - Fully responsive across desktop, tablet, and mobile devices
- **Interactive Hero Section** - Dynamic shoe image switching with color selection
- **Product Catalog** - Browse shoes by category with filters and search
- **Product Details** - Detailed product pages with size selection
- **Shopping Cart** - Add/remove items with persistent storage
- **User Authentication** - Login and registration with secure sessions
- **Toast Notifications** - Beautiful animated notifications for user actions
- **Loading Animations** - Smooth page transitions and loading states

### 🔧 Backend Features
- **RESTful API** - Express.js server with clean API endpoints
- **User Management** - SQLite database for user authentication
- **Product Database** - JSON-based product storage
- **Session Management** - Secure user sessions
- **CORS Enabled** - Cross-origin resource sharing support

### 🎯 Key Functionalities
- ✅ User registration and login with toast notifications
- ✅ Browse products by category (Men, Women, Kids)
- ✅ Search and filter products
- ✅ Interactive color selection on homepage
- ✅ Add products to cart with animations
- ✅ Persistent cart using localStorage
- ✅ Logout functionality with user feedback
- ✅ Responsive navigation with mobile support

## 🚀 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations, flexbox, and grid
- **JavaScript (ES6+)** - Vanilla JS for interactivity
- **Google Fonts** - Outfit font family

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - User database
- **bcrypt** - Password hashing
- **body-parser** - Request body parsing

### Tools & Libraries
- **Three.js** - 3D graphics (optional)
- **Custom Toast System** - Notification management
- **Custom Loader** - Page transition animations

## 📁 Project Structure

```
anigravityprojects/
├── backend/
│   ├── database.js          # SQLite user database setup
│   └── products-db.js       # JSON product database
├── css/
│   ├── styles.css           # Main stylesheet
│   ├── loader.css           # Loading animations
│   └── toast.css            # Toast notification styles
├── data/
│   └── products.json        # Product data
├── images/
│   ├── shoe_cyan.png        # Product images
│   ├── shoe_pink.png
│   ├── shoe_green.png
│   └── shoe_purple.png
├── js/
│   ├── app.js               # Main application logic
│   ├── auth.js              # Authentication handling
│   ├── loader.js            # Page loading animations
│   ├── toast.js             # Toast notification system
│   └── shoe-switcher.js     # Hero image switching
├── index.html               # Homepage
├── category.html            # Product catalog page
├── product.html             # Product detail page
├── cart.html                # Shopping cart page
├── profile.html             # User profile page
├── admin.html               # Admin panel
├── server.js                # Express server
├── package.json             # Dependencies
└── README.md                # This file
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (comes with Node.js)

### Steps

1. **Clone or download the project**
   ```bash
   cd anigravityprojects
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node server.js
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Dependencies

```json
{
  "express": "^5.0.1",
  "sqlite3": "^5.1.7",
  "bcrypt": "^5.1.1",
  "body-parser": "^1.20.3"
}
```

## 🎮 Usage

### For Users

1. **Browse Products**
   - Visit the homepage to see featured products
   - Navigate to Categories to view all products
   - Use filters and search to find specific shoes

2. **User Account**
   - Click "Login" to create an account or sign in
   - Register with name, email, and password
   - Logout using the "Logout" button when logged in

3. **Shopping**
   - Click on any product to view details
   - Select your size
   - Click "Add to Cart"
   - View cart and proceed to checkout

4. **Interactive Features**
   - On the homepage, click color thumbnails to change the hero shoe image
   - Enjoy smooth animations and toast notifications

### For Developers

#### API Endpoints

**Authentication**
- `POST /api/register` - Register new user
- `POST /api/login` - User login

**Products**
- `GET /api/products` - Get all products

#### Database Schema

**Users Table (SQLite)**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
```

**Products (JSON)**
```json
{
  "id": 1,
  "name": "Product Name",
  "category": "Men/Women/Kids",
  "price": 99.99,
  "image": "image_url"
}
```

## 🎨 Design Features

### Color Palette
- **Background**: `#F3F5F9` (Light gray)
- **Text**: `#111111` (Near black)
- **Accent**: `#6C63FF` (Purple)
- **Gradient Primary**: `linear-gradient(135deg, #c471ed 0%, #f64f59 100%)`

### Typography
- **Font Family**: Outfit (Google Fonts)
- **Weights**: 300, 400, 600, 700

### Responsive Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile Landscape**: 481px - 768px
- **Mobile Portrait**: < 480px

## 🔐 Security Features

- Password hashing with bcrypt
- SQL injection prevention with parameterized queries
- Session management
- Input validation

## 🚧 Future Enhancements

- [ ] Payment gateway integration
- [ ] Order management system
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced admin dashboard
- [ ] Real 3D product models
- [ ] Multi-language support
- [ ] Dark mode toggle

## 🐛 Known Issues

- Mobile navigation menu needs hamburger implementation
- Cart persistence across sessions needs backend integration
- Admin panel requires role-based access control

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Skechers for brand inspiration
- Google Fonts for typography
- Three.js community for 3D graphics support

## 📞 Support

For support, email your.email@example.com or open an issue in the repository.

---

**Made with ❤️ using Node.js and vanilla JavaScript**
