// Re-export database types for convenience
export type {
  Database,
  DocumentType,
  DocumentStatus,
  PlanType,
  Json,
} from "./database";

// Convenience row types
import type { Database } from "./database";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Template = Database["public"]["Tables"]["templates"]["Row"];
export type Send = Database["public"]["Tables"]["sends"]["Row"];

// Insert types
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type TemplateInsert = Database["public"]["Tables"]["templates"]["Insert"];
export type SendInsert = Database["public"]["Tables"]["sends"]["Insert"];

// Update types
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
export type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];
export type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];
export type TemplateUpdate = Database["public"]["Tables"]["templates"]["Update"];
export type SendUpdate = Database["public"]["Tables"]["sends"]["Update"];
