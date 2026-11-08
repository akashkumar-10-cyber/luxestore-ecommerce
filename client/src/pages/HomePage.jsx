import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import apiRequest from '../utils/api';

const categoriesData = [
  {
    name: 'Electronics',
    desc: 'Audio gear, smartwatches & cameras',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    slug: 'Electronics',
  },
  {
    name: 'Fashion & Apparel',
    desc: 'Leather jackets, sneakers & apparel',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
    slug: 'Fashion %26 Apparel',
  },
  {
    name: 'Home & Living',
    desc: 'Ergonomic furniture & luxury decor',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    slug: 'Home %26 Living',
  },
  {
    name: 'Accessories & Gadgets',
    desc: 'Mechanical keyboards & everyday carry',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    slug: 'Accessories %26 Gadgets',
  },
];

const testimonials = [
  {
    name: 'Elena Rostova',
    role: 'Verified Buyer',
    comment: 'The Sony headphones arrived within 2 days! Packaging was pristine, and Cash on Delivery made the transaction completely effortless.',
    rating: 5,
  },
  {
    name: 'Marcus Vance',
    role: 'Interior Designer',
    comment: 'The ergonomic executive task chair and ceramic vase set completely upgraded my home studio. Build quality is top tier.',
    rating: 5,
  },
  {
    name: 'Sophia Patel',
    role: 'Tech Lead',
    comment: 'Exceptional shopping experience. Being able to track order status live in real-time from Pending to Delivered is fantastic!',
    rating: 5,
  },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await apiRequest('/products/featured');
        if (data.success && data.products) {
          setFeaturedProducts(data.products);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white py-16 sm:py-24">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Headlines */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modern Living & Everyday Essentials</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
                Redefine Your Everyday Style & Comfort.
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Explore an exclusive catalog of world-class audio gear, Italian leather fashion, artisanal homeware, and sleek desk accessories.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explore Catalog
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/products?category=Electronics"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 backdrop-blur-md flex items-center justify-center gap-2 transition-all"
                >
                  Trending Tech Deals
                </Link>
              </div>

              {/* Trust Badges Minimal */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-slate-400">Authentic Goods</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white">COD</p>
                  <p className="text-xs text-slate-400">Doorstep Payment</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white">30-Day</p>
                  <p className="text-xs text-slate-400">Easy Returns</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=85"
                  alt="Sony WH-1000XM5 Headset"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <span className="bg-emerald-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full w-max mb-2">
                    FEATURED SPOTLIGHT
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Sony WH-1000XM5 Noise Canceling
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm">
                    Flagship noise canceling headset with 30-hour battery life and custom audio engineering.
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-400">$349.99</span>
                    <Link
                      to="/products"
                      className="text-xs font-semibold text-white underline hover:text-emerald-400"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Browse by Department
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Curated Collections
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Browse All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesData.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent flex flex-col justify-end p-5">
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{cat.desc}</p>
                <span className="mt-2 inline-flex items-center text-xs font-semibold text-emerald-400 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Handpicked For You
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600"
          >
            View all {featuredProducts.length > 0 ? `${featuredProducts.length}+ products` : 'items'}{' '}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-80 bg-slate-100 rounded-2xl animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No featured products currently available.</p>
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-full border border-emerald-500/30">
              SPECIAL PROMOTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Enjoy Free Shipping On All Orders Over $50
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Experience prompt doorstep delivery with Cash on Delivery option available. No upfront credit card required.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 shadow-lg transition-transform hover:scale-105"
              >
                Start Shopping Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials & Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Customer Satisfaction
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Loved By Thousands of Shoppers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{test.comment}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">{test.name}</h4>
                <p className="text-[11px] text-emerald-600 font-medium">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
