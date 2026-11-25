import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["seating", "lighting", "tables", "bedroom", "decor"],
      lowercase: true,
      trim: true,
    },
    categoryLabel: {
      type: String,
      default: "Scandinavian Living",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      enum: ["COPENHAGEN ALMOND", "SALE", "NEW ARRIVAL", "BESTSELLER", null],
      default: null,
    },
    image: {
      type: String,
      required: [true, "Main image URL is required"],
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    material: {
      type: String,
      default: "European Solid Oak & Natural Textiles",
    },
    dimensions: {
      type: String,
      default: "Standard Nordic Sizing",
    },
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
      },
    ],
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      default: 10,
      min: [0, "Stock cannot be negative"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual id to match frontend expectations (id instead of _id)
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Virtual SKU guarantee so older records also display a clean Scandinavian SKU
productSchema.virtual("productSku").get(function () {
  if (this.sku) return this.sku;
  const catCode = (this.category || "GEN").substring(0, 3).toUpperCase();
  const idSuffix = this._id ? this._id.toString().slice(-4).toUpperCase() : "001";
  return `CPN-${catCode}-${idSuffix}`;
});

// Auto-update inStock based on stock count & generate SKU if missing
productSchema.pre("save", function () {
  if (!this.sku && this.category) {
    const catCode = this.category.substring(0, 3).toUpperCase();
    const idSuffix = this._id ? this._id.toString().slice(-4).toUpperCase() : Math.floor(1000 + Math.random() * 9000);
    this.sku = `CPN-${catCode}-${idSuffix}`;
  }

  if (this.stock <= 0) {
    this.inStock = false;
  } else {
    this.inStock = true;
  }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
