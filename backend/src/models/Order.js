import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  selectedColor: {
    type: String,
    default: "Standard",
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    items: [orderItemSchema],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: false, default: "+1 (555) 000-0000" },
      address: { type: String, required: true },
      apartment: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, default: "" },
      postalCode: { type: String, required: true },
      country: { type: String, default: "Canada" },
    },
    shippingOption: {
      name: { type: String, default: "Standard Carbon-Neutral Delivery" },
      price: { type: Number, default: 0 },
      estimate: { type: String, default: "3-5 business days" },
    },
    paymentMethod: {
      type: String,
      enum: ["credit-card", "apple-pay", "cod", "stripe"],
      default: "credit-card",
    },
    stripeSessionId: {
      type: String,
      default: null,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "Refunded"],
      default: "Paid",
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Processing", "In Transit", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual id to match frontend
orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
