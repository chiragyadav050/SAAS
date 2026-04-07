import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Server-only Supabase client using service role key.
// Use this in API routes where we don't need cookie-based auth
// (Clerk handles auth, Supabase is DB-only).
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
