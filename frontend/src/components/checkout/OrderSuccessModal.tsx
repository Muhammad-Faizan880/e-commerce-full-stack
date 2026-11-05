import React from 'react';
import { CheckCircle2, Truck, ArrowRight, Printer } from 'lucide-react';
import type { OrderConfirmation } from '../../types/checkout';
import { handleImageError } from '../../data/products';
import { Button } from '../ui/Button';

export interface OrderSuccessModalProps {
  order: OrderConfirmation | null;
  onContinueShopping: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onContinueShopping,
}) => {
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="bg-offwhite-surface border border-copen-border p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header Confirmation */}
        <div className="text-center space-y-3 border-b border-copen-border pb-8">
          <div className="w-16 h-16 mx-auto bg-olive-100 rounded-full flex items-center justify-center text-olive-700">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-olive-700 font-semibold">
            Order Confirmed • Receipt #{order.orderId}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-copen-black">
            Thank you, {order.shippingAddress.firstName}
          </h1>
          <p className="text-xs text-copen-gray max-w-md mx-auto">
            Your Scandinavian furnishings are being prepared with care in our Copenhagen workshop. A confirmation email has been dispatched to{' '}
            <strong className="text-copen-black">{order.shippingAddress.email}</strong>.
          </p>
        </div>

        {/* Delivery Timeline info */}
        <div className="bg-offwhite-card border border-copen-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-olive-600 shrink-0" />
            <div>
              <span className="font-medium text-copen-black block">
                Estimated Delivery Window
              </span>
              <span className="text-copen-muted">
                {order.shippingOption.name} ({order.shippingOption.estimate})
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2.5 py-1 text-[10px] uppercase font-semibold bg-olive-600 text-offwhite-50 tracking-wider">
              Preparing for Dispatch
            </span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-copen-border pb-8">
          {/* Shipping Address */}
          <div className="space-y-1.5">
            <h4 className="font-semibold uppercase tracking-wider text-[11px] text-copen-black">
              Shipping Destination
            </h4>
            <p className="text-copen-gray">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p className="text-copen-gray">{order.shippingAddress.address}</p>
            {order.shippingAddress.apartment && (
              <p className="text-copen-gray">Apt/Suite {order.shippingAddress.apartment}</p>
            )}
            <p className="text-copen-gray">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-copen-gray">{order.shippingAddress.country}</p>
            <p className="text-copen-muted pt-1">Tel: {order.shippingAddress.phone}</p>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <h4 className="font-semibold uppercase tracking-wider text-[11px] text-copen-black">
              Payment & Settlement
            </h4>
            <p className="text-copen-gray capitalize">
              Method: {order.paymentMethod.replace('-', ' ')}
            </p>
            <p className="text-copen-muted">Date: {order.orderDate}</p>
            <p className="text-copen-muted">Invoice Ref: INV-{order.orderId.replace('#', '')}</p>
            <p className="text-olive-700 font-medium pt-1">
              ✓ Transaction Verified & Secured
            </p>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-3">
          <h4 className="font-semibold uppercase tracking-wider text-[11px] text-copen-black">
            Acquired Pieces ({order.items.length})
          </h4>

          <div className="divide-y divide-copen-border/60">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.gallery[0] || item.product.image}
                    alt={item.product.name}
                    onError={handleImageError}
                    className="w-12 h-12 object-cover bg-offwhite-card border border-copen-border"
                  />
                  <div>
                    <h5 className="font-serif text-sm text-copen-black">
                      {item.product.name}
                    </h5>
                    <p className="text-copen-muted text-[11px]">
                      Qty: {item.quantity} • Finish: {item.selectedColor || 'Standard'}
                    </p>
                  </div>
                </div>
                <span className="font-medium text-copen-black">
                  ${(item.product.price * item.quantity).toFixed(2)} CAD
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-copen-border pt-4 space-y-1.5 text-xs text-copen-gray">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)} CAD</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-olive-700 font-medium">
              <span>Promotional Savings</span>
              <span>-${order.discount.toFixed(2)} CAD</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {order.shippingFee === 0 ? 'Complimentary' : `$${order.shippingFee.toFixed(2)} CAD`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Provincial / Federal Tax (5%)</span>
            <span>${order.tax.toFixed(2)} CAD</span>
          </div>
          <div className="flex justify-between items-baseline pt-3 border-t border-copen-border text-base text-copen-black font-serif font-medium">
            <span>Total Paid</span>
            <span className="text-xl">${order.total.toFixed(2)} CAD</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onContinueShopping}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue Exploring Copenhagen
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};
