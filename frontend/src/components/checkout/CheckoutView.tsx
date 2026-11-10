import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Lock,
  Tag,
  Building,
  Smartphone,
  User as UserIcon,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SHIPPING_OPTIONS, handleImageError } from '../../data/products';
import type { ShippingAddress, ShippingOption, PaymentMethodType, OrderConfirmation } from '../../types/checkout';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export const CheckoutView: React.FC = () => {
  const {
    cartItems,
    subtotal,
    discountAmount,
    activePromo,
    applyPromo,
    removePromo,
    setCurrentView,
    clearCart,
    setLastOrder,
  } = useCart();

  const { showToast } = useToast();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Form State
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    apartment: user?.apartment || '',
    city: user?.city || '',
    state: user?.state || '',
    postalCode: user?.postalCode || '',
    country: user?.country || 'Canada',
    saveForNextTime: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit-card');

  // Credit Card mock state
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8821',
    holder: user ? `${user.firstName} ${user.lastName}`.trim().toUpperCase() : '',
    expiry: '08/28',
    cvv: '392',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        apartment: user.apartment || prev.apartment,
        city: user.city || prev.city,
        state: user.state || prev.state,
        postalCode: user.postalCode || prev.postalCode,
        country: user.country || prev.country,
      }));
      setCardData((prev) => ({
        ...prev,
        holder: `${user.firstName} ${user.lastName}`.toUpperCase(),
      }));
    }
  }, [user]);

  const [promoInput, setPromoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const shippingCost = subtotal >= 300 && selectedShipping.id === 'standard' ? 0 : selectedShipping.price;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.05; // 5% GST/PST
  const total = taxableAmount + shippingCost + tax;

  const handleInputChange = (field: keyof ShippingAddress, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fulfill the necessary shipping fields', 'error');
      return;
    }

    if (cartItems.length === 0) {
      showToast('Your bag has no items', 'error');
      return;
    }

    // Step to gate payment: Prompt login / register if not authenticated
    if (!isAuthenticated) {
      showToast('Please sign in or register to complete your payment', 'info');
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `#CPH-${Math.floor(100000 + Math.random() * 900000)}`;
      const confirmation: OrderConfirmation = {
        orderId,
        orderDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        items: [...cartItems],
        shippingAddress: formData,
        shippingOption: { ...selectedShipping, price: shippingCost },
        paymentMethod,
        subtotal,
        discount: discountAmount,
        shippingFee: shippingCost,
        tax,
        total,
        status: 'confirmed',
      };

      setLastOrder(confirmation);
      clearCart();
      setIsSubmitting(false);
      setCurrentView('success');
      showToast(`Order ${orderId} successfully placed!`, 'success');
    }, 1200);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      if (applyPromo(promoInput)) {
        setPromoInput('');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb & Return to shop */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-copen-border">
        <button
          type="button"
          onClick={() => setCurrentView('shop')}
          className="flex items-center gap-2 text-xs uppercase tracking-wider text-copen-gray hover:text-copen-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Copenhagen Gallery</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-olive-700 font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Checkout Forms (7 cols) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-10">
          {/* Section 1: Customer & Delivery Address */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-2xl text-copen-black">
                1. Delivery Destination
              </h2>
              <span className="text-[11px] uppercase tracking-wider text-copen-muted">
                Step 1 of 3
              </span>
            </div>

            {/* Member status banner or Sign In prompt */}
            {isAuthenticated && user ? (
              <div className="p-3 bg-olive-50/80 border border-olive-200/90 rounded-xs flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-olive-600 shrink-0" />
                  <span className="text-copen-black">
                    Signed in as <span className="font-semibold text-olive-800">{user.firstName} {user.lastName}</span> ({user.email})
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-olive-700 font-semibold px-2 py-0.5 bg-offwhite-surface border border-olive-300 rounded-xs">
                  {user.memberTier || 'Member'}
                </span>
              </div>
            ) : (
              <div className="p-3.5 bg-offwhite-card border border-copen-border rounded-xs flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-olive-700 shrink-0" />
                  <span className="text-copen-gray">
                    Have a Copenhagen account? Sign in for saved delivery addresses.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-xs uppercase tracking-wider font-semibold text-olive-700 hover:text-olive-900 underline underline-offset-4 cursor-pointer shrink-0"
                >
                  Sign In
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={formErrors.firstName}
              />
              <Input
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={formErrors.lastName}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address (for dispatch updates)"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={formErrors.email}
              />
              <Input
                label="Phone Number"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={formErrors.phone}
              />
            </div>

            <Input
              label="Street Address"
              required
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={formErrors.address}
              placeholder="House number and street name"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Apt / Suite / Floor (Optional)"
                value={formData.apartment || ''}
                onChange={(e) => handleInputChange('apartment', e.target.value)}
              />
              <Input
                label="City"
                required
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={formErrors.city}
              />
              <Input
                label="Postal Code"
                required
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                error={formErrors.postalCode}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Province / Region"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                options={[
                  { value: 'Quebec', label: 'Quebec (QC)' },
                  { value: 'Ontario', label: 'Ontario (ON)' },
                  { value: 'British Columbia', label: 'British Columbia (BC)' },
                  { value: 'Alberta', label: 'Alberta (AB)' },
                  { value: 'Nova Scotia', label: 'Nova Scotia (NS)' },
                ]}
              />
              <Select
                label="Country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                options={[
                  { value: 'Canada', label: 'Canada' },
                  { value: 'United States', label: 'United States' },
                  { value: 'Denmark', label: 'Denmark' },
                  { value: 'United Kingdom', label: 'United Kingdom' },
                ]}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-copen-gray">
              <input
                type="checkbox"
                checked={formData.saveForNextTime}
                onChange={(e) => handleInputChange('saveForNextTime', e.target.checked)}
                className="w-4 h-4 accent-olive-600 rounded-xs"
              />
              <span>Save delivery information for future acquisitions</span>
            </label>
          </div>

          {/* Section 2: Shipping Method */}
          <div className="space-y-6 pt-6 border-t border-copen-border">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-2xl text-copen-black">
                2. Shipping & Handling
              </h2>
              <span className="text-[11px] uppercase tracking-wider text-copen-muted">
                Step 2 of 3
              </span>
            </div>

            <div className="space-y-3">
              {SHIPPING_OPTIONS.map((option) => {
                const isComplimentary = subtotal >= 300 && option.id === 'standard';
                const isSelected = selectedShipping.id === option.id;

                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedShipping(option)}
                    className={`p-4 border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-olive-600 bg-olive-50/50 shadow-xs ring-1 ring-olive-600'
                        : 'border-copen-border bg-offwhite-surface hover:border-copen-charcoal'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <input
                          type="radio"
                          name="shippingOption"
                          checked={isSelected}
                          onChange={() => setSelectedShipping(option)}
                          className="w-4 h-4 accent-olive-600"
                        />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-copen-black block">
                          {option.name}
                        </span>
                        <p className="text-xs text-copen-muted mt-0.5">
                          {option.description} •{' '}
                          <span className="text-copen-gray font-medium">
                            {option.estimate}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {isComplimentary ? (
                        <span className="text-xs font-semibold text-olive-700 uppercase tracking-wider">
                          Complimentary
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm font-medium text-copen-black">
                          {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)} CAD`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-6 pt-6 border-t border-copen-border">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-2xl text-copen-black">
                3. Payment Method
              </h2>
              <span className="text-[11px] uppercase tracking-wider text-copen-muted">
                Step 3 of 3
              </span>
            </div>

            {/* Account requirement banner if guest is about to pay */}
            {!isAuthenticated && (
              <div className="bg-olive-50/90 border border-olive-200 p-4 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-olive-700/10 text-olive-800 flex items-center justify-center shrink-0">
                    <UserIcon className="w-4 h-4 text-olive-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-copen-black">
                      Sign in required for payment
                    </p>
                    <p className="text-[11px] text-copen-gray mt-0.5">
                      Create an account or sign in to finalize payment and record your bespoke order.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => openAuthModal('login')}
                  className="shrink-0 text-xs tracking-wider"
                >
                  Sign In / Register
                </Button>
              </div>
            )}

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit-card')}
                className={`p-3 border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'credit-card'
                    ? 'border-olive-600 bg-olive-50/60 font-medium text-olive-900 ring-1 ring-olive-600'
                    : 'border-copen-border bg-offwhite-surface text-copen-gray hover:border-copen-charcoal'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple-pay')}
                className={`p-3 border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'apple-pay'
                    ? 'border-olive-600 bg-olive-50/60 font-medium text-olive-900 ring-1 ring-olive-600'
                    : 'border-copen-border bg-offwhite-surface text-copen-gray hover:border-copen-charcoal'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider">Digital Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'cod'
                    ? 'border-olive-600 bg-olive-50/60 font-medium text-olive-900 ring-1 ring-olive-600'
                    : 'border-copen-border bg-offwhite-surface text-copen-gray hover:border-copen-charcoal'
                }`}
              >
                <Building className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider">Pay on Delivery</span>
              </button>
            </div>

            {/* Credit Card Fields */}
            {paymentMethod === 'credit-card' && (
              <div className="space-y-4 p-5 bg-offwhite-card border border-copen-border">
                <div className="flex items-center justify-between text-xs text-copen-gray pb-2 border-b border-copen-border/60">
                  <span className="font-medium text-copen-black uppercase tracking-wider text-[11px]">
                    Card Information
                  </span>
                  <div className="flex items-center gap-2 text-copen-muted">
                    <span className="text-[10px] font-bold">VISA</span>
                    <span className="text-[10px] font-bold">MASTERCARD</span>
                    <span className="text-[10px] font-bold">AMEX</span>
                  </div>
                </div>

                <Input
                  label="Card Number"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  rightIcon={<Lock className="w-3.5 h-3.5" />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiration Date"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    placeholder="MM / YY"
                  />
                  <Input
                    label="Security Code (CVV)"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    placeholder="123"
                  />
                </div>

                <Input
                  label="Name on Card"
                  value={cardData.holder}
                  onChange={(e) => setCardData({ ...cardData, holder: e.target.value })}
                  placeholder="Full name as printed on card"
                />
              </div>
            )}

            {paymentMethod === 'apple-pay' && (
              <div className="p-6 bg-offwhite-card border border-copen-border text-center space-y-2">
                <Smartphone className="w-8 h-8 mx-auto text-olive-700" />
                <h4 className="font-serif font-bold text-lg text-copen-black">Instant Digital Settlement</h4>
                <p className="text-xs text-copen-gray max-w-sm mx-auto">
                  Biometric authorization will be prompted via Apple Pay or Google Wallet when placing this order.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-6 bg-offwhite-card border border-copen-border text-center space-y-2">
                <Building className="w-8 h-8 mx-auto text-olive-700" />
                <h4 className="font-serif font-bold text-lg text-copen-black">Pay Upon White-Glove Handover</h4>
                <p className="text-xs text-copen-gray max-w-sm mx-auto">
                  Settle by credit card terminal or certified bank cheque upon arrival and inspection of your items.
                </p>
              </div>
            )}
          </div>

          {/* Place Order CTA */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              className="bg-olive-600 hover:bg-olive-700 text-offwhite-50 text-sm tracking-[0.16em]"
            >
              {isAuthenticated
                ? `Confirm & Complete Acquisition ($${total.toFixed(2)} CAD)`
                : `Sign In to Pay & Place Order ($${total.toFixed(2)} CAD)`}
            </Button>
            <p className="text-center text-[11px] text-copen-muted mt-3">
              {isAuthenticated
                ? 'By confirming your purchase, you authorize Copenhagen to charge your selected payment method.'
                : 'You will be prompted to sign in or create your Copenhagen account to finalize payment.'}
            </p>
          </div>
        </form>

        {/* Right Column: Sticky Order Summary (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-offwhite-surface border border-copen-border p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-copen-border pb-4">
              <h3 className="font-serif font-bold text-xl text-copen-black">
                Order Review ({cartItems.length})
              </h3>
              <span className="text-xs text-copen-muted">Copenhagen CAD</span>
            </div>

            {/* Line items list with thumbnails */}
            <div className="divide-y divide-copen-border/60 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="relative">
                    <img
                      src={item.product.gallery[0] || item.product.image}
                      alt={item.product.name}
                      onError={handleImageError}
                      className="w-14 h-14 object-cover bg-offwhite-card border border-copen-border"
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-copen-black text-offwhite-50 text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-medium">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-copen-black truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-copen-muted uppercase tracking-wider block">
                      {item.selectedColor || 'Standard'}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-copen-black shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="border-t border-copen-border pt-4">
              {activePromo ? (
                <div className="flex items-center justify-between text-xs bg-olive-100 p-2.5 border border-olive-300 text-olive-900">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5 text-olive-700" />
                    <span>
                      {activePromo.code} ({activePromo.discountPercentage}% OFF)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="text-xs text-olive-800 hover:text-olive-950 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Coupon code (COPEN10)"
                    className="flex-1 bg-offwhite border border-copen-border text-xs px-3 py-2 text-copen-black uppercase placeholder:normal-case placeholder:text-copen-muted focus:outline-none focus:border-olive-600"
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    Apply
                  </Button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-copen-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-copen-gray">
                <span>Subtotal</span>
                <span className="text-copen-black font-medium">
                  ${subtotal.toFixed(2)} CAD
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-olive-700 font-medium">
                  <span>Promotional Savings</span>
                  <span>-${discountAmount.toFixed(2)} CAD</span>
                </div>
              )}

              <div className="flex justify-between text-copen-gray">
                <span>Transit & White-Glove</span>
                <span className="text-copen-black font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-olive-700 font-semibold uppercase text-[10px]">
                      Complimentary
                    </span>
                  ) : (
                    `$${shippingCost.toFixed(2)} CAD`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-copen-gray">
                <span>Estimated Sales Tax (5% GST/PST)</span>
                <span className="text-copen-black font-medium">
                  ${tax.toFixed(2)} CAD
                </span>
              </div>

              <div className="border-t border-copen-border pt-3 flex justify-between items-baseline">
                <span className="font-serif font-bold text-lg text-copen-black">Final Amount</span>
                <div className="text-right">
                  <span className="text-[10px] text-copen-muted block">CAD Currency</span>
                  <span className="font-serif text-2xl font-bold text-copen-black">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Guarantee badge */}
            <div className="bg-offwhite-card border border-copen-border p-3.5 flex items-center gap-3 text-xs text-copen-gray">
              <ShieldCheck className="w-5 h-5 text-olive-600 shrink-0" />
              <span>
                Backed by 30-Day Nordic In-Home Trial and 10-Year Craftsmanship Guarantee.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
