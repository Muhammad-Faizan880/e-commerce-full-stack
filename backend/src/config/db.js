import mongoose from "mongoose";

let cachedPromise = null;

const connectDB = async () => {
  // If already connected, reuse connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If connection is in progress, reuse the same promise
  if (mongoose.connection.readyState === 2 && cachedPromise) {
    return cachedPromise;
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  // Set bufferCommands to false or reasonable serverSelectionTimeoutMS to prevent hanging queries
  mongoose.set("bufferCommands", false);

  cachedPromise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 8000, // Fail fast within 8s if network/IP blocked
      maxPoolSize: 10,
    })
    .then((m) => {
      console.log(" MongoDB Connected successfully:", m.connection.name);
      return m.connection;
    })
    .catch((err) => {
      cachedPromise = null;
      console.error(" MongoDB Connection Failed:", err.message);
      throw err;
    });

  return cachedPromise;
};

export default connectDB;
