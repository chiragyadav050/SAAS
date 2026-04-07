import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
    lineHeight: 1.5,
  },
  heading1: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 12,
    marginTop: 4,
  },
  heading2: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
  },
  heading3: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },
  paragraph: {
    fontSize: 10,
    color: "#374151",
    marginBottom: 6,
    lineHeight: 1.5,
  },
  listItem: {
    fontSize: 10,
    color: "#374151",
    marginBottom: 3,
    paddingLeft: 16,
    lineHeight: 1.5,
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginVertical: 12,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
});

interface ContractPdfProps {
  markdown: string;
  title: string;
}

export function ContractPdf({ markdown, title }: ContractPdfProps) {
  const elements = parseMarkdown(markdown);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>{title}</Text>
        <View style={styles.hr} />
        {elements.map((el, i) => renderElement(el, i))}
      </Page>
    </Document>
  );
}

type MdElement =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "li"; text: string; ordered: boolean; index: number }
  | { type: "hr" };

function parseMarkdown(md: string): MdElement[] {
  const lines = md.split("\n");
  const elements: MdElement[] = [];
  let listIndex = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^---+$/.test(trimmed)) {
      elements.push({ type: "hr" });
      listIndex = 0;
      continue;
    }

    const h1 = trimmed.match(/^#\s+(.+)/);
    if (h1) { elements.push({ type: "h1", text: stripInline(h1[1]) }); listIndex = 0; continue; }

    const h2 = trimmed.match(/^##\s+(.+)/);
    if (h2) { elements.push({ type: "h2", text: stripInline(h2[1]) }); listIndex = 0; continue; }

    const h3 = trimmed.match(/^###\s+(.+)/);
    if (h3) { elements.push({ type: "h3", text: stripInline(h3[1]) }); listIndex = 0; continue; }

    const ol = trimmed.match(/^\d+\.\s+(.+)/);
    if (ol) { listIndex++; elements.push({ type: "li", text: stripInline(ol[1]), ordered: true, index: listIndex }); continue; }

    const ul = trimmed.match(/^[-*]\s+(.+)/);
    if (ul) { elements.push({ type: "li", text: stripInline(ul[1]), ordered: false, index: 0 }); continue; }

    if (trimmed === "") { listIndex = 0; continue; }

    elements.push({ type: "p", text: stripInline(trimmed) });
    listIndex = 0;
  }

  return elements;
}

function stripInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1");
}

function renderElement(el: MdElement, key: number) {
  switch (el.type) {
    case "h1":
      return <Text key={key} style={styles.heading1}>{el.text}</Text>;
    case "h2":
      return <Text key={key} style={styles.heading2}>{el.text}</Text>;
    case "h3":
      return <Text key={key} style={styles.heading3}>{el.text}</Text>;
    case "p":
      return <Text key={key} style={styles.paragraph}>{el.text}</Text>;
    case "li":
      const bullet = el.ordered ? `${el.index}. ` : "\u2022 ";
      return <Text key={key} style={styles.listItem}>{bullet}{el.text}</Text>;
    case "hr":
      return <View key={key} style={styles.hr} />;
  }
}
