import Anthropic from "@anthropic-ai/sdk";
import { invoiceOutputSchema, type InvoiceOutput } from "@/lib/validations/invoice";
import type { Client } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
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
    system:
      "You are a professional accountant generating invoices. Output valid JSON matching the provided schema. Always include: payment terms, late fee clause, professional language. Return ONLY raw JSON, no markdown code fences.",
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Strip any markdown fencing if the model includes it despite instructions
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  const parsed = JSON.parse(cleaned);
  const validated = invoiceOutputSchema.parse(parsed);
  return validated;
}

export { anthropic };
