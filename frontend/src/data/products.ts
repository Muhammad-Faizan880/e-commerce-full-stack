import type { Product } from '../types/product';

export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80';

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  if (e.currentTarget.src !== FALLBACK_IMAGE) {
    e.currentTarget.src = FALLBACK_IMAGE;
  }
};

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Accent Lounge Chair',
    subtitle: 'Solid white oak frame with sage upholstery',
    category: 'seating',
    categoryLabel: 'Chairs & Armchairs',
    price: 150.0,
    compareAtPrice: 195.0,
    rating: 4.9,
    reviewsCount: 38,
    badge: 'COPENHAGEN ALMOND',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Sculptural comfort rooted in Nordic heritage. Crafted from FSC-certified European white oak with textured olive-toned wool weave, providing relaxed ergonomics and architectural presence in any space.',
    material: 'Solid White Oak, Danish Wool Weave Blend',
    dimensions: 'W 74cm × D 82cm × H 76cm | Seat H 41cm',
    colors: [
      { name: 'Olive Sage', hex: '#6b825a' },
      { name: 'Almond Cream', hex: '#e8dfd1' },
      { name: 'Charcoal Black', hex: '#262626' },
    ],
    inStock: true,
  },
  {
    id: 'prod-2',
    name: 'Artful Canvas Art Board',
    subtitle: 'Framed minimalist relief tray and wall study',
    category: 'decor',
    categoryLabel: 'Art & Wall Decor',
    price: 38.0,
    compareAtPrice: 48.0,
    rating: 4.8,
    reviewsCount: 24,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'A warm wooden presentation piece and tactile wall study carved from sustainably sourced natural ash wood. Finished with an organic matte oil that enhances natural woodgrain contours.',
    material: 'Natural Ash Wood, Organic Linseed Oil',
    dimensions: 'L 46cm × W 32cm × H 3.5cm',
    colors: [
      { name: 'Natural Ash', hex: '#d7c4a7' },
      { name: 'Smoked Walnut', hex: '#5c483a' },
    ],
    inStock: true,
  },
  {
    id: 'prod-3',
    name: 'Basic Platform Bed',
    subtitle: 'Low profile Scandinavian bed with linen headboard',
    category: 'bedroom',
    categoryLabel: 'Bedroom & Beds',
    price: 199.0,
    compareAtPrice: 249.0,
    rating: 5.0,
    reviewsCount: 52,
    badge: 'COPENHAGEN ALMOND',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Elegantly quiet bedtime proportions. Solid slatted foundation with floating tapered legs and a breathable padded Belgian linen headboard tailored in off-white textured canvas.',
    material: 'Nordic Pine Frame, Natural Belgian Linen, Steel Joints',
    dimensions: 'Queen: L 214cm × W 162cm × H 96cm',
    colors: [
      { name: 'Oatmeal Linen', hex: '#e4dece' },
      { name: 'Pebble Gray', hex: '#b5b2a9' },
    ],
    inStock: true,
  },
  {
    id: 'prod-4',
    name: 'Mushroom Accent Lamp',
    subtitle: 'Organic translucent ceramic glowing dome',
    category: 'lighting',
    categoryLabel: 'Table & Ambient Lighting',
    price: 55.0,
    compareAtPrice: 68.0,
    rating: 4.9,
    reviewsCount: 79,
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'A cozy bedside and credenza companion emitting warm 2700K ambient luminescence. Matte glazed handmade stoneware base complemented by a frosted mouth-blown glass canopy.',
    material: 'Glazed Stoneware, Handblown Frosted Glass, Brass Dimmer',
    dimensions: 'Diameter 24cm × H 31cm | Cable 1.8m Fabric Cord',
    colors: [
      { name: 'Warm Chalk', hex: '#f0ece1' },
      { name: 'Olive Ochre', hex: '#738363' },
    ],
    inStock: true,
  },
  {
    id: 'prod-5',
    name: 'Sleek Leather Armchair',
    subtitle: 'Cognac saddle leather over slim tubular frame',
    category: 'seating',
    categoryLabel: 'Chairs & Armchairs',
    price: 319.0,
    compareAtPrice: 380.0,
    rating: 4.9,
    reviewsCount: 41,
    badge: 'NEW ARRIVAL',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Precision architectural lines meet buttery full-grain Tuscan leather. Over time, the untreated aniline leather develops an enviable patina unique to your home.',
    material: 'Semi-Aniline Tuscan Leather, Powder-coated Matte Black Steel',
    dimensions: 'W 68cm × D 74cm × H 78cm',
    colors: [
      { name: 'Cognac Saddle', hex: '#a66938' },
      { name: 'Raven Black', hex: '#1c1c1c' },
      { name: 'Olive Drab', hex: '#586348' },
    ],
    inStock: true,
  },
  {
    id: 'prod-6',
    name: 'Black Dome Table Lamp',
    subtitle: 'Modernist balanced cantilever desk light',
    category: 'lighting',
    categoryLabel: 'Table & Ambient Lighting',
    price: 120.0,
    compareAtPrice: 145.0,
    rating: 4.8,
    reviewsCount: 31,
    badge: 'COPENHAGEN ALMOND',
    image: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Geometric hemisphere shade balanced gracefully on a solid steel stem. Integrated continuous touch dimming with warm glare-free downward diffusion.',
    material: 'Spun Aluminium Shade, Solid Cast Base, Matte Powder Coating',
    dimensions: 'Shade Ø 30cm × Base Ø 18cm × H 42cm',
    colors: [
      { name: 'Matte Charcoal', hex: '#1a1a1a' },
      { name: 'Olive Green', hex: '#4e5f41' },
    ],
    inStock: true,
  },
  {
    id: 'prod-7',
    name: 'Minimalist Wool Sofa',
    subtitle: 'Clean 3-seater lounge with slender raised legs',
    category: 'seating',
    categoryLabel: 'Living & Sofas',
    price: 780.0,
    compareAtPrice: 890.0,
    rating: 5.0,
    reviewsCount: 19,
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Timeless proportions inspired by 1950s Danish modernism. High-resilience cold foam core wrapped in feather down and tailored in textured charcoal-black bouclé.',
    material: 'FSC Solid Pine, High-Density Foam, Charcoal Bouclé Weave',
    dimensions: 'W 210cm × D 88cm × H 73cm | Seat H 42cm',
    colors: [
      { name: 'Midnight Charcoal', hex: '#1f2022' },
      { name: 'Forest Olive', hex: '#394531' },
      { name: 'Stone Sand', hex: '#ded8ce' },
    ],
    inStock: true,
  },
  {
    id: 'prod-8',
    name: 'Handcrafted Oak Coat Rack',
    subtitle: 'Turned sphere wooden pegs on solid oak rail',
    category: 'decor',
    categoryLabel: 'Entryway & Storage',
    price: 65.0,
    compareAtPrice: 75.0,
    rating: 4.7,
    reviewsCount: 46,
    badge: 'COPENHAGEN ALMOND',
    image: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Functional entryway rhythm. Five spherical hand-turned wooden spheres mounted seamlessly on an oiled white oak bracket with concealed magnetic mounting system.',
    material: 'Solid European White Oak, Natural Beeswax Polish',
    dimensions: 'L 60cm × D 9cm × H 12cm',
    colors: [
      { name: 'Natural Oak', hex: '#cca778' },
      { name: 'Smoked Oak', hex: '#5c483a' },
    ],
    inStock: true,
  },
  {
    id: 'prod-9',
    name: 'Sculptural Ceramic Low Bench',
    subtitle: 'Cast sandstone plinth with textured ivory finish',
    category: 'tables',
    categoryLabel: 'Benches & Tables',
    price: 240.0,
    compareAtPrice: 285.0,
    rating: 4.9,
    reviewsCount: 15,
    badge: 'NEW ARRIVAL',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Monolithic silhouette celebrating raw mineral surfaces. Functions as a coffee table, media plinth, or entryway focal bench.',
    material: 'Cast Sandstone Composite, Matte Protective Seal',
    dimensions: 'L 120cm × W 40cm × H 36cm',
    colors: [
      { name: 'Ivory Sandstone', hex: '#ede8dd' },
      { name: 'Basalt Charcoal', hex: '#2b2a29' },
    ],
    inStock: true,
  },
];

export const AVAILABLE_PROMOS = [
  { code: 'COPEN10', discountPercentage: 10, description: '10% off your entire order' },
  { code: 'NORDIC15', discountPercentage: 15, description: '15% off orders over $250' },
  { code: 'OLIVE', discountPercentage: 20, description: '20% special launch discount' },
];

export const SHIPPING_OPTIONS = [
  {
    id: 'standard' as const,
    name: 'Standard Carbon-Neutral Delivery',
    estimate: '3-5 business days',
    price: 0,
    description: 'Tracked shipping with eco-packaging',
  },
  {
    id: 'express' as const,
    name: 'Express DHL Air Freight',
    estimate: '1-2 business days',
    price: 18.0,
    description: 'Priority handling & real-time GPS tracking',
  },
  {
    id: 'white-glove' as const,
    name: 'White Glove Room-of-Choice Delivery',
    estimate: 'Scheduled delivery window',
    price: 45.0,
    description: 'In-home placement, unboxing & packaging recycling',
  },
];
