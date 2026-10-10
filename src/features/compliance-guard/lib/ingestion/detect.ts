import type { SupportedMime } from "@/lib/types";

const EXT_MAP: Record<string, SupportedMime> = {
  txt: "text/plain",
  md: "text/markdown",
  markdown: "text/markdown",
  csv: "text/csv",
  json: "application/json",
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const startsWith = (b: Uint8Array, sig: number[]) => sig.every((v, i) => b[i] === v);

/**
 * Resolve the real format from magic bytes first, then extension, then declared MIME.
 * Never trust the client-declared MIME alone (spoofing / mislabelled exports are common).
 */
export function detectMime(bytes: Uint8Array, fileName: string, declared?: string): SupportedMime | null {
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46])) return "application/pdf";               // %PDF
  const ext = fileName.toLowerCase().split(".").pop() ?? "";
  if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04])) {                                        // ZIP container
    return ext === "docx" ? EXT_MAP.docx : null;                                            // xlsx/pptx not yet supported
  }
  if (EXT_MAP[ext]) return EXT_MAP[ext];
  if (declared && (Object.values(EXT_MAP) as string[]).includes(declared)) return declared as SupportedMime;
  // Heuristic: printable UTF-8 → plain text.
  const sample = bytes.subarray(0, 512);
  const printable = sample.every((c) => c === 9 || c === 10 || c === 13 || c >= 32);
  return printable ? "text/plain" : null;
}
