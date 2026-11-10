import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
