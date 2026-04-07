"use client";

import { useState } from "react";
import Link from "next/link";

interface OnboardingWizardProps {
  hasClients: boolean;
  hasDocuments: boolean;
}

const STEPS = [
  {
    title: "Add your first client",
    description: "Add a client so you can generate invoices and contracts for them.",
    href: "/clients/new",
    cta: "Add Client",
    checkKey: "hasClients" as const,
  },
  {
    title: "Create your first invoice",
    description: "Generate a professional AI-powered invoice in seconds.",
    href: "/new-invoice",
    cta: "Create Invoice",
    checkKey: "hasDocuments" as const,
  },
];

export function OnboardingWizard({
  hasClients,
  hasDocuments,
}: OnboardingWizardProps) {
  const [dismissed, setDismissed] = useState(false);

  const checks = { hasClients, hasDocuments };
  const pendingSteps = STEPS.filter((step) => !checks[step.checkKey]);

  if (dismissed || pendingSteps.length === 0) return null;

  return (
    <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-blue-900">
            Get started with Clause
          </h2>
          <p className="mt-1 text-sm text-blue-700">
            Complete these steps to start generating AI-powered documents.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Dismiss
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {STEPS.map((step, i) => {
          const completed = checks[step.checkKey];
          return (
            <div
              key={i}
              className={`flex items-center justify-between rounded-md border p-4 ${
                completed
                  ? "border-green-200 bg-green-50"
                  : "border-white bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {completed ? "\u2713" : i + 1}
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      completed ? "text-green-800 line-through" : "text-gray-900"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {!completed && (
                <Link
                  href={step.href}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                >
                  {step.cta}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
