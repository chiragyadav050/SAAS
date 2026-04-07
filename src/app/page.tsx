import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">Clause</h1>
        <p className="mt-4 text-lg text-gray-600">
          AI-powered invoices and contracts for freelancers.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Get Started
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
