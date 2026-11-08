const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with search, category filter, sorting
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { keyword, category, sort, minPrice, maxPrice, inStock } = req.query;

    const query = {};

    // Keyword search
    if (keyword && keyword.trim() !== '') {
      query.$or = [
        { name: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } },
        { category: { $regex: keyword.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // In Stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, numReviews: -1 };
    } else if (sort === 'popular') {
      sortOptions = { numReviews: -1, rating: -1 };
    }

    const products = await Product.find(query).sort(sortOptions);
    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      count,
      products,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/categories
// @desc    Get all distinct product categories
// @access  Public
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const featured = await Product.find({ featured: true }).limit(8);
    // If fewer than 4 featured, fall back to top rated
    if (featured.length < 4) {
      const topRated = await Product.find().sort({ rating: -1 }).limit(8);
      return res.json({ success: true, products: topRated });
    }
    res.json({
      success: true,
      products: featured,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, description, price, category, image, stock, rating, brand, featured } =
      req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, category, and image are required',
      });
    }

    const product = await Product.create({
      name,
      description: description || 'No description provided.',
      price: Number(price),
      category,
      image,
      stock: Number(stock) || 0,
      rating: Number(rating) || 4.5,
      brand: brand || 'LuxeStore',
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      product,
      message: 'Product created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/products/:id
// @desc    Update an existing product
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, description, price, category, image, stock, rating, brand, featured } =
      req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category) product.category = category;
    if (image) product.image = image;
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);
    if (brand) product.brand = brand;
    if (featured !== undefined) product.featured = Boolean(featured);

    const updatedProduct = await product.save();

    res.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
