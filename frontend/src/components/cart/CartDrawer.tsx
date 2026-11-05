import React, { useState } from 'react';
import { ShoppingBag, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { CartItemRow } from './CartItemRow';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    setIsFullCartOpen,
    cartItems,
    subtotal,
    discountAmount,
    activePromo,
    applyPromo,
    removePromo,
    freeShippingQualified,
    amountNeededForFreeShipping,
    shippingThreshold,
    setCurrentView,
    currency,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [showPromoField, setShowPromoField] = useState(false);

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    setIsFullCartOpen(true);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      if (applyPromo(promoInput)) {
        setPromoInput('');
      }
    }
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / shippingThreshold) * 100)
  );

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      title="Cart"
      subtitle="A quick overview of your selected items."
      width="md"
      footer={
        cartItems.length > 0 && (
          <div className="space-y-4">
            {/* Promo Code Drawer Widget */}
            <div className="border-b border-copen-border/80 pb-3">
              {activePromo ? (
                <div className="flex items-center justify-between text-xs bg-olive-100/70 border border-olive-300 p-2 text-olive-900">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5 text-olive-700" />
                    <span>
                      {activePromo.code} ({activePromo.discountPercentage}% OFF)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="text-xs text-olive-800 hover:text-olive-950 underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  {!showPromoField ? (
                    <button
                      type="button"
                      onClick={() => setShowPromoField(true)}
                      className="text-[11px] font-medium uppercase tracking-wider text-copen-gray hover:text-copen-black flex items-center gap-1.5 transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5 text-olive-600" />
                      <span>Have a promotional voucher?</span>
                    </button>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="e.g. COPEN10 or OLIVE"
                        className="flex-1 bg-offwhite-surface border border-copen-border text-xs px-2.5 py-1.5 uppercase tracking-wider text-copen-black placeholder:normal-case placeholder:text-copen-muted focus:outline-none focus:border-olive-600"
                      />
                      <Button type="submit" variant="secondary" size="sm">
                        Apply
                      </Button>
                    </form>
                  )}
                </>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-baseline text-copen-gray">
                <span className="uppercase tracking-widest text-[11px] font-semibold text-copen-black">
                  Subtotal:
                </span>
                <span className="font-medium text-sm text-copen-black">
                  ${subtotal.toFixed(2)} {currency.replace('$', '')}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-olive-700 font-medium">
                  <span>Promotional Discount:</span>
                  <span>-${discountAmount.toFixed(2)} CAD</span>
                </div>
              )}

              <p className="text-[11px] text-copen-muted font-normal pt-1">
                Taxes and <span className="underline decoration-copen-border">shipping</span> calculated at checkout
              </p>
            </div>

            {/* Main Action Buttons matching screenshot */}
            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleGoToCheckout}
                className="bg-olive-600 hover:bg-olive-700 text-offwhite-50 tracking-[0.14em]"
              >
                GO TO CHECKOUT
              </Button>

              <button
                type="button"
                onClick={handleViewCart}
                className="w-full text-center text-xs tracking-[0.14em] uppercase font-medium text-copen-gray hover:text-copen-black py-2.5 transition-colors cursor-pointer"
              >
                VIEW CART
              </button>
            </div>
          </div>
        )
      }
    >
      {/* Free Shipping Progress bar */}
      <div className="mb-4 bg-offwhite-card border border-copen-border p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-copen-black flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-olive-600" />
            {freeShippingQualified ? (
              <span className="text-olive-700 font-semibold">
                ✓ Free White-Glove Shipping unlocked!
              </span>
            ) : (
              <span>
                Add{' '}
                <strong className="text-olive-700">
                  ${amountNeededForFreeShipping.toFixed(2)} CAD
                </strong>{' '}
                more for complimentary shipping
              </span>
            )}
          </span>
          <span className="text-copen-muted">{freeShippingProgress}%</span>
        </div>
        <div className="w-full h-1 bg-copen-border/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-olive-600 transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Items List */}
      {cartItems.length === 0 ? (
        <div className="py-16 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-offwhite-card border border-copen-border flex items-center justify-center text-copen-muted">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="font-serif text-xl text-copen-black">Your bag is empty</p>
            <p className="text-xs text-copen-muted max-w-xs mx-auto">
              Browse our architectural collection of Scandinavian furniture and ambient illumination.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCartOpen(false)}
          >
            Continue Browsing
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-copen-border/40">
          {cartItems.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </Drawer>
  );
};
