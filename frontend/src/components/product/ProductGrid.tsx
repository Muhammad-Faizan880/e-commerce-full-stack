import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import type { Product, CategoryFilter, SortOption } from '../../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  onQuickView: (product: Product) => void;
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  onQuickView,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'seating', label: 'Lounge Seating' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'tables', label: 'Tables & Benches' },
    { id: 'decor', label: 'Decor & Storage' },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => {
          if (a.badge === 'NEW ARRIVAL' && b.badge !== 'NEW ARRIVAL') return -1;
          if (b.badge === 'NEW ARRIVAL' && a.badge !== 'NEW ARRIVAL') return 1;
          return 0;
        });
        break;
      case 'featured':
      default:
        // natural featured order
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, sortOption]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb matching image: Home > Products */}
      <div className="flex items-center justify-center gap-2 text-[11px] tracking-wider uppercase text-copen-muted">
        <span
          onClick={() => onSelectCategory('all')}
          className="hover:text-copen-black cursor-pointer transition-colors"
        >
          Home
        </span>
        <span>&gt;</span>
        <span className="text-copen-black font-medium">Products</span>
      </div>

      {/* Main Page Heading matching image */}
      <div className="text-center mt-3 mb-10 sm:mb-14">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-copen-black tracking-tight">
          Products
        </h1>
        <p className="text-xs sm:text-sm text-copen-gray mt-2 font-normal">
          Explore complete range of our offerings.
        </p>
      </div>

      {/* Category Pills & Filter Bar */}
      <div className="border-b border-copen-border pb-4 mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 text-[11px] tracking-wider uppercase font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-olive-600 text-offwhite-50 shadow-xs'
                    : 'text-copen-gray hover:text-copen-black hover:bg-offwhite-hover'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Counts and Sort Bar matching image */}
          <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto text-[11px] uppercase tracking-wider text-copen-gray">
            <span className="font-medium text-copen-muted">
              SHOWING {filteredProducts.length} OF {PRODUCTS.length} PRODUCTS
            </span>

            <div className="flex items-center gap-4">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="flex items-center gap-1.5 text-copen-gray hover:text-copen-black transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-olive-600" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="relative inline-flex items-center">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-transparent text-copen-black text-[11px] tracking-wider uppercase font-medium pr-5 py-1 appearance-none focus:outline-none cursor-pointer border-b border-transparent hover:border-copen-charcoal transition-colors"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-copen-gray pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {showSearchInput && (
          <div className="mt-4 pt-4 border-t border-copen-border/60 flex items-center gap-2 animate-fade-in">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-copen-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, material, or category..."
                className="w-full bg-offwhite-surface border border-copen-border text-xs pl-9 pr-8 py-2 text-copen-black placeholder:text-copen-muted focus:outline-none focus:border-olive-600"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-copen-muted hover:text-copen-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Grid - Exactly matching layout and spacing */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-offwhite-card/40 border border-dashed border-copen-border">
          <p className="font-serif font-bold text-2xl text-copen-black">No offerings found</p>
          <p className="text-xs text-copen-muted mt-2">
            Try adjusting your search or filtering by another category.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-semibold uppercase tracking-wider text-olive-700 underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
};
