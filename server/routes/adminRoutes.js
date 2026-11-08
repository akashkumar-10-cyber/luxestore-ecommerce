const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// Apply protect & adminOnly to all routes in this file
router.use(protect, adminOnly);

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics, revenue, and order breakdown
// @access  Private/Admin
router.get('/stats', async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from non-cancelled orders
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);
    const totalSales = revenueResult.length > 0 ? revenueResult[0].totalSales : 0;

    // Order status counts
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusMap = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    statusCounts.forEach((item) => {
      if (statusMap[item._id] !== undefined) {
        statusMap[item._id] = item.count;
      }
    });

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Products low in stock (less than 5 units)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('name stock price category')
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalCustomers,
        totalOrders,
        totalSales: Number(totalSales.toFixed(2)),
        statusCounts: statusMap,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/users
// @desc    Get all registered users
// @access  Private/Admin
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent revoking own admin access
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot revoke your own administrative privileges',
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
