import React from 'react';
import { useCart } from '../../context/CartContext';

export const AnnouncementBar: React.FC = () => {
  const { freeShippingQualified, amountNeededForFreeShipping, currency } = useCart();

  return (
    <div className="bg-olive-800 text-offwhite-50 text-[11px] tracking-widest uppercase font-medium py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-olive-200">
          <span>FSC-Certified Craftsmanship & Nordic Design</span>
        </div>

        <div className="mx-auto md:mx-0 text-center">
          {freeShippingQualified ? (
            <span className="text-olive-100 font-semibold">
               You unlocked Complimentary White-Glove Delivery
            </span>
          ) : (
            <span>
              Complimentary shipping on orders over $300 {currency} (Add ${amountNeededForFreeShipping.toFixed(2)} more)
            </span>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 text-olive-200">
          <span className="hover:text-offwhite-50 cursor-pointer transition-colors">Client Support</span>
          <span>•</span>
          <span className="hover:text-offwhite-50 cursor-pointer transition-colors">Showrooms</span>
        </div>
      </div>
    </div>
  );
};

