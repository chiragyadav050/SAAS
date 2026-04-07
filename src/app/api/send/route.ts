import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";
import { getResend } from "@/lib/resend";
import { generatePublicToken } from "@/lib/tokens";
import { buildInvoiceEmailHtml } from "@/components/email/invoice-email";
import { invoiceOutputSchema } from "@/lib/validations/invoice";
import { currentUser } from "@clerk/nextjs/server";

// POST /api/send — send a document (invoice) via email
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

    // Fetch document with client info
    const { data: doc } = await supabase
      .from("documents")
      .select("*, clients(name, email)")
      .eq("id", document_id)
      .eq("user_id", userId)
      .single();

    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (doc.type !== "invoice") {
      return NextResponse.json(
        { error: "Only invoices can be sent via email currently" },
        { status: 400 }
      );
    }

    const client = doc.clients as { name: string; email: string } | null;
    if (!client?.email) {
      return NextResponse.json(
        { error: "Client has no email address" },
        { status: 400 }
      );
    }

    // Generate public token if not already set
    let publicToken = doc.public_token;
    if (!publicToken) {
      publicToken = generatePublicToken();
      await supabase
        .from("documents")
        .update({ public_token: publicToken })
        .eq("id", doc.id);
    }

    // Parse invoice data for email
    const invoice = invoiceOutputSchema.parse(doc.content_json);
    const clerkUser = await currentUser();
    const fromName = clerkUser?.fullName ?? clerkUser?.firstName ?? "Freelancer";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const viewUrl = `${appUrl}/invoice/${publicToken}`;

    // Create the send record first (for tracking ID)
    const { data: send, error: sendError } = await supabase
      .from("sends")
      .insert({
        document_id: doc.id,
        recipient_email: client.email,
      })
      .select()
      .single();

    if (sendError || !send) {
      return NextResponse.json(
        { error: "Failed to create send record" },
        { status: 500 }
      );
    }

    const trackingUrl = `${appUrl}/api/track/${send.id}`;

    const CURRENCY_SYMBOLS: Record<string, string> = {
      USD: "$", EUR: "\u20AC", GBP: "\u00A3", CAD: "C$", AUD: "A$",
    };
    const symbol = CURRENCY_SYMBOLS[invoice.currency] ?? invoice.currency + " ";
    const totalFormatted = `${symbol}${invoice.total.toFixed(2)}`;

    // Build email HTML
    const html = buildInvoiceEmailHtml({
      fromName,
      clientName: client.name,
      invoiceNumber: invoice.invoice_number,
      total: totalFormatted,
      dueDate: invoice.due_date,
      viewUrl,
      trackingUrl,
    });

    // Send via Resend
    const { error: emailError } = await getResend().emails.send({
      from: `${fromName} via Clause <invoices@${process.env.RESEND_DOMAIN ?? "clause.app"}>`,
      to: client.email,
      subject: `Invoice ${invoice.invoice_number} from ${fromName}`,
      html,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Update document status to sent
    await supabase
      .from("documents")
      .update({ status: "sent" })
      .eq("id", doc.id);

    return NextResponse.json({ success: true, send_id: send.id });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Send error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please try again." },
      { status: 500 }
    );
  }
}
