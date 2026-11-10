import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const emailToPromote = process.argv[2]?.trim().toLowerCase();

if (!emailToPromote) {
  console.log("Usage: node src/scripts/makeAdmin.js <user-email>");
  process.exit(1);
}

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not found in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const user = await User.findOne({ email: emailToPromote });
    if (!user) {
      console.log(`User not found with email: ${emailToPromote}`);
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`SUCCESS: User "${user.name}" (${user.email}) is now an ADMIN!`);
    process.exit(0);
  } catch (error) {
    console.error("Error making user admin:", error.message);
    process.exit(1);
  }
};

run();
