import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StoreLayout } from './components/layout/StoreLayout';
import { ProductGrid } from './components/product/ProductGrid';
import { ProductDetailView } from './components/product/ProductDetailView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { AuthView } from './components/auth/AuthView';
import { AccountView } from './components/auth/AccountView';
import { ResetPasswordView } from './components/auth/ResetPasswordView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { verifyStripeSession } from './api/paymentApi';
import type { CategoryFilter, Product } from './types/product';
import type { OrderConfirmation } from './types/checkout';

// Shop View wrapper connecting ProductGrid with URL & Cart Context
const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = (searchParams.get('category') as CategoryFilter) || 'all';
  const { setQuickViewProduct } = useCart();

  const handleSelectCategory = (cat: CategoryFilter) => {
    if (cat === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), category: cat });
    }
  };

  return (
    <ProductGrid
      selectedCategory={urlCategory}
      onSelectCategory={handleSelectCategory}
      onQuickView={(p: Product) => setQuickViewProduct(p)}
    />
  );
};

// Checkout Success View wrapper
const SuccessPage: React.FC = () => {
  const { lastOrder, setLastOrder, clearCart, setCurrentView } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(Boolean(sessionId && !lastOrder));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    if (lastOrder) return;

    let isMounted = true;
    const verify = async () => {
      try {
        setLoading(true);
        console.log('[STRIPE_CLIENT: VERIFY_START] Verifying session:', sessionId);
        const orderData = await verifyStripeSession(sessionId);
        if (!isMounted) return;

        if (orderData) {
          const raw = orderData;
          const normalized: OrderConfirmation = {
            orderId: raw.orderNumber || raw._id || 'CPN-STRIPE',
            orderDate: raw.createdAt
              ? new Date(raw.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : new Date().toLocaleDateString(),
            items: (raw.items || []).map((it, idx) => ({
              id: it.product || `item-${idx}`,
              product: {
                id: it.product || String(idx),
                name: it.name,
                price: it.price,
                category: 'seating' as const,
                categoryLabel: 'Furniture',
                rating: 5,
                reviewsCount: 1,
                image: it.image || '',
                gallery: it.image ? [it.image] : [],
                description: '',
                material: 'Oak & Linen',
                dimensions: 'Standard',
                inStock: true,
              },
              quantity: it.quantity,
              selectedColor: it.selectedColor || 'Standard',
            })),
            shippingAddress: raw.shippingAddress || {
              firstName: 'Valued',
              lastName: 'Client',
              email: '',
              phone: '',
              address: '',
              city: '',
              state: '',
              postalCode: '',
              country: '',
            },
            shippingOption: {
              id: 'standard',
              name: raw.shippingOption?.name || 'Standard Carbon-Neutral Delivery',
              estimate: raw.shippingOption?.estimate || '3-5 business days',
              price: raw.shippingOption?.price || 0,
              description: '',
            },
            paymentMethod: 'credit-card',
            subtotal: raw.subtotal || 0,
            discount: raw.discount || 0,
            shippingFee: raw.shippingFee || 0,
            tax: raw.tax || 0,
            total: raw.total || 0,
            status: 'confirmed',
          };
          setLastOrder(normalized);
          clearCart();
          console.log('[STRIPE_CLIENT: VERIFY_SUCCESS] Order placed and cart cleared:', normalized.orderId);
        }
      } catch (err: any) {
        console.error('[STRIPE_CLIENT: VERIFY_FAILED]', err);
        if (isMounted) {
          setError(err?.response?.data?.message || err?.message || 'Payment verification failed');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [sessionId, lastOrder, setLastOrder, clearCart]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-copen-black" />
        <h2 className="font-serif text-2xl text-copen-black">Confirming Your Payment</h2>
        <p className="text-xs text-copen-gray max-w-sm">
          Please wait a moment while we verify your Stripe transaction and prepare your Copenhagen Atelier invoice...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-offwhite-surface border border-copen-border text-center space-y-4">
        <h2 className="font-serif text-2xl text-copen-black">Payment Verification Notice</h2>
        <p className="text-xs text-copen-gray">{error}</p>
        <button
          onClick={() => {
            setCurrentView('checkout');
            window.location.href = '/checkout';
          }}
          className="inline-block px-6 py-2.5 bg-copen-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition"
        >
          Return to Checkout
        </button>
      </div>
    );
  }

  return (
    <OrderSuccessModal
      order={lastOrder}
      onContinueShopping={() => {
        setCurrentView('shop');
        window.location.href = '/';
      }}
    />
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Storefront Layout (Navbar, AnnouncementBar, Footer, Modals) */}
            <Route element={<StoreLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailView />} />
              <Route path="/checkout" element={<CheckoutView />} />
              <Route path="/auth" element={<AuthView />} />
              <Route path="/login" element={<AuthView />} />
              <Route path="/reset-password" element={<ResetPasswordView />} />
              <Route path="/reset-password/:token" element={<ResetPasswordView />} />
              <Route path="/success" element={<SuccessPage />} />

              {/* Protected User Account Route (Requires logged in user) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<AccountView />} />
              </Route>

              {/* Protected Admin Route (Requires user role === 'admin') */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboardView />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
