export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: 'seating' | 'lighting' | 'tables' | 'bedroom' | 'decor';
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: 'COPENHAGEN ALMOND' | 'SALE' | 'NEW ARRIVAL' | 'BESTSELLER';
  image: string;
  gallery: string[];
  description: string;
  material: string;
  dimensions: string;
  colors?: { name: string; hex: string }[];
  inStock: boolean;
}

export type CategoryFilter = 'all' | 'seating' | 'lighting' | 'tables' | 'bedroom' | 'decor';
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

