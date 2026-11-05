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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { getAdminDashboardData } from '../../api/adminApi';

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
  const { user, logout } = useAuth();
  const { setCurrentView } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers'>('orders');
  const [searchTerm, setSearchTerm] = useState('');

  // Live Backend Data State
  const [isLoading, setIsLoading] = useState(true);
  const [backendStats, setBackendStats] = useState<BackendStats | null>(null);
  const [liveUsers, setLiveUsers] = useState<MongoUser[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const res = await getAdminDashboardData();
      if (res?.stats) {
        setBackendStats(res.stats);
      }
      if (res?.recentUsers) {
        setLiveUsers(res.recentUsers);
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      setApiError(errObj.response?.data?.message || errObj.message || 'Failed to fetch admin data');
    } finally {
      setIsLoading(false);
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
            <Button variant="ghost" size="sm" onClick={fetchDashboardData} className="text-rose-700">
              Retry
            </Button>
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
              <p className="font-serif text-2xl text-copen-black">$54,820 CAD</p>
              <p className="text-[11px] text-olive-700 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3" /> +14.2% from last month
              </p>
            </div>
          </div>

          <div className="bg-offwhite-surface border border-copen-border p-5 rounded-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-copen-muted">
              <span className="uppercase tracking-widest font-medium text-[10px]">Active Orders</span>
              <Package className="w-4 h-4 text-olive-600" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-2xl text-copen-black">38 Orders</p>
              <p className="text-[11px] text-copen-gray">
                4 awaiting workshop packaging
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
              <p className="font-serif text-2xl text-copen-black">24 Pieces</p>
              <p className="text-[11px] text-amber-700 font-medium">
                2 items running low in stock
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
            Customer Orders (4)
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
            Product Catalog (4)
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
                  {demoOrders
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
              <h3 className="text-xs uppercase tracking-widest font-semibold text-copen-black">
                Active Catalog Pieces
              </h3>
              <Button variant="primary" size="sm">
                + Add New Piece
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-offwhite-card border-b border-copen-border text-[10px] uppercase tracking-widest text-copen-gray">
                  <tr>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Design Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Stock Qty</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-copen-border">
                  {demoProducts.map((p) => (
                    <tr key={p.sku} className="hover:bg-offwhite-hover/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-copen-muted">
                        {p.sku}
                      </td>
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
                    </tr>
                  ))}
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
      </div>
    </div>
  );
};

