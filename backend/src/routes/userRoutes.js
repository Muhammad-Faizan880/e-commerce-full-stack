import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
    user: {
      id: req.user.userId,
      role: req.user.role,
    },
  });
});

export default router;