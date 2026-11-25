import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

// Database connection middleware for Serverless & Local
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error in request:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed. Please verify MongoDB connection.",
      error: err.message,
    });
  }
});

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost, vercel deployments, or custom CLIENT_URL
      if (
        !origin ||
        origin === "http://localhost:5173" ||
        origin.endsWith(".vercel.app") ||
        (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Copenhagen Scandinavian E-commerce API is active!",
  });
});

if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("DB connection error:", err.message);
    });
}


export default app;
