import crypto from "crypto";
import jwt from "jsonwebtoken";

// Generate Access Token
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    }
  );
};

// Generate Refresh Token
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// Hash Refresh Token
export const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};
