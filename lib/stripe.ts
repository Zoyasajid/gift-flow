import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set.");
    }
    if (!key.startsWith("sk_")) {
      throw new Error(
        "STRIPE_SECRET_KEY must be a secret key (sk_...), not a publishable key (pk_...).",
      );
    }
    console.log("[Stripe] Initialized with key type:", key.slice(0, 7) + "...");
    _stripe = new Stripe(key);
  }
  return _stripe;
}
