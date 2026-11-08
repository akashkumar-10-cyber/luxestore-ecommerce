import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import apiRequest from '../utils/api';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter States
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const sortParam = searchParams.get('sort') || 'newest';
  const inStockParam = searchParams.get('inStock') === 'true';

  const [searchTerm, setSearchTerm] = useState(keywordParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [onlyInStock, setOnlyInStock] = useState(inStockParam);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSearchTerm(searchParams.get('keyword') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedSort(searchParams.get('sort') || 'newest');
    setOnlyInStock(searchParams.get('inStock') === 'true');
  }, [searchParams]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiRequest('/products/categories');
        if (data.success && data.categories) {
          setCategories(['All', ...data.categories]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.set('keyword', searchTerm);
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.set('category', selectedCategory);
        }
        if (selectedSort) queryParams.set('sort', selectedSort);
        if (onlyInStock) queryParams.set('inStock', 'true');

        const data = await apiRequest(`/products?${queryParams.toString()}`);
        if (data.success) {
          setProducts(data.products);
          setTotalCount(data.count);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory, selectedSort, onlyInStock]);

  const updateUrlParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'newest' && value !== false) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    updateUrlParam('category', cat);
  };

  const handleSortChange = (sortVal) => {
    setSelectedSort(sortVal);
    updateUrlParam('sort', sortVal);
  };

  const handleStockToggle = () => {
    const nextVal = !onlyInStock;
    setOnlyInStock(nextVal);
    updateUrlParam('inStock', nextVal ? 'true' : false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParam('keyword', searchTerm);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedSort('newest');
    setOnlyInStock(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedSort !== 'newest' ||
    onlyInStock;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse our wide range of authentic tech, apparel, home decor, and accessories.
          </p>
        </div>

        {/* Search bar inside header */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search within catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-20 py-2 text-xs bg-white border border-slate-200 rounded-full focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-emerald-600 transition-colors"
          >
            Find
          </button>
        </form>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:flex flex-col gap-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Filter & Sort
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Department
            </h4>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-left text-xs py-1.5 px-3 rounded-lg font-medium transition-colors ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Sort By
            </h4>
            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 font-medium select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={handleStockToggle}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Products Grid Content Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Controls Bar for mobile & info */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-slate-500">
              Showing <strong className="text-slate-900">{products.length}</strong> of{' '}
              <strong className="text-slate-900">{totalCount}</strong> items
            </span>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              Filter & Sort
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                  Category: {selectedCategory}
                  <button onClick={() => handleCategoryChange('All')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      updateUrlParam('keyword', '');
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {onlyInStock && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                  In Stock Only
                  <button onClick={handleStockToggle}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-slate-100 rounded-2xl animate-pulse border border-slate-200"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any items matching your active search and filter criteria. Try searching for a different keyword or resetting filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                Filter & Sort
              </h3>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Sort Option
              </label>
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={handleStockToggle}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
