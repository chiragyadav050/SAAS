import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/new-invoice"
          className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-black">
            New Invoice
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Generate a professional invoice with AI in seconds.
          </p>
        </Link>

        <Link
          href="/new-contract"
          className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-black">
            New Contract
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Draft a freelance contract tailored to your project.
          </p>
        </Link>

        <Link
          href="/clients"
          className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-black">
            Manage Clients
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Add and manage your client information.
          </p>
        </Link>
      </div>
    </div>
  );
}
