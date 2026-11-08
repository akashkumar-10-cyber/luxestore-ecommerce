import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CheckCheck,
  XCircle,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import apiRequest from '../utils/api';
import StatusBadge from '../components/StatusBadge';

const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`/orders/${id}`);
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="h-40 bg-slate-200 rounded-3xl"></div>
        <div className="h-60 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-500">
          We could not locate this order or you do not have permission to view it.
        </p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> View My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = steps.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
      {/* Back and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/orders"
            className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <StatusBadge status={order.status} size="lg" />
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Visual Step-by-Step Order Tracker */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <h2 className="text-sm font-extrabold text-slate-900">Live Delivery Tracker</h2>

        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
            <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Order Cancelled</p>
              <p className="mt-0.5">
                This order has been cancelled. Any deducted stock has been replenished back to inventory.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Steps bar */}
            <div className="grid grid-cols-5 gap-2 relative">
              {steps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {idx === 0 && <Clock className="w-4 h-4" />}
                      {idx === 1 && <CheckCircle2 className="w-4 h-4" />}
                      {idx === 2 && <Package className="w-4 h-4" />}
                      {idx === 3 && <Truck className="w-4 h-4" />}
                      {idx === 4 && <CheckCheck className="w-4 h-4" />}
                    </div>

                    <span
                      className={`mt-2 text-xs font-semibold block ${
                        isCurrent
                          ? 'text-emerald-700 font-bold'
                          : isPassed
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Connecting Progress Line behind circles */}
            <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-slate-100 -z-0">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Status History Timeline Log */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Status Activity Log
            </h4>
            <div className="space-y-3">
              {order.statusHistory.map((hist, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{hist.status}</span>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(hist.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {hist.note && <p className="text-slate-500 mt-0.5">{hist.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Details & Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ordered Items List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Items Ordered ({order.orderItems.length})
          </h3>

          <div className="divide-y divide-slate-100">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Quantity: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info: Shipping & Payment Summary */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Delivery Destination
            </h3>
            <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
            <p className="text-slate-600 leading-relaxed">
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-500">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {order.shippingAddress.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {order.shippingAddress.email}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Payment Summary
            </h3>
            <div className="flex justify-between text-slate-600">
              <span>Method</span>
              <span className="font-bold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Status</span>
              <span
                className={`font-bold ${
                  order.isPaid ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {order.isPaid
                  ? `Paid (${new Date(order.paidAt).toLocaleDateString()})`
                  : 'Pending Doorstep Collection'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (5%)</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-600">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
