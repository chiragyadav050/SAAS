"use client";

import { useState } from "react";
import Link from "next/link";
import type { Client } from "@/types";

interface ContractFormProps {
  clients: Client[];
  onGenerated: (markdown: string, documentId: string) => void;
}

export function ContractForm({ clients, onGenerated }: ContractFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const body = {
      client_id: formData.get("client_id") as string,
      title: formData.get("title") as string,
      project_description: formData.get("project_description") as string,
      rate: parseFloat(formData.get("rate") as string),
      rate_type: formData.get("rate_type") as string,
      currency: (formData.get("currency") as string) || "USD",
      start_date: formData.get("start_date") as string,
      end_date: (formData.get("end_date") as string) || undefined,
      jurisdiction: formData.get("jurisdiction") as string,
      revisions: parseInt(formData.get("revisions") as string) || 2,
      notes: (formData.get("notes") as string) || undefined,
    };

    try {
      const res = await fetch("/api/generate/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setErrors(data.details);
        } else {
          setErrors({ _form: [data.error || "Something went wrong"] });
        }
        return;
      }

      onGenerated(data.contract, data.document.id);
    } catch {
      setErrors({ _form: ["Network error. Please try again."] });
    } finally {
      setLoading(false);
    }
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <h3 className="text-sm font-medium text-gray-900">No clients yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          You need to add a client before creating a contract.
        </p>
        <Link
          href="/clients/new"
          className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Client
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {errors._form && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{errors._form[0]}</p>
        </div>
      )}

      <div>
        <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
          Client *
        </label>
        <select
          id="client_id"
          name="client_id"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.email})
            </option>
          ))}
        </select>
        {errors.client_id && (
          <p className="mt-1 text-sm text-red-600">{errors.client_id[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Contract Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="e.g. Website Redesign Contract"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="project_description" className="block text-sm font-medium text-gray-700">
          Project Description *
        </label>
        <textarea
          id="project_description"
          name="project_description"
          required
          rows={4}
          placeholder="Describe the project scope, deliverables, and expectations..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.project_description && (
          <p className="mt-1 text-sm text-red-600">{errors.project_description[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
            Rate *
          </label>
          <input
            type="number"
            id="rate"
            name="rate"
            required
            min="0"
            step="0.01"
            placeholder="150.00"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.rate && (
            <p className="mt-1 text-sm text-red-600">{errors.rate[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="rate_type" className="block text-sm font-medium text-gray-700">
            Rate Type
          </label>
          <select
            id="rate_type"
            name="rate_type"
            defaultValue="hourly"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="hourly">Hourly</option>
            <option value="fixed">Fixed Price</option>
          </select>
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            defaultValue="USD"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
            Start Date *
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.start_date && (
            <p className="mt-1 text-sm text-red-600">{errors.start_date[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
            End Date (optional)
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700">
            Jurisdiction *
          </label>
          <input
            type="text"
            id="jurisdiction"
            name="jurisdiction"
            required
            placeholder="e.g. State of California, USA"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.jurisdiction && (
            <p className="mt-1 text-sm text-red-600">{errors.jurisdiction[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="revisions" className="block text-sm font-medium text-gray-700">
            Revisions Included
          </label>
          <input
            type="number"
            id="revisions"
            name="revisions"
            min="0"
            defaultValue={2}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Additional Terms / Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Any special terms or conditions..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Generating Contract with AI..." : "Generate Contract"}
      </button>
    </form>
  );
}
