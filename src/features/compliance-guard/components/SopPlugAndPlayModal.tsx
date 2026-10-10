"use client";

import React, { useState } from "react";
import type { IngestResult } from "@/lib/types";

interface SopPlugAndPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess?: (result: IngestResult) => void;
}

const SAMPLE_TEMPLATES = [
  {
    name: "SOP-KIT-04_Fryer_Oil_Filtration.md",
    kind: "sop",
    title: "SOP-KIT-04: High-Pressure Fryer Maintenance & Oil Filtration",
    content: `# STANDARD OPERATING PROCEDURE: Commercial Fryer Oil Filtration & Burn Prevention
Document ID: SOP-KIT-04 | Standard: ISO 45001 §8.1.2 & GSR Reg 2

1. PURPOSE
Mandatory engineering & PPE protocols to eliminate hot-oil splash injuries during oil filtration.

2. CONTROLS
- Oil must be cooled below 60°C before valve actuation.
- EN 407 certified forearm heat-resistant gauntlets mandatory.
- Stainless steel enclosed filtration wand required. No open plastic buckets.`,
  },
  {
    name: "SOP-LOG-02_Receiving_Ergonomics.md",
    kind: "sop",
    title: "SOP-LOG-02: Receiving Bay Manual Handling & Ergonomics",
    content: `# STANDARD OPERATING PROCEDURE: Receiving Bay Pallet Destacking & Ergonomics
Document ID: SOP-LOG-02 | Standard: Ergonomics Regulations 2019 (Reg 3)

1. PURPOSE
Eliminate lumbar spinal disc compression during bulk pallet unloading.

2. MAXIMUM LIFT LIMITS
- Single lift capped at 20kg. 25kg bulk flour/sugar bags strictly require two-person team lift or hydraulic lifter.
- Heavy SKUs slotted in 'golden zone' shelving (70cm - 120cm).`,
  },
];

export function SopPlugAndPlayModal({
  isOpen,
  onClose,
  onIngestSuccess,
}: SopPlugAndPlayModalProps) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<IngestResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessPayload = async (fileName: string, mimeType: string, content: string, kind?: string) => {
    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const base64 = btoa(unescape(encodeURIComponent(content)));
      const res = await fetch("/api/sop/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": "tenant_sa_retail_group",
          "x-user-id": "user_safety_officer_sarah",
        },
        body: JSON.stringify({
          fileName,
          mimeType,
          contentBase64: base64,
          declaredKind: kind,
          siteId: "site_mochachos_centurion",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to ingest document");
      }

      const data: IngestResult = await res.json();
      setResult(data);
      if (onIngestSuccess) onIngestSuccess(data);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("siteId", "site_mochachos_centurion");

      const res = await fetch("/api/sop/ingest", {
        method: "POST",
        headers: {
          "x-tenant-id": "tenant_sa_retail_group",
          "x-user-id": "user_safety_officer_sarah",
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Upload failed");
      }

      const data: IngestResult = await res.json();
      setResult(data);
      if (onIngestSuccess) onIngestSuccess(data);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-navy-950/75 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl border border-line bg-surface-strong p-5 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-ink">
                Universal SOP Connector
              </h2>
              <p className="text-xs text-muted">
                Plug in existing procedures & historical logs. Auto-versioned & vector-indexed.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:text-ink hover:bg-surface active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4">
          {/* Quick Benchmark Templates */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
              Instant Ingest with SA Industry Benchmark SOPs:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => handleProcessPayload(tmpl.name, "text/markdown", tmpl.content, tmpl.kind)}
                  className="text-left p-3 rounded-xl border border-line bg-surface hover:border-brand-500/50 hover:bg-surface-strong transition text-xs space-y-1 active:scale-[0.99]"
                >
                  <div className="font-semibold text-ink">{tmpl.title}</div>
                  <div className="text-[10px] text-muted font-mono">{tmpl.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files[0];
              if (file) {
                const input = document.getElementById("sop-modal-file-input") as HTMLInputElement;
                if (input) {
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);
                  input.files = dataTransfer.files;
                  input.dispatchEvent(new Event("change", { bubbles: true }));
                }
              }
            }}
            className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
              dragActive ? "border-brand-500 bg-brand-500/10" : "border-line bg-surface/50 hover:border-brand-400"
            }`}
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 mb-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-xs font-semibold text-ink">
              Drop PDF, Word (.docx), CSV, or Markdown here
            </div>
            <p className="text-[11px] text-muted mt-1">
              File is encrypted, SHA-256 hashed, and aligned to ISO 45001 clauses.
            </p>

            <label className="btn-primary text-xs mt-3 cursor-pointer inline-flex">
              <span>{loading ? "Processing Document..." : "Browse from Device"}</span>
              <input
                id="sop-modal-file-input"
                type="file"
                disabled={loading}
                onChange={handleFileChange}
                accept=".pdf,.docx,.csv,.json,.txt,.md"
                className="hidden"
              />
            </label>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
              <strong>Ingestion Error:</strong> {errorMessage}
            </div>
          )}

          {/* Live Ingestion Result Card */}
          {result && (
            <div className="rounded-xl border border-brand-500/40 bg-surface p-4 text-xs space-y-2.5 animate-fade-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-ink">{result.document.title}</span>
                </div>
                <span className="chip text-[10px] font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  Version v{result.document.version}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted font-mono pt-1">
                <div>Chunks: <strong className="text-ink">{result.chunkCount} vectors</strong></div>
                <div>Hash: <strong className="text-ink">{result.document.contentHash.slice(0, 10)}...</strong></div>
                <div>Status: <strong className="text-ink capitalize">{result.document.status}</strong></div>
                <div>Review: <strong className="text-ink">{new Date(result.document.reviewDueAt).toLocaleDateString("en-ZA")}</strong></div>
              </div>

              {result.document.clauseMappings.length > 0 && (
                <div className="pt-2 border-t border-line/60">
                  <div className="text-[10px] font-semibold uppercase text-muted mb-1">
                    Auto-Mapped Statutory & ISO Clauses:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.document.clauseMappings.map((c, i) => (
                      <span key={i} className="chip text-[10px] font-mono">
                        {c.standard} §{c.clause} ({c.title})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
