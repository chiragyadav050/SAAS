"use client";

import { useState } from "react";
import Link from "next/link";
import type { Client } from "@/types";
import type { InvoiceOutput } from "@/lib/validations/invoice";

interface InvoiceFormProps {
  clients: Client[];
  onGenerated: (invoice: InvoiceOutput, documentId: string) => void;
}

export function InvoiceForm({ clients, onGenerated }: InvoiceFormProps) {
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
      description: formData.get("description") as string,
      rate: parseFloat(formData.get("rate") as string),
      hours: parseFloat(formData.get("hours") as string),
      due_date: formData.get("due_date") as string,
      currency: (formData.get("currency") as string) || "USD",
      notes: (formData.get("notes") as string) || undefined,
    };

    try {
      const res = await fetch("/api/generate/invoice", {
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

      onGenerated(data.invoice, data.document.id);
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
          You need to add a client before creating an invoice.
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
          Invoice Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="e.g. Website Redesign - March 2026"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Project Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          placeholder="Describe the work performed..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
            Hourly Rate *
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
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
            Hours Worked *
          </label>
          <input
            type="number"
            id="hours"
            name="hours"
            required
            min="0"
            step="0.25"
            placeholder="40"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.hours && (
            <p className="mt-1 text-sm text-red-600">{errors.hours[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            Due Date *
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.due_date && (
            <p className="mt-1 text-sm text-red-600">{errors.due_date[0]}</p>
          )}
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
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (&euro;)</option>
            <option value="GBP">GBP (&pound;)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Any extra details for the invoice..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Generating Invoice with AI..." : "Generate Invoice"}
      </button>
    </form>
  );
}
