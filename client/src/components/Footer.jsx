import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Heart,
  Send,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you for subscribing to LuxeStore updates!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      {/* Value Proposition Highlights Banner */}
      <div className="border-b border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Free Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">Complimentary for orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Cash on Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">Pay safely at your doorstep</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">30-day money-back guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">100% Genuine Items</h4>
                <p className="text-xs text-slate-400 mt-0.5">Directly sourced & certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Luxe<span className="text-emerald-500">Store</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Discover a curated collection of premium electronics, contemporary fashion, ergonomic living furniture, and refined accessories designed to elevate your lifestyle.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100 Commerce Plaza, Financial District, CA 94105</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+1 (800) 555-LUXE (Mon - Sat, 9am - 8pm EST)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@luxestore.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wide mb-4">Shop Categories</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-emerald-400 transition-colors">
                  Electronics & Audio
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fashion%20%26%20Apparel" className="hover:text-emerald-400 transition-colors">
                  Fashion & Streetwear
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home%20%26%20Living" className="hover:text-emerald-400 transition-colors">
                  Home & Living Decor
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories%20%26%20Gadgets" className="hover:text-emerald-400 transition-colors">
                  Accessories & Gear
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-emerald-400 transition-colors">
                  View Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wide mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/orders" className="hover:text-emerald-400 transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">
                  View Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-400 transition-colors">
                  My Profile & Address
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Shipping & Delivery Policy</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Privacy & Terms</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wide mb-4">Stay Connected</h5>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get exclusive discount codes and new product releases directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LuxeStore E-Commerce Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with modern React, Node.js & MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
