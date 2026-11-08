import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import apiRequest from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest(`/products/${id}`);
        if (data.success && data.product) {
          setProduct(data.product);
          setQuantity(1);

          // Fetch related products in the same category
          const related = await apiRequest(
            `/products?category=${encodeURIComponent(data.product.category)}`
          );
          if (related.success && related.products) {
            setRelatedProducts(
              related.products.filter((p) => p._id !== data.product._id).slice(0, 4)
            );
          }
        }
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      showToast(`Only ${product.stock} units available in stock`, 'error');
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    await addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    if (!product || product.stock <= 0) return;
    const added = await addToCart(product, quantity);
    if (added) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 w-full animate-pulse space-y-8">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-24 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Unavailable</h2>
        <p className="text-xs text-slate-500">
          The product you are looking for does not exist or has been removed from our catalog.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-emerald-600">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/products" className="hover:text-emerald-600">
          Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-emerald-600"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {product.category}
            </span>
            {isOutOfStock && (
              <span className="absolute top-4 right-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {product.brand || 'LuxeStore Exclusive'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-snug">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-4">
              <RatingStars
                rating={product.rating}
                numReviews={product.numReviews}
                size="md"
              />
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                SKU: {product._id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium">USD (Tax incl.)</span>
              </div>
            </div>

            {/* Stock indicator badge */}
            <div>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" /> Only {product.stock} units left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  Max available: {product.stock}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full sm:flex-1 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'Sold Out' : 'Add to Shopping Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full sm:flex-1 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-98"
              >
                Buy Now (Cash on Delivery)
              </button>
            </div>
          </div>

          {/* Delivery & Assurance Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free Express Delivery on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cash on Delivery (Pay at Doorstep)</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Guaranteed Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-slate-200">
          <div className="mb-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              You Might Also Like
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Related Items in {product.category}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
