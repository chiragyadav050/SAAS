import Link from "next/link";

const FEATURES = [
  {
    title: "AI Invoice Generation",
    description:
      "Describe your project and let AI create a professional invoice with line items, payment terms, and late fee clauses.",
  },
  {
    title: "AI Contract Drafting",
    description:
      "Generate complete freelance contracts with scope, IP ownership, termination clauses, and jurisdiction-specific terms.",
  },
  {
    title: "PDF Export",
    description:
      "Export polished PDFs for invoices and contracts. Download or share them with clients instantly.",
  },
  {
    title: "Email Delivery",
    description:
      "Send invoices directly to clients with a single click. Track opens and know when they view your invoice.",
  },
  {
    title: "Client Management",
    description:
      "Manage your client list with contact details. Auto-populate client info in invoices and contracts.",
  },
  {
    title: "Flexible Plans",
    description:
      "Start free with 3 invoices/month. Upgrade to Pro for unlimited documents, or Agency for white-label features.",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "",
    features: ["3 invoices/month", "1 contract/month", "PDF export"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    features: [
      "Unlimited invoices",
      "Unlimited contracts",
      "PDF export",
      "Email sending",
      "Custom templates",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$199",
    period: "/month",
    features: [
      "Everything in Pro",
      "White-label branding",
      "Team members",
      "Priority support",
      "API access",
    ],
    cta: "Contact Us",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-bold">Clause</span>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          AI-Powered Invoices &<br />
          Contracts for Freelancers
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Generate professional invoices and legally sound contracts in seconds.
          No templates to fill. No legal jargon to decipher. Just describe your
          project and let AI do the rest.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-lg bg-black px-8 py-3.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Start for Free
          </Link>
          <Link
            href="#features"
            className="rounded-lg border border-gray-300 px-8 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            See Features
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Free plan includes 3 invoices/month. No credit card required.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Everything you need to get paid
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            From generating invoices to tracking payments, Clause handles the
            business side so you can focus on your craft.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-gray-600">
            Start free. Upgrade when you need more.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-8 ${
                  plan.highlighted
                    ? "border-black bg-gray-50 shadow-md"
                    : "border-gray-200"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  )}
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center text-sm text-gray-600">
                      <svg
                        className="mr-2 h-4 w-4 flex-shrink-0 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`mt-8 block rounded-lg px-4 py-2.5 text-center text-sm font-medium ${
                    plan.highlighted
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-gray-500">
            Built on OpenAI API. Designed for freelancers.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Clause. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
