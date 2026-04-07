"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Template } from "@/types";

interface TemplateListProps {
  templates: Template[];
}

export function TemplateList({ templates }: TemplateListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this template?")) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/templates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <h3 className="text-sm font-medium text-gray-900">No templates yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create custom prompt templates to personalize AI-generated documents.
        </p>
        <Link
          href="/templates/new"
          className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create Template
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <div
          key={template.id}
          className="rounded-lg border border-gray-200 bg-white p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {template.name}
              </h3>
              <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
                {template.type}
              </span>
              {template.is_default && (
                <span className="ml-1 inline-flex rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white">
                  Default
                </span>
              )}
            </div>
            <button
              onClick={() => handleDelete(template.id)}
              disabled={deletingId === template.id}
              className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {deletingId === template.id ? "..." : "Delete"}
            </button>
          </div>
          <p className="mt-3 line-clamp-3 text-xs text-gray-500">
            {template.prompt_template}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {new Date(template.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
