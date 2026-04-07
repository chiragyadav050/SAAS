import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, ensureUser } from "@/lib/auth";
import { contractInputSchema } from "@/lib/validations/contract";
import { generateContract } from "@/lib/claude";
import { checkUsage } from "@/lib/usage";
import { currentUser } from "@clerk/nextjs/server";

// POST /api/generate/contract — generate an AI contract
export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    await ensureUser(userId);
    const supabase = createAdminClient();

    // Check plan usage limits
    const usage = await checkUsage(userId, "contract");
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: `Monthly contract limit reached (${usage.used}/${usage.limit}). Upgrade your plan for unlimited contracts.`,
          upgrade: true,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = contractInputSchema.safeParse(body);

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

    // Get Clerk user info
    const clerkUser = await currentUser();
    const userName = clerkUser?.fullName ?? clerkUser?.firstName ?? "Freelancer";
    const userEmail = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

    // Generate contract via Claude
    const contractMarkdown = await generateContract({
      userName,
      userEmail,
      client,
      projectDescription: parsed.data.project_description,
      rate: parsed.data.rate,
      rateType: parsed.data.rate_type,
      currency: parsed.data.currency,
      startDate: parsed.data.start_date,
      endDate: parsed.data.end_date,
      jurisdiction: parsed.data.jurisdiction,
      revisions: parsed.data.revisions,
      notes: parsed.data.notes,
    });

    // Save to database
    const { data: document, error } = await supabase
      .from("documents")
      .insert({
        user_id: userId,
        type: "contract",
        title: parsed.data.title,
        content_markdown: contractMarkdown,
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
      contract: contractMarkdown,
    }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Contract generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate contract. Please try again." },
      { status: 500 }
    );
  }
}
