import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Get the current Clerk user ID or throw 401.
 * Use in API routes to enforce authentication.
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

/**
 * Ensure the Clerk user exists in our Supabase users table.
 * Creates the record on first call (lazy sync).
 */
export async function ensureUser(userId: string): Promise<void> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  if (!data) {
    const clerkUser = await currentUser();
    await supabase.from("users").insert({
      id: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
      full_name: clerkUser?.fullName ?? null,
    });
  }
}
