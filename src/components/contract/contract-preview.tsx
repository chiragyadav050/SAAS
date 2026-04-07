"use client";

import Link from "next/link";

interface ContractPreviewProps {
  markdown: string;
  documentId: string;
}

export function ContractPreview({ markdown, documentId }: ContractPreviewProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Contract Preview</h2>
        <div className="flex gap-2">
          <Link
            href="/documents"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View All Documents
          </Link>
          <Link
            href="/new-contract"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Another
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div
          className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
        />
      </div>

      <p className="mt-2 text-center text-xs text-gray-400">
        Document ID: {documentId}
      </p>
    </div>
  );
}

/**
 * Minimal markdown-to-HTML converter.
 * Handles headings, bold, italic, lists, paragraphs, and horizontal rules.
 * No external dependency needed for preview purposes.
 */
function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      if (inList) { html.push(`</${listType}>`); inList = false; listType = null; }
      html.push("<hr />");
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      if (inList) { html.push(`</${listType}>`); inList = false; listType = null; }
      const level = headingMatch[1].length;
      html.push(`<h${level}>${inlineFormat(headingMatch[2])}</h${level}>`);
      continue;
    }

    // Ordered list item
    const olMatch = line.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (!inList || listType !== "ol") {
        if (inList) html.push(`</${listType}>`);
        html.push("<ol>");
        inList = true;
        listType = "ol";
      }
      html.push(`<li>${inlineFormat(olMatch[1])}</li>`);
      continue;
    }

    // Unordered list item
    const ulMatch = line.match(/^[-*]\s+(.+)/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        if (inList) html.push(`</${listType}>`);
        html.push("<ul>");
        inList = true;
        listType = "ul";
      }
      html.push(`<li>${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    // Close list if we're not in a list item
    if (inList) {
      html.push(`</${listType}>`);
      inList = false;
      listType = null;
    }

    // Empty line
    if (line.trim() === "") {
      continue;
    }

    // Paragraph
    html.push(`<p>${inlineFormat(line)}</p>`);
  }

  if (inList) html.push(`</${listType}>`);
  return html.join("\n");
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}
