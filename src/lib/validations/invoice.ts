import { z } from "zod";

// Schema for the invoice generation request (user input)
export const invoiceInputSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  rate: z.number().positive("Rate must be positive"),
  hours: z.number().positive("Hours must be positive"),
  due_date: z.string().min(1, "Due date is required"),
  currency: z.string().default("USD"),
  notes: z.string().max(1000).optional(),
});

export type InvoiceInput = z.infer<typeof invoiceInputSchema>;

// Schema for the AI-generated invoice JSON output
export const invoiceOutputSchema = z.object({
  invoice_number: z.string(),
  issue_date: z.string(),
  due_date: z.string(),
  currency: z.string(),
  from: z.object({
    name: z.string(),
    email: z.string(),
  }),
  to: z.object({
    name: z.string(),
    email: z.string(),
    company: z.string().nullable(),
    address: z.string().nullable(),
  }),
  line_items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      unit_price: z.number(),
      amount: z.number(),
    })
  ),
  subtotal: z.number(),
  tax_rate: z.number(),
  tax_amount: z.number(),
  total: z.number(),
  payment_terms: z.string(),
  late_fee_clause: z.string(),
  notes: z.string().nullable(),
});

export type InvoiceOutput = z.infer<typeof invoiceOutputSchema>;
