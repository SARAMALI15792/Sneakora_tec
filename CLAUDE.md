# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Install Dependencies**: To install all project dependencies, run:
  ```bash
  npm install
  ```

- **Start Development Server**: To start the Express.js backend server, run:
  ```bash
  node server.js
  ```
  The application will then be accessible at `http://localhost:3000`.

- **Run Tests**: The `package.json` currently contains a placeholder test script. There are no actual tests configured. To execute the placeholder script, run:
  ```bash
  npm test
  ```

## High-Level Architecture

This project is a full-stack e-commerce web application structured with a clear separation between frontend and backend.

- **Frontend**: Primarily built with HTML, CSS, and vanilla JavaScript. It handles the user interface, interactive elements (like product display, cart management, and dynamic image switching), and client-side authentication flow. Pages include `index.html` (homepage), `category.html` (product catalog), `cart.html` (shopping cart), and `contact.html` (contact us page). The `js/loader.js` provides smooth page transitions.

- **Backend**: Implemented using Node.js with the Express.js framework. It exposes a RESTful API for managing user authentication and serving product data. User data is stored in an SQLite3 database (`backend/database.js`), while product information is managed via JSON files (`data/products.json` and `backend/products-db.js`).

## Project Structure Overview

- `backend/`: Contains server-side logic, including database setup (`database.js`) and product data handling (`products-db.js`).
- `css/`: Stores all stylesheets, including `styles.css` (main styles), `loader.css` (loading animations), and `toast.css` (toast notifications).
- `data/`: Holds static data, primarily `products.json`.
- `images/`: Contains product and UI images.
- `js/`: Contains client-side JavaScript files, each responsible for specific functionalities like `app.js` (main logic), `auth.js` (authentication), `loader.js` (page transitions), `toast.js` (notifications), and `shoe-switcher.js` (homepage interactivity).
- `.html` files in the root: Main application pages like `index.html`, `category.html`, `product.html`, `cart.html`, `profile.html`, `admin.html`, and `contact.html`.
- `server.js`: The main entry point for the Express.js backend server.

## Key Functionalities

- User registration and login (with `bcrypt` for password hashing).
- Product browsing, searching, and filtering by category.
- Shopping cart management with persistent storage (`localStorage`).
- Interactive elements on the homepage, such as dynamic shoe image switching.
- Smooth page loading and toast notifications.

## API Endpoints

- `POST /api/register`: Registers a new user.
- `POST /api/login`: Authenticates a user.
- `GET /api/products`: Retrieves all available products.

## Database

- **Users**: Stored in an SQLite3 database (`backend/database.js`) with schema including `id`, `name`, `email` (unique), and `password` (hashed).
- **Products**: Stored in `data/products.json` as a JSON array.
