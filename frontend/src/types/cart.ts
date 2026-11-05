import type { Product } from './product';

export interface CartItem {
  id: string; // composite key: product.id + selected color/variant
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  description: string;
}

