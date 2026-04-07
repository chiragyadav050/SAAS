import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

// GET /api/documents — list all documents for the authenticated user
export async function GET() {
  try {
    const userId = await requireAuth();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("documents")
      .select("*, clients(name, email)")
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
