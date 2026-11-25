import React, { useState } from 'react';
import { Upload, Loader2, ImageIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { createProduct, uploadProductImage } from '../../api/productApi';
import type { Product } from '../../types/product';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductCreated,
}) => {
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    subtitle: '',
    category: 'seating' as 'seating' | 'lighting' | 'tables' | 'bedroom' | 'decor',
    price: '',
    compareAtPrice: '',
    stock: '10',
    image: '',
    description: '',
    material: 'European Solid Oak & Natural Textiles',
    dimensions: 'Standard Nordic Dimensions',
    badge: '' as '' | 'COPENHAGEN ALMOND' | 'SALE' | 'NEW ARRIVAL' | 'BESTSELLER',
  });

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit');
      return;
    }

    try {
      setIsUploadingImage(true);
      setUploadError(null);
      const uploadedUrl = await uploadProductImage(file);
      setProductForm((prev) => ({ ...prev, image: uploadedUrl }));
      showToast('Image uploaded successfully to Cloudinary', 'success');
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      setUploadError(errObj.response?.data?.message || errObj.message || 'Image upload to Cloudinary failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.image || !productForm.description) {
      showToast('Please fill all required fields (Name, Price, Image, Description)', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const stockNumber = parseInt(productForm.stock, 10) || 10;
      const newProd = await createProduct({
        name: productForm.name,
        sku: productForm.sku ? productForm.sku.trim().toUpperCase() : undefined,
        subtitle: productForm.subtitle,
        category: productForm.category,
        categoryLabel: `${productForm.category.charAt(0).toUpperCase() + productForm.category.slice(1)} Living`,
        price: parseFloat(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? parseFloat(productForm.compareAtPrice) : undefined,
        stock: stockNumber,
        image: productForm.image,
        gallery: [productForm.image],
        description: productForm.description,
        material: productForm.material,
        dimensions: productForm.dimensions,
        badge: productForm.badge || undefined,
        rating: 5.0,
        reviewsCount: 1,
        inStock: stockNumber > 0,
      });

      onProductCreated(newProd);
      showToast('New design piece published to catalog', 'success');
      onClose();

      // Reset form
      setProductForm({
        name: '',
        sku: '',
        subtitle: '',
        category: 'seating',
        price: '',
        compareAtPrice: '',
        stock: '10',
        image: '',
        description: '',
        material: 'European Solid Oak & Natural Textiles',
        dimensions: 'Standard Nordic Dimensions',
        badge: '',
      });
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      showToast(errObj.response?.data?.message || errObj.message || 'Failed to create product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Scandinavian Piece"
      subtitle="Publish a new design item with SKU and stock tracking to Copenhagen catalog"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Row 1: Title, SKU, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
              Design Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kruso Lounge Chair"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
              SKU (Auto if blank)
            </label>
            <input
              type="text"
              placeholder="e.g. CPN-SEAT-101"
              value={productForm.sku}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value.toUpperCase() })}
              className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black font-mono uppercase focus:outline-none focus:border-olive-600 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
              Category *
            </label>
            <select
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
              className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600 cursor-pointer"
            >
              <option value="seating">Lounge Seating</option>
              <option value="lighting">Lighting</option>
              <option value="tables">Tables & Benches</option>
              <option value="bedroom">Bedroom</option>
              <option value="decor">Decor & Storage</option>
            </select>
          </div>
        </div>

        {/* Row 2: Subtitle */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
            Subtitle / Short Headline
          </label>
          <input
            type="text"
            placeholder="e.g. Solid European white oak with olive wool weave"
            value={productForm.subtitle}
            onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
            className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
          />
        </div>

        {/* Row 3: Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
              Price ($ CAD) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="180.00"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
              Compare Price ($ CAD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="220.00"
              value={productForm.compareAtPrice}
              onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
              className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
              Stock Units *
            </label>
            <input
              type="number"
              min="0"
              required
              placeholder="10"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
            />
          </div>
        </div>

        {/* Product Image Selection: Cloudinary Upload or Direct URL */}
        <div className="space-y-2">
          <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium">
            Product Image * (Upload to Cloudinary or Paste URL)
          </label>

          <div className="border border-dashed border-copen-border p-4 bg-offwhite hover:bg-offwhite-hover transition-colors rounded-xs text-center">
            <input
              type="file"
              id="product-image-file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageFileChange}
              disabled={isUploadingImage}
              className="hidden"
            />
            <label
              htmlFor="product-image-file"
              className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              {isUploadingImage ? (
                <div className="flex items-center gap-2 text-olive-700 py-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-medium">Uploading to Cloudinary...</span>
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-olive-50 border border-olive-200 flex items-center justify-center text-olive-700">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-copen-black">
                    Click to upload piece from Computer
                  </span>
                  <span className="text-[10px] text-copen-muted">
                    Supports PNG, JPG, WebP up to 5MB (Uploaded directly to Cloudinary)
                  </span>
                </>
              )}
            </label>
          </div>

          {uploadError && (
            <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xs">
              {uploadError}
            </p>
          )}

          <div className="pt-1">
            <div className="relative">
              <ImageIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-copen-muted" />
              <input
                type="url"
                required
                placeholder="Or paste direct image URL (https://...)"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                className="w-full bg-offwhite border border-copen-border pl-8 pr-3 py-2 text-copen-black focus:outline-none focus:border-olive-600 text-xs"
              />
            </div>
            {productForm.image && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-offwhite border border-copen-border rounded-xs">
                <img
                  src={productForm.image}
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded-xs border border-copen-border shrink-0"
                />
                <span className="text-[10px] text-copen-muted truncate">
                  Image attached: {productForm.image}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Row 4: Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
              Materials &amp; Finish
            </label>
            <input
              type="text"
              placeholder="e.g. European Solid Oak & Natural Textiles"
              value={productForm.material}
              onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
              className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
              Dimensions
            </label>
            <input
              type="text"
              placeholder="e.g. 74cm H x 82cm W x 79cm D"
              value={productForm.dimensions}
              onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
              className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600"
            />
          </div>
        </div>

        {/* Row 5: Badge */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
            Editorial Badge
          </label>
          <select
            value={productForm.badge}
            onChange={(e) => setProductForm({ ...productForm, badge: e.target.value as any })}
            className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600 cursor-pointer"
          >
            <option value="">No Badge</option>
            <option value="COPENHAGEN ALMOND">Copenhagen Almond (Exclusive)</option>
            <option value="NEW ARRIVAL">New Arrival</option>
            <option value="BESTSELLER">Bestseller</option>
            <option value="SALE">Sale</option>
          </select>
        </div>

        {/* Row 6: Description */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-copen-gray font-medium mb-1">
            Architectural Description *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Detailed Scandinavian design narrative, joinery notes, craftsmanship..."
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            className="w-full bg-offwhite border border-copen-border px-3 py-2 text-copen-black focus:outline-none focus:border-olive-600 resize-none"
          />
        </div>

        <div className="pt-3 border-t border-copen-border flex items-center justify-end gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Publish to Atelier Catalog
          </Button>
        </div>
      </form>
    </Modal>
  );
};
