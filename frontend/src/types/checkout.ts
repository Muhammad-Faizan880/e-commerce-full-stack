import type { CartItem } from './cart';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  saveForNextTime?: boolean;
}

export interface ShippingOption {
  id: 'standard' | 'express' | 'white-glove';
  name: string;
  estimate: string;
  price: number;
  description: string;
}

export type PaymentMethodType = 'credit-card' | 'cod' | 'apple-pay' | 'bank-transfer';

export interface PaymentDetails {
  method: PaymentMethodType;
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
}

export interface OrderConfirmation {
  orderId: string;
  orderDate: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingOption: ShippingOption;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped';
}

