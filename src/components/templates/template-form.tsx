"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TemplateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      prompt_template: formData.get("prompt_template") as string,
      is_default: formData.get("is_default") === "on",
    };

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.details) {
          setErrors(data.details);
        } else {
          setErrors({ _form: [data.error || "Something went wrong"] });
        }
        return;
      }

      router.push("/templates");
      router.refresh();
    } catch {
      setErrors({ _form: ["Network error. Please try again."] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {errors._form && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{errors._form[0]}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Template Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="e.g. Standard Web Dev Invoice"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type *
        </label>
        <select
          id="type"
          name="type"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="invoice">Invoice</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      <div>
        <label htmlFor="prompt_template" className="block text-sm font-medium text-gray-700">
          Prompt Template *
        </label>
        <p className="mt-1 text-xs text-gray-500">
          Custom instructions for the AI. Use {"{client_name}"}, {"{description}"}, {"{rate}"}, {"{hours}"} as placeholders.
        </p>
        <textarea
          id="prompt_template"
          name="prompt_template"
          required
          rows={6}
          placeholder="Generate a professional invoice for web development services. Ensure the tone is formal and include a detailed breakdown of hours..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.prompt_template && (
          <p className="mt-1 text-sm text-red-600">{errors.prompt_template[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_default"
          name="is_default"
          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
        />
        <label htmlFor="is_default" className="text-sm text-gray-700">
          Set as default template for this type
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Template"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
