import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS } from "@/lib/stripe";
import { PlanCard } from "@/components/settings/plan-card";
import type { PlanType } from "@/types";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from("users")
    .select("plan, stripe_customer_id")
    .eq("id", userId)
    .single();

  const currentPlan: PlanType = user?.plan ?? "free";
  const hasStripeCustomer = !!user?.stripe_customer_id;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription and account settings.
        </p>
      </div>

      {params.success && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-700">
            Subscription activated successfully! Your plan has been upgraded.
          </p>
        </div>
      )}

      {params.canceled && (
        <div className="mb-6 rounded-md bg-yellow-50 p-4">
          <p className="text-sm text-yellow-700">
            Checkout was canceled. No changes were made to your plan.
          </p>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Subscription Plans
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.entries(PLANS) as [PlanType, (typeof PLANS)[PlanType]][]).map(
          ([key, plan]) => (
            <PlanCard
              key={key}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              planKey={key}
              currentPlan={currentPlan}
              hasStripeCustomer={hasStripeCustomer}
            />
          )
        )}
      </div>
    </div>
  );
}
