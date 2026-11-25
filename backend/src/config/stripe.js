import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.trim() : "";

const stripe = new Stripe(stripeKey, {
  apiVersion: "2024-06-20",
});

export default stripe;
