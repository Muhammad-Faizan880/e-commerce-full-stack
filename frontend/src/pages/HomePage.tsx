import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Compass, ChevronRight } from 'lucide-react';
import { fetchProducts } from '../api/productApi';
import { PRODUCTS, handleImageError } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/product';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setQuickViewProduct } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadFeatured = async () => {
      try {
        setLoading(true);
        const liveProducts = await fetchProducts({ sort: 'featured' });
        if (isMounted && Array.isArray(liveProducts) && liveProducts.length > 0) {
          setFeaturedProducts(liveProducts.slice(0, 4));
        } else if (isMounted) {
          setFeaturedProducts(PRODUCTS.slice(0, 4));
        }
      } catch (e) {
        if (isMounted) {
          setFeaturedProducts(PRODUCTS.slice(0, 4));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const curatedCollections = [
    {
      title: 'Lounge Seating',
      subtitle: 'Organic forms sculpted from solid Nordic oak and textured bouclé.',
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80',
      category: 'seating',
      tag: 'Iconic Pieces',
    },
    {
      title: 'Architectural Lighting',
      subtitle: 'Warm diffuse illumination designed for Nordic winter evenings.',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      category: 'lighting',
      tag: 'Warm Illumination',
    },
    {
      title: 'Minimalist Sanctuary',
      subtitle: 'Pure unadorned lines, certified linens, and silent joinery.',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
      category: 'bedroom',
      tag: 'Bedroom Atelier',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-copen-border">
        {/* Background Image with warm Nordic overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
            alt="Copenhagen Minimalist Interior"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-offwhite via-offwhite/50 to-transparent" />
          <div className="absolute inset-0 bg-copen-black/5 mix-blend-multiply" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-12">
         

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-copen-black tracking-tight leading-[1.08] font-bold">
            Timeless Form, <br />
            <span className="italic font-bold text-olive-900">Enduring Comfort.</span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-copen-charcoal font-normal leading-relaxed">
            Rooted in Copenhagen craftsmanship. Clean architectural silhouettes, responsibly sourced European oak, and natural upholstery built to age gracefully.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="w-full sm:w-auto px-8 py-3.5 bg-copen-black text-offwhite-50 text-xs uppercase tracking-[0.2em] font-medium hover:bg-olive-800 transition-all duration-300 shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/shop?category=seating')}
              className="w-full sm:w-auto px-8 py-3.5 bg-offwhite-card/90 backdrop-blur-md text-copen-black border border-copen-border text-xs uppercase tracking-[0.2em] font-medium hover:bg-offwhite-hover transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lounge Seating</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Brand Value Pillars (Nordic Guarantees) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-copen-border">
          <div className="flex items-start gap-4 p-4">
            <div className="p-2.5 bg-offwhite-card border border-copen-border rounded-xs text-olive-700">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-copen-black tracking-wide">Honest Materials</h3>
              <p className="text-xs text-copen-gray mt-1 leading-relaxed">
                FSC-certified solid European oak, oiled walnut, and non-toxic plant-based finishes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="p-2.5 bg-offwhite-card border border-copen-border rounded-xs text-olive-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-copen-black tracking-wide">White-Glove Delivery</h3>
              <p className="text-xs text-copen-gray mt-1 leading-relaxed">
                Complimentary room-of-choice placement and packaging removal on all qualifying orders.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="p-2.5 bg-offwhite-card border border-copen-border rounded-xs text-olive-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-copen-black tracking-wide">10-Year Craft Guarantee</h3>
              <p className="text-xs text-copen-gray mt-1 leading-relaxed">
                Every joint, bracket, and seam is engineered for lifetime residential durability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Architectural Spaces (Category Highlights) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-olive-700 font-semibold block mb-1">
              Curated Spaces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-copen-black tracking-tight">
              Designed For Intentional Living
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-copen-black hover:text-olive-700 transition font-medium group cursor-pointer"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {curatedCollections.map((col) => (
            <div
              key={col.category}
              onClick={() => navigate(`/shop?category=${col.category}`)}
              className="group relative bg-offwhite-surface border border-copen-border overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-offwhite-300 shrink-0">
                <img
                  src={col.image}
                  alt={col.title}
                  onError={handleImageError}
                  className="absolute inset-0 block w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-offwhite/90 backdrop-blur-md text-[9px] uppercase tracking-widest text-copen-black font-semibold border border-copen-border">
                    {col.tag}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-4 bg-offwhite-surface border-t border-copen-border">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-copen-black group-hover:text-olive-700 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-copen-gray leading-relaxed line-clamp-2">
                    {col.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-olive-800 font-semibold">
                  <span>Explore category</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Pieces (Best Sellers / New Arrivals) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-olive-700 font-semibold block mb-1">
              Atelier Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-copen-black tracking-tight">
              Signature Pieces
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-copen-black hover:text-olive-700 transition font-medium group cursor-pointer"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-offwhite-card border border-copen-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Editorial Philosophy / Brand Story Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-offwhite-card border border-copen-border p-8 sm:p-14 lg:p-20 overflow-hidden">
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-olive-700 font-semibold">
              The Copenhagen Ethos
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-copen-black leading-tight">
              "We do not design for the season. We design for the generation."
            </h2>
            <p className="text-xs sm:text-sm text-copen-gray leading-relaxed">
              Every curve of our seating, every joint in our oak tables, and every lamp shade is born out of respect for Scandinavian restraint. We believe furniture should bring tranquility, quiet warmth, and tactile pleasure to everyday life.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-olive-700 text-offwhite-50 text-xs uppercase tracking-[0.2em] font-medium hover:bg-olive-800 transition shadow-sm cursor-pointer"
              >
                Discover The Atelier
              </button>
            </div>
          </div>

          {/* Decorative subtle aesthetic watermark */}
          <div className="absolute right-[-40px] bottom-[-40px] select-none pointer-events-none opacity-5">
            <span className="font-serif text-[180px] text-copen-black font-bold">CPH</span>
          </div>
        </div>
      </section>
    </div>
  );
};
