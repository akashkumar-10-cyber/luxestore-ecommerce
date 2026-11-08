import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiRequest from '../utils/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('guest_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sync with backend if user is logged in
  const fetchBackendCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await apiRequest('/cart');
      if (data.success && data.cart) {
        const formatted = data.cart.items.map((item) => ({
          product: item.product._id || item.product,
          name: item.product.name || item.name || 'Product',
          price: item.product.price !== undefined ? item.product.price : item.price,
          image: item.product.image || item.image || '',
          stock: item.product.stock !== undefined ? item.product.stock : 99,
          category: item.product.category || '',
          quantity: item.quantity,
        }));
        setCartItems(formatted);
      }
    } catch (err) {
      console.warn('Could not fetch backend cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
    } else {
      const saved = localStorage.getItem('guest_cart');
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  }, [isAuthenticated, fetchBackendCart]);

  // Persist guest cart
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    const availableStock = product.stock !== undefined ? product.stock : 99;
    const existing = cartItems.find((i) => i.product === product._id);
    const currentQty = existing ? existing.quantity : 0;
    const targetQty = currentQty + quantity;

    if (targetQty > availableStock) {
      showToast(`Only ${availableStock} units available in stock`, 'error');
      return false;
    }

    if (isAuthenticated) {
      try {
        await apiRequest('/cart/add', {
          method: 'POST',
          body: JSON.stringify({ productId: product._id, quantity }),
        });
        await fetchBackendCart();
        showToast(`Added "${product.name}" to cart`, 'success');
        return true;
      } catch (err) {
        showToast(err.message, 'error');
        return false;
      }
    } else {
      // Local state for guest
      setCartItems((prev) => {
        const index = prev.findIndex((i) => i.product === product._id);
        if (index > -1) {
          const updated = [...prev];
          updated[index].quantity += quantity;
          return updated;
        } else {
          return [
            ...prev,
            {
              product: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              stock: product.stock,
              category: product.category,
              quantity,
            },
          ];
        }
      });
      showToast(`Added "${product.name}" to cart`, 'success');
      return true;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const item = cartItems.find((i) => i.product === productId);
    if (!item) return;

    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (quantity > item.stock) {
      showToast(`Maximum available stock reached (${item.stock})`, 'error');
      return;
    }

    if (isAuthenticated) {
      try {
        await apiRequest('/cart/update', {
          method: 'PUT',
          body: JSON.stringify({ productId, quantity }),
        });
        await fetchBackendCart();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.product === productId ? { ...i, quantity } : i))
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        await apiRequest(`/cart/remove/${productId}`, { method: 'DELETE' });
        await fetchBackendCart();
        showToast('Item removed from cart', 'info');
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setCartItems((prev) => prev.filter((i) => i.product !== productId));
      showToast('Item removed from cart', 'info');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await apiRequest('/cart/clear', { method: 'DELETE' });
      } catch (err) {
        console.warn('Error clearing cart on server:', err.message);
      }
    }
    setCartItems([]);
    localStorage.removeItem('guest_cart');
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );
  const shippingPrice = subtotal >= 50 || subtotal === 0 ? 0 : 10;
  const taxPrice = Number((subtotal * 0.05).toFixed(2));
  const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        shippingPrice,
        taxPrice,
        totalPrice,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchBackendCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
