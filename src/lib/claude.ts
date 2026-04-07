import OpenAI from "openai";
import { invoiceOutputSchema, type InvoiceOutput } from "@/lib/validations/invoice";
import type { Client } from "@/types";

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openai;
}

// ─── Invoice Generation ────────────────────────────────────────────

const INVOICE_SCHEMA_DESCRIPTION = `{
  "invoice_number": "string (e.g. INV-2026-001)",
  "issue_date": "string (YYYY-MM-DD)",
  "due_date": "string (YYYY-MM-DD)",
  "currency": "string (e.g. USD)",
  "from": { "name": "string", "email": "string" },
  "to": { "name": "string", "email": "string", "company": "string|null", "address": "string|null" },
  "line_items": [{ "description": "string", "quantity": "number", "unit_price": "number", "amount": "number" }],
  "subtotal": "number",
  "tax_rate": "number (0 if not applicable)",
  "tax_amount": "number",
  "total": "number",
  "payment_terms": "string (professional payment terms)",
  "late_fee_clause": "string (professional late fee clause)",
  "notes": "string|null"
}`;

interface GenerateInvoiceParams {
  userName: string;
  userEmail: string;
  client: Client;
  description: string;
  rate: number;
  hours: number;
  dueDate: string;
  currency: string;
  notes?: string;
}

export async function generateInvoice(
  params: GenerateInvoiceParams
): Promise<InvoiceOutput> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    max_tokens: 2000,
    messages: [
      {
        role: "system",
        content:
          "You are a professional accountant generating invoices. Output valid JSON matching the provided schema. Always include: payment terms, late fee clause, professional language. Return ONLY raw JSON, no markdown code fences.",
      },
      {
        role: "user",
        content: `Generate a professional invoice in JSON format.

Client: ${params.client.name} (${params.client.email})${params.client.company ? `, Company: ${params.client.company}` : ""}${params.client.address ? `, Address: ${params.client.address}` : ""}
Freelancer: ${params.userName} (${params.userEmail})
Project: ${params.description}
Rate: ${params.currency} ${params.rate}/hour
Hours: ${params.hours}
Due Date: ${params.dueDate}
${params.notes ? `Notes: ${params.notes}` : ""}

Output valid JSON matching this exact schema:
${INVOICE_SCHEMA_DESCRIPTION}

Rules:
- Calculate subtotal as rate * hours
- Tax rate should be 0 unless the description implies a specific jurisdiction with sales tax
- Include professional payment terms (e.g. "Net 30")
- Include a professional late fee clause
- Generate a realistic invoice number
- Issue date is today
- Return ONLY the JSON object, no markdown fencing or extra text`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content ?? "";
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  const parsed = JSON.parse(cleaned);
  return invoiceOutputSchema.parse(parsed);
}

// ─── Contract Generation ───────────────────────────────────────────

interface GenerateContractParams {
  userName: string;
  userEmail: string;
  client: Client;
  projectDescription: string;
  rate: number;
  rateType: "hourly" | "fixed";
  currency: string;
  startDate: string;
  endDate?: string;
  jurisdiction: string;
  revisions: number;
  notes?: string;
}

export async function generateContract(
  params: GenerateContractParams
): Promise<string> {
  const rateDescription =
    params.rateType === "hourly"
      ? `${params.currency} ${params.rate}/hour`
      : `${params.currency} ${params.rate} fixed price`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4000,
    messages: [
      {
        role: "system",
        content:
          "You are a legal professional drafting freelance contracts. Output a complete, professional contract in clean markdown. Include all standard legal sections. Tailor the contract to the specific jurisdiction provided. Be thorough but clear.",
      },
      {
        role: "user",
        content: `Draft a professional freelance contract with these details:

Freelancer: ${params.userName} (${params.userEmail})
Client: ${params.client.name} (${params.client.email})${params.client.company ? `, Company: ${params.client.company}` : ""}${params.client.address ? `, Address: ${params.client.address}` : ""}

Project: ${params.projectDescription}
Compensation: ${rateDescription}
Start Date: ${params.startDate}
${params.endDate ? `End Date: ${params.endDate}` : "No fixed end date"}
Jurisdiction: ${params.jurisdiction}
Revisions Included: ${params.revisions}
${params.notes ? `Additional Terms: ${params.notes}` : ""}

Requirements:
- Include all standard freelance contract sections
- Scope of Work (based on the project description)
- Payment Terms (including late fees)
- Intellectual Property ownership (IP transfers to client upon full payment)
- Revision Policy (${params.revisions} revisions included, additional at the agreed rate)
- Confidentiality clause
- Termination clause (with notice period)
- Limitation of Liability
- Governing Law and Jurisdiction (${params.jurisdiction})
- Signature blocks for both parties

Output the contract in clean markdown format. Use proper headings (##), numbered lists where appropriate, and bold for key terms. Make it professional and legally sound.`,
      },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

export { getOpenAI };
