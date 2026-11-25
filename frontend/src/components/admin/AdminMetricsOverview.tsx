import React from 'react';
import { DollarSign, TrendingUp, Package, Users, Database, ShoppingBag } from 'lucide-react';

interface AdminMetricsOverviewProps {
  liveRevenue: number;
  liveOrdersCount: number;
  processingOrdersCount: number;
  totalUsers: number;
  totalAdmins: number;
  totalSessions: number;
  liveProductsCount: number;
  lowStockCount: number;
}

export const AdminMetricsOverview: React.FC<AdminMetricsOverviewProps> = ({
  liveRevenue,
  liveOrdersCount,
  processingOrdersCount,
  totalUsers,
  totalAdmins,
  totalSessions,
  liveProductsCount,
  lowStockCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Monthly Revenue */}
      <div className="bg-offwhite-surface border border-copen-border p-5 rounded-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-copen-muted">
          <span className="uppercase tracking-widest font-medium text-[10px]">Monthly Gross</span>
          <DollarSign className="w-4 h-4 text-olive-600" />
        </div>
        <div className="space-y-1">
          <p className="font-serif text-2xl text-copen-black">
            ${liveRevenue.toFixed(2)} CAD
          </p>
          <p className="text-[11px] text-olive-700 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Live revenue calculated from database
          </p>
        </div>
      </div>

      {/* 2. Active Orders */}
      <div className="bg-offwhite-surface border border-copen-border p-5 rounded-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-copen-muted">
          <span className="uppercase tracking-widest font-medium text-[10px]">Active Orders</span>
          <Package className="w-4 h-4 text-olive-600" />
        </div>
        <div className="space-y-1">
          <p className="font-serif text-2xl text-copen-black">
            {liveOrdersCount} Orders
          </p>
          <p className="text-[11px] text-copen-gray">
            {processingOrdersCount} awaiting workshop fulfillment
          </p>
        </div>
      </div>

      {/* 3. Registered Clients */}
      <div className="bg-offwhite-surface border border-copen-border p-5 rounded-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-copen-muted">
          <span className="uppercase tracking-widest font-medium text-[10px]">Registered Clients</span>
          <Users className="w-4 h-4 text-olive-600" />
        </div>
        <div className="space-y-1">
          <p className="font-serif text-2xl text-copen-black">
            {totalUsers} Accounts
          </p>
          <p className="text-[11px] text-olive-700 flex items-center gap-1 font-medium">
            <Database className="w-3 h-3 text-olive-600" />
            <span>{totalAdmins} Admin(s) • {totalSessions} Active Sessions</span>
          </p>
        </div>
      </div>

      {/* 4. Catalog Inventory & Low Stock */}
      <div className="bg-offwhite-surface border border-copen-border p-5 rounded-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-copen-muted">
          <span className="uppercase tracking-widest font-medium text-[10px]">Catalog Inventory</span>
          <ShoppingBag className="w-4 h-4 text-olive-600" />
        </div>
        <div className="space-y-1">
          <p className="font-serif text-2xl text-copen-black">
            {liveProductsCount} Pieces
          </p>
          <p className={`text-[11px] font-medium ${lowStockCount > 0 ? 'text-amber-700' : 'text-olive-700'}`}>
            {lowStockCount > 0 ? `${lowStockCount} items running low in stock` : 'Optimal stock levels maintained'}
          </p>
        </div>
      </div>
    </div>
  );
};
