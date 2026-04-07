import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, ensureUser } from "@/lib/auth";
import { z } from "zod";

const templateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  type: z.enum(["invoice", "contract"]),
  prompt_template: z.string().min(1, "Prompt template is required").max(5000),
  is_default: z.boolean().default(false),
});

// GET /api/templates — list templates
export async function GET() {
  try {
    const userId = await requireAuth();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("templates")
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

// POST /api/templates — create a template
export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    await ensureUser(userId);
    const supabase = createAdminClient();

    const body = await request.json();
    const parsed = templateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults of same type
    if (parsed.data.is_default) {
      await supabase
        .from("templates")
        .update({ is_default: false })
        .eq("user_id", userId)
        .eq("type", parsed.data.type);
    }

    const { data, error } = await supabase
      .from("templates")
      .insert({
        user_id: userId,
        name: parsed.data.name,
        type: parsed.data.type,
        prompt_template: parsed.data.prompt_template,
        is_default: parsed.data.is_default,
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

// DELETE /api/templates — delete a template (pass id in body)
export async function DELETE(request: Request) {
  try {
    const userId = await requireAuth();
    const supabase = createAdminClient();

    const { id } = await request.json();

    const { error } = await supabase
      .from("templates")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
