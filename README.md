#  LuxeStore — Full-Stack E-Commerce Web Application

[![Deploy LuxeStore to GitHub Pages](https://github.com/akashkumar-10-cyber/luxestore-ecommerce/actions/workflows/deploy.yml/badge.svg)](https://github.com/akashkumar-10-cyber/luxestore-ecommerce/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)

A modern, production-grade, full-stack E-Commerce Web Application built with **React**, **Node.js**, **Express**, **MongoDB Atlas**, and **Tailwind CSS**. Designed with a luxury aesthetic, real-time order tracking, server-verified inventory, Cash on Delivery payments, and an administrative control center.

---

##  Live Public HTTPS Deployment

- **Public Production Website:** [https://akashkumar-10-cyber.github.io/luxestore-ecommerce/](https://akashkumar-10-cyber.github.io/luxestore-ecommerce/)
- **GitHub Repository:** [https://github.com/akashkumar-10-cyber/luxestore-ecommerce](https://github.com/akashkumar-10-cyber/luxestore-ecommerce)

>  The live website is accessible to visitors worldwide on desktops, laptops, tablets, and smartphones without needing any local setup.

---

##  Pre-Configured Instant Demo Logins

Both accounts can be signed in instantly with a single click on the login screen using the **"Instant Demo Logins"** quick-fill buttons:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| ** Administrator** | `admin@luxestore.com` | `Admin@123456` | Full admin dashboard, product management (add/edit/delete), order status lifecycle updates, user role management, revenue analytics. |
| ** Customer** | `customer@luxestore.com` | `Customer@123456` | Browse catalog, filter/sort items, shopping cart, Cash on Delivery checkout, order tracking with visual timeline. |

---

##  Key Features

### 1. Customer Shopping Experience
- **Hero & Curated Collections:** Showcase of top brands, promotional banners, and department shortcuts.
- **Product Catalog & Real-Time Filtering:**
  - Live keyword search across title, description, and brand.
  - Category filters (*Electronics, Fashion & Apparel, Home & Living, Accessories & Gadgets*).
  - Sorting by price (Low to High, High to Low), customer rating, and newest arrivals.
  - In-stock availability toggle.
- **Product Details:** High-res image zoom, star rating, verified review count, stock counter, and real-time quantity controls.
- **Shopping Cart:**
  - Persistent cart state for both authenticated users and guests.
  - Free express delivery indicator (orders over $50).
  - Server-side inventory limit validation preventing overselling.
- **Checkout & Cash on Delivery:**
  - Complete recipient shipping form (Full Name, Phone, Delivery Address, City, Postal Code).
  - Cash on Delivery (COD) selected by default with doorstep payment reassurance.
- **Live Order Tracking:**
  - Visual step-by-step milestone tracker: `Pending` → `Confirmed` → `Processing` → `Shipped` → `Delivered`.
  - Detailed activity log with timestamps and status notes.

### 2. Administrator Operations Center
- **Executive KPI Cards:** Real-time revenue volume, total order count, active products, and registered customers.
- **Fulfillment Breakdown:** Visual distribution across each order status.
- **Product Management:**
  - View all products with category badges, stock levels, and ratings.
  - **Add New Product** modal with live image URL preview, category selector, and inventory count.
  - **Edit Product** modal for price changes and inventory replenishment.
  - **Delete Product** with safety confirmation.
- **Order Management:**
  - Inspect customer addresses and ordered items.
  - Live status dropdown to advance orders from `Pending` through `Delivered` or `Cancelled`.
  - Automatic inventory restoration if an order is cancelled.
- **Customer Directory:** View registered shoppers and toggle administrative rights.

---

## 🛠 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 5, Tailwind CSS, Lucide React, React Router v7 (`HashRouter`) |
| **Backend** | Node.js v20, Express.js 4.21, Mongoose 8.9 |
| **Database** | MongoDB Atlas (Cloud NoSQL Database) / Local MongoDB |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js password hashing |
| **Hosting & CI/CD** | GitHub Pages (Automated GitHub Actions CI/CD), Vercel & Render Ready |

---

## 🏗 Project Architecture & Directory Structure

```
internship-3/
├── .github/
│   └── workflows/
│       └── deploy.yml           # Automated GitHub Pages CI/CD workflow
├── api/
│   └── index.js                 # Serverless entrypoint for Vercel deployment
├── client/                      # React Frontend Application
│   ├── public/                  # Favicons and web assets
│   ├── src/
│   │   ├── components/          # Reusable UI widgets (Navbar, Footer, ProductCard, etc.)
│   │   ├── context/             # React Context (AuthContext, CartContext, ToastContext)
│   │   ├── pages/               # Application views (Home, Products, Detail, Cart, Admin, etc.)
│   │   ├── utils/               # Centralized apiRequest caller & resilient mock store
│   │   ├── App.jsx              # Main routing & layout configuration
│   │   ├── index.css            # Tailwind directives and custom scrollbars
│   │   └── main.jsx             # React DOM root entrypoint
│   ├── index.html               # HTML5 shell with responsive viewport & meta tags
│   ├── tailwind.config.js       # Tailwind CSS theme extensions
│   └── vite.config.js           # Vite build and proxy configuration
├── server/                      # Node.js + Express REST API Backend
│   ├── config/
│   │   └── db.js                # Mongoose database connector
│   ├── middleware/
│   │   ├── auth.js              # JWT verification & adminOnly authorization guards
│   │   └── error.js             # Global 404 & Cast/Validation error handlers
│   ├── models/                  # Mongoose Schemas (User, Product, Category, Order, Cart)
│   ├── routes/                  # Express RESTful routes (auth, products, cart, orders, admin)
│   ├── seeder.js                # Database seeder (16 sample products & default accounts)
│   └── server.js                # Express app initialization & static asset serving
├── render.yaml                  # 1-Click Render Cloud deployment blueprint
├── vercel.json                  # Vercel monorepo configuration
├── netlify.toml                 # Netlify static hosting configuration
└── package.json                 # Monorepo root scripts
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas connection string (or local MongoDB running at `mongodb://127.0.0.1:27017`)

### 2. Clone the Repository
```bash
git clone https://github.com/akashkumar-10-cyber/luxestore-ecommerce.git
cd luxestore-ecommerce
```

### 3. Install All Dependencies
```bash
npm run install:all
```

### 4. Configure Backend Environment
Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_ecommerce_key_2026_production
ADMIN_EMAIL=admin@luxestore.com
ADMIN_PASSWORD=Admin@123456
```

### 5. Seed the Database
Populate MongoDB with 16 realistic products and demo accounts:
```bash
npm run seed
```

### 6. Start Development Servers
In terminal 1 (Backend):
```bash
npm run server
```

In terminal 2 (Frontend):
```bash
cd client
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application locally.

---

## 🚀 Public Cloud Deployment Guide

### Option A: GitHub Pages (Currently Active & Deployed)
1. Fork or push changes to the `main` branch.
2. The included GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and publishes the site to:
   `https://<your-username>.github.io/luxestore-ecommerce/`

### Option B: Render Web Service (Backend + Frontend Monorepo)
1. Sign up at [render.com](https://render.com).
2. Click **New +** → **Blueprint**.
3. Select this GitHub repository. Render reads `render.yaml` automatically and configures:
   - Build Command: `npm run install:all && npm run build`
   - Start Command: `npm run server`
4. Add your `MONGO_URI` in the Render Environment Variables tab.
5. Your full-stack website will be deployed at `https://luxestore-ecommerce.onrender.com`.

### Option C: Vercel (Serverless Full-Stack)
1. Sign up at [vercel.com](https://vercel.com).
2. Click **Add New** → **Project** → Import `luxestore-ecommerce`.
3. Vercel automatically detects `vercel.json`.
4. Add `MONGO_URI` and `JWT_SECRET` in Project Settings → Environment Variables.
5. Click **Deploy**. Your application is live at `https://luxestore-ecommerce.vercel.app`.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System uptime & service health |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/profile` | Private | Get authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user details & default address |
| `GET` | `/api/products` | Public | Filter, search, and sort products |
| `GET` | `/api/products/categories` | Public | List distinct product departments |
| `GET` | `/api/products/featured` | Public | Retrieve curated spotlight products |
| `GET` | `/api/products/:id` | Public | Retrieve single product details |
| `POST` | `/api/products` | Admin | Create a new product |
| `PUT` | `/api/products/:id` | Admin | Update product price, stock, or details |
| `DELETE` | `/api/products/:id` | Admin | Permanently delete product |
| `GET` | `/api/cart` | Private | Fetch user's shopping cart |
| `POST` | `/api/cart/add` | Private | Add product or increment quantity |
| `PUT` | `/api/cart/update` | Private | Update item quantity in cart |
| `DELETE` | `/api/cart/remove/:productId` | Private | Remove item from cart |
| `POST` | `/api/orders` | Private | Place order (deducts stock atomically) |
| `GET` | `/api/orders/my-orders` | Private | Retrieve logged-in customer's orders |
| `GET` | `/api/orders/:id` | Private | Retrieve order details & tracking status |
| `GET` | `/api/orders` | Admin | List all store orders |
| `PUT` | `/api/orders/:id/status` | Admin | Update status (*Pending → Delivered*) |
| `GET` | `/api/admin/stats` | Admin | Aggregate sales revenue & analytics |
| `GET` | `/api/admin/users` | Admin | List registered user directory |
| `PUT` | `/api/admin/users/:id/role` | Admin | Update user role (*customer/admin*) |

---

## 🛡 Security & Reliability Practices

1. **Password Protection:** Passwords hashed with `bcryptjs` using a salt work factor of 10. Passwords never returned in query selections (`select: false`).
2. **JWT Authorization:** Stateless Bearer tokens verified on protected endpoints via `protect` and `adminOnly` Express middleware.
3. **Server-Side Price & Stock Verification:** Prices, taxes, and shipping are computed strictly on the backend to prevent client tampering.
4. **Atomic Inventory Tracking:** Product stock is atomically decremented upon order placement and replenished if an order is cancelled.
5. **CORS & Environment Safeguards:** Configured for cross-origin compliance with strict separation of credentials.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
