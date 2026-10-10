import "server-only";
import type { SupportedMime } from "@/lib/types";

const decoder = new TextDecoder("utf-8", { fatal: false });

/** Extracts normalised plain text. Heavy parsers are lazy-loaded so cold starts stay small. */
export async function extractText(bytes: Uint8Array, mime: SupportedMime): Promise<string> {
  switch (mime) {
    case "text/plain":
    case "text/markdown":
    case "text/csv":
    case "application/json":
      return normalise(decoder.decode(bytes));

    case "application/pdf": {
      const { extractText: pdfText, getDocumentProxy } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(bytes));
      const { text } = await pdfText(pdf, { mergePages: true });
      return normalise(text);
    }

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      const mammoth = await import("mammoth");
      const { value } = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
      return normalise(value);
    }
  }
}

function normalise(s: string): string {
  return s
    .replace(/^\uFEFF/, "")         // BOM
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
