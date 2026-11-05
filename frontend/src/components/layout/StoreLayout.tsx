import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { FullCartModal } from '../cart/FullCartModal';
import { QuickViewModal } from '../product/QuickViewModal';
import { AuthModal } from '../auth/AuthModal';
import { useCart } from '../../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export const StoreLayout: React.FC = () => {
  const {
    currentView,
    quickViewProduct,
    setQuickViewProduct,
    setIsCartOpen,
    itemCount,
  } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-offwhite text-copen-black selection:bg-olive-600 selection:text-white">
      {/* Top Scandinavian Announcement */}
      <AnnouncementBar />

      {/* Main Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Scandinavian Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Full Bag Review Modal */}
      <FullCartModal />

      {/* Quick View Product Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Global Sign In / Register Modal */}
      <AuthModal />

      {/* Floating Review Bag Button */}
      {currentView === 'shop' && itemCount > 0 && (
        <aside
          aria-label="Shopping bag quick toggle"
          className="fixed bottom-6 left-6 z-30 animate-fade-in"
        >
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 bg-olive-700 hover:bg-olive-800 text-offwhite-50 px-4 py-3 shadow-lg border border-olive-900/30 transition-all cursor-pointer group"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-2 -right-2 bg-offwhite-50 text-olive-800 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest font-medium hidden sm:inline">
              Review Bag
            </span>
          </button>
        </aside>
      )}
    </div>
  );
};

export default StoreLayout;

