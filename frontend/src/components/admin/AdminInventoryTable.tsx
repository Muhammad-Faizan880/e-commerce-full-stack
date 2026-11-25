import React, { useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Product } from '../../types/product';

interface AdminInventoryTableProps {
  products: Product[];
  onQuickStockChange: (productId: string, currentStock: number, delta: number) => Promise<void> | void;
  onDeleteProduct: (productId: string, productName: string) => Promise<void> | void;
  onAddNewPiece: () => void;
  updatingStockId: string | null;
}

export const AdminInventoryTable: React.FC<AdminInventoryTableProps> = ({
  products,
  onQuickStockChange,
  onDeleteProduct,
  onAddNewPiece,
  updatingStockId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const filteredProducts = products.filter((p) => {
    const prodId = p.id || (p as unknown as { _id?: string })._id || '';
    const skuStr = (p.sku || p.productSku || `CPN-${p.category.slice(0, 3).toUpperCase()}-${prodId.slice(-4).toUpperCase()}`).toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      skuStr.includes(term);

    const stockVal = (p as unknown as { stock?: number }).stock ?? (p.inStock ? 10 : 0);
    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = stockVal <= 5 && stockVal > 0;
    if (stockFilter === 'out') matchesStock = stockVal === 0;

    return matchesSearch && matchesStock;
  });

  return (
    <div className="bg-offwhite-surface border border-copen-border overflow-hidden rounded-xs">
      {/* Header bar */}
      <div className="p-4 border-b border-copen-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs uppercase tracking-widest font-semibold text-copen-black">
            Catalog Inventory &amp; Stock Tracking ({products.length} Pieces)
          </h3>
          <p className="text-[11px] text-copen-gray mt-0.5">
            Live synchronized inventory, SKU barcode tracking, and real-time inline stock adjustments
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onAddNewPiece}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add New Piece
        </Button>
      </div>

      {/* Inventory & Stock Filter Bar */}
      <div className="p-3 border-b border-copen-border bg-offwhite flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-copen-muted" />
          <input
            type="text"
            placeholder="Filter by piece name, category, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-offwhite-card border border-copen-border text-xs pl-8 pr-3 py-1.5 text-copen-black placeholder:text-copen-muted focus:outline-none focus:border-olive-600"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setStockFilter('all')}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-xs transition cursor-pointer font-medium ${
              stockFilter === 'all'
                ? 'bg-copen-black text-white shadow-xs'
                : 'bg-offwhite-card border border-copen-border text-copen-gray hover:text-copen-black'
            }`}
          >
            All ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('low')}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-xs transition cursor-pointer font-medium ${
              stockFilter === 'low'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-offwhite-card border border-amber-300 text-amber-800 hover:bg-amber-50'
            }`}
          >
            Low Stock (&le;5) ({products.filter((p) => {
              const st = (p as unknown as { stock?: number }).stock ?? (p.inStock ? 10 : 0);
              return st <= 5 && st > 0;
            }).length})
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('out')}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-xs transition cursor-pointer font-medium ${
              stockFilter === 'out'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-offwhite-card border border-rose-300 text-rose-800 hover:bg-rose-50'
            }`}
          >
            Out of Stock ({products.filter((p) => {
              const st = (p as unknown as { stock?: number }).stock ?? (p.inStock ? 10 : 0);
              return st === 0;
            }).length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-offwhite-card border-b border-copen-border text-[10px] uppercase tracking-widest text-copen-gray">
            <tr>
              <th className="py-3 px-4">SKU / Ref</th>
              <th className="py-3 px-4">Design Piece</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Stock &amp; Quick Adjust</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-copen-border">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                const prodId = p.id || (p as unknown as { _id?: string })._id || '';
                const stockVal = (p as unknown as { stock?: number }).stock ?? (p.inStock ? 10 : 0);
                const displaySku = p.sku || p.productSku || `CPN-${p.category.slice(0, 3).toUpperCase()}-${prodId.slice(-4).toUpperCase()}`;
                const isUpdating = updatingStockId === prodId;

                return (
                  <tr key={prodId} className="hover:bg-offwhite-hover/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] bg-offwhite border border-copen-border px-1.5 py-0.5 rounded-xs text-copen-black font-semibold">
                        {displaySku}
                      </span>
                    </td>
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
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <button
                          type="button"
                          disabled={isUpdating || stockVal <= 0}
                          onClick={() => onQuickStockChange(prodId, stockVal, -1)}
                          className="w-5 h-5 flex items-center justify-center border border-copen-border bg-offwhite hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition cursor-pointer"
                          title="Decrease stock by 1"
                        >
                          -
                        </button>
                        <span
                          className={`min-w-[28px] text-center font-bold text-xs ${
                            stockVal === 0
                              ? 'text-rose-700'
                              : stockVal <= 5
                              ? 'text-amber-700'
                              : 'text-copen-black'
                          }`}
                        >
                          {isUpdating ? '...' : stockVal}
                        </span>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => onQuickStockChange(prodId, stockVal, +1)}
                          className="w-5 h-5 flex items-center justify-center border border-copen-border bg-offwhite hover:bg-neutral-200 disabled:opacity-30 text-xs transition cursor-pointer"
                          title="Increase stock by 1"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => onQuickStockChange(prodId, stockVal, +10)}
                          className="text-[9px] px-1.5 py-0.5 border border-copen-border bg-offwhite hover:bg-olive-50 hover:text-olive-800 text-copen-gray transition cursor-pointer"
                          title="Restock +10 units"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-medium inline-block ${
                          stockVal > 5
                            ? 'bg-olive-100 text-olive-800'
                            : stockVal > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800 font-semibold'
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
                        onClick={() => onDeleteProduct(prodId, p.name)}
                        className="text-rose-600 hover:text-rose-800 transition-colors p-1 cursor-pointer"
                        title="Delete from Catalog"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-copen-gray text-xs">
                  No catalog pieces found for the active search or stock filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
