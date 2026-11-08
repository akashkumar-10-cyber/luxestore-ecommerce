require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const sampleCategories = [
  {
    name: 'Electronics',
    description: 'Cutting-edge gadgets, audio gear, and personal devices for everyday tech enthusiasts.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  },
  {
    name: 'Fashion & Apparel',
    description: 'Timeless apparel, premium fabrics, and curated streetwear essentials.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
  },
  {
    name: 'Home & Living',
    description: 'Modern lifestyle, aesthetic home decor, and ergonomic work-from-home comfort.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  },
  {
    name: 'Accessories & Gadgets',
    description: 'Functional, sleek accessories that elevate your productivity and everyday carry.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  },
];

const sampleProducts = [
  // Electronics
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },

  // Fashion & Apparel
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },

  // Home & Living
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },

  // Accessories & Gadgets
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';
    console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully for seeding.');

    // 1. Clear existing products and categories
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing products and categories.');

    // 2. Insert Categories
    await Category.insertMany(sampleCategories);
    console.log(`Seeded ${sampleCategories.length} categories.`);

    // 3. Insert Products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${createdProducts.length} realistic products.`);

    // 4. Ensure Admin User exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@luxestore.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const existingAdmin = await User.findOne({ email: adminEmail });

    let adminUser;
    if (!existingAdmin) {
      adminUser = await User.create({
        name: 'Store Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '+1 (555) 019-2834',
        address: '100 Infinite Loop, Suite 400',
        city: 'Cupertino',
        postalCode: '95014',
      });
      console.log(`Created default Admin user: ${adminEmail}`);
    } else {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      adminUser = existingAdmin;
      console.log(`Existing Admin user confirmed: ${adminEmail}`);
    }

    // 5. Ensure Customer User exists
    const customerEmail = 'customer@luxestore.com';
    const existingCustomer = await User.findOne({ email: customerEmail });

    let customerUser;
    if (!existingCustomer) {
      customerUser = await User.create({
        name: 'Sarah Jenkins',
        email: customerEmail,
        password: 'Customer@123456',
        role: 'customer',
        phone: '+1 (555) 349-8812',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        postalCode: '97477',
      });
      console.log(`Created default Demo Customer user: ${customerEmail}`);
    } else {
      customerUser = existingCustomer;
    }

    // 6. Create sample orders for realistic dashboard reporting
    const existingOrders = await Order.countDocuments();
    if (existingOrders === 0 && customerUser && createdProducts.length >= 4) {
      await Order.create([
        {
          user: customerUser._id,
          orderItems: [
            {
              product: createdProducts[0]._id,
              name: createdProducts[0].name,
              image: createdProducts[0].image,
              price: createdProducts[0].price,
              quantity: 1,
            },
            {
              product: createdProducts[1]._id,
              name: createdProducts[1].name,
              image: createdProducts[1].image,
              price: createdProducts[1].price,
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
          subtotal: createdProducts[0].price + createdProducts[1].price,
          shippingPrice: 0,
          taxPrice: Number(((createdProducts[0].price + createdProducts[1].price) * 0.05).toFixed(2)),
          totalPrice: Number(((createdProducts[0].price + createdProducts[1].price) * 1.05).toFixed(2)),
          isPaid: true,
          paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'Delivered',
          statusHistory: [
            { status: 'Pending', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), note: 'Order placed' },
            { status: 'Confirmed', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), note: 'Payment verified' },
            { status: 'Shipped', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Carrier tracking #FX-884920' },
            { status: 'Delivered', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Package delivered to recipient' },
          ],
        },
        {
          user: customerUser._id,
          orderItems: [
            {
              product: createdProducts[4]._id,
              name: createdProducts[4].name,
              image: createdProducts[4].image,
              price: createdProducts[4].price,
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
          subtotal: createdProducts[4].price,
          shippingPrice: 0,
          taxPrice: Number((createdProducts[4].price * 0.05).toFixed(2)),
          totalPrice: Number((createdProducts[4].price * 1.05).toFixed(2)),
          isPaid: false,
          status: 'Processing',
          statusHistory: [
            { status: 'Pending', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Order placed' },
            { status: 'Confirmed', timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), note: 'Order confirmed' },
            { status: 'Processing', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), note: 'Fulfillment in progress' },
          ],
        },
      ]);
      console.log('Seeded sample orders for dashboard statistics.');
    }

    console.log('\n=========================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Admin Account:    admin@luxestore.com / Admin@123456');
    console.log('Customer Account: customer@luxestore.com / Customer@123456');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
