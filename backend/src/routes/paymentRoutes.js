import express from "express";
import {
  createCheckoutSession,
  verifySessionAndCreateOrder,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/payment/create-checkout-session (Protected)
router.post("/create-checkout-session", protect, createCheckoutSession);

// GET /api/payment/verify-session/:sessionId (Protected)
router.get("/verify-session/:sessionId", protect, verifySessionAndCreateOrder);

export default router;
