import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS } from "@/lib/stripe";
import type { PlanType, DocumentType } from "@/types";

interface UsageResult {
  allowed: boolean;
  used: number;
  limit: number;
}

/**
 * Check whether a user can create a new document of the given type
 * based on their plan's monthly limits.
 */
export async function checkUsage(
  userId: string,
  documentType: DocumentType
): Promise<UsageResult> {
  const supabase = createAdminClient();

  // Get user plan
  const { data: user } = await supabase
    .from("users")
    .select("plan")
    .eq("id", userId)
    .single();

  const plan: PlanType = user?.plan ?? "free";
  const planConfig = PLANS[plan];

  const limit =
    documentType === "invoice"
      ? planConfig.invoicesPerMonth
      : planConfig.contractsPerMonth;

  // Unlimited plans
  if (limit === Infinity) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  // Count documents created this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("type", documentType)
    .gte("created_at", startOfMonth);

  const used = count ?? 0;

  return {
    allowed: used < limit,
    used,
    limit,
  };
}
