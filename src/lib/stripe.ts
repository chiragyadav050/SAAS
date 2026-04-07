import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    invoicesPerMonth: 3,
    features: ["3 invoices/month", "1 contract/month", "PDF export"],
  },
  pro: {
    name: "Pro",
    price: 79,
    priceId: process.env.STRIPE_PRICE_PRO,
    invoicesPerMonth: Infinity,
    features: [
      "Unlimited invoices",
      "Unlimited contracts",
      "PDF export",
      "Email sending",
      "Custom templates",
    ],
  },
  agency: {
    name: "Agency",
    price: 199,
    priceId: process.env.STRIPE_PRICE_AGENCY,
    invoicesPerMonth: Infinity,
    features: [
      "Everything in Pro",
      "White-label branding",
      "Team members",
      "Priority support",
      "API access",
    ],
  },
} as const;
