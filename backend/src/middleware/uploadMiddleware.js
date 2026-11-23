import multer from "multer";

// Use memory storage for seamless execution on both local and serverless (Vercel)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, WEBP) are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB maximum file size
  fileFilter,
});
