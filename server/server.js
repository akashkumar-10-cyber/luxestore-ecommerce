require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend assets in production or if build exists
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'LuxeStore E-Commerce REST API is running',
      version: '1.0.0',
      docs: '/api/health',
    });
  });
}

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
