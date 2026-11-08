import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, ShoppingBag } from 'lucide-react';
import apiRequest from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiRequest('/orders/my-orders');
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching my orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to track orders</h2>
        <p className="text-xs text-slate-500">
          Please log in to your account to view your past purchases and track real-time delivery status.
        </p>
        <Link
          to="/login?redirect=orders"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="h-32 bg-slate-200 rounded-2xl"></div>
        <div className="h-32 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Package className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">No Orders Placed Yet</h2>
          <p className="text-xs text-slate-500">
            You haven't made any purchases yet. Your orders and delivery milestones will appear here.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-500 transition-all hover:scale-105"
        >
          <ShoppingBag className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Order History
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track and view status updates for your purchases.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-black text-slate-900">
                  Order #{order._id.slice(-8).toUpperCase()}
                </span>
                <StatusBadge status={order.status} />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>
                  {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                </span>
                <span>•</span>
                <span className="font-bold text-slate-900">
                  Total: ${order.totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Items thumbnail preview */}
              <div className="flex items-center gap-2 pt-2">
                {order.orderItems.slice(0, 4).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image}
                    alt={item.name}
                    title={item.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                  />
                ))}
                {order.orderItems.length > 4 && (
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                    +{order.orderItems.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <Link
              to={`/orders/${order._id}`}
              className="w-full md:w-auto px-5 py-2.5 rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0"
            >
              Track Order <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
