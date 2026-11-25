import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim().replace(/^["']|["']$/g, "");
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim().replace(/^["']|["']$/g, "");
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim().replace(/^["']|["']$/g, "");

if (!apiKey) {
  console.error("[CLOUDINARY_CONFIG: NOTICE] CLOUDINARY_API_KEY is not defined in environment variables!");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
