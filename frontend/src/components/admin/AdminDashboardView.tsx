import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { getAdminDashboardData } from '../../api/adminApi';
import { fetchProducts, updateProduct, deleteProduct } from '../../api/productApi';
import { getAllOrdersApi, updateOrderStatusApi, type BackendOrder } from '../../api/orderApi';
import type { Product } from '../../types/product';

// Modular Child Components (Separation of Concerns)
import { AdminMetricsOverview } from './AdminMetricsOverview';
import { AdminOrdersTable } from './AdminOrdersTable';
import { AdminInventoryTable } from './AdminInventoryTable';
import { AdminCustomersTable, type MongoUser } from './AdminCustomersTable';
import { AddProductModal } from './AddProductModal';

interface BackendStats {
  totalUsers: number;
  totalAdmins: number;
  totalSessions: number;
}

export const AdminDashboardView: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { setCurrentView } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers'>('orders');

  // Live Backend Data State
  const [isLoading, setIsLoading] = useState(true);
  const [backendStats, setBackendStats] = useState<BackendStats | null>(null);
  const [liveUsers, setLiveUsers] = useState<MongoUser[]>([]);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [liveOrders, setLiveOrders] = useState<BackendOrder[]>([]);
  const [liveRevenue, setLiveRevenue] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);

  // Modal and Action States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);

  // Fetch Dashboard Data from MongoDB
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const [res, productsRes, ordersRes] = await Promise.all([
        getAdminDashboardData(),
        fetchProducts().catch(() => []),
        getAllOrdersApi().catch(() => ({ orders: [], totalRevenue: 0 })),
      ]);

      if (res?.success) {
        setBackendStats(res.stats || null);
        setLiveUsers(res.recentUsers || []);
      }

      if (Array.isArray(productsRes)) {
        setLiveProducts(productsRes);
      }

      if (ordersRes?.orders && Array.isArray(ordersRes.orders)) {
        setLiveOrders(ordersRes.orders);
        setLiveRevenue(ordersRes.totalRevenue || 0);
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      setApiError(errObj.response?.data?.message || errObj.message || 'Failed to fetch admin data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handler: Quick Stock Update
  const handleQuickStockChange = async (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      setUpdatingStockId(productId);
      const updated = await updateProduct(productId, { stock: newStock });
      setLiveProducts((prev) =>
        prev.map((p) => {
          const pId = p.id || (p as unknown as { _id?: string })._id;
          return pId === productId ? { ...p, stock: updated.stock, inStock: updated.inStock } : p;
        })
      );
      showToast(`Stock updated to ${newStock} units`, 'success');
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      showToast(errObj.response?.data?.message || errObj.message || 'Failed to update stock', 'error');
    } finally {
      setUpdatingStockId(null);
    }
  };

  // Handler: Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await updateOrderStatusApi(orderId, newStatus);
      setLiveOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o))
      );
      showToast(`Order marked as "${newStatus}"`, 'success');
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      showToast(errObj.response?.data?.message || errObj.message || 'Failed to update order status', 'error');
    }
  };

  // Handler: Delete Product
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${productName}" from the catalog?`)) {
      return;
    }

    try {
      await deleteProduct(productId);
      setLiveProducts((prev) => prev.filter((p) => (p.id || (p as unknown as { _id?: string })._id) !== productId));
      showToast(`"${productName}" removed from catalog`, 'success');
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      showToast(errObj.response?.data?.message || errObj.message || 'Failed to delete product', 'error');
    }
  };

  // Calculate Metrics
  const processingOrdersCount = liveOrders.filter((o) => o.status === 'Processing').length;
  const lowStockCount = liveProducts.filter((p) => {
    const st = (p as unknown as { stock?: number }).stock ?? (p.inStock ? 10 : 0);
    return st <= 5 && st > 0;
  }).length;

  return (
    <div className="min-h-screen bg-offwhite py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header / Store Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-copen-border pb-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setCurrentView('shop');
                window.location.href = '/';
              }}
              className="p-2 border border-copen-border hover:bg-offwhite-hover transition-colors rounded-xs text-copen-gray hover:text-copen-black cursor-pointer"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-olive-700 font-semibold">
                Copenhagen Atelier Operations
              </span>
              <p className="text-xs text-copen-gray">
                Logged in as <strong className="text-copen-black">{user?.name || 'Administrator'}</strong> ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Sync Live
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentView('shop');
                window.location.href = '/';
              }}
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              View Storefront
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-copen-gray hover:text-rose-700"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Title & Overview Banner */}
        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-copen-black">
            Administration &amp; Atelier Management
          </h1>
          <p className="text-xs text-copen-gray">
            Real-time monitoring of bespoke furniture orders, catalog stock, and private client registrations.
          </p>
        </div>

        {/* API Error Notification if Backend authorization or network fails */}
        {apiError && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xs text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Admin API Notice: {apiError}</span>
            </div>
            <div className="flex items-center gap-2">
              {apiError.toLowerCase().includes('login') || apiError.toLowerCase().includes('token') || apiError.toLowerCase().includes('denied') ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthModal('login')}
                  className="text-rose-800 border-rose-300 hover:bg-rose-100"
                >
                  Sign In Again
                </Button>
              ) : null}
              <Button variant="ghost" size="sm" onClick={fetchDashboardData} className="text-rose-700">
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* 1. Modular KPI Metrics Overview */}
        <AdminMetricsOverview
          liveRevenue={liveRevenue}
          liveOrdersCount={liveOrders.length}
          processingOrdersCount={processingOrdersCount}
          totalUsers={backendStats?.totalUsers ?? liveUsers.length}
          totalAdmins={backendStats?.totalAdmins ?? 1}
          totalSessions={backendStats?.totalSessions ?? 1}
          liveProductsCount={liveProducts.length}
          lowStockCount={lowStockCount}
        />

        {/* 2. Navigation Tabs */}
        <div className="border-b border-copen-border flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs uppercase tracking-widest font-medium transition-colors relative cursor-pointer ${
              activeTab === 'orders'
                ? 'text-copen-black font-semibold'
                : 'text-copen-gray hover:text-copen-black'
            }`}
          >
            Customer Orders ({liveOrders.length})
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-olive-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs uppercase tracking-widest font-medium transition-colors relative cursor-pointer ${
              activeTab === 'products'
                ? 'text-copen-black font-semibold'
                : 'text-copen-gray hover:text-copen-black'
            }`}
          >
            Product Catalog &amp; Stock ({liveProducts.length})
            {activeTab === 'products' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-olive-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`pb-3 text-xs uppercase tracking-widest font-medium transition-colors relative cursor-pointer ${
              activeTab === 'customers'
                ? 'text-copen-black font-semibold'
                : 'text-copen-gray hover:text-copen-black'
            }`}
          >
            Registered Clients ({liveUsers.length})
            {activeTab === 'customers' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-olive-600" />
            )}
          </button>
        </div>

        {/* 3. Modular Tab Content */}
        {activeTab === 'orders' && (
          <AdminOrdersTable
            orders={liveOrders}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'products' && (
          <AdminInventoryTable
            products={liveProducts}
            onQuickStockChange={handleQuickStockChange}
            onDeleteProduct={handleDeleteProduct}
            onAddNewPiece={() => setIsAddModalOpen(true)}
            updatingStockId={updatingStockId}
          />
        )}

        {activeTab === 'customers' && (
          <AdminCustomersTable
            users={liveUsers}
            isLoading={isLoading}
            onRefresh={fetchDashboardData}
          />
        )}

        {/* 4. Modular Add Product Modal */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onProductCreated={(newProd) => setLiveProducts((prev) => [newProd, ...prev])}
        />
      </div>
    </div>
  );
};

export default AdminDashboardView;
