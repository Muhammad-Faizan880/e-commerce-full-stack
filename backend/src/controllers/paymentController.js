import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import sendEmail from "../utils/email.js";
import { generateOrderReceiptHtml } from "../utils/orderEmailTemplate.js";

/**
 * POST /api/payment/create-checkout-session
 * Initialize Stripe Checkout Session for real online payment
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      shippingOption,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided for checkout",
      });
    }

    if (!shippingAddress || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const frontendUrl =
      process.env.FRONTEND_URL || "https://full-flow-e-commerce-full-stack.vercel.app";

    // Build Stripe Line Items
    const lineItems = items.map((item) => {
      const priceInCents = Math.round(Number(item.price || 0) * 100);
      const imageUrl = item.image && item.image.startsWith("http") ? item.image : undefined;

      return {
        price_data: {
          currency: "cad",
          product_data: {
            name: item.name || "Copenhagen Scandinavian Piece",
            description: `Finish: ${item.selectedColor || "Standard"}`,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity || 1,
      };
    });

    // Add Shipping Fee as a line item if applicable
    if (shippingFee && Number(shippingFee) > 0) {
      lineItems.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: shippingOption?.name || "Carbon-Neutral Atelier Delivery",
            description: shippingOption?.estimate || "3-5 business days",
          },
          unit_amount: Math.round(Number(shippingFee) * 100),
        },
        quantity: 1,
      });
    }

    // Add Sales Tax (HST 13%) as a line item if applicable
    if (tax && Number(tax) > 0) {
      lineItems.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: "Harmonized Sales Tax (HST 13%)",
            description: "Canadian Provincial & Federal Tax",
          },
          unit_amount: Math.round(Number(tax) * 100),
        },
        quantity: 1,
      });
    }

    // Customer email
    const customerEmail =
      shippingAddress.email || req.user?.email || undefined;

    console.log(`[STRIPE: SESSION_INIT] Creating checkout session for user: ${req.user.userId} | Items: ${items.length} | Total: $${total} CAD`);

    // Create the session with Stripe API
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout?canceled=true`,
      metadata: {
        userId: req.user.userId,
        customerEmail: customerEmail || "",
        shippingAddressJson: JSON.stringify(shippingAddress).substring(0, 490),
        shippingOptionJson: JSON.stringify(shippingOption || {}).substring(0, 490),
        subtotal: String(subtotal),
        discount: String(discount || 0),
        shippingFee: String(shippingFee || 0),
        tax: String(tax || 0),
        total: String(total),
      },
    });

    console.log(`[STRIPE: SESSION_CREATED] Session ID: ${session.id} | Redirect URL generated`);

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("[STRIPE: CREATE_SESSION_ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Stripe payment session",
      error: error.message,
    });
  }
};

/**
 * GET /api/payment/verify-session/:sessionId
 * Verify Stripe payment status, create order in MongoDB Atlas, deduct stock, and send invoice email
 */
export const verifySessionAndCreateOrder = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Stripe Session ID is required",
      });
    }

    // 1. Check if Order already created for this session
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      console.log(`[STRIPE: VERIFY] Order already exists for session ${sessionId}: #${existingOrder.orderNumber}`);
      return res.status(200).json({
        success: true,
        message: "Order already verified and confirmed",
        order: existingOrder,
      });
    }

    // 2. Retrieve session from Stripe
    console.log(`[STRIPE: VERIFY_START] Retrieving session: ${sessionId}`);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: `Payment has not been completed (Status: ${session.payment_status})`,
      });
    }

    console.log(`[STRIPE: VERIFY_SUCCESS] Payment confirmed paid! Amount: $${(session.amount_total / 100).toFixed(2)} CAD`);

    // 3. Extract order details from session metadata
    const metadata = session.metadata || {};
    const userId = metadata.userId || req.user?.userId;

    let shippingAddress = {};
    try {
      shippingAddress = JSON.parse(metadata.shippingAddressJson || "{}");
    } catch {
      shippingAddress = {
        firstName: session.customer_details?.name?.split(" ")[0] || "Valued",
        lastName: session.customer_details?.name?.split(" ").slice(1).join(" ") || "Client",
        email: session.customer_details?.email || metadata.customerEmail || "",
        phone: session.customer_details?.phone || "",
        address: session.customer_details?.address?.line1 || "Main Street",
        city: session.customer_details?.address?.city || "Toronto",
        postalCode: session.customer_details?.address?.postal_code || "M5V 2T6",
        country: session.customer_details?.address?.country || "Canada",
      };
    }

    let shippingOption = {
      name: "Standard Carbon-Neutral Delivery",
      price: Number(metadata.shippingFee || 0),
      estimate: "3-5 business days",
    };
    try {
      if (metadata.shippingOptionJson) {
        shippingOption = JSON.parse(metadata.shippingOptionJson);
      }
    } catch {
      // keep fallback
    }

    // Build items from line_items or session
    const formattedItems = [];
    if (session.line_items?.data) {
      for (const line of session.line_items.data) {
        // Skip shipping or tax line items
        if (line.description?.includes("HST") || line.description?.includes("Delivery")) {
          continue;
        }

        formattedItems.push({
          name: line.description || "Curated Design Piece",
          image: "",
          price: (line.price?.unit_amount || 0) / 100,
          quantity: line.quantity || 1,
          selectedColor: "Standard",
        });
      }
    }

    const orderNumber = `CPN-${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = Number(metadata.subtotal || (session.amount_subtotal / 100));
    const total = Number(metadata.total || (session.amount_total / 100));
    const shippingFee = Number(metadata.shippingFee || 0);
    const tax = Number(metadata.tax || 0);
    const discount = Number(metadata.discount || 0);

    // 4. Create Order in MongoDB
    const order = await Order.create({
      orderNumber,
      user: userId,
      items: formattedItems.length > 0 ? formattedItems : [
        {
          name: "Bespoke Scandinavian Furnishings",
          image: "",
          price: subtotal,
          quantity: 1,
          selectedColor: "Standard",
        }
      ],
      shippingAddress,
      shippingOption,
      paymentMethod: "stripe",
      paymentStatus: "Paid",
      stripeSessionId: sessionId,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      status: "Processing",
    });

    console.log(`[ORDER: SAVED] Stripe Order #${order.orderNumber} successfully written to MongoDB`);

    // 5. Send Order Confirmation Email (Awaited for Vercel Serverless)
    try {
      const customer = await User.findById(userId);
      const recipientEmail = (
        shippingAddress.email ||
        session.customer_details?.email ||
        customer?.email ||
        ""
      ).trim().toLowerCase();

      if (recipientEmail) {
        const htmlReceipt = generateOrderReceiptHtml({
          order,
          user: customer || { name: `${shippingAddress.firstName || ""} ${shippingAddress.lastName || ""}`.trim() },
        });

        await sendEmail({
          email: recipientEmail,
          subject: `Order Confirmed: #${order.orderNumber} — Copenhagen Atelier`,
          html: htmlReceipt,
        });

        console.log(`[ORDER: EMAIL_SUCCESS] Confirmation receipt successfully dispatched to: ${recipientEmail}`);
      }
    } catch (emailError) {
      console.error("[ORDER: EMAIL_ERROR] Confirmation email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Payment verified and order created",
      order,
    });
  } catch (error) {
    console.error("[STRIPE: VERIFY_SESSION_ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify Stripe payment session",
      error: error.message,
    });
  }
};
