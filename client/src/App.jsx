import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

// 404 Not Found Page Component
const NotFoundPage = () => (
  <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
    <h1 className="text-6xl font-black text-slate-300">404</h1>
    <h2 className="text-xl font-bold text-slate-900">Page Not Found</h2>
    <p className="text-xs text-slate-500">
      The requested page could not be found. Please check the URL or return to our homepage.
    </p>
    <Link
      to="/"
      className="inline-block px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-md"
    >
      Return Home
    </Link>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
              <Navbar />
              <main className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrderDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
