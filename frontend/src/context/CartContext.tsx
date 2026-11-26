import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { CartItem, PromoCode } from '../types/cart';
import type { Product } from '../types/product';
import type { OrderConfirmation } from '../types/checkout';
import { AVAILABLE_PROMOS } from '../data/products';
import { useToast } from './ToastContext';

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  activePromo: PromoCode | null;
  shippingThreshold: number;
  freeShippingQualified: boolean;
  amountNeededForFreeShipping: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isFullCartOpen: boolean;
  setIsFullCartOpen: (open: boolean) => void;
  currentView: 'shop' | 'checkout' | 'success' | 'auth' | 'account';
  setCurrentView: (view: 'shop' | 'checkout' | 'success' | 'auth' | 'account') => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  lastOrder: OrderConfirmation | null;
  setLastOrder: (order: OrderConfirmation | null) => void;
  currency: string;
  addItem: (product: Product, quantity?: number, selectedColor?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 300; // $300 CAD for free shipping

const CART_STORAGE_KEY = 'copenhagen_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // Load user's actual cart from localStorage (starts empty [] if new visitor)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage restriction
    }
    return [];
  });

  // Sync cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const navigate = useNavigate();
  const location = useLocation();

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isFullCartOpen, setIsFullCartOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'shop' | 'checkout' | 'success' | 'auth' | 'account'>('shop');

  // Synchronize URL changes to currentView state
  useEffect(() => {
    const path = location.pathname;
    if (path === '/checkout') setCurrentView('checkout');
    else if (path === '/auth' || path === '/login' || path === '/register') setCurrentView('auth');
    else if (path === '/account') setCurrentView('account');
    else if (path === '/success') setCurrentView('success');
    else setCurrentView('shop');
  }, [location.pathname]);

  const handleSetCurrentView = (view: 'shop' | 'checkout' | 'success' | 'auth' | 'account') => {
    setCurrentView(view);
    const viewToPath = {
      shop: '/shop',
      checkout: '/checkout',
      auth: '/auth',
      account: '/account',
      success: '/success',
    };
    navigate(viewToPath[view] || '/');
  };

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [lastOrder, setLastOrder] = useState<OrderConfirmation | null>(null);
  const currency = 'CAD $';

  // Calculations: Bag counter shows unique products count
  const itemCount = useMemo(() => {
    const uniqueProductIds = new Set(cartItems.map((item) => item.product.id));
    return uniqueProductIds.size;
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!activePromo) return 0;
    return (subtotal * activePromo.discountPercentage) / 100;
  }, [subtotal, activePromo]);

  const freeShippingQualified = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const addItem = (product: Product, quantity = 1, selectedColor?: string) => {
    const color = selectedColor || product.colors?.[0]?.name || 'Standard';
    const itemId = `${product.id}-${color}`;

    const maxStock = product.stock !== undefined ? product.stock : (product.inStock ? 10 : 0);

    // 1. Guard against adding sold out items
    if (maxStock <= 0) {
      showToast(`"${product.name}" is currently out of stock`, 'error');
      return;
    }

    const existingItem = cartItems.find((item) => item.id === itemId);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;

    // 2. Guard against exceeding available stock
    if (currentQtyInCart + quantity > maxStock) {
      const allowedToAdd = maxStock - currentQtyInCart;
      if (allowedToAdd <= 0) {
        showToast(`Cannot add more. Maximum available stock (${maxStock}) is already in your bag.`, 'error');
        setIsCartOpen(true);
        return;
      }
      showToast(`Only ${maxStock} units of "${product.name}" exist in inventory. Added remaining ${allowedToAdd}.`, 'info');
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: maxStock } : item
        )
      );
      setIsCartOpen(true);
      return;
    }

    console.log(`[CART: ADD_ITEM] Adding "${product.name}" | Qty: ${quantity} | Color: ${color} | Stock: ${maxStock}`);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, quantity, selectedColor: color }];
    });

    showToast(`${product.name} added to cart`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    const target = cartItems.find((i) => i.id === itemId);
    if (!target) return;

    const maxStock = target.product.stock !== undefined ? target.product.stock : 10;

    if (quantity > maxStock) {
      showToast(`Only ${maxStock} units of "${target.product.name}" are available in stock.`, 'error');
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: maxStock } : item))
      );
      return;
    }

    console.log(`[CART: UPDATE_QTY] ItemId: ${itemId} | New Qty: ${quantity} / Stock: ${maxStock}`);
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (itemId: string) => {
    const target = cartItems.find((i) => i.id === itemId);
    console.log(`[CART: REMOVE_ITEM] ItemId: ${itemId} | Name: ${target?.product.name}`);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    if (target) {
      showToast(`${target.product.name} removed`, 'info');
    }
  };

  const clearCart = () => {
    console.log(`[CART: CLEAR] Cart emptied`);
    setCartItems([]);
  };

  const applyPromo = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    const found = AVAILABLE_PROMOS.find((p) => p.code === trimmed);
    if (found) {
      setActivePromo(found);
      showToast(`Promo ${found.code} applied (${found.discountPercentage}% off)`, 'success');
      return true;
    }
    showToast('Invalid promotion code. Try COPEN10 or OLIVE', 'error');
    return false;
  };

  const removePromo = () => {
    setActivePromo(null);
    showToast('Promotion code removed', 'info');
  };

  // Keep screen view aligned: scroll to top when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        discountAmount,
        activePromo,
        shippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingQualified,
        amountNeededForFreeShipping,
        isCartOpen,
        setIsCartOpen,
        isFullCartOpen,
        setIsFullCartOpen,
        currentView,
        setCurrentView: handleSetCurrentView,
        quickViewProduct,
        setQuickViewProduct,
        lastOrder,
        setLastOrder,
        currency,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyPromo,
        removePromo,
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

