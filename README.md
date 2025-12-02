# 🏃‍♂️ Skechers Shoes Store

A modern, full-stack e-commerce web application for browsing and purchasing Skechers shoes. Built with Node.js, Express, and vanilla JavaScript with a beautiful, responsive UI featuring dynamic animations and interactive elements.

![Skechers Store Homepage](images/project_preview.png?updated=2025-12-03)
*Homepage featuring SKECHERS branding, dynamic hero section with auto-switching shoe colors, and modern UI design*

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 🎨 Frontend Features
- **Modern UI Design** - Light theme with gradient accents and smooth animations
- **Responsive Design** - Fully responsive across desktop, tablet, and mobile devices
- **Dynamic Hero Section** - Auto-switching shoe images (4-second intervals) with manual color selection
- **Deal Ribbon** - Animated countdown ribbon with random time-limited offers
- **Interactive Color Switcher** - Click thumbnails to change hero shoe with smooth fade transitions
- **Contact Page** - Comprehensive contact page with story section, Google Maps integration, and contact form
- **Product Catalog** - Browse shoes by category with filters and search
- **Product Details** - Detailed product pages with size selection
- **Shopping Cart** - Add/remove items with persistent localStorage
- **User Authentication** - Login and registration with secure sessions and toast notifications
- **Toast Notifications** - Beautiful animated notifications for user actions (success, error, info)
- **Loading Animations** - Smooth page transitions and loading states
- **Circular Logo** - Custom SKH logo with circular styling in navbar

### 🔧 Backend Features
- **RESTful API** - Express.js server with clean API endpoints
- **User Management** - SQLite database for user authentication
- **Product Database** - JSON-based product storage
- **Session Management** - Secure user sessions
- **CORS Enabled** - Cross-origin resource sharing support

### 🎯 Key Functionalities
- ✅ User registration and login with toast notifications
- ✅ Automatic logout with personalized goodbye message
- ✅ Browse products by category (Men, Women, Kids, Sports, Casual)
- ✅ Search and filter products
- ✅ Auto-switching hero shoe images every 4 seconds
- ✅ Manual color selection with 4 color options (Pink, Cyan, Green, Purple)
- ✅ Animated deal ribbon with random countdown timers
- ✅ Smooth fade and scale transitions on image changes
- ✅ Add products to cart with animations
- ✅ Persistent cart using localStorage
- ✅ Contact page with Google Maps integration
- ✅ Responsive navigation with mobile support
- ✅ Dynamic user greeting in navbar when logged in

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
│   ├── styles.css           # Main stylesheet (24KB+ with all features)
│   ├── styles.css.backup    # Backup of previous styles
│   ├── loader.css           # Loading animations
│   └── toast.css            # Toast notification styles
├── data/
│   └── products.json        # Product data
├── images/
│   ├── hero_shoe_main.png   # Main hero shoe image
│   ├── shoe_cyan.png        # Cyan color variant
│   ├── shoe_pink.png        # Pink color variant
│   ├── shoe_green.png       # Green color variant
│   ├── shoe_purple.png      # Purple color variant
│   ├── logo_skh.png         # SKH circular logo
│   └── project_preview.png  # README preview image
├── js/
│   ├── app.js               # Main application logic
│   ├── auth.js              # Authentication handling with logout
│   ├── loader.js            # Page loading animations
│   ├── toast.js             # Toast notification system
│   ├── shoe-switcher.js     # Auto & manual shoe image switching
│   └── home-3d.js           # Three.js 3D graphics (optional)
├── index.html               # Homepage with hero section
├── category.html            # Product catalog page
├── product.html             # Product detail page
├── cart.html                # Shopping cart page
├── contact.html             # Contact page with map & form
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

## 🆕 Recent Changes & Improvements

### Branding & Logo Updates
- **SKH Circular Logo**: Replaced old logo with circular SKH logo (`logo_skh.png`) across all pages
- **Consistent Branding**: Applied SKH logo to navbar on all pages (index, category, contact, cart, product, profile, admin)
- **Circular Logo Styling**: Implemented 50px circular logo with proper object-fit and border-radius
- **Footer Branding**: Updated footer with "SKECHERS" text branding for consistency

### Hero Section Complete Redesign
- **White Card Layout**: Hero shoe now displayed on elegant white background card with rounded corners (30px radius)
- **Card Shadow Effects**: Added sophisticated shadow effects (0 20px 50px rgba) for depth
- **Auto-Switching Shoe Images**: Hero shoe automatically cycles through 4 color variants (Pink, Cyan, Green, Purple) every 4 seconds
- **Manual Color Selection**: Interactive color thumbnails allow instant manual switching between shoe colors
- **Smooth Fade Transitions**: Implemented 0.3s opacity and scale transitions for seamless image changes
- **Floating Animation**: Continuous float animation (translateY -20px) for dynamic shoe presentation
- **Cyan Default**: Set cyan color as the default starting shoe color
- **Enhanced Color Controls**: Redesigned color selector with white background, rounded corners, and hover effects

### Deal Ribbon Feature
- **Animated Deal Ribbon**: Modern gradient ribbon (135deg, #FF6B6B to #FFE66D) positioned on hero card
- **Random Countdown Timer**: Displays random time-limited offers (1-12 hours remaining)
- **Typewriter Animation**: Deal text appears with typewriter effect (50ms per character) on each shoe change
- **Modern Styling**: Rounded corners (20px), shadow effects, and fire emoji icon for visual appeal
- **Dynamic Updates**: Ribbon updates with new random countdown on every shoe color change

### Contact Page (New)
- **Dedicated Contact Page**: Created comprehensive `contact.html` with multiple sections
- **Brand Story Section**: "Our Story" section introducing the Skechers Store brand and mission
- **Google Maps Integration**: Embedded interactive Google Maps showing store location (Minneapolis)
- **Contact Form**: Fully styled contact form with name, email, subject, and message fields
- **Social Media Section**: Dedicated social media links section with emoji icons
- **Responsive Layout**: Flexbox-based responsive layout with white card sections
- **Consistent Styling**: Matches overall site design with rounded corners and shadow effects

### Authentication & User Experience
- **Logout Functionality**: Implemented logout button in navbar across all pages
- **Personalized Logout**: Goodbye messages display user's name on logout
- **Dynamic User Greeting**: Navbar shows "Hi, [Name]" when user is logged in
- **Toast Notifications**: Beautiful animated notifications for login, logout, and user actions
- **Session Management**: Persistent user sessions with proper state management

### UI/UX Enhancements
- **Rounded Modal Inputs**: Changed modal inputs from 8px to 50px border-radius for modern look
- **Enhanced Focus States**: Added accent color borders and subtle focus rings on form inputs
- **Improved Button Hover**: Lift effect (translateY -2px) and shadow on button hover
- **Footer Gradient**: Dark gradient footer (135deg, #1a1a2e to #16213e) with improved contrast
- **Link Hover Effects**: Footer links slide right (padding-left 5px) on hover
- **Responsive Breakpoints**: Optimized for desktop (>1024px), tablet (768-1024px), and mobile (<768px)

### Technical Improvements
- **Shoe Switcher Script**: Created dedicated `shoe-switcher.js` (128 lines) for all image switching logic
- **Auto-Switch Interval**: 4-second interval with proper cleanup on manual selection
- **CSS Expansion**: Expanded `styles.css` to 1146 lines (24KB+) with comprehensive styling
- **Image Assets**: Added 4 shoe color variants (pink, cyan, green, purple) and hero images
- **Code Organization**: Modular JavaScript files (auth.js, toast.js, loader.js, shoe-switcher.js)
- **Color Controls Styling**: Enhanced with backdrop-filter blur, white background, and shadow effects

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
- **Accent**: `#d151e3` (Purple)
- **Gradient Primary**: `linear-gradient(135deg, #c471ed 0%, #f64f59 100%)`
- **Deal Ribbon**: `linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)`
- **Footer**: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`

### Typography
- **Font Family**: Outfit (Google Fonts)
- **Weights**: 300, 400, 600, 700

### Animations
- **Float Animation**: Hero shoe floats up and down continuously
- **Fade Transition**: 0.3s opacity and scale transitions on shoe changes
- **Hover Effects**: Lift and shadow effects on buttons and cards
- **Typewriter Effect**: Deal ribbon text types out character by character

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

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Order management system with tracking
- [ ] Product reviews and ratings system
- [ ] Wishlist functionality
- [ ] Email notifications for orders and promotions
- [ ] Advanced admin dashboard with analytics
- [ ] Real 3D product models with Three.js
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Size recommendation based on user preferences
- [ ] Virtual try-on using AR technology
- [ ] Live chat support
- [ ] Product comparison feature

## 🐛 Known Issues

- Contact form submission needs backend integration for email sending
- Mobile navigation menu needs hamburger implementation for smaller screens
- Cart persistence across sessions needs backend integration
- Admin panel requires role-based access control implementation
- Product detail page 3D view needs full Three.js implementation

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Saram Ali**
- GitHub: [@SARAMALI15792](https://github.com/SARAMALI15792)
- Email: saramali15792@gmail.com

## 🙏 Acknowledgments

- Skechers for brand inspiration
- Google Fonts for typography
- Three.js community for 3D graphics support

## 📞 Support

For support, email saramali15792@gmail.com or open an issue in the repository.

---


