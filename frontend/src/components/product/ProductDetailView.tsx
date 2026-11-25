import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
  Share2,
  Sparkles,
  Loader2,
  PackageCheck,
} from 'lucide-react';
import { fetchProductById, fetchProducts } from '../../api/productApi';
import { PRODUCTS, handleImageError } from '../../data/products';
import type { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../ui/Badge';
import { ProductCard } from './ProductCard';

export const ProductDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, setQuickViewProduct } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'dimensions' | 'delivery'>('details');

  // Load product by ID from MongoDB with local fallback
  useEffect(() => {
    let isMounted = true;

    const loadProductData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        console.log(`[CATALOG: DETAIL_FETCH] Fetching product with ID: "${id}"`);

        // 1. Try Backend MongoDB API
        let data: Product | null = null;
        try {
          data = await fetchProductById(id);
        } catch {
          // If backend fails, search local static data
          data = PRODUCTS.find((p) => p.id === id) || null;
        }

        if (isMounted) {
          if (data) {
            setProduct(data);
            setSelectedColor(data.colors?.[0]?.name || 'Standard');
            setSelectedImageIndex(0);
            setQuantity(1);

            // Fetch related products in the same category
            fetchProducts({ category: data.category })
              .then((list) => {
                if (isMounted) {
                  const filtered = list.filter((p) => (p.id || (p as any)._id) !== (data!.id || (data as any)._id)).slice(0, 4);
                  setRelatedProducts(filtered);
                }
              })
              .catch(() => {
                if (isMounted) {
                  const fallback = PRODUCTS.filter((p) => p.category === data!.category && p.id !== data!.id).slice(0, 4);
                  setRelatedProducts(fallback);
                }
              });
          } else {
            setProduct(null);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadProductData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedColor);
    showToast(`Added ${quantity}x ${product.name} to your bag`, 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard', 'info');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-olive-700 animate-spin" />
        <p className="text-xs uppercase tracking-widest text-copen-gray font-medium">
          Retrieving Atelier Piece...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-copen-black">Piece Not Found</h2>
        <p className="text-xs text-copen-muted max-w-md mx-auto">
          The curated item you are looking for may have been archived or is no longer available in our collection.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-copen-black text-offwhite-50 text-xs uppercase tracking-widest hover:bg-olive-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </button>
      </div>
    );
  }

  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const currentMainImage = galleryImages[selectedImageIndex] || product.image;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Navigation & Breadcrumbs */}
      <nav className="flex items-center justify-between text-xs tracking-wider uppercase text-copen-muted mb-8 pb-4 border-b border-copen-border">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-copen-black transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3 h-3 text-copen-border" />
          <Link to={`/?category=${product.category}`} className="hover:text-copen-black transition-colors">
            {product.categoryLabel}
          </Link>
          <ChevronRight className="w-3 h-3 text-copen-border" />
          <span className="text-copen-black font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-copen-gray hover:text-copen-black transition-colors cursor-pointer"
          title="Share Piece Link"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium">Share</span>
        </button>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery & Image Showcase (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Stage */}
          <div className="relative aspect-4/5 w-full bg-offwhite-card border border-copen-border overflow-hidden rounded-xs group">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
              {product.badge && (
                <Badge
                  variant={
                    product.badge === 'SALE'
                      ? 'sale'
                      : product.badge === 'COPENHAGEN ALMOND'
                      ? 'almond'
                      : 'olive'
                  }
                >
                  {product.badge}
                </Badge>
              )}
            </div>

            <img
              src={currentMainImage}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Thumbnail Gallery Strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 shrink-0 border overflow-hidden rounded-xs transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-olive-700 ring-2 ring-olive-700/20'
                      : 'border-copen-border hover:border-copen-gray opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications, Pricing & Purchasing (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Category & Heritage Tag */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-[0.2em] uppercase text-olive-700 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {product.categoryLabel}
              </span>

              {/* Stock Indicator */}
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                {product.stock !== undefined && product.stock > 0 ? (
                  product.stock <= 5 ? (
                    <span className="text-amber-700 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Only {product.stock} pieces remaining in stock
                    </span>
                  ) : (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      In Stock ({product.stock} pieces) &bull; Ready to Dispatch
                    </span>
                  )
                ) : (product.stock === 0 || product.inStock === false) ? (
                  <span className="text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-xs">
                    Sold Out / Out of Stock
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Atelier Handcrafted
                  </span>
                )}
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-copen-black tracking-tight">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="text-xs text-copen-muted font-sans leading-relaxed">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Rating Stars & Client Reviews */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating || 5)
                        ? 'fill-current'
                        : 'text-copen-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-copen-black">
                {product.rating ? product.rating.toFixed(1) : '5.0'}
              </span>
              <span className="text-copen-border">•</span>
              <span className="text-xs text-copen-muted">
                {product.reviewsCount || 24} Verified Collector Reviews
              </span>
            </div>

            {/* Price Presentation */}
            <div className="flex items-baseline gap-3 pt-2 pb-4 border-b border-copen-border">
              <span className="font-serif text-3xl font-medium text-copen-black">
                ${product.price.toFixed(2)} CAD
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-copen-muted line-through font-serif">
                    ${product.compareAtPrice!.toFixed(2)} CAD
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 border border-rose-200 rounded-xs">
                    Save ${(product.compareAtPrice! - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-copen-gray font-medium text-[11px]">
                    Atelier Finish / Hue:
                  </span>
                  <span className="font-semibold text-copen-black">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-8 h-8 rounded-full transition-all cursor-pointer flex items-center justify-center border ${
                        selectedColor === color.name
                          ? 'border-olive-700 ring-2 ring-olive-700/30 scale-110'
                          : 'border-copen-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            ['#FAF8F5', '#F5EBE1', '#F5F5F0', '#FFFFFF'].includes(
                              color.hex.toUpperCase()
                            )
                              ? 'text-copen-black'
                              : 'text-offwhite-50'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Bag Action */}
            <div className="space-y-3 pt-2">
              {(() => {
                const maxStock = product.stock !== undefined ? product.stock : (product.inStock ? 10 : 0);
                const isSoldOut = maxStock <= 0 || product.inStock === false;

                return (
                  <div className="flex items-center gap-4">
                    {/* Stepper */}
                    <div className="flex items-center border border-copen-border bg-offwhite h-12 px-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1 || isSoldOut}
                        className="p-1 text-copen-gray hover:text-copen-black disabled:opacity-30 cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-semibold text-xs text-copen-black">
                        {isSoldOut ? 0 : quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                        disabled={quantity >= maxStock || isSoldOut}
                        className="p-1 text-copen-gray hover:text-copen-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title={quantity >= maxStock ? `Only ${maxStock} units available in stock` : "Increase quantity"}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Primary Add Button */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={isSoldOut}
                      className="flex-1 h-12 bg-copen-black hover:bg-olive-700 text-offwhite-50 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:bg-copen-muted disabled:cursor-not-allowed"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {isSoldOut
                          ? 'Sold Out / Out of Stock'
                          : `Add to Bag • $${(product.price * quantity).toFixed(2)} CAD`}
                      </span>
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-copen-border text-center text-[10px] uppercase tracking-wider text-copen-muted">
              <div className="flex flex-col items-center gap-1.5 p-2 bg-offwhite-card border border-copen-border rounded-xs">
                <Truck className="w-4 h-4 text-olive-700" />
                <span>Carbon Neutral</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 bg-offwhite-card border border-copen-border rounded-xs">
                <ShieldCheck className="w-4 h-4 text-olive-700" />
                <span>10-Yr Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 bg-offwhite-card border border-copen-border rounded-xs">
                <RotateCcw className="w-4 h-4 text-olive-700" />
                <span>30-Day Atelier Trial</span>
              </div>
            </div>
          </div>

          {/* Specifications Accordion / Tab Section */}
          <div className="pt-6 border-t border-copen-border space-y-3">
            <div className="flex border-b border-copen-border gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 text-xs uppercase tracking-wider font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-copen-black text-copen-black font-semibold'
                    : 'border-transparent text-copen-muted hover:text-copen-black'
                }`}
              >
                Story & Craft
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dimensions')}
                className={`pb-2.5 text-xs uppercase tracking-wider font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'dimensions'
                    ? 'border-copen-black text-copen-black font-semibold'
                    : 'border-transparent text-copen-muted hover:text-copen-black'
                }`}
              >
                Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('delivery')}
                className={`pb-2.5 text-xs uppercase tracking-wider font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'delivery'
                    ? 'border-copen-black text-copen-black font-semibold'
                    : 'border-transparent text-copen-muted hover:text-copen-black'
                }`}
              >
                Delivery
              </button>
            </div>

            <div className="text-xs text-copen-gray leading-relaxed pt-1 min-h-[90px]">
              {activeTab === 'details' && (
                <p>{product.description}</p>
              )}
              {activeTab === 'dimensions' && (
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-copen-border/60">
                    <span className="text-copen-muted">Dimensions</span>
                    <span className="font-medium text-copen-black">{product.dimensions || 'W 74cm × D 82cm × H 76cm'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-copen-border/60">
                    <span className="text-copen-muted">Primary Material</span>
                    <span className="font-medium text-copen-black">{product.material || 'Solid European White Oak & Natural Wool'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-copen-muted">Origin</span>
                    <span className="font-medium text-copen-black">Designed in Denmark &bull; Crafted in EU</span>
                  </div>
                </div>
              )}
              {activeTab === 'delivery' && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 font-medium text-copen-black">
                    <PackageCheck className="w-4 h-4 text-olive-700" />
                    White-Glove & Standard Delivery Available
                  </p>
                  <p>
                    All furniture pieces are dispatched within 2 business days in custom recyclable wooden crates to preserve joinery.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Curated Recommendations / Related Pieces Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-copen-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-copen-muted font-medium">
                Harmonious Pairings
              </span>
              <h2 className="font-serif text-2xl text-copen-black mt-1">
                More from the {product.categoryLabel} Collection
              </h2>
            </div>
            <Link
              to={`/?category=${product.category}`}
              className="text-xs uppercase tracking-wider text-olive-700 hover:text-copen-black font-semibold transition-colors"
            >
              Explore Collection &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id || (relProduct as any)._id}
                product={relProduct}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailView;
