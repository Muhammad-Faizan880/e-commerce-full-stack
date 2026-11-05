import React from 'react';
import { Trash2 } from 'lucide-react';
import type { CartItem } from '../../types/cart';
import { handleImageError } from '../../data/products';
import { QuantitySelector } from '../ui/QuantitySelector';
import { useCart } from '../../context/CartContext';

export interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const lineTotal = item.product.price * item.quantity;

  return (
    <div className="py-4 border-b border-copen-border/70 flex gap-4 items-start group">
      {/* Thumbnail */}
      <div className="w-16 h-16 bg-offwhite-card border border-copen-border shrink-0 overflow-hidden">
        <img
          src={item.product.gallery[0] || item.product.image}
          alt={item.product.name}
          onError={handleImageError}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-copen-black line-clamp-1">
              {item.product.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-copen-gray">
                ${item.product.price.toFixed(2)}
              </span>
              {item.selectedColor && (
                <span className="text-[10px] text-copen-muted uppercase tracking-wider">
                  / {item.selectedColor}
                </span>
              )}
            </div>
          </div>

          {/* Line Total */}
          <span className="text-xs sm:text-sm font-medium text-copen-black shrink-0">
            ${lineTotal.toFixed(2)}
          </span>
        </div>

        {/* Quantity Controls & Delete Icon matching screenshot */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <QuantitySelector
              quantity={item.quantity}
              onChange={(newQty) => updateQuantity(item.id, newQty)}
              size="sm"
            />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="p-1 text-copen-muted hover:text-rose-600 transition-colors cursor-pointer"
              aria-label={`Remove ${item.product.name} from cart`}
              title="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
