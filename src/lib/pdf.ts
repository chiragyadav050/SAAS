import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePdf } from "@/components/pdf/invoice-pdf";
import { ContractPdf } from "@/components/pdf/contract-pdf";
import type { InvoiceOutput } from "@/lib/validations/invoice";

export async function generateInvoicePdf(
  invoice: InvoiceOutput
): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(InvoicePdf, { invoice }) as any;
  const buffer = await renderToBuffer(element);
  return Buffer.from(buffer);
}

export async function generateContractPdf(
  markdown: string,
  title: string
): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(ContractPdf, { markdown, title }) as any;
  const buffer = await renderToBuffer(element);
  return Buffer.from(buffer);
}
