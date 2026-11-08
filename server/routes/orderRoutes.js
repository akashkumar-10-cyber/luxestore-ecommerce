const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order with server-side stock & price verification
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address and contact phone are required',
      });
    }

    // 1. Verify stock and calculate verified subtotal server-side
    const verifiedOrderItems = [];
    let subtotal = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ID ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} items remaining.`,
        });
      }

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: Number(item.quantity),
      });

      subtotal += product.price * Number(item.quantity);
    }

    // Free delivery over $50 / ₹500, otherwise flat 10
    const shippingPrice = subtotal >= 50 ? 0 : 10;
    const taxPrice = Number((subtotal * 0.05).toFixed(2));
    const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2));

    // 2. Atomically reduce stock for each product
    for (const item of verifiedOrderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 3. Create the Order
    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email || req.user.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      subtotal,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: false,
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order placed successfully with Cash on Delivery.',
        },
      ],
    });

    // 4. Clear the customer's cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders
// @access  Private
router.get('/my-orders', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization: must be the owner or an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = status;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      // For COD, mark paid upon delivery
      if (order.paymentMethod === 'Cash on Delivery') {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }

    // If order was cancelled and wasn't cancelled before, restore stock
    if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status} by administrator`,
    });

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
