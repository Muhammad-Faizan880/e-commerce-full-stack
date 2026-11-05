import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    // 1. User Reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 2. Hashed Refresh Token
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    // 3. Session Expiry
    expiresAt: {
      type: Date,
      required: true,
    },

    // 4. Device Information
    device: {
      type: String,
      default: "Unknown",
    },
  },

  {
    timestamps: true,
  }
);

// Automatically delete expired sessions
sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;