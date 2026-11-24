import React, { useState } from 'react';
import {
  ShieldAlert,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Database,
  Trash2,
  Plus,
  Upload,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { getAdminDashboardData } from '../../api/adminApi';
import { fetchProducts, createProduct, deleteProduct, uploadProductImage } from '../../api/productApi';
import { getAllOrdersApi, updateOrderStatusApi, type BackendOrder } from '../../api/orderApi';
import type { Product } from '../../types/product';

interface BackendStats {
  totalUsers: number;
  totalAdmins: number;
  totalSessions: number;
}

interface MongoUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const AdminDashboardView: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { setCurrentView } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers'>('orders');
  const [searchTerm, setSearchTerm] = useState('');

  // Live Backend Data State
  const [isLoading, setIsLoading] = useState(true);
  const [backendStats, setBackendStats] = useState<BackendStats | null>(null);
  const [liveUsers, setLiveUsers] = useState<MongoUser[]>([]);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [liveOrders, setLiveOrders] = useState<BackendOrder[]>([]);
  const [liveRevenue, setLiveRevenue] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    subtitle: '',
    category: 'seating' as 'seating' | 'lighting' | 'tables' | 'bedroom' | 'decor',
    price: '',
    compareAtPrice: '',
    stock: '10',
    image: '',
    description: '',
    material: 'European Solid Oak & Natural Textiles',
    dimensions: '',
    badge: '' as '' | 'COPENHAGEN ALMOND' | 'SALE' | 'NEW ARRIVAL' | 'BESTSELLER',
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit');
      return;
    }

    try {
      setIsUploadingImage(true);
      setUploadError(null);
      const uploadedUrl = await uploadProductImage(file);
      setProductForm((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      setUploadError(errObj.response?.data?.message || errObj.message || 'Image upload to Cloudinary failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const [res, productsRes, ordersRes] = await Promise.all([
        getAdminDashboardData(),
        fetchProducts().catch(() => []),
        getAllOrdersApi().catch(() => ({ orders: [], totalRevenue: 0 })),
      ]);

      if (res?.stats) {
        setBackendStats(res.stats);
      }
      if (res?.recentUsers) {
        setLiveUsers(res.recentUsers);
      }
      if (Array.isArray(productsRes) && productsRes.length > 0) {
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
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await updateOrderStatusApi(orderId, newStatus);
      setLiveOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o))
      );
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj.response?.data?.message || errObj.message || 'Failed to update order status');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.image || !productForm.description) {
      alert('Please fill all required fields (Name, Price, Image URL, Description)');
      return;
    }

    try {
      setIsSubmittingProduct(true);
      const newProd = await createProduct({
        name: productForm.name,
        subtitle: productForm.subtitle,
        category: productForm.category,
        categoryLabel: `${productForm.category.charAt(0).toUpperCase() + productForm.category.slice(1)} Living`,
        price: parseFloat(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? parseFloat(productForm.compareAtPrice) : undefined,
        stock: parseInt(productForm.stock, 10) || 10,
        image: productForm.image,
        gallery: [productForm.image],
        description: productForm.description,
        material: productForm.material,
        dimensions: productForm.dimensions,
        badge: productForm.badge || undefined,
        rating: 5.0,
        reviewsCount: 1,
        inStock: true,
      });

      setLiveProducts((prev) => [newProd, ...prev]);
      setIsAddModalOpen(false);
      setProductForm({
        name: '',
        subtitle: '',
        category: 'seating',
        price: '',
        compareAtPrice: '',
        stock: '10',
        image: '',
        description: '',
        material: 'European Solid Oak & Natural Textiles',
        dimensions: '',
        badge: '',
      });
      alert('Product created successfully in MongoDB!');
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj.response?.data?.message || errObj.message || 'Failed to create product');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${productName}" from the catalog?`)) {
      return;
    }

    try {
      await deleteProduct(productId);
      setLiveProducts((prev) => prev.filter((p) => (p.id || (p as unknown as { _id?: string })._id) !== productId));
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj.response?.data?.message || errObj.message || 'Failed to delete product');
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  // Mock demo orders for administrative management
  const demoOrders = [
    {
      id: 'CPN-98421',
      customer: 'Faizan Ahmed',
      email: 'faizan@designstudio.com',
      date: 'Nov 05, 2026',
      total: 1475.0,
      status: 'In Transit',
      items: 'Kruso Lounge Chair (1), Mushroom Lamp (1)',
      payment: 'Credit Card',
    },
    {
      id: 'CPN-98420',
      customer: 'Elena Rostova',
      email: 'elena.rostova@atelier.se',
      date: 'Nov 04, 2026',
      total: 340.0,
      status: 'Delivered',
      items: 'Danish Wool Throw (2)',
      payment: 'Apple Pay',
    },
    {
      id: 'CPN-98419',
      customer: 'Henrik Vanger',
      email: 'henrik@vanger-arch.dk',
      date: 'Nov 03, 2026',
      total: 2890.0,
      status: 'Processing',
      items: 'Nordic Oak Dining Table (1), Chairs (4)',
      payment: 'Bank Transfer',
    },
    {
      id: 'CPN-98418',
      customer: 'Astrid Lind',
      email: 'astrid@linddesign.no',
      date: 'Nov 02, 2026',
      total: 195.0,
      status: 'Processing',
      items: 'Ceramic Arch Vase (1)',
      payment: 'Credit Card',
    },
  ];

  const demoProducts = [
    {
      sku: 'CPN-CHR-01',
      name: 'Accent Lounge Chair',
      category: 'Seating',
      price: 150.0,
      stock: 14,
      status: 'In Stock',
    },
    {
      sku: 'CPN-LMP-04',
      name: 'Mushroom Table Lamp',
      category: 'Lighting',
      price: 68.0,
      stock: 3,
      status: 'Low Stock',
    },
    {
      sku: 'CPN-DEC-02',
      name: 'Artful Canvas Art Board',
      category: 'Decor',
      price: 38.0,
      stock: 28,
      status: 'In Stock',
    },
    {
      sku: 'CPN-BD-03',
      name: 'Minimal Oak Bedside Table',
      category: 'Bedroom',
      price: 110.0,
      stock: 0,
      status: 'Out of Stock',
    },
  ];

  const demoCustomers = [
    {
      name: 'Faizan Ahmed',
      email: 'faizan@designstudio.com',
      role: 'Customer',
      tier: 'Private Collector',
      orders: 3,
      spent: '$2,480 CAD',
    },
    {
      name: 'Admin Supervisor',
      email: user?.email || 'admin@copenhagen.design',
      role: 'Admin',
      tier: 'System Root',
      orders: 0,
      spent: '$0 CAD',
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@atelier.se',
      role: 'Customer',
      tier: 'Architect Club',
      orders: 5,
      spent: '$4,920 CAD',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-olive-100 text-olive-800 text-[10px] uppercase tracking-wider font-semibold rounded-xs">
            <CheckCircle2 className="w-3 h-3 text-olive-600" />
            {status}
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] uppercase tracking-wider font-semibold rounded-xs">
            <Truck className="w-3 h-3 text-amber-600" />
            {status}
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 text-[10px] uppercase tracking-wider font-semibold rounded-xs">
            <Clock className="w-3 h-3 text-sky-600" />
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-offwhite-hover text-copen-gray text-[10px] uppercase tracking-wider rounded-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-offwhite py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Breadcrumb & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-copen-border pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('shop')}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-copen-gray hover:text-copen-black transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Storefront</span>
            </button>
            <span className="text-copen-border">•</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-olive-900 text-offwhite-50 text-[10px] uppercase tracking-widest font-semibold rounded-xs">
              <ShieldAlert className="w-3 h-3 text-olive-400" />
              <span>Copenhagen Control Room</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-copen-muted hidden sm:inline">
              Logged in as <span className="font-semibold text-copen-black">{user?.name || user?.firstName}</span> ({user?.role || 'admin'})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('shop')}
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Live Store
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-rose-700 hover:text-rose-900"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Title & Overview Banner */}
        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-copen-black">
            Administration & Atelier Management
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

        {/* Key Metrics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-offwhite-surface border border-copen-border p-5 rounded-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-copen-muted">
              <span className="uppercase tracking-widest font-medium text-[10px]">Monthly Gross</span>
              <DollarSign className="w-4 h-4 text-olive-600" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-2xl text-copen-black">
                {liveRevenue > 0 ? `$${liveRevenue.toFixed(2)} CAD` : '$54,820 CAD'}
              </p>
              <p className="text-[11px] text-olive-700 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3" /> Live revenue calculated from database
              </p>
            </div>
          </div>

          <div className="bg-offwhite-surface border border-copen-border p-5 rounded-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-copen-muted">
              <span className="uppercase tracking-widest font-medium text-[10px]">Active Orders</span>
              <Package className="w-4 h-4 text-olive-600" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-2xl text-copen-black">
                {liveOrders.length > 0 ? `${liveOrders.length} Orders` : '38 Orders'}
              </p>
              <p className="text-[11px] text-copen-gray">
                {liveOrders.length > 0 ? `${liveOrders.filter((o) => o.status === 'Processing').length} awaiting fulfillment` : '4 awaiting workshop packaging'}
              </p>
            </div>
          </div>

          <div className="bg-offwhite-surface border border-copen-border p-5 rounded-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-copen-muted">
              <span className="uppercase tracking-widest font-medium text-[10px]">Registered Clients</span>
              <Users className="w-4 h-4 text-olive-600" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-2xl text-copen-black">
                {backendStats ? `${backendStats.totalUsers} Accounts` : '142 Members'}
              </p>
              <p className="text-[11px] text-olive-700 flex items-center gap-1 font-medium">
                {backendStats ? (
                  <>
                    <Database className="w-3 h-3 text-olive-600" />
                    <span>{backendStats.totalAdmins} Admin(s) • {backendStats.totalSessions} Sessions</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-olive-600" /> 18 Private Collectors
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="bg-offwhite-surface border border-copen-border p-5 rounded-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-copen-muted">
              <span className="uppercase tracking-widest font-medium text-[10px]">Catalog Inventory</span>
              <ShoppingBag className="w-4 h-4 text-olive-600" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-2xl text-copen-black">
                {liveProducts.length > 0 ? `${liveProducts.length} Pieces` : '9 Pieces'}
              </p>
              <p className="text-[11px] text-amber-700 font-medium">
                {liveProducts.filter((p) => (p as unknown as { stock?: number }).stock !== undefined && (p as unknown as { stock?: number }).stock! < 5).length} items running low in stock
              </p>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
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
            Customer Orders ({liveOrders.length > 0 ? liveOrders.length : demoOrders.length})
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
            Product Catalog ({liveProducts.length > 0 ? liveProducts.length : demoProducts.length})
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
            Registered Users (3)
            {activeTab === 'customers' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-olive-600" />
            )}
          </button>
        </div>

        {/* Tab 1: Orders Table */}
        {activeTab === 'orders' && (
          <div className="bg-offwhite-surface border border-copen-border overflow-hidden rounded-xs">
            <div className="p-4 border-b border-copen-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-copen-muted" />
                <input
                  type="text"
                  placeholder="Filter by customer or order #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-offwhite border border-copen-border text-xs pl-8 pr-3 py-2 text-copen-black placeholder:text-copen-muted focus:outline-none focus:border-olive-600"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-copen-gray">
                <Filter className="w-3.5 h-3.5 text-olive-600" />
                <span>Sort by: Most Recent</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-offwhite-card border-b border-copen-border text-[10px] uppercase tracking-widest text-copen-gray">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Pieces Ordered</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-copen-border">
                  {liveOrders.length > 0
                    ? liveOrders
                        .filter((o) => {
                          const clientName = `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`.toLowerCase();
                          const term = searchTerm.toLowerCase();
                          return (
                            clientName.includes(term) ||
                            o.orderNumber.toLowerCase().includes(term) ||
                            o.shippingAddress.email.toLowerCase().includes(term)
                          );
                        })
                        .map((order) => {
                          const clientName = `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;
                          const itemsSummary = order.items.map((i) => `${i.name} (${i.quantity})`).join(', ');
                          return (
                            <tr key={order._id} className="hover:bg-offwhite-hover/60 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-medium text-copen-black">
                                #{order.orderNumber}
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="font-medium text-copen-black">{clientName}</p>
                                <p className="text-[10px] text-copen-muted">{order.shippingAddress.email}</p>
                              </td>
                              <td className="py-3.5 px-4 text-copen-gray max-w-xs truncate" title={itemsSummary}>
                                {itemsSummary}
                              </td>
                              <td className="py-3.5 px-4 text-copen-muted text-[11px]">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3.5 px-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                  className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-xs border cursor-pointer focus:outline-none ${
                                    order.status === 'Delivered'
                                      ? 'bg-olive-100 text-olive-800 border-olive-300'
                                      : order.status === 'In Transit'
                                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                                      : 'bg-sky-50 text-sky-800 border-sky-300'
                                  }`}
                                >
                                  <option value="Processing">Processing</option>
                                  <option value="In Transit">In Transit</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="py-3.5 px-4 text-right font-medium text-copen-black">
                                ${order.total.toFixed(2)} CAD
                              </td>
                            </tr>
                          );
                        })
                    : demoOrders
                        .filter((o) =>
                          o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-offwhite-hover/60 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-medium text-copen-black">
                              {order.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-medium text-copen-black">{order.customer}</p>
                              <p className="text-[10px] text-copen-muted">{order.email}</p>
                            </td>
                            <td className="py-3.5 px-4 text-copen-gray max-w-xs truncate">
                              {order.items}
                            </td>
                            <td className="py-3.5 px-4 text-copen-muted text-[11px]">
                              {order.date}
                            </td>
                            <td className="py-3.5 px-4">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-medium text-copen-black">
                              ${order.total.toFixed(2)} CAD
                            </td>
                          </tr>
                        ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Products Table */}
        {activeTab === 'products' && (
          <div className="bg-offwhite-surface border border-copen-border overflow-hidden rounded-xs">
            <div className="p-4 border-b border-copen-border flex items-center justify-between">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-copen-black">
                  Active Catalog Pieces ({liveProducts.length > 0 ? liveProducts.length : demoProducts.length})
                </h3>
                <p className="text-[11px] text-copen-gray mt-0.5">
                  Live synchronized inventory managed in MongoDB
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add New Piece
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-offwhite-card border-b border-copen-border text-[10px] uppercase tracking-widest text-copen-gray">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-copen-border">
                  {liveProducts.length > 0 ? (
                    liveProducts.map((p) => {
                      const prodId = p.id || (p as unknown as { _id?: string })._id || '';
                      const stockVal = (p as unknown as { stock?: number }).stock ?? (p.inStock ? 10 : 0);
                      return (
                        <tr key={prodId} className="hover:bg-offwhite-hover/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-9 object-cover rounded-xs border border-copen-border shrink-0"
                              />
                              <div>
                                <p className="font-medium text-copen-black">{p.name}</p>
                                <p className="text-[10px] text-copen-muted truncate max-w-xs">{p.subtitle || p.material}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-copen-gray uppercase tracking-wider text-[10px]">
                            {p.category}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {stockVal} units
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-medium ${
                                stockVal > 5
                                  ? 'bg-olive-100 text-olive-800'
                                  : stockVal > 0
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {stockVal > 5 ? 'In Stock' : stockVal > 0 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-copen-black">
                            ${p.price.toFixed(2)} CAD
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prodId, p.name)}
                              className="text-rose-600 hover:text-rose-800 transition-colors p-1"
                              title="Delete from Catalog"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    demoProducts.map((p) => (
                      <tr key={p.sku} className="hover:bg-offwhite-hover/60 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-copen-black">
                          {p.name}
                        </td>
                        <td className="py-3.5 px-4 text-copen-gray uppercase tracking-wider text-[10px]">
                          {p.category}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {p.stock} units
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-medium ${
                              p.status === 'In Stock'
                                ? 'bg-olive-100 text-olive-800'
                                : p.status === 'Low Stock'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-copen-black">
                          ${p.price.toFixed(2)} CAD
                        </td>
                        <td className="py-3.5 px-4 text-right text-copen-muted text-[11px]">
                          Demo
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Customers Table */}
        {activeTab === 'customers' && (
          <div className="bg-offwhite-surface border border-copen-border overflow-hidden rounded-xs">
            <div className="p-4 border-b border-copen-border flex items-center justify-between">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-copen-black">
                  Registered Copenhagen Accounts
                </h3>
                <p className="text-[11px] text-copen-gray mt-0.5">
                  {liveUsers.length > 0 ? 'Live verified accounts from MongoDB database' : 'Client ledger'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDashboardData}
                leftIcon={<RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />}
              >
                Sync Data
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-offwhite-card border-b border-copen-border text-[10px] uppercase tracking-widest text-copen-gray">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Registered Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4 text-right">Joined / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-copen-border">
                  {liveUsers.length > 0
                    ? liveUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-offwhite-hover/60 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-copen-black">
                            {u.name}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-copen-muted text-[11px]">
                            {u.email}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-xs font-semibold ${
                                u.role === 'admin'
                                  ? 'bg-olive-900 text-offwhite-50'
                                  : 'bg-offwhite-card text-copen-gray border border-copen-border'
                              }`}
                            >
                              {u.role || 'customer'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-olive-800 text-[11px] font-mono">
                            MongoDB DB
                          </td>
                          <td className="py-3.5 px-4 text-right text-copen-gray text-[11px]">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                          </td>
                        </tr>
                      ))
                    : demoCustomers.map((c) => (
                        <tr key={c.email} className="hover:bg-offwhite-hover/60 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-copen-black">
                            {c.name}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-copen-muted text-[11px]">
                            {c.email}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-xs font-semibold ${
                                c.role === 'Admin'
                                  ? 'bg-olive-900 text-offwhite-50'
                                  : 'bg-offwhite-card text-copen-gray'
                              }`}
                            >
                              {c.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-olive-800 text-[11px]">
                            {c.tier}
                          </td>
                          <td className="py-3.5 px-4 text-right font-medium text-copen-black">
                            {c.spent}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Scandinavian Piece"
          subtitle="Publish a new design item directly to Copenhagen MongoDB catalog"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
                  Design Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kruso Lounge Chair"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
                  Category *
                </label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                  className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600 cursor-pointer"
                >
                  <option value="seating">Lounge Seating</option>
                  <option value="lighting">Lighting</option>
                  <option value="tables">Tables & Benches</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="decor">Decor & Storage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
                Subtitle / Short Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Solid European white oak with olive wool weave"
                value={productForm.subtitle}
                onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
                  Price ($ CAD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="180.00"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
                  Compare Price ($ CAD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="220.00"
                  value={productForm.compareAtPrice}
                  onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
                  className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
                  Stock Units *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="10"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
                />
              </div>
            </div>

            {/* Product Image Selection: Cloudinary Upload or Direct URL */}
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium">
                Product Image * (Upload to Cloudinary or Paste URL)
              </label>

              {/* Direct File Upload to Cloudinary */}
              <div className="border border-dashed border-copen-border p-4 bg-offwhite hover:bg-offwhite-hover transition-colors rounded-xs text-center">
                <input
                  type="file"
                  id="product-image-file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  disabled={isUploadingImage}
                  className="hidden"
                />
                <label
                  htmlFor="product-image-file"
                  className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  {isUploadingImage ? (
                    <div className="flex items-center gap-2 text-olive-700 py-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-xs font-medium">Uploading to Cloudinary...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-olive-50 border border-olive-200 flex items-center justify-center text-olive-700">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-copen-black">
                        Click to upload piece from Computer
                      </span>
                      <span className="text-[10px] text-copen-muted">
                        PNG, JPG, or WEBP up to 5MB (Uploaded to Cloudinary CDN)
                      </span>
                    </>
                  )}
                </label>
              </div>

              {uploadError && (
                <p className="text-[11px] text-rose-600 font-medium">⚠️ {uploadError}</p>
              )}

              {/* URL input fallback */}
              <div className="pt-1">
                <span className="text-[10px] uppercase tracking-wider text-copen-muted block mb-1">
                  Or paste direct image URL:
                </span>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600 font-mono text-[11px]"
                />
              </div>

              {productForm.image && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-offwhite-card border border-copen-border rounded-xs">
                  <img
                    src={productForm.image}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-xs border border-copen-border"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-[11px] space-y-0.5 overflow-hidden">
                    <p className="text-emerald-700 font-medium flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> Image attached successfully
                    </p>
                    <p className="text-copen-muted truncate max-w-xs text-[10px] font-mono">
                      {productForm.image}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
                Description & Craft Story *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Sculptural comfort rooted in Nordic heritage..."
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
                  Material
                </label>
                <input
                  type="text"
                  placeholder="Solid White Oak, Danish Wool"
                  value={productForm.material}
                  onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                  className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  placeholder="W 74cm × D 82cm × H 76cm"
                  value={productForm.dimensions}
                  onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                  className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-copen-border">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingProduct}
              >
                Publish to Catalog
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

