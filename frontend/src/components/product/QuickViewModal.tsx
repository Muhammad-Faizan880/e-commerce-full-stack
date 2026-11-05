import React, { useState, useEffect } from 'react';
import { Star, Shield, Truck, Check, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types/product';
import { handleImageError } from '../../data/products';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { QuantitySelector } from '../ui/QuantitySelector';
import { useCart } from '../../context/CartContext';

export interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addItem, currency } = useCart();
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0]?.name || '');
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor);
    onClose();
  };

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Modal isOpen={Boolean(product)} onClose={onClose} maxWidth="3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-4/5 w-full bg-offwhite-card border border-copen-border overflow-hidden relative">
            <img
              src={product.gallery[activeImageIndex] || product.image}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <div className="absolute top-3 left-3">
                <Badge variant={product.badge === 'SALE' ? 'sale' : 'almond'}>
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.gallery.length > 1 && (
            <div className="flex gap-2">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 bg-offwhite-card border overflow-hidden transition-all ${
                    activeImageIndex === idx
                      ? 'border-olive-600 ring-1 ring-olive-600'
                      : 'border-copen-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" onError={handleImageError} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Controls */}
        <div className="flex flex-col space-y-5">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-copen-muted font-medium">
              {product.categoryLabel}
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-copen-black mt-1">
              {product.name}
            </h2>
            {product.subtitle && (
              <p className="text-xs text-copen-gray mt-1">{product.subtitle}</p>
            )}

            {/* Price & Rating */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-copen-border">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-medium text-copen-black">
                  ${product.price.toFixed(2)} {currency}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-copen-muted line-through">
                    ${product.compareAtPrice?.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-copen-charcoal">
                <div className="flex text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-copen-muted">({product.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-copen-gray leading-relaxed border-t border-copen-border/60 pt-3">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-copen-gray uppercase tracking-wider text-[11px] font-medium">
                  Finish / Shade:
                </span>
                <span className="font-medium text-copen-black">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.name);
                      if (product.gallery[i]) setActiveImageIndex(i);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 border text-xs transition-all ${
                      selectedColor === c.name
                        ? 'border-olive-600 bg-olive-50 text-olive-900 font-medium'
                        : 'border-copen-border hover:border-copen-charcoal text-copen-charcoal'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-copen-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specs */}
          <div className="bg-offwhite-card p-3 space-y-1.5 text-[11px] text-copen-gray border border-copen-border">
            <div className="flex justify-between">
              <span className="text-copen-muted">Material:</span>
              <span className="font-medium text-copen-black">{product.material}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-copen-muted">Dimensions:</span>
              <span className="font-medium text-copen-black">{product.dimensions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-copen-muted">Availability:</span>
              <span className="font-medium text-olive-700 flex items-center gap-1">
                <Check className="w-3 h-3" /> In Stock for dispatch
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                size="md"
              />
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleAddToCart}
                leftIcon={<ShoppingBag className="w-4 h-4" />}
              >
                Add To Bag — ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-copen-muted text-center pt-2">
              <div className="flex items-center justify-center gap-1">
                <Truck className="w-3 h-3 text-olive-600" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Shield className="w-3 h-3 text-olive-600" />
                <span>10-Year Craft Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

