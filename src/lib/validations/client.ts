import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  company: z.string().max(200).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
