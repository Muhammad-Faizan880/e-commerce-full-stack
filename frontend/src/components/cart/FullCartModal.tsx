import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { handleImageError } from '../../data/products';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { QuantitySelector } from '../ui/QuantitySelector';

export const FullCartModal: React.FC = () => {
  const {
    isFullCartOpen,
    setIsFullCartOpen,
    cartItems,
    subtotal,
    discountAmount,
    activePromo,
    applyPromo,
    removePromo,
    updateQuantity,
    removeItem,
    setCurrentView,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [orderNote, setOrderNote] = useState('');

  const handleCheckout = () => {
    setIsFullCartOpen(false);
    setCurrentView('checkout');
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromo(promoCode)) {
      setPromoCode('');
    }
  };

  return (
    <Modal
      isOpen={isFullCartOpen}
      onClose={() => setIsFullCartOpen(false)}
      title="Shopping Bag Review"
      subtitle="Examine your items, add special delivery instructions, and review estimates."
      maxWidth="3xl"
    >
      {cartItems.length === 0 ? (
        <div className="py-12 text-center space-y-4">
          <p className="font-serif text-2xl text-copen-black">Your bag is empty</p>
          <Button variant="primary" onClick={() => setIsFullCartOpen(false)}>
            Discover Offerings
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Items Table */}
          <div className="border border-copen-border overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 bg-offwhite-card px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-copen-gray border-b border-copen-border">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-copen-border/60">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center bg-offwhite-surface"
                >
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <img
                      src={item.product.gallery[0] || item.product.image}
                      alt={item.product.name}
                      onError={handleImageError}
                      className="w-16 h-16 object-cover bg-offwhite-card border border-copen-border shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-base text-copen-black line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-copen-muted">
                        Finish: {item.selectedColor || 'Standard'}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[11px] text-copen-muted hover:text-rose-600 transition-colors mt-1 underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-center w-full sm:w-auto">
                    <QuantitySelector
                      quantity={item.quantity}
                      onChange={(newQty) => updateQuantity(item.id, newQty)}
                      size="sm"
                    />
                  </div>

                  <div className="col-span-2 text-right text-xs text-copen-gray hidden sm:block">
                    ${item.product.price.toFixed(2)}
                  </div>

                  <div className="col-span-2 text-right font-medium text-sm text-copen-black w-full sm:w-auto flex justify-between sm:block">
                    <span className="sm:hidden text-xs text-copen-muted">Total:</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid: Note on left, Summary on right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Special instructions & Promo */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-copen-gray mb-1.5">
                  Special Delivery Instructions / Notes
                </label>
                <textarea
                  rows={3}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Leave with building concierge, specific entrance code..."
                  className="w-full bg-offwhite-surface border border-copen-border text-xs p-3 text-copen-black placeholder:text-copen-muted focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* Promo input */}
              <div className="bg-offwhite-card p-4 border border-copen-border space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-copen-black block">
                  Promotional Coupon
                </span>
                {activePromo ? (
                  <div className="flex items-center justify-between text-xs bg-olive-100 p-2 border border-olive-300 text-olive-900">
                    <span className="font-medium">
                      {activePromo.code} applied ({activePromo.discountPercentage}% OFF)
                    </span>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-xs text-rose-700 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. COPEN10 or OLIVE"
                      className="flex-1 bg-offwhite-surface border border-copen-border text-xs px-3 py-2 text-copen-black uppercase placeholder:normal-case placeholder:text-copen-muted focus:outline-none focus:border-olive-600"
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Apply
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Subtotal & Actions */}
            <div className="bg-offwhite-card border border-copen-border p-6 space-y-4">
              <h4 className="font-serif font-bold text-lg text-copen-black border-b border-copen-border pb-3">
                Order Summary
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-copen-gray">
                  <span>Cart Subtotal</span>
                  <span className="font-medium text-copen-black">
                    ${subtotal.toFixed(2)} CAD
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-olive-700 font-medium">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)} CAD</span>
                  </div>
                )}

                <div className="flex justify-between text-copen-gray">
                  <span>Carbon-Neutral Shipping</span>
                  <span className="text-olive-700 font-medium">
                    {subtotal >= 300 ? 'Complimentary' : 'Calculated next'}
                  </span>
                </div>

                <div className="border-t border-copen-border pt-3 flex justify-between items-baseline">
                  <span className="font-serif text-xl text-copen-black">Estimated Total</span>
                  <span className="font-serif text-2xl font-bold text-copen-black">
                    ${(subtotal - discountAmount).toFixed(2)} CAD
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleCheckout}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => setIsFullCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
