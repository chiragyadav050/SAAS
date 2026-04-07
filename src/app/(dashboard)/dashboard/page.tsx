import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const supabase = createAdminClient();

  // Fetch stats in parallel
  const [invoiceCount, contractCount, clientCount, recentDocs] =
    await Promise.all([
      supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("type", "invoice"),
      supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("type", "contract"),
      supabase
        .from("clients")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("documents")
        .select("id, title, type, status, created_at, clients(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const stats = [
    { label: "Invoices", value: invoiceCount.count ?? 0, href: "/documents" },
    { label: "Contracts", value: contractCount.count ?? 0, href: "/documents" },
    { label: "Clients", value: clientCount.count ?? 0, href: "/clients" },
  ];

  const STATUS_COLORS: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-500",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create invoices and contracts powered by AI.
        </p>
      </div>

      {/* Onboarding */}
      <OnboardingWizard
        hasClients={(clientCount.count ?? 0) > 0}
        hasDocuments={
          ((invoiceCount.count ?? 0) + (contractCount.count ?? 0)) > 0
        }
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/new-invoice"
            className="group rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-black">
              New Invoice
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Generate a professional invoice with AI.
            </p>
          </Link>
          <Link
            href="/new-contract"
            className="group rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-black">
              New Contract
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Draft a freelance contract tailored to your project.
            </p>
          </Link>
          <Link
            href="/clients/new"
            className="group rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-black">
              Add Client
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Add a new client to your account.
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Documents
          </h2>
          <Link
            href="/documents"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            View all
          </Link>
        </div>

        {!recentDocs.data || recentDocs.data.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">
              No documents yet. Create your first invoice or contract!
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentDocs.data.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {doc.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-500">
                      {doc.type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {(doc.clients as { name: string } | null)?.name ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[doc.status] ?? ""}`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
