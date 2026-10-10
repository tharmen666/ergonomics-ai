"use client";

import React, { useState } from "react";
import type { ControlledDocument, IngestResult } from "@/lib/types";

const SAMPLE_SOPS = [
  {
    name: "SOP-KIT-04_Fryer_Oil_Filtration.md",
    kind: "sop",
    title: "SOP-KIT-04: Commercial Fryer Oil Filtration & Burn Hazard Prevention",
    content: `# STANDARD OPERATING PROCEDURE: Commercial Fryer Oil Filtration & Burn Hazard Prevention
Document ID: SOP-KIT-04 | Revision: 2.1 | Applicable to: Franchise Kitchens (Wimpy, Mochachos, Mugg & Bean)

1. PURPOSE & SCOPE
This SOP defines mandatory safety controls for filtering cooking oil at commercial open and pressure fryers to eliminate severe thermal burns and hot-oil splashes in compliance with GSR Reg 2 and ISO 45001 §8.1.2.

2. RESPONSIBILITIES
- Shift Cook: Execute filtration only when oil temperature drops below 60°C or using automated pump systems.
- Store Manager: Ensure certified heat-resistant forearm-length PPE is stationed at each frying station.
- Safety Officer: Audit compliance monthly; review risk assessment annually.

3. MANDATORY PERSONAL PROTECTIVE EQUIPMENT (PPE)
- EN 407 certified heavy-duty silicone or neoprene heat-resistant gloves (forearm coverage).
- Splash-resistant commercial kitchen apron.
- SANS 20345 slip-resistant safety footwear with oil-resistant nitrile soles.

4. STEP-BY-STEP FILTRATION PROCEDURE
4.1 Power down fryer heating elements at least 45 minutes prior to scheduled filtration or shift close.
4.2 Verify digital thermometer reads below 60°C before opening drain valve.
4.3 Barricade immediate 2-meter radius with yellow 'CAUTION: HOT OIL IN PROGRESS' cones.
4.4 Connect dedicated stainless steel filtration wand. Never use open plastic or unrated buckets.
4.5 Inspect drain valve O-rings for degradation. Report leaking seals to maintenance immediately.

5. EMERGENCY FIRST AID & SPILL RESPONSE
5.1 In the event of skin contact, immediately flood burn area with cold running tap water for a minimum of 20 minutes.
5.2 Apply sterile Burnshield hydrogel dressing from Station Kit A. Do not apply butter or unapproved ointments.
5.3 Transport employee to nearest medical facility if burn exceeds size of palm or exhibits blistering.`,
  },
  {
    name: "Historical_Incidents_Register_3Year.csv",
    kind: "incident_log",
    title: "Historical 3-Year SMS Incidents & Near-Miss Log (CSV)",
    content: `Date,Site,Incident_Type,Description,Injury,Action_Taken
2025-11-12,Mochachos Centurion,Near Miss,Cook almost slipped near dishwashing drain due to standing grease water. No injury.,None,Drain cleared and anti-slip grit taped.
2025-08-04,Wimpy Gateway,First Aid,Assistant cook sustained superficial hot pan burn on left thumb.,Superficial burn,Cold water and Burnshield applied.
2025-03-22,Makro Crown Mines,Lost Time,Warehouse packer sprained right ankle stepping off broken wooden pallet.,Ankle sprain,Sent to clinic; booked off 2 days. Pallet quarantined.
2024-09-18,Clicks Sandton,Near Miss,Technician noticed mislabeled antibiotic bottle prior to handing to customer.,None,Stock returned to manufacturer quarantine.
2024-01-10,Tiger Brands Durban,First Aid,Operator grazed knuckle while adjusting conveyor guide rail.,Abrasion,First aid dressing applied.`,
  },
  {
    name: "SOP-LOG-02_Receiving_Bay_Manual_Handling.md",
    kind: "sop",
    title: "SOP-LOG-02: Receiving Bay Pallet Destacking & Ergonomic Manual Handling",
    content: `# STANDARD OPERATING PROCEDURE: Receiving Bay Pallet Destacking & Ergonomics
Document ID: SOP-LOG-02 | Department: Logistics & Receiving | Standard: Ergonomics Regulations 2019 (Reg 3)

1. PURPOSE
To protect receiving bay staff from acute musculoskeletal disorders (MSD), lumbar spinal strain, and repetitive movement trauma when handling bulk goods.

2. MAXIMUM PERMISSIBLE LIFTING LIMITS
- Single-person lift: Maximum 20kg between waist and shoulder height.
- Any package >20kg (e.g., 25kg bulk flour/sugar bags) requires two-person lift or hydraulic pallet lifter.
- Heavy goods must be slotted into 'golden zone' storage racks (70cm - 120cm above floor level).

3. ERGONOMIC RISK ASSESSMENT (ERA) CONTROLS
3.1 Daily pre-shift check of all hydraulic pallet jacks, dock levelers, and roll containers.
3.2 Rotate receiving staff every 2 hours between pallet offloading and digital scan-in duties.
3.3 Mandatory 5-minute pre-shift dynamic mobility stretch routine for logistics personnel.`,
  },
];

export function SopConnectorSection() {
  const [activeDocuments, setActiveDocuments] = useState<ControlledDocument[]>([]);
  const [ingestLogs, setIngestLogs] = useState<IngestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleIngestSample = async (sample: typeof SAMPLE_SOPS[0]) => {
    setLoading(true);
    setStatusMessage(null);

    try {
      const bytes = new TextEncoder().encode(sample.content);
      const base64 = btoa(unescape(encodeURIComponent(sample.content)));

      const res = await fetch("/api/sop/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": "tenant_sa_retail_group",
          "x-user-id": "user_safety_officer_sarah",
        },
        body: JSON.stringify({
          fileName: sample.name,
          mimeType: sample.kind === "incident_log" ? "text/csv" : "text/markdown",
          contentBase64: base64,
          declaredKind: sample.kind,
          siteId: "site_mochachos_centurion",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to ingest document");
      }

      const result: IngestResult = await res.json();
      setIngestLogs((prev) => [result, ...prev]);
      setActiveDocuments((prev) => {
        const filtered = prev.filter((d) => d.title !== result.document.title);
        return [result.document, ...filtered];
      });

      setStatusMessage(
        `✓ Successfully processed "${result.document.title}". Created version v${result.document.version} with ${result.chunkCount} vector chunks. ${
          result.backfilledIncidents > 0 ? `Backfilled ${result.backfilledIncidents} historical incidents into 3-year rolling logs.` : ""
        }`
      );
    } catch (err: unknown) {
      setStatusMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusMessage(null);

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
        throw new Error(data.error?.message || "Failed to ingest uploaded file");
      }

      const result: IngestResult = await res.json();
      setIngestLogs((prev) => [result, ...prev]);
      setActiveDocuments((prev) => [result.document, ...prev]);
      setStatusMessage(`✓ Successfully ingested and normalized "${file.name}".`);
    } catch (err: unknown) {
      setStatusMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass p-5 sm:p-6 border-l-4 border-l-brand-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-brand-600 dark:text-brand-400">Document Control & Legacy Sync</div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink mt-0.5">
              Universal SMS/TQM Plug-and-Play SOP Connector
            </h2>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Clients simply drop their existing SOP PDFs, Word procedures, or historical Excel/CSV incident registers.
              Autonomous normalizers extract structure, map ISO 45001/9001 clauses, maintain semantic version control, and clean rolling 3-year logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="chip font-mono text-xs bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20">
              ISO 9001 §7.5.3 Versioned
            </span>
            <span className="chip font-mono text-xs bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20">
              HNSW Vector Indexed
            </span>
          </div>
        </div>

        {/* Preset Sample Ingestion */}
        <div className="mt-4 pt-4 border-t border-line/60">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            Test Instant Plug-and-Play Ingestion with Realistic Client Documents:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_SOPS.map((sample, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-line bg-surface-strong/40 p-3 flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="chip text-[10px] uppercase font-mono">{sample.kind.replace("_", " ")}</span>
                    <span className="text-[10px] font-mono text-muted">{sample.name.split(".").pop()}</span>
                  </div>
                  <div className="text-xs font-bold text-ink mt-1.5">{sample.title}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleIngestSample(sample)}
                  disabled={loading}
                  className="btn-ghost text-xs w-full py-1.5 justify-center"
                >
                  <svg className="h-3.5 w-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Plug & Ingest This Asset</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="glass p-6 text-center border-2 border-dashed border-line hover:border-brand-400 transition-colors">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-3">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="text-sm font-semibold text-ink">
          Drop Client SOPs, HIRA, or Past Incident Registers (CSV/Excel)
        </div>
        <p className="text-xs text-muted mt-1 max-w-md mx-auto">
          Supports PDF, Word (.docx), CSV, JSON, Markdown. Auto-converts scans and establishes 3-year rolling audit baselines.
        </p>

        <label className="btn-primary text-xs mt-4 cursor-pointer inline-flex">
          <span>Browse File from Disk</span>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={loading}
            accept=".pdf,.docx,.csv,.json,.txt,.md"
            className="hidden"
          />
        </label>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`rounded-xl p-3.5 text-xs font-medium border ${
            statusMessage.startsWith("Error")
              ? "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400"
              : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
          }`}
        >
          {statusMessage}
        </div>
      )}

      {/* Controlled Documents Register */}
      <div className="glass p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="card-title">Controlled Document Register</h3>
            <p className="text-xs text-muted mt-0.5">
              Live document repository backing RAG queries during incident investigations.
            </p>
          </div>
          <span className="chip font-mono text-xs">
            {activeDocuments.length} Documents Active
          </span>
        </div>

        {activeDocuments.length === 0 ? (
          <div className="rounded-xl border border-line bg-surface-strong/30 p-8 text-center text-xs text-muted">
            No SOPs or registers connected yet. Click any of the 3 realistic client document buttons above to test the ingestion pipeline!
          </div>
        ) : (
          <div className="divide-y divide-line/60">
            {activeDocuments.map((doc) => (
              <div key={doc.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink">{doc.title}</span>
                    <span className="chip font-mono text-[10px] uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      v{doc.version}
                    </span>
                    <span className="chip font-mono text-[10px] text-muted capitalize">
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted mt-1">
                    <span>File: <strong className="font-mono text-ink">{doc.sourceFileName}</strong></span>
                    <span>•</span>
                    <span>Hash: <strong className="font-mono text-ink">{doc.contentHash.slice(0, 10)}...</strong></span>
                    <span>•</span>
                    <span>Review Due: <strong className="font-mono text-ink">{new Date(doc.reviewDueAt).toLocaleDateString("en-ZA")}</strong></span>
                  </div>

                  {/* Clause tags */}
                  {doc.clauseMappings.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.clauseMappings.map((c, i) => (
                        <span key={i} className="chip text-[10px] font-mono border-line">
                          {c.standard} §{c.clause} ({c.title})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="chip font-mono text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Active in RAG
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
