import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import apiRequest from '../utils/api';

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, subtotal, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill user profile info if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        postalCode: user.postalCode || prev.postalCode,
      }));
    }
  }, [user]);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isAuthenticated) {
      showToast('Please sign in or create an account to finalize your order.', 'info');
      navigate('/login?redirect=checkout');
      return;
    }

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode
    ) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email || user.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        paymentMethod,
      };

      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      if (res.success && res.order) {
        showToast('Your order has been placed successfully!', 'success');
        await clearCart();
        navigate(`/orders/${res.order._id}`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
      showToast(err.message || 'Error creating order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Checkout & Shipping
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review your delivery details and choose your payment method.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Already have an account? Sign in for saved addresses and fast 1-click checkout.
            </span>
          </div>
          <Link
            to="/login?redirect=checkout"
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-xs shrink-0"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Delivery Form & Payment Choice */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Truck className="w-4 h-4 text-emerald-600" />
              1. Delivery Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address & House / Apartment *
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  placeholder="e.g. Springfield"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Postal Code / ZIP *
                </label>
                <input
                  type="text"
                  required
                  name="postalCode"
                  placeholder="e.g. 97477"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              2. Payment Selection
            </h3>

            <div className="space-y-3">
              {/* Cash on Delivery option (Default & Active) */}
              <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/40 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      Cash on Delivery (COD)
                    </span>
                    <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Pay safely with cash or mobile UPI directly to the courier upon parcel delivery. No card info required upfront.
                  </p>
                </div>
              </label>

              {/* Online Gateway Info Pill (Future expansion) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-60 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Credit / Debit Card & NetBanking</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Integration Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
          <h3 className="text-sm font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Order Review ({cartItems.length} items)
          </h3>

          {/* Quick Item List */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center gap-3 text-xs">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                  <p className="text-slate-400">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (5%)</span>
              <span className="font-semibold text-slate-900">${taxPrice.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm">
              <span className="font-bold text-slate-900">Total Due on Delivery</span>
              <span className="font-black text-lg text-emerald-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-98"
          >
            {isSubmitting ? (
              <span>Placing Your Order...</span>
            ) : (
              <>
                <span>Confirm & Place Order (COD)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            By placing your order, you agree to LuxeStore's terms of sale and privacy policy.
          </p>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
