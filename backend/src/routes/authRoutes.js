import express from "express";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/refresh-token (Silent Auto-Renewal)
router.post("/refresh-token", refreshAccessToken);

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", resetPassword);
router.post("/reset-password", resetPassword);

export default router;