import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  X,
  Save,
  DollarSign,
  BarChart3,
  Layers,
} from 'lucide-react';
import apiRequest from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'customers'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: '',
    stock: 10,
    brand: 'LuxeStore',
    rating: 4.8,
    featured: false,
  });

  // Order inspection modal state
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Security guard: check admin rights
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      showToast('Access restricted: Administrator rights required.', 'error');
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate, showToast]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, usersRes] = await Promise.all([
        apiRequest('/admin/stats'),
        apiRequest('/products?sort=newest'),
        apiRequest('/orders'),
        apiRequest('/admin/users'),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (productsRes.success) setProducts(productsRes.products);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (usersRes.success) setCustomers(usersRes.users);
    } catch (err) {
      showToast(err.message || 'Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  // Handle Product Add/Edit
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      image: '',
      stock: 10,
      brand: 'LuxeStore',
      rating: 4.8,
      featured: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category,
      image: prod.image,
      stock: prod.stock,
      brand: prod.brand || 'LuxeStore',
      rating: prod.rating || 4.8,
      featured: prod.featured || false,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await apiRequest(`/products/${editingProduct._id}`, {
          method: 'PUT',
          body: JSON.stringify(productForm),
        });
        showToast('Product updated successfully', 'success');
      } else {
        await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(productForm),
        });
        showToast('Product added successfully', 'success');
      }
      setIsProductModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }
    try {
      await apiRequest(`/products/${productId}`, { method: 'DELETE' });
      showToast('Product deleted successfully', 'info');
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Error deleting product', 'error');
    }
  };

  // Handle Order Status Update
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      showToast(`Order status updated to ${newStatus}`, 'success');
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // Handle User Role Toggle
  const handleToggleUserRole = async (userId, currentRole) => {
    const targetRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      await apiRequest(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: targetRole }),
      });
      showToast(`User role updated to ${targetRole}`, 'success');
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to update user role', 'error');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-100 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Operations Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Store management, inventory control, and real-time customer order updates.
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'products'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'customers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customers ({customers.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-200 mx-auto"></div>
          <p className="text-xs text-slate-400">Loading admin operations metrics...</p>
        </div>
      ) : (
        <>
          {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Top 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Total Revenue
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      ${stats?.totalSales?.toFixed(2) || '0.00'}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
                      Active Store Volume
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Total Orders
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {stats?.totalOrders || 0}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600 mt-0.5 block">
                      {stats?.statusCounts?.Pending || 0} pending review
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Active Products
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {stats?.totalProducts || 0}
                    </span>
                    <span className="text-[11px] font-semibold text-purple-600 mt-0.5 block">
                      In Catalog
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Registered Customers
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {stats?.totalCustomers || 0}
                    </span>
                    <span className="text-[11px] font-semibold text-teal-600 mt-0.5 block">
                      Verified Shoppers
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Order Status Distribution Progress Bars */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    Fulfillment Status Breakdown
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    Total: {stats?.totalOrders || 0} Orders
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(stats?.statusCounts || {}).map(([st, cnt]) => (
                    <div key={st} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                      <StatusBadge status={st} size="sm" />
                      <p className="text-xl font-black text-slate-900 mt-2">{cnt}</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {stats?.totalOrders > 0
                          ? `${Math.round((cnt / stats.totalOrders) * 100)}% of orders`
                          : '0%'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-slate-900">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(stats?.recentOrders || []).map((ord) => (
                        <tr key={ord._id} className="hover:bg-slate-50/60">
                          <td className="py-3 font-mono font-bold text-slate-900">
                            #{ord._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="py-3">
                            <span className="font-semibold text-slate-900 block">
                              {ord.shippingAddress?.fullName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {ord.shippingAddress?.email}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 font-bold text-slate-900">
                            ${ord.totalPrice.toFixed(2)}
                          </td>
                          <td className="py-3">
                            <StatusBadge status={ord.status} size="sm" />
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PRODUCTS MANAGEMENT ================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Product Inventory</h2>
                  <p className="text-xs text-slate-500">
                    Add, edit pricing, update stock levels, and delete products in the database.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                        <th className="p-4">Item</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4 text-right">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div className="max-w-xs">
                              <span className="font-bold text-slate-900 line-clamp-1 block">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                Brand: {p.brand || 'LuxeStore'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-900">
                            ${p.price.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`font-bold ${
                                p.stock <= 0
                                  ? 'text-rose-600'
                                  : p.stock <= 5
                                  ? 'text-amber-600'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {p.stock} units
                            </span>
                          </td>
                          <td className="p-4 text-slate-700 font-semibold">
                            ★ {p.rating?.toFixed(1) || '4.8'}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id, p.name)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: ORDER MANAGEMENT ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Customer Orders</h2>
                <p className="text-xs text-slate-500">
                  Update order status from Pending to Confirmed, Processing, Shipped, or Delivered.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Current Status</th>
                        <th className="p-4">Update Status</th>
                        <th className="p-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((ord) => (
                        <tr key={ord._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-900">
                            #{ord._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-900 block">
                              {ord.shippingAddress?.fullName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {ord.shippingAddress?.phone}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            {ord.orderItems?.length} items
                          </td>
                          <td className="p-4 font-bold text-slate-900">
                            ${ord.totalPrice.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <StatusBadge status={ord.status} size="sm" />
                          </td>
                          <td className="p-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                              className="p-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: CUSTOMERS MANAGEMENT ================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Registered Users & Roles</h2>
                <p className="text-xs text-slate-500">
                  View registered shoppers and assign administrative authorization.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Address</th>
                        <th className="p-4">Joined Date</th>
                        <th className="p-4 text-right">Role Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customers.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                              {c.name?.charAt(0).toUpperCase()}
                            </div>
                            {c.name}
                          </td>
                          <td className="p-4 text-slate-600">{c.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                                c.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {c.role}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500">{c.phone || '—'}</td>
                          <td className="p-4 text-slate-500 max-w-xs truncate">
                            {c.city ? `${c.city}, ${c.postalCode}` : '—'}
                          </td>
                          <td className="p-4 text-slate-500">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleToggleUserRole(c._id, c.role)}
                              disabled={c._id === user?._id}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Make {c.role === 'admin' ? 'Customer' : 'Admin'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony Wireless Noise Canceling Headphones"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="299.99"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Stock Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="25"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Accessories & Gadgets">Accessories & Gadgets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sony / Apple / LuxeStore"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Image URL (Unsplash or direct image URL) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                  {productForm.image && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={productForm.image}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                      <span className="text-[11px] text-slate-400">Live image preview</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detailed specs, features, and warranty details..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                    />
                    <span>Highlight as Featured on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ORDER INSPECTION ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </h3>
                <span className="text-[11px] text-slate-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <p className="font-bold text-slate-900">
                {selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.phone})
              </p>
              <p className="text-slate-600">
                {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city} -{' '}
                {selectedOrder.shippingAddress?.postalCode}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Ordered Items</h4>
              {selectedOrder.orderItems?.map((i, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <img src={i.image} alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="font-medium text-slate-800 line-clamp-1">{i.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900 shrink-0">
                    {i.quantity} × ${i.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Status change select */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Update Status:</label>
              <div className="flex gap-2">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    handleOrderStatusChange(selectedOrder._id, e.target.value);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value });
                  }}
                  className="flex-1 p-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Order Total</span>
              <span className="text-emerald-600">${selectedOrder.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
