import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const {
    cartItems,
    itemCount,
    subtotal,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't added any products to your cart yet. Explore our store and discover premium items.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
        >
          <ShoppingBag className="w-4 h-4" /> Start Shopping Now
        </Link>
      </div>
    );
  }

  const freeShippingThreshold = 50;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            You have <strong className="text-slate-900">{itemCount}</strong> items in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Tracker Bar */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-emerald-900 font-semibold mb-2">
                Add <strong className="text-emerald-700">${amountNeededForFreeShipping.toFixed(2)}</strong> more to unlock <span className="underline">FREE Express Delivery</span>!
              </p>
            ) : (
              <p className="text-emerald-900 font-bold mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                Congratulations! Your order qualifies for FREE Express Delivery.
              </p>
            )}
            <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Items Container */}
          <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {cartItems.map((item) => {
              const itemTotal = (item.price * item.quantity).toFixed(2);
              return (
                <div
                  key={item.product}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Link
                      to={`/product/${item.product}`}
                      className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="space-y-1">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs text-slate-400 block">
                        Unit Price: ${item.price.toFixed(2)}
                      </span>
                      {item.quantity >= item.stock && (
                        <span className="text-[11px] font-semibold text-amber-600 block">
                          Max available stock reached
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls & Item Total */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 sm:w-10 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-extrabold text-slate-900">
                        ${itemTotal}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/products"
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">
                Estimated Shipping
                {shippingPrice === 0 && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    FREE
                  </span>
                )}
              </span>
              <span className="font-semibold text-slate-900">
                {shippingPrice === 0 ? '$0.00' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Estimated Tax (5%)</span>
              <span className="font-semibold text-slate-900">${taxPrice.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-900">Final Order Total</span>
              <span className="font-black text-lg text-emerald-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Notice */}
          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Cash on Delivery Guarantee
            </p>
            <p>
              Inspect and pay for your merchandise upon delivery at your doorstep. Zero prepayment risk.
            </p>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-600/20 transition-all active:scale-98"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
