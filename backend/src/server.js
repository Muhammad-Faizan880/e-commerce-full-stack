import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

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

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Copenhagen Scandinavian E-commerce API is active!",
  });
});

// Connect to DB and listen when not running as serverless function
let isDbConnected = false;
const ensureDbConnected = async () => {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
};

if (process.env.NODE_ENV !== "test") {
  ensureDbConnected()
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
