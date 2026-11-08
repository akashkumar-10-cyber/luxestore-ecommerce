const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price image stock category',
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/cart/add
// @desc    Add product to cart or increment
// @access  Private
router.post('/add', protect, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Product is currently out of stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const qtyToAdd = Number(quantity);

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + qtyToAdd;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock} units)`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = product.price;
    } else {
      if (qtyToAdd > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock} units)`,
        });
      }
      cart.items.push({
        product: productId,
        quantity: qtyToAdd,
        price: product.price,
      });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price image stock category',
    });

    res.json({
      success: true,
      cart: populatedCart,
      message: 'Item added to cart',
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/cart/update
// @desc    Update item quantity
// @access  Private
router.put('/update', protect, async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    if (newQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units are currently available in stock`,
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = product.price;
      await cart.save();
    } else {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price image stock category',
    });

    res.json({
      success: true,
      cart: populatedCart,
      message: 'Cart updated',
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove an item from cart
// @access  Private
router.delete('/remove/:productId', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price image stock category',
    });

    res.json({
      success: true,
      cart: populatedCart,
      message: 'Item removed from cart',
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      cart: { user: req.user._id, items: [] },
      message: 'Cart cleared',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
