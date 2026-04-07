"use client";

import { useState, useEffect } from "react";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { InvoicePreview } from "@/components/invoice/invoice-preview";
import type { Client } from "@/types";
import type { InvoiceOutput } from "@/lib/validations/invoice";

export default function NewInvoicePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceOutput | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleGenerated(inv: InvoiceOutput, docId: string) {
    setInvoice(inv);
    setDocumentId(docId);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details and let AI generate a professional invoice.
        </p>
      </div>

      {invoice && documentId ? (
        <InvoicePreview invoice={invoice} documentId={documentId} />
      ) : (
        <InvoiceForm clients={clients} onGenerated={handleGenerated} />
      )}
    </div>
  );
}
