export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DocumentType = "invoice" | "contract";
export type DocumentStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";
export type PlanType = "free" | "pro" | "agency";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          plan: PlanType;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          plan?: PlanType;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          plan?: PlanType;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          type: DocumentType;
          title: string;
          content_json: Json | null;
          content_markdown: string | null;
          pdf_url: string | null;
          status: DocumentStatus;
          public_token: string | null;
          client_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: DocumentType;
          title: string;
          content_json?: Json | null;
          content_markdown?: string | null;
          pdf_url?: string | null;
          status?: DocumentStatus;
          public_token?: string | null;
          client_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: DocumentType;
          title?: string;
          content_json?: Json | null;
          content_markdown?: string | null;
          pdf_url?: string | null;
          status?: DocumentStatus;
          public_token?: string | null;
          client_id?: string | null;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          company: string | null;
          address: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          company?: string | null;
          address?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
          company?: string | null;
          address?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          user_id: string;
          type: DocumentType;
          name: string;
          prompt_template: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: DocumentType;
          name: string;
          prompt_template: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: DocumentType;
          name?: string;
          prompt_template?: string;
          is_default?: boolean;
          updated_at?: string;
        };
      };
      sends: {
        Row: {
          id: string;
          document_id: string;
          recipient_email: string;
          sent_at: string;
          opened_at: string | null;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          document_id: string;
          recipient_email: string;
          sent_at?: string;
          opened_at?: string | null;
          paid_at?: string | null;
        };
        Update: {
          opened_at?: string | null;
          paid_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      document_type: DocumentType;
      document_status: DocumentStatus;
      plan_type: PlanType;
    };
  };
}
