// In-browser resilient database for fallback when backend API is spinning up or offline
const initialCategories = [
  'Electronics',
  'Fashion & Apparel',
  'Home & Living',
  'Accessories & Gadgets',
];

const initialProducts = [
  // Electronics
  {
    _id: '674e01a1e0b12a0011110001',
    name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging, crystal-clear hands-free calling, and ultra-comfortable lightweight design.',
    price: 349.99,
    category: 'Electronics',
    brand: 'Sony',
    stock: 24,
    rating: 4.9,
    numReviews: 128,
    featured: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110002',
    name: 'Apple Watch Series 9 GPS + Cellular',
    description: 'Advanced health sensors provide insights into your physical well-being. Powerful S9 SiP chip with Double Tap gesture, brighter Always-On Retina display, and fast charging.',
    price: 399.0,
    category: 'Electronics',
    brand: 'Apple',
    stock: 18,
    rating: 4.8,
    numReviews: 95,
    featured: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110003',
    name: 'Fujifilm X-T30 II Mirrorless Digital Camera',
    description: '26.1MP X-Trans CMOS 4 sensor with high-speed autofocus and stunning 4K/30p video. Iconic retro body with tactile dials and legendary Fujifilm film simulation modes.',
    price: 899.99,
    category: 'Electronics',
    brand: 'Fujifilm',
    stock: 10,
    rating: 4.9,
    numReviews: 42,
    featured: true,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110004',
    name: 'Marshall Stanmore III Bluetooth Home Speaker',
    description: 'Re-engineered for a wider soundstage with room-filling Marshall signature sound. Bluetooth 5.2 connectivity and iconic vintage brass accents with textured vinyl finish.',
    price: 379.99,
    category: 'Electronics',
    brand: 'Marshall',
    stock: 15,
    rating: 4.7,
    numReviews: 64,
    featured: false,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    createdAt: new Date().toISOString(),
  },

  // Fashion & Apparel
  {
    _id: '674e01a1e0b12a0011110005',
    name: 'Heritage Italian Nappa Leather Biker Jacket',
    description: 'Masterfully crafted from 100% full-grain supple Italian leather. Features asymmetric zip closure, tailored athletic cut, zippered gussets, and silky satin lining.',
    price: 289.0,
    category: 'Fashion & Apparel',
    brand: 'Verona Milano',
    stock: 12,
    rating: 4.8,
    numReviews: 76,
    featured: true,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110006',
    name: 'Minimalist Clean White Leather Court Sneakers',
    description: 'Handcrafted in Portugal from smooth calfskin leather with durable Margom rubber cupsoles. Versatile styling that complements both tailored trousers and casual denim.',
    price: 145.0,
    category: 'Fashion & Apparel',
    brand: 'Aethel',
    stock: 35,
    rating: 4.7,
    numReviews: 112,
    featured: true,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110007',
    name: 'Heavyweight French Terry Organic Cotton Hoodie',
    description: 'Custom knit 450 GSM combed organic cotton. Double-layered hood, ribbed side gussets for flexibility, and pre-shrunk finish for lifetime durability.',
    price: 85.0,
    category: 'Fashion & Apparel',
    brand: 'Nordic Basics',
    stock: 40,
    rating: 4.6,
    numReviews: 89,
    featured: false,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110008',
    name: 'Automatic Sapphire Minimalist Dress Watch',
    description: 'Self-winding Japanese automatic movement with 42-hour power reserve. Scratch-resistant sapphire crystal, 316L stainless steel case, and genuine Horween leather strap.',
    price: 220.0,
    category: 'Fashion & Apparel',
    brand: 'Chronos',
    stock: 22,
    rating: 4.9,
    numReviews: 53,
    featured: false,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
    createdAt: new Date().toISOString(),
  },

  // Home & Living
  {
    _id: '674e01a1e0b12a0011110009',
    name: 'Ergonomic Mesh Executive Task Chair',
    description: 'Designed for 12+ hours of posture support with responsive 3D lumbar support, breathable hybrid mesh, 4D adjustable armrests, and pneumatic seat height adjustment.',
    price: 320.0,
    category: 'Home & Living',
    brand: 'ErgoPro',
    stock: 14,
    rating: 4.8,
    numReviews: 145,
    featured: true,
    image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110010',
    name: 'DeLonghi Barista Touch Espresso & Coffee Machine',
    description: 'Thermojet heating system achieves optimum extraction temperature in 3 seconds. Integrated stainless steel conical burr grinder and automated microfoam milk steam wand.',
    price: 649.0,
    category: 'Home & Living',
    brand: 'DeLonghi',
    stock: 8,
    rating: 4.9,
    numReviews: 98,
    featured: true,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110011',
    name: 'Artisan Ceramic Stoneware Vase Set (Set of 3)',
    description: 'Hand-thrown textured ceramic vases in matte off-white and desert sand glaze. Perfect for pampas grass, fresh botanical cuttings, or standalone architectural display.',
    price: 58.0,
    category: 'Home & Living',
    brand: 'Clay & Kiln',
    stock: 28,
    rating: 4.7,
    numReviews: 43,
    featured: false,
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110012',
    name: 'Smart Ultrasonic Aromatherapy Essential Oil Diffuser',
    description: 'Quiet ultrasonic cool mist technology with ambient warm LED glow. App-controlled mist timing, waterless auto-shutoff, and genuine beech wood base.',
    price: 49.99,
    category: 'Home & Living',
    brand: 'ZenLiving',
    stock: 35,
    rating: 4.6,
    numReviews: 67,
    featured: false,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    createdAt: new Date().toISOString(),
  },

  // Accessories & Gadgets
  {
    _id: '674e01a1e0b12a0011110013',
    name: 'Handcrafted Full-Grain Leather 15-inch Laptop Sleeve',
    description: 'Vegetable-tanned full grain cowhide with soft microfiber protective lining and magnetic secure closure. Fits MacBook Pro 14/16 and ultrabooks up to 15.6 inches.',
    price: 75.0,
    category: 'Accessories & Gadgets',
    brand: 'Crafter Co.',
    stock: 30,
    rating: 4.8,
    numReviews: 82,
    featured: false,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110014',
    name: 'Anker 3-in-1 MagSafe Fast Wireless Charging Station',
    description: 'Official 15W MagSafe fast charging for iPhone, Apple Watch Ultra/Series 9, and AirPods Pro simultaneously. Sleek space-saving foldable design with aerospace aluminum base.',
    price: 119.99,
    category: 'Accessories & Gadgets',
    brand: 'Anker',
    stock: 25,
    rating: 4.9,
    numReviews: 110,
    featured: true,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110015',
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    description: 'Full CNC aluminum body, 75% layout with programmable rotary knob. Hot-swappable mechanical switches, acoustic foam dampening, and south-facing RGB backlighting.',
    price: 199.0,
    category: 'Accessories & Gadgets',
    brand: 'Keychron',
    stock: 16,
    rating: 4.9,
    numReviews: 73,
    featured: true,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '674e01a1e0b12a0011110016',
    name: 'Ray-Ban Classic Polarized Wayfarer Sunglasses',
    description: 'Timeless silhouette with crystal green polarized lenses providing 100% UV protection and glare elimination. Hypoallergenic black acetate frame with silver hinge rivets.',
    price: 168.0,
    category: 'Accessories & Gadgets',
    brand: 'Ray-Ban',
    stock: 20,
    rating: 4.7,
    numReviews: 91,
    featured: false,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

const initialUsers = [
  {
    _id: '674e01a1e0b12a0022220001',
    name: 'Store Administrator',
    email: 'admin@luxestore.com',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    address: '100 Infinite Loop, Suite 400',
    city: 'Cupertino',
    postalCode: '95014',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    _id: '674e01a1e0b12a0022220002',
    name: 'Sarah Jenkins',
    email: 'customer@luxestore.com',
    role: 'customer',
    phone: '+1 (555) 349-8812',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    postalCode: '97477',
    createdAt: '2026-02-20T14:30:00.000Z',
  },
];

const initialOrders = [
  {
    _id: '674e01a1e0b12a0033330001',
    user: '674e01a1e0b12a0022220002',
    orderItems: [
      {
        product: '674e01a1e0b12a0011110001',
        name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        price: 349.99,
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Sarah Jenkins',
      email: 'customer@luxestore.com',
      phone: '+1 (555) 349-8812',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
    },
    paymentMethod: 'Cash on Delivery',
    subtotal: 349.99,
    shippingPrice: 0,
    taxPrice: 17.5,
    totalPrice: 367.49,
    isPaid: true,
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Delivered',
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), note: 'Order placed' },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), note: 'Payment & verification complete' },
      { status: 'Shipped', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'In transit with FedEx Tracking #FX-884920' },
      { status: 'Delivered', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Package handed to recipient at doorstep' },
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper to access persistent local database
const getDB = () => {
  const data = localStorage.getItem('luxestore_mock_db');
  if (!data) {
    const initial = {
      products: initialProducts,
      categories: initialCategories,
      users: initialUsers,
      orders: initialOrders,
    };
    localStorage.setItem('luxestore_mock_db', JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveDB = (db) => {
  localStorage.setItem('luxestore_mock_db', JSON.stringify(db));
};

export const handleMockRequest = async (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const db = getDB();

  // Normalize endpoint path and extract query parameters
  const [cleanEndpoint, queryString] = endpoint.split('?');
  const path = cleanEndpoint.startsWith('/api') ? cleanEndpoint.replace('/api', '') : cleanEndpoint;
  const searchParams = new URLSearchParams(queryString || '');

  // 1. GET /products
  if (path === '/products' && method === 'GET') {
    let prods = [...db.products];
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const inStock = searchParams.get('inStock') === 'true';

    if (keyword) {
      const kw = keyword.toLowerCase();
      prods = prods.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.category.toLowerCase().includes(kw)
      );
    }

    if (category && category !== 'All') {
      prods = prods.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (inStock) {
      prods = prods.filter((p) => p.stock > 0);
    }

    if (sort === 'price_asc') {
      prods.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      prods.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      prods.sort((a, b) => b.rating - a.rating);
    } else {
      // newest
      prods.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return { success: true, count: prods.length, products: prods };
  }

  // 2. GET /products/categories
  if (path === '/products/categories' && method === 'GET') {
    return { success: true, categories: db.categories };
  }

  // 3. GET /products/featured
  if (path === '/products/featured' && method === 'GET') {
    const featured = db.products.filter((p) => p.featured);
    return { success: true, products: featured.length > 0 ? featured : db.products.slice(0, 8) };
  }

  // 4. GET /products/:id
  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch && method === 'GET') {
    const pId = productMatch[1];
    const prod = db.products.find((p) => p._id === pId);
    if (!prod) throw new Error('Product not found');
    return { success: true, product: prod };
  }

  // 5. POST /products (Admin add)
  if (path === '/products' && method === 'POST') {
    const newProd = {
      _id: 'prod_' + Date.now(),
      name: body.name,
      description: body.description,
      price: Number(body.price),
      category: body.category,
      image: body.image,
      stock: Number(body.stock) || 0,
      rating: Number(body.rating) || 4.8,
      brand: body.brand || 'LuxeStore',
      featured: Boolean(body.featured),
      createdAt: new Date().toISOString(),
    };
    db.products.unshift(newProd);
    saveDB(db);
    return { success: true, product: newProd };
  }

  // 6. PUT /products/:id (Admin edit)
  if (productMatch && method === 'PUT') {
    const pId = productMatch[1];
    const idx = db.products.findIndex((p) => p._id === pId);
    if (idx === -1) throw new Error('Product not found');
    db.products[idx] = { ...db.products[idx], ...body };
    saveDB(db);
    return { success: true, product: db.products[idx] };
  }

  // 7. DELETE /products/:id (Admin delete)
  if (productMatch && method === 'DELETE') {
    const pId = productMatch[1];
    db.products = db.products.filter((p) => p._id !== pId);
    saveDB(db);
    return { success: true, message: 'Product deleted' };
  }

  // 8. POST /auth/login
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = body;
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Accept predefined demo passwords or any standard test password
    const valid =
      (email === 'admin@luxestore.com' && password === 'Admin@123456') ||
      (email === 'customer@luxestore.com' && password === 'Customer@123456') ||
      password.length >= 6;

    if (!valid) {
      throw new Error('Invalid credentials');
    }

    return {
      success: true,
      token: 'mock_jwt_token_' + user._id,
      user,
    };
  }

  // 9. POST /auth/register
  if (path === '/auth/register' && method === 'POST') {
    const exists = db.users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());
    if (exists) {
      throw new Error('An account with this email already exists');
    }
    const newUser = {
      _id: 'usr_' + Date.now(),
      name: body.name,
      email: body.email.toLowerCase(),
      role: 'customer',
      phone: body.phone || '',
      address: body.address || '',
      city: body.city || '',
      postalCode: body.postalCode || '',
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDB(db);
    return {
      success: true,
      token: 'mock_jwt_token_' + newUser._id,
      user: newUser,
    };
  }

  // 10. GET /auth/profile
  if (path === '/auth/profile' && method === 'GET') {
    const saved = localStorage.getItem('user');
    const u = saved ? JSON.parse(saved) : db.users[1];
    return { success: true, user: u };
  }

  // 11. PUT /auth/profile
  if (path === '/auth/profile' && method === 'PUT') {
    const saved = localStorage.getItem('user');
    const currentUser = saved ? JSON.parse(saved) : db.users[1];
    const idx = db.users.findIndex((u) => u._id === currentUser._id);
    const updated = { ...currentUser, ...body };
    if (idx > -1) {
      db.users[idx] = updated;
      saveDB(db);
    }
    return { success: true, user: updated, token: 'mock_jwt_token_' + updated._id };
  }

  // 12. GET /cart
  if (path === '/cart' && method === 'GET') {
    const savedGuest = localStorage.getItem('guest_cart');
    const items = savedGuest ? JSON.parse(savedGuest) : [];
    return {
      success: true,
      cart: {
        items: items.map((i) => ({
          product: {
            _id: i.product,
            name: i.name,
            price: i.price,
            image: i.image,
            stock: i.stock,
            category: i.category,
          },
          quantity: i.quantity,
          price: i.price,
        })),
      },
    };
  }

  // 13. POST /orders
  if (path === '/orders' && method === 'POST') {
    const { orderItems, shippingAddress, paymentMethod } = body;
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of orderItems) {
      const prod = db.products.find((p) => p._id === item.product);
      if (prod) {
        if (prod.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${prod.name}`);
        }
        prod.stock -= item.quantity;
        verifiedItems.push({
          product: prod._id,
          name: prod.name,
          image: prod.image,
          price: prod.price,
          quantity: item.quantity,
        });
        subtotal += prod.price * item.quantity;
      }
    }

    const shippingPrice = subtotal >= 50 ? 0 : 10;
    const taxPrice = Number((subtotal * 0.05).toFixed(2));
    const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2));

    const newOrder = {
      _id: 'ord_' + Date.now(),
      user: '674e01a1e0b12a0022220002',
      orderItems: verifiedItems,
      shippingAddress,
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
          timestamp: new Date().toISOString(),
          note: 'Order placed successfully with Cash on Delivery.',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    saveDB(db);
    return { success: true, order: newOrder };
  }

  // 14. GET /orders/my-orders
  if (path === '/orders/my-orders' && method === 'GET') {
    return { success: true, orders: db.orders };
  }

  // 15. GET /orders/:id
  const orderMatch = path.match(/^\/orders\/([^/]+)$/);
  if (orderMatch && method === 'GET') {
    const ordId = orderMatch[1];
    const ord = db.orders.find((o) => o._id === ordId);
    if (!ord) throw new Error('Order not found');
    return { success: true, order: ord };
  }

  // 16. GET /orders (Admin all)
  if (path === '/orders' && method === 'GET') {
    return { success: true, orders: db.orders };
  }

  // 17. PUT /orders/:id/status (Admin status update)
  const orderStatusMatch = path.match(/^\/orders\/([^/]+)\/status$/);
  if (orderStatusMatch && method === 'PUT') {
    const ordId = orderStatusMatch[1];
    const ord = db.orders.find((o) => o._id === ordId);
    if (!ord) throw new Error('Order not found');
    ord.status = body.status;
    if (body.status === 'Delivered') {
      ord.isPaid = true;
      ord.paidAt = new Date().toISOString();
    }
    ord.statusHistory.push({
      status: body.status,
      timestamp: new Date().toISOString(),
      note: body.note || `Status updated to ${body.status} by administrator`,
    });
    saveDB(db);
    return { success: true, order: ord };
  }

  // 18. GET /admin/stats
  if (path === '/admin/stats' && method === 'GET') {
    const totalSales = db.orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const statusCounts = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    db.orders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) statusCounts[o.status]++;
    });

    return {
      success: true,
      stats: {
        totalProducts: db.products.length,
        totalCustomers: db.users.filter((u) => u.role === 'customer').length,
        totalOrders: db.orders.length,
        totalSales: Number(totalSales.toFixed(2)),
        statusCounts,
        recentOrders: db.orders.slice(0, 6),
      },
    };
  }

  // 19. GET /admin/users
  if (path === '/admin/users' && method === 'GET') {
    return { success: true, users: db.users };
  }

  // 20. PUT /admin/users/:id/role
  const userRoleMatch = path.match(/^\/admin\/users\/([^/]+)\/role$/);
  if (userRoleMatch && method === 'PUT') {
    const uId = userRoleMatch[1];
    const u = db.users.find((usr) => usr._id === uId);
    if (!u) throw new Error('User not found');
    u.role = body.role;
    saveDB(db);
    return { success: true, user: u };
  }

  // Health check
  if (path === '/health') {
    return { status: 'online', environment: 'production-resilient' };
  }

  return { success: true };
};
