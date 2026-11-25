import express from "express";
import {
  createCheckoutSession,
  verifySessionAndCreateOrder,
} from "../controllers/paymentController.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/payment/create-checkout-session (Protected)
router.post("/create-checkout-session", protect, createCheckoutSession);

// GET /api/payment/verify-session/:sessionId (Optional Protect - Allows return from Stripe)
router.get("/verify-session/:sessionId", optionalProtect, verifySessionAndCreateOrder);

export default router;
