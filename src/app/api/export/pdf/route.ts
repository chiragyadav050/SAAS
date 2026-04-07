import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";
import { generateInvoicePdf, generateContractPdf } from "@/lib/pdf";
import { uploadPdf } from "@/lib/supabase/storage";
import { invoiceOutputSchema } from "@/lib/validations/invoice";

// POST /api/export/pdf — generate PDF and upload to storage
export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    const supabase = createAdminClient();

    const { document_id } = await request.json();

    if (!document_id) {
      return NextResponse.json(
        { error: "document_id is required" },
        { status: 400 }
      );
    }

    // Fetch the document
    const { data: doc } = await supabase
      .from("documents")
      .select("*")
      .eq("id", document_id)
      .eq("user_id", userId)
      .single();

    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    let pdfBuffer: Buffer;
    const filename = `${doc.title.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "-")}.pdf`;

    if (doc.type === "invoice") {
      if (!doc.content_json) {
        return NextResponse.json(
          { error: "Invoice has no content" },
          { status: 400 }
        );
      }
      const invoice = invoiceOutputSchema.parse(doc.content_json);
      pdfBuffer = await generateInvoicePdf(invoice);
    } else if (doc.type === "contract") {
      if (!doc.content_markdown) {
        return NextResponse.json(
          { error: "Contract has no content" },
          { status: 400 }
        );
      }
      pdfBuffer = await generateContractPdf(doc.content_markdown, doc.title);
    } else {
      return NextResponse.json(
        { error: "Unknown document type" },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const pdfUrl = await uploadPdf(userId, doc.id, pdfBuffer, filename);

    // Update document with PDF URL
    await supabase
      .from("documents")
      .update({ pdf_url: pdfUrl })
      .eq("id", doc.id);

    return NextResponse.json({ pdf_url: pdfUrl });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("PDF export error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    );
  }
}
