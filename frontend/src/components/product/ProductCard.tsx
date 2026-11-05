import React, { useState } from 'react';
import { Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types/product';
import { handleImageError } from '../../data/products';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';

export interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || ''
  );
  const [imageIndex, setImageIndex] = useState(0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1, selectedColor);
  };

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col cursor-pointer transition-all duration-300"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-offwhite-card border border-copen-border/60 transition-colors group-hover:border-copen-border">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.badge && (
            <Badge
              variant={
                product.badge === 'SALE'
                  ? 'sale'
                  : product.badge === 'COPENHAGEN ALMOND'
                  ? 'almond'
                  : 'olive'
              }
            >
              {product.badge}
            </Badge>
          )}
        </div>

        {/* Hover Action Buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-9 h-9 bg-offwhite-surface/90 backdrop-blur-xs border border-copen-border text-copen-black hover:bg-copen-black hover:text-offwhite-50 flex items-center justify-center transition-colors shadow-xs"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Image */}
        <img
          src={product.gallery[imageIndex] || product.image}
          alt={product.name}
          onError={handleImageError}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Quick Add Bar on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-copen-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-offwhite-surface/95 backdrop-blur-xs hover:bg-olive-600 hover:text-offwhite-50 text-copen-black text-[11px] uppercase tracking-wider font-medium py-2.5 px-4 border border-copen-border/80 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Details matching screenshot */}
      <div className="pt-4 flex flex-col items-center text-center space-y-1">
        {/* Subtle Category Tag */}
        <span className="text-[10px] tracking-[0.18em] uppercase text-copen-muted font-medium">
          {product.categoryLabel}
        </span>

        {/* Title */}
        <h3 className="font-serif font-bold text-base sm:text-lg text-copen-black group-hover:text-olive-700 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs sm:text-sm font-medium text-copen-black">
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-copen-muted line-through">
              ${product.compareAtPrice?.toFixed(2)}
            </span>
          )}
        </div>

        {/* Color swatches if any */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-2">
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(c.name);
                  if (product.gallery[idx]) {
                    setImageIndex(idx);
                  }
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor === c.name
                    ? 'ring-1 ring-copen-black ring-offset-1 border-transparent'
                    : 'border-copen-border hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Select ${c.name}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
