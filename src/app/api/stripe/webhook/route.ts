import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanType } from "@/types";

// POST /api/stripe/webhook — handle Stripe webhook events
export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const clerkUserId = session.metadata?.clerk_user_id;
      const plan = session.metadata?.plan as PlanType | undefined;

      if (clerkUserId && plan) {
        await supabase
          .from("users")
          .update({
            plan,
            stripe_customer_id: session.customer as string,
          })
          .eq("id", clerkUserId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.toString();

      // If subscription is active, check the price to determine plan
      if (subscription.status === "active") {
        const priceId = subscription.items.data[0]?.price?.id;
        let plan: PlanType = "free";

        if (priceId === process.env.STRIPE_PRICE_PRO) {
          plan = "pro";
        } else if (priceId === process.env.STRIPE_PRICE_AGENCY) {
          plan = "agency";
        }

        await supabase
          .from("users")
          .update({ plan })
          .eq("stripe_customer_id", customerId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.toString();

      // Downgrade to free plan
      await supabase
        .from("users")
        .update({ plan: "free" })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
