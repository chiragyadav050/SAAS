"use client";

import { useState, useEffect } from "react";
import { ContractForm } from "@/components/contract/contract-form";
import { ContractPreview } from "@/components/contract/contract-preview";
import type { Client } from "@/types";

export default function NewContractPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleGenerated(markdown: string, docId: string) {
    setContract(markdown);
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
        <h1 className="text-2xl font-bold text-gray-900">New Contract</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details and let AI draft a professional freelance contract.
        </p>
      </div>

      {contract && documentId ? (
        <ContractPreview markdown={contract} documentId={documentId} />
      ) : (
        <ContractForm clients={clients} onGenerated={handleGenerated} />
      )}
    </div>
  );
}
