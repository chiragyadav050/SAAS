import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, ensureUser } from "@/lib/auth";
import { clientSchema } from "@/lib/validations/client";

// GET /api/clients — list all clients for the authenticated user
export async function GET() {
  try {
    const userId = await requireAuth();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/clients — create a new client
export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    await ensureUser(userId);
    const supabase = createAdminClient();

    const body = await request.json();
    const parsed = clientSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("clients")
      .insert({
        user_id: userId,
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company ?? null,
        address: parsed.data.address ?? null,
        phone: parsed.data.phone ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
