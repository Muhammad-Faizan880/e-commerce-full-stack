import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StoreLayout } from './components/layout/StoreLayout';
import { ProductGrid } from './components/product/ProductGrid';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { AuthView } from './components/auth/AuthView';
import { AccountView } from './components/auth/AccountView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import type { CategoryFilter, Product } from './types/product';

// Shop View wrapper connecting ProductGrid with Cart Context
const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const { setQuickViewProduct } = useCart();

  return (
    <ProductGrid
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      onQuickView={(p: Product) => setQuickViewProduct(p)}
    />
  );
};

// Checkout Success View wrapper
const SuccessPage: React.FC = () => {
  const { lastOrder, setCurrentView } = useCart();
  return (
    <OrderSuccessModal
      order={lastOrder}
      onContinueShopping={() => setCurrentView('shop')}
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
              <Route path="/checkout" element={<CheckoutView />} />
              <Route path="/auth" element={<AuthView />} />
              <Route path="/login" element={<AuthView />} />
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
