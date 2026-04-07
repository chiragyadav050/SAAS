import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, ensureUser } from "@/lib/auth";
import { getStripe, getOrCreateCustomer, PLANS } from "@/lib/stripe";
import type { PlanType } from "@/types";

// POST /api/stripe/checkout — create a Checkout Session
export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    await ensureUser(userId);
    const supabase = createAdminClient();

    const { plan } = (await request.json()) as { plan: PlanType };

    if (plan !== "pro" && plan !== "agency") {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const priceId = PLANS[plan].priceId;
    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured" },
        { status: 500 }
      );
    }

    // Get user info
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

    const { data: dbUser } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    // Get or create Stripe customer
    const customerId = await getOrCreateCustomer(
      userId,
      email,
      dbUser?.stripe_customer_id
    );

    // Save customer ID if new
    if (!dbUser?.stripe_customer_id) {
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId);
    }

    // Create Checkout Session
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
      metadata: {
        clerk_user_id: userId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
