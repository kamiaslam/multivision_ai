import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe publishable key - replace with your actual key in production
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export default getStripe;

export const STRIPE_CONFIG = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  // Add other Stripe configuration options here
};
