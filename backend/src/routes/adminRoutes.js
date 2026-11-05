import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import User from "../models/User.js";
import Session from "../models/Session.js";

const router = express.Router();

// GET /api/admin/dashboard - Fetch real-time dashboard analytics
router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalAdmins, totalSessions, recentUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      Session.countDocuments(),
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.status(200).json({
      success: true,
      message: "Welcome to Admin Dashboard",
      admin: req.user,
      stats: {
        totalUsers,
        totalAdmins,
        totalSessions,
      },
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard statistics",
      error: error.message,
    });
  }
});

// GET /api/admin/users - Fetch full registered users list
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

export default router;
