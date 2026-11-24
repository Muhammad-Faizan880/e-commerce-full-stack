import Order from "../models/Order.js";
import Product from "../models/Product.js";

/**
 * POST /api/orders
 * Create a new customer order
 */
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      shippingOption,
      paymentMethod,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided",
      });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: "Valid shipping address is required",
      });
    }

    // Generate unique order reference (e.g. CPN-74892)
    const orderNumber = `CPN-${Math.floor(10000 + Math.random() * 90000)}`;

    // Prepare order items & decrement stock in Product collection
    const formattedItems = [];

    for (const item of items) {
      const prodId = item.productId || item.product?.id || item.product?._id;
      const quantity = item.quantity || 1;

      formattedItems.push({
        product: prodId && prodId.length === 24 ? prodId : undefined,
        name: item.name || item.product?.name || "Curated Design Piece",
        image: item.image || item.product?.image || item.product?.gallery?.[0] || "",
        price: Number(item.price || item.product?.price || 0),
        quantity,
        selectedColor: item.selectedColor || "Standard",
      });

      // Deduct stock if product exists in MongoDB
      if (prodId && prodId.length === 24) {
        try {
          const product = await Product.findById(prodId);
          if (product) {
            const previousStock = product.stock;
            product.stock = Math.max(0, product.stock - quantity);
            if (product.stock === 0) {
              product.inStock = false;
            }
            await product.save();
            console.log(` [BACKEND STOCK UPDATE] "${product.name}" stock reduced: ${previousStock} -> ${product.stock}`);
          }
        } catch {
          // If product lookup fails, continue order creation
        }
      }
    }

    // Payment status logic
    const paymentStatus = paymentMethod === "cod" ? "Pending" : "Paid";

    console.log(` [BACKEND ORDER INCOMING] User ID: ${req.user.userId} | Items: ${formattedItems.length} | Total: $${total}`);

    const order = await Order.create({
      orderNumber,
      user: req.user.userId,
      items: formattedItems,
      shippingAddress,
      shippingOption: shippingOption || {
        name: "Standard Carbon-Neutral Delivery",
        price: Number(shippingFee || 0),
        estimate: "3-5 business days",
      },
      paymentMethod: paymentMethod || "credit-card",
      paymentStatus,
      subtotal: Number(subtotal),
      discount: Number(discount || 0),
      shippingFee: Number(shippingFee || 0),
      tax: Number(tax || 0),
      total: Number(total),
      status: "Processing",
    });

    console.log(` [BACKEND ORDER SAVED] Order #${order.orderNumber} successfully written to MongoDB!`);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(" [CREATE ORDER ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to place order. Please try again.",
      error: error.message,
    });
  }
};

/**
 * GET /api/orders/my-orders
 * Fetch logged-in user's orders
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(" [GET MY ORDERS ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

/**
 * GET /api/orders/:id
 * Fetch single order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only allow owner or admin
    if (
      order.user._id.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(" [GET ORDER BY ID ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
};

/**
 * GET /api/orders (Admin Only)
 * Fetch all customer orders for the admin dashboard
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

    return res.status(200).json({
      success: true,
      count: orders.length,
      totalRevenue,
      orders,
    });
  } catch (error) {
    console.error(" [GET ALL ORDERS ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

/**
 * PUT /api/orders/:id/status (Admin Only)
 * Update order tracking status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Processing", "In Transit", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error(" [UPDATE ORDER STATUS ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
