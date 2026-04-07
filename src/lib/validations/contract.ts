import { z } from "zod";

// Schema for the contract generation request (user input)
export const contractInputSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  title: z.string().min(1, "Title is required").max(200),
  project_description: z.string().min(1, "Project description is required").max(5000),
  rate: z.number().positive("Rate must be positive"),
  rate_type: z.enum(["hourly", "fixed"]).default("hourly"),
  currency: z.string().default("USD"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  jurisdiction: z.string().min(1, "Jurisdiction is required").max(200),
  revisions: z.number().int().min(0).default(2),
  notes: z.string().max(2000).optional(),
});

export type ContractInput = z.infer<typeof contractInputSchema>;
