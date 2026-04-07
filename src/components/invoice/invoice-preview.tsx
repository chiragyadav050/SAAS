"use client";

import type { InvoiceOutput } from "@/lib/validations/invoice";
import Link from "next/link";

interface InvoicePreviewProps {
  invoice: InvoiceOutput;
  documentId: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
  CAD: "C$",
  AUD: "A$",
};

function formatCurrency(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + " ";
  return `${symbol}${amount.toFixed(2)}`;
}

export function InvoicePreview({ invoice, documentId }: InvoicePreviewProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Invoice Preview</h2>
        <div className="flex gap-2">
          <Link
            href="/documents"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View All Documents
          </Link>
          <Link
            href={`/new-invoice`}
            onClick={() => window.location.reload()}
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Another
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
            <p className="mt-1 text-sm text-gray-500">{invoice.invoice_number}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Issue Date: {invoice.issue_date}</p>
            <p>Due Date: {invoice.due_date}</p>
          </div>
        </div>

        {/* From / To */}
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              From
            </h3>
            <p className="mt-2 text-sm font-medium text-gray-900">
              {invoice.from.name}
            </p>
            <p className="text-sm text-gray-600">{invoice.from.email}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Bill To
            </h3>
            <p className="mt-2 text-sm font-medium text-gray-900">
              {invoice.to.name}
            </p>
            <p className="text-sm text-gray-600">{invoice.to.email}</p>
            {invoice.to.company && (
              <p className="text-sm text-gray-600">{invoice.to.company}</p>
            )}
            {invoice.to.address && (
              <p className="text-sm text-gray-600">{invoice.to.address}</p>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Qty
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Rate
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.line_items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="py-3 text-right text-sm text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-sm text-gray-600">
                    {formatCurrency(item.unit_price, invoice.currency)}
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                {formatCurrency(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Tax ({invoice.tax_rate}%)
                </span>
                <span className="text-gray-900">
                  {formatCurrency(invoice.tax_amount, invoice.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-8 space-y-3 border-t border-gray-200 pt-6">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Payment Terms
            </h4>
            <p className="mt-1 text-sm text-gray-600">{invoice.payment_terms}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Late Fee Policy
            </h4>
            <p className="mt-1 text-sm text-gray-600">
              {invoice.late_fee_clause}
            </p>
          </div>
          {invoice.notes && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Notes
              </h4>
              <p className="mt-1 text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-gray-400">
        Document ID: {documentId}
      </p>
    </div>
  );
}
