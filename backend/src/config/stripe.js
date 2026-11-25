import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const rawKey = process.env.STRIPE_SECRET_KEY || "";
const stripeKey = rawKey.trim().replace(/^["']|["']$/g, "");

if (!stripeKey) {
  console.error("[STRIPE_CONFIG: CRITICAL] STRIPE_SECRET_KEY is missing from environment variables!");
}

const stripe = new Stripe(stripeKey || "sk_test_placeholder", {
  apiVersion: "2024-06-20",
});

export default stripe;
