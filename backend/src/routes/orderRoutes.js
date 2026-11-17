import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Customer Order Routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin Order Management
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

// Order details by ID
router.get("/:id", protect, getOrderById);

export default router;
