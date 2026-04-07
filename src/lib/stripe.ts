import Stripe from "stripe";
import type { PlanType } from "@/types";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS: Record<
  PlanType,
  {
    name: string;
    price: number;
    priceId?: string;
    invoicesPerMonth: number;
    contractsPerMonth: number;
    features: string[];
  }
> = {
  free: {
    name: "Free",
    price: 0,
    invoicesPerMonth: 3,
    contractsPerMonth: 1,
    features: ["3 invoices/month", "1 contract/month", "PDF export"],
  },
  pro: {
    name: "Pro",
    price: 79,
    priceId: process.env.STRIPE_PRICE_PRO,
    invoicesPerMonth: Infinity,
    contractsPerMonth: Infinity,
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
    contractsPerMonth: Infinity,
    features: [
      "Everything in Pro",
      "White-label branding",
      "Team members",
      "Priority support",
      "API access",
    ],
  },
};

/**
 * Get or create a Stripe customer for the given user.
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  existingCustomerId?: string | null
): Promise<string> {
  if (existingCustomerId) {
    return existingCustomerId;
  }

  const customer = await getStripe().customers.create({
    email,
    metadata: { clerk_user_id: userId },
  });

  return customer.id;
}
