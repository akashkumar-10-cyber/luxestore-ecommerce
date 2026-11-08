import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import RatingStars from './RatingStars';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden">
      {/* Product Image & Badges */}
      <Link to={`/product/${product._id}`} className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            Sold Out
          </span>
        ) : isLowStock ? (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse">
            Only {product.stock} Left
          </span>
        ) : null}

        {/* Quick View Overlay on hover */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <span className="bg-white text-slate-900 p-2.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110">
            <Eye className="w-5 h-5" />
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-2">
          <RatingStars rating={product.rating} numReviews={product.numReviews} />
        </div>

        <Link
          to={`/product/${product._id}`}
          className="text-base font-semibold text-slate-900 line-clamp-1 hover:text-emerald-600 transition-colors"
          title={product.name}
        >
          {product.name}
        </Link>

        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-slate-900 hover:bg-emerald-600 text-white hover:shadow-md active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
