"use client";

import { useState } from "react";
import type { PlanType } from "@/types";

interface PlanCardProps {
  name: string;
  price: number;
  features: string[];
  planKey: PlanType;
  currentPlan: PlanType;
  hasStripeCustomer: boolean;
}

export function PlanCard({
  name,
  price,
  features,
  planKey,
  currentPlan,
  hasStripeCustomer,
}: PlanCardProps) {
  const [loading, setLoading] = useState(false);
  const isCurrent = planKey === currentPlan;

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleManage() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`rounded-lg border p-6 ${
        isCurrent
          ? "border-black bg-gray-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        {isCurrent && (
          <span className="rounded-full bg-black px-2.5 py-0.5 text-xs font-medium text-white">
            Current
          </span>
        )}
      </div>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        ${price}
        {price > 0 && (
          <span className="text-base font-normal text-gray-500">/month</span>
        )}
      </p>

      <ul className="mt-4 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center text-sm text-gray-600">
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
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {isCurrent && hasStripeCustomer && planKey !== "free" ? (
          <button
            onClick={handleManage}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Manage Subscription"}
          </button>
        ) : isCurrent ? (
          <div className="w-full rounded-lg bg-gray-100 px-4 py-2 text-center text-sm font-medium text-gray-500">
            Current Plan
          </div>
        ) : planKey === "free" ? null : (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Loading..." : `Upgrade to ${name}`}
          </button>
        )}
      </div>
    </div>
  );
}
