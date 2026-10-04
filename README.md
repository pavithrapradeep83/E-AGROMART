# 🚀 Farmer Market - Smart Agriculture Platform

**Version**: 2.0 | **Status**: Production Ready ✅ | **Last Updated**: March 2026

A comprehensive full-stack web application connecting buyers directly with local farmers, enabling smart agriculture marketplace with real-time product browsing, ordering, payments, and farmer management.

---

## 📋 Table of Contents

1. [Quick Start Guide](#-quick-start-guide)
2. [Project Overview](#-project-overview)
3. [Tech Stack](#-tech-stack)
4. [Installation & Setup](#-installation--setup)
5. [Project Structure](#-project-structure)
6. [Features & Functionality](#-features--functionality)
7. [API Documentation](#-api-documentation)
8. [Database Schema](#-database-schema)
9. [How to Run (Step by Step)](#-how-to-run-step-by-step)
10. [Troubleshooting](#-troubleshooting)
11. [Development & Deployment](#-development--deployment)

---

## ⚡ Quick Start Guide

### For Complete Beginners (5-10 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/kailasnath2255/farming_website.git
cd farmer_website

# 2. Install backend dependencies
cd backend
npm install

# 3. Start the backend server
npm start
# Backend will run at http://localhost:5000

# 4. Open the frontend
# Go to http://localhost:5000 or open index.html in your browser
```

---

## 🎯 Project Overview

**Farmer Market** is a smart agriculture platform designed to bridge the gap between farmers and consumers.

### Key Objectives
- ✅ Direct farmer-to-consumer marketplace
- ✅ Product browsing and filtering
- ✅ Secure user authentication
- ✅ Shopping cart and checkout
- ✅ Order management
- ✅ Product reviews and ratings
- ✅ Farmer profile management
- ✅ Admin dashboard for platform management

### User Roles
1. **Buyers** - Browse products, place orders, write reviews
2. **Farmers** - Manage products, view orders, update farm profile
3. **Admins** - Platform management, user control, order monitoring

---

## 🛠️ Tech Stack

### Frontend (Client-Side)
- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, animations, responsive design
- **Vanilla JavaScript** - No frameworks, lightweight (~500KB total)
- **FontAwesome 6.4.0** - Icons
- **Google Fonts** - Poppins, Inter typography

### Backend (Server-Side)
- **Node.js & Express.js** - REST API framework
- **SQLite** - Lightweight database (better-sqlite3)
- **JWT (JSON Web Tokens)** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

### Database
- **SQLite** - File-based database (database.sqlite)
- **5 Tables** - Users, Products, Orders, Reviews, Wishlist

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v14+) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/kailasnath2255/farming_website.git
cd farmer_website
```

#### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (already exists with defaults)
# PORT=5000
# JWT_SECRET=farmer-market-secret-key-2026
# NODE_ENV=development
```

#### 3. Start Backend Server
```bash
# Development mode
npm start

# Or with auto-reload (requires nodemon)
npm run dev
```

**Expected output:**
```
🔧 Initializing database...
✅ Database initialized
✅ Sample data seeded
📨 Server running on http://localhost:5000
```

#### 4. Frontend Access
- Open browser: `http://localhost:5000`
- Or open `index.html` directly

---

## 📁 Project Structure

```
farmer_website/
├── backend/
│   ├── config/
│   │   └── database.js          # Database setup & seeding
│   ├── controllers/             # Business logic
│   │   ├── authController.js    # Login/Register
│   │   ├── productController.js # Product CRUD
│   │   ├── orderController.js   # Order management
│   │   ├── reviewController.js  # Reviews
│   │   ├── wishlistController.js# Wishlist
│   │   └── adminController.js   # Admin functions
│   ├── models/                  # Database models
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Auth, validation
│   ├── server.js                # Express app
│   ├── package.json
│   └── database.sqlite          # SQLite database
│
├── frontend/                    # HTML/CSS/JS
│   ├── index.html               # Landing page
│   ├── login.html               # Authentication
│   ├── register.html
│   ├── buyer.html               # Buyer dashboard
│   ├── farmer.html              # Farmer dashboard
│   ├── admin.html               # Admin panel
│   ├── payment.html             # Checkout
│   ├── profile.html             # User profiles
│   ├── wishlist.html
│   ├── invoice.html
│   ├── css/
│   │   └── style.css            # All styling (~5000 lines)
│   ├── js/
│   │   └── script.js            # Frontend logic
│   └── frontend-config.js       # API configuration
│
├── manifest.json                # PWA configuration
├── sw.js                        # Service Worker
├── start.bat                    # Windows startup script
└── README.md                    # This file
```

---

## ✨ Features & Functionality

### 🛒 Buyer Features
- **Browse Products**
  - Filter by category, price range
  - Search functionality
  - Sort by price/rating
  - Product details & reviews

- **Shopping**
  - Add to cart
  - Wishlist
  - Remove items
  - Update quantities

- **Checkout & Payments**
  - Secure payment processing
  - Order confirmation
  - Invoice generation

- **Order Management**
  - View order history
  - Track status
  - Download invoices
  - Return/cancellation

- **Reviews & Ratings**
  - Leave product reviews
  - Rate products
  - View other reviews

### 👨‍🌾 Farmer Features
- **Product Management**
  - Add/Edit/Delete products
  - Set prices and inventory
  - Upload product images
  - Manage categories

- **Order Management**
  - View incoming orders
  - Update order status
  - Track fulfillment

- **Farm Profile**
  - Manage farm information
  - Upload farm images
  - View statistics

### 👨‍💼 Admin Features
- **User Management**
  - View all users
  - Farmer approvals
  - Ban/Suspend users

- **Product Management**
  - Approve products
  - Remove inappropriate items
  - Monitor inventory

- **Order Monitoring**
  - View all orders
  - Generate reports
  - Revenue tracking

- **Platform Statistics**
  - User counts
  - Sales metrics
  - Popular products

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
```
POST /auth/register         # Register new user
POST /auth/login           # Login user
POST /auth/logout          # Logout
```

### Product Endpoints
```
GET  /products             # Get all products
GET  /products/:id         # Get single product
POST /products             # Create product (Farmer)
PUT  /products/:id         # Update product (Farmer)
DELETE /products/:id       # Delete product (Farmer)
```

### Order Endpoints
```
POST /orders               # Create order
GET  /orders              # Get user orders
GET  /orders/:id          # Get order details
PUT  /orders/:id          # Update order status
```

### Review Endpoints
```
POST /reviews             # Create review
GET  /reviews/:productId  # Get product reviews
DELETE /reviews/:id       # Delete review
```

### Wishlist Endpoints
```
POST /wishlist            # Add to wishlist
GET  /wishlist            # Get wishlist items
DELETE /wishlist/:id      # Remove from wishlist
```

### Admin Endpoints
```
GET /admin/users          # Get all users
GET /admin/products       # Get all products
GET /admin/orders         # Get all orders
PUT /admin/users/:id      # Update user status
```

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT, -- 'buyer', 'farmer', 'admin'
  phone TEXT,
  address TEXT,
  avatar TEXT,
  status TEXT, -- 'active', 'suspended'
  created_at DATETIME
);
```

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  farmer_id INTEGER,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  price DECIMAL,
  image TEXT,
  rating DECIMAL,
  created_at DATETIME,
  FOREIGN KEY(farmer_id) REFERENCES users(id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  buyer_id INTEGER,
  total DECIMAL,
  status TEXT, -- 'pending', 'confirmed', 'shipped', 'delivered'
  payment_method TEXT,
  items JSON,
  created_at DATETIME,
  FOREIGN KEY(buyer_id) REFERENCES users(id)
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY,
  product_id INTEGER,
  buyer_id INTEGER,
  rating INTEGER,
  comment TEXT,
  created_at DATETIME,
  FOREIGN KEY(product_id) REFERENCES products(id),
  FOREIGN KEY(buyer_id) REFERENCES users(id)
);
```

### Wishlist Table
```sql
CREATE TABLE wishlist (
  id INTEGER PRIMARY KEY,
  buyer_id INTEGER,
  product_id INTEGER,
  created_at DATETIME,
  FOREIGN KEY(buyer_id) REFERENCES users(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);
```

---

## 🚀 How to Run (Step by Step)

### For a Complete Beginner

#### Step 1: Install Prerequisites (10 minutes)
1. Download Node.js from https://nodejs.org/ (LTS version)
2. Run the installer and follow prompts
3. Download Git from https://git-scm.com/
4. Run the installer

#### Step 2: Clone the Project (2 minutes)
```bash
# Open Command Prompt or PowerShell
# Navigate to where you want the project
cd C:\Users\YourName\Documents

# Clone the repository
git clone https://github.com/kailasnath2255/farming_website.git
cd farmer_website
```

#### Step 3: Install Backend Dependencies (3 minutes)
```bash
cd backend
npm install
```

#### Step 4: Start the Server (1 minute)
```bash
npm start
```

You should see:
```
🔧 Initializing database...
✅ Database initialized
✅ Sample data seeded
📨 Server running on http://localhost:5000
```

#### Step 5: Access the Application
- Open your browser (Chrome, Firefox, Edge)
- Go to: **http://localhost:5000**
- You should see the Farmer Market landing page

#### Step 6: Test the Application

**Test Buyer Account:**
- Click "Login"
- Email: `buyer@example.com`
- Password: `password123`

**Test Farmer Account:**
- Email: `farmer@example.com`
- Password: `password123`

**Test Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

#### Step 7: Explore Features
- Browse products on buyer dashboard
- Add items to cart
- Leave reviews
- Switch between buyer/farmer accounts
- Access admin panel

---

## 🐛 Troubleshooting

### Issue 1: "npm: command not found"
**Solution**: Node.js not installed
```bash
# Install Node.js from https://nodejs.org/
# Restart your terminal/command prompt
# Try again: npm --version
```

### Issue 2: Port 5000 already in use
**Solution**: Change the port in `.env` file
```
PORT=3000
```
Then access: `http://localhost:3000`

### Issue 3: Database locked error
**Solution**: Close all instances and restart
```bash
# Stop the server (Ctrl+C)
# Wait 2 seconds
# Start again: npm start
```

### Issue 4: "Cannot find module 'express'"
**Solution**: Dependencies not installed
```bash
cd backend
npm install
npm start
```

### Issue 5: SSL/HTTPS errors
**Note**: This project uses HTTP (development mode)
- This is normal for local development
- For production, implement proper HTTPS

### Issue 6: Products not showing
**Solution**: Check browser console (F12 → Console tab)
- Verify backend is running
- Check API Health: http://localhost:5000/api/health
- Verify database file exists: `backend/database.sqlite`

---

## 💻 Development & Deployment

### Development Mode
```bash
cd backend

# With auto-reload on file changes
npm install -g nodemon
npm run dev
```

### Production Deployment

#### Option 1: Heroku
```bash
# Create Heroku account
# Install Heroku CLI
heroku login
heroku create farmer-market-app
git push heroku master
```

#### Option 2: Self-hosted (VPS/Cloud)
```bash
# SSH into your server
ssh user@your-server.com

# Clone and setup
git clone [repo-url]
cd farmer_website/backend
npm install --production
NODE_ENV=production npm start
```

### Database Backup
```bash
# SQLite automatically saves to database.sqlite
# Backup command:
cp backend/database.sqlite backend/database.sqlite.backup
```

### Security Considerations
- ✅ Change `JWT_SECRET` in `.env`
- ✅ Use HTTPS in production
- ✅ Set `NODE_ENV=production`
- ✅ Implement rate limiting
- ✅ Add input validation
- ✅ Sanitize user inputs

---

## 📞 Support & Contact

**Created by**: Farmer Market Team  
**Version**: 2.0  
**Last Updated**: March 2026

---

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy Farming! 🚜🌾**
