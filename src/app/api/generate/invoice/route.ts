import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, ensureUser } from "@/lib/auth";
import { invoiceInputSchema } from "@/lib/validations/invoice";
import { generateInvoice } from "@/lib/claude";
import { currentUser } from "@clerk/nextjs/server";

// POST /api/generate/invoice — generate an AI invoice
export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    await ensureUser(userId);
    const supabase = createAdminClient();

    const body = await request.json();
    const parsed = invoiceInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Fetch the client
    const { data: client } = await supabase
      .from("clients")
      .select("*")
      .eq("id", parsed.data.client_id)
      .eq("user_id", userId)
      .single();

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get Clerk user info for the "from" field
    const clerkUser = await currentUser();
    const userName = clerkUser?.fullName ?? clerkUser?.firstName ?? "Freelancer";
    const userEmail = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

    // Generate invoice via Claude
    const invoiceData = await generateInvoice({
      userName,
      userEmail,
      client,
      description: parsed.data.description,
      rate: parsed.data.rate,
      hours: parsed.data.hours,
      dueDate: parsed.data.due_date,
      currency: parsed.data.currency,
      notes: parsed.data.notes,
    });

    // Save to database
    const { data: document, error } = await supabase
      .from("documents")
      .insert({
        user_id: userId,
        type: "invoice",
        title: parsed.data.title,
        content_json: JSON.parse(JSON.stringify(invoiceData)),
        status: "draft",
        client_id: parsed.data.client_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      document,
      invoice: invoiceData,
    }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Invoice generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate invoice. Please try again." },
      { status: 500 }
    );
  }
}
