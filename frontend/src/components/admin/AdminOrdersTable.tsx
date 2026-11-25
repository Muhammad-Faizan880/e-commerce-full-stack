import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { BackendOrder } from '../../api/orderApi';

interface AdminOrdersTableProps {
  orders: BackendOrder[];
  onUpdateStatus: (orderId: string, status: string) => Promise<void> | void;
}

export const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
  orders,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled'>('all');

  const filteredOrders = orders.filter((o) => {
    const clientName = `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      clientName.includes(term) ||
      (o.orderNumber && o.orderNumber.toLowerCase().includes(term)) ||
      (o.shippingAddress?.email && o.shippingAddress.email.toLowerCase().includes(term));
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-offwhite-surface border border-copen-border overflow-hidden rounded-xs">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-copen-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-copen-muted" />
          <input
            type="text"
            placeholder="Filter by customer, email, or order #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-offwhite border border-copen-border text-xs pl-8 pr-3 py-2 text-copen-black placeholder:text-copen-muted focus:outline-none focus:border-olive-600"
          />
        </div>

        {/* Status Lifecycle Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'Processing', 'In Transit', 'Delivered', 'Cancelled'] as const).map((st) => {
            const count = st === 'all' ? orders.length : orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-xs transition cursor-pointer font-medium ${
                  statusFilter === st
                    ? 'bg-copen-black text-white shadow-xs'
                    : 'bg-offwhite-card border border-copen-border text-copen-gray hover:text-copen-black'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-offwhite-card border-b border-copen-border text-[10px] uppercase tracking-widest text-copen-gray">
            <tr>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Pieces Ordered</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Tracking Status</th>
              <th className="py-3 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-copen-border">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const clientName = `${order.shippingAddress?.firstName || 'Valued'} ${order.shippingAddress?.lastName || 'Client'}`;
                const itemsSummary = (order.items || []).map((i) => `${i.name} (${i.quantity})`).join(', ');

                return (
                  <tr key={order._id} className="hover:bg-offwhite-hover/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-copen-black">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-copen-black">{clientName}</p>
                      <p className="text-[10px] text-copen-muted">{order.shippingAddress?.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-copen-gray max-w-xs truncate" title={itemsSummary}>
                      {itemsSummary || 'Scandinavian Pieces'}
                    </td>
                    <td className="py-3.5 px-4 text-copen-muted text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-xs border cursor-pointer focus:outline-none transition ${
                          order.status === 'Delivered'
                            ? 'bg-olive-100 text-olive-800 border-olive-300'
                            : order.status === 'In Transit'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
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
                      ${(order.total || 0).toFixed(2)} CAD
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-copen-gray text-xs">
                  No orders match the current filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
