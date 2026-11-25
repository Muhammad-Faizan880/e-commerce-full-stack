import express from "express";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * POST /api/upload
 * Upload image file to Cloudinary and return CDN URL
 */
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided in request",
      });
    }

    console.log(
      `[UPLOAD: CLOUDINARY] Processing "${req.file.originalname}" (${Math.round(req.file.size / 1024)} KB)...`
    );

    // Stream upload directly from memory buffer
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "copenhagen_products",
            transformation: [
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              console.error("[UPLOAD: STREAM_ERROR]:", error);
              return reject(error);
            }
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadToCloudinary();

    console.log(`[UPLOAD: SUCCESS] Image uploaded successfully! URL: ${result.secure_url}`);
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully to Cloudinary",
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("[UPLOAD: FAILED]:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image to Cloudinary",
    });
  }
});

export default router;
