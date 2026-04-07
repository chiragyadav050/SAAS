import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { InvoiceOutput } from "@/lib/validations/invoice";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 4,
  },
  dateBlock: {
    textAlign: "right",
    fontSize: 9,
    color: "#6b7280",
  },
  partyRow: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 24,
  },
  partyBlock: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  partyName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  partyDetail: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colRate: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1, textAlign: "right" },
  totalsBlock: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 200,
    paddingVertical: 3,
  },
  totalLabel: {
    flex: 1,
    fontSize: 9,
    color: "#6b7280",
  },
  totalValue: {
    width: 80,
    textAlign: "right",
    fontSize: 9,
    color: "#111827",
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 200,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 2,
  },
  grandTotalLabel: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  grandTotalValue: {
    width: 80,
    textAlign: "right",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  termsSection: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
  },
  termsLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: 10,
  },
  termsText: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.4,
  },
});

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
  CAD: "C$",
  AUD: "A$",
};

function fmt(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + " ";
  return `${symbol}${amount.toFixed(2)}`;
}

interface InvoicePdfProps {
  invoice: InvoiceOutput;
}

export function InvoicePdf({ invoice }: InvoicePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text>Issue Date: {invoice.issue_date}</Text>
            <Text>Due Date: {invoice.due_date}</Text>
          </View>
        </View>

        {/* From / To */}
        <View style={styles.partyRow}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>From</Text>
            <Text style={styles.partyName}>{invoice.from.name}</Text>
            <Text style={styles.partyDetail}>{invoice.from.email}</Text>
          </View>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>Bill To</Text>
            <Text style={styles.partyName}>{invoice.to.name}</Text>
            <Text style={styles.partyDetail}>{invoice.to.email}</Text>
            {invoice.to.company && (
              <Text style={styles.partyDetail}>{invoice.to.company}</Text>
            )}
            {invoice.to.address && (
              <Text style={styles.partyDetail}>{invoice.to.address}</Text>
            )}
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colDesc]}>
            Description
          </Text>
          <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
          <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
        </View>
        {invoice.line_items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colRate}>
              {fmt(item.unit_price, invoice.currency)}
            </Text>
            <Text style={[styles.colAmount, { fontFamily: "Helvetica-Bold" }]}>
              {fmt(item.amount, invoice.currency)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {fmt(invoice.subtotal, invoice.currency)}
            </Text>
          </View>
          {invoice.tax_amount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Tax ({invoice.tax_rate}%)
              </Text>
              <Text style={styles.totalValue}>
                {fmt(invoice.tax_amount, invoice.currency)}
              </Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {fmt(invoice.total, invoice.currency)}
            </Text>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsLabel}>Payment Terms</Text>
          <Text style={styles.termsText}>{invoice.payment_terms}</Text>
          <Text style={styles.termsLabel}>Late Fee Policy</Text>
          <Text style={styles.termsText}>{invoice.late_fee_clause}</Text>
          {invoice.notes && (
            <>
              <Text style={styles.termsLabel}>Notes</Text>
              <Text style={styles.termsText}>{invoice.notes}</Text>
            </>
          )}
        </View>
      </Page>
    </Document>
  );
}
