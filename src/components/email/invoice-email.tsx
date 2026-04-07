interface InvoiceEmailProps {
  fromName: string;
  clientName: string;
  invoiceNumber: string;
  total: string;
  dueDate: string;
  viewUrl: string;
  trackingUrl: string;
}

/**
 * Generate HTML email for sending an invoice.
 * Plain HTML string — no React rendering needed for Resend.
 */
export function buildInvoiceEmailHtml(props: InvoiceEmailProps): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="padding:32px;">
      <h1 style="margin:0 0 8px;font-size:20px;color:#111827;">New Invoice from ${escapeHtml(props.fromName)}</h1>
      <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
        Hi ${escapeHtml(props.clientName)}, you have a new invoice.
      </p>

      <div style="background:#f9fafb;border-radius:6px;padding:16px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:4px 0;font-size:13px;color:#6b7280;">Invoice</td>
            <td style="padding:4px 0;font-size:13px;color:#111827;text-align:right;font-weight:600;">${escapeHtml(props.invoiceNumber)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:13px;color:#6b7280;">Amount Due</td>
            <td style="padding:4px 0;font-size:13px;color:#111827;text-align:right;font-weight:600;">${escapeHtml(props.total)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:13px;color:#6b7280;">Due Date</td>
            <td style="padding:4px 0;font-size:13px;color:#111827;text-align:right;font-weight:600;">${escapeHtml(props.dueDate)}</td>
          </tr>
        </table>
      </div>

      <a href="${escapeHtml(props.viewUrl)}" style="display:block;text-align:center;background:#111827;color:#ffffff;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:500;text-decoration:none;">
        View Invoice
      </a>

      <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;">
        This invoice was sent via Clause.
      </p>
    </div>
  </div>
  <img src="${escapeHtml(props.trackingUrl)}" width="1" height="1" style="display:none;" alt="" />
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
