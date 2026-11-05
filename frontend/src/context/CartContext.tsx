import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { CartItem, PromoCode } from '../types/cart';
import type { Product } from '../types/product';
import type { OrderConfirmation } from '../types/checkout';
import { PRODUCTS, AVAILABLE_PROMOS } from '../data/products';
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // Initial cart seeded with the exact 2 items from the user's uploaded screenshot!
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const mushroom = PRODUCTS.find((p) => p.id === 'prod-4');
    const armchair = PRODUCTS.find((p) => p.id === 'prod-5');
    const initial: CartItem[] = [];
    if (mushroom) {
      initial.push({
        id: `${mushroom.id}-Warm Chalk`,
        product: mushroom,
        quantity: 1,
        selectedColor: 'Warm Chalk',
      });
    }
    if (armchair) {
      initial.push({
        id: `${armchair.id}-Cognac Saddle`,
        product: armchair,
        quantity: 1,
        selectedColor: 'Cognac Saddle',
      });
    }
    return initial;
  });

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
      shop: '/',
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
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (itemId: string) => {
    const target = cartItems.find((i) => i.id === itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    if (target) {
      showToast(`${target.product.name} removed`, 'info');
    }
  };

  const clearCart = () => {
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

