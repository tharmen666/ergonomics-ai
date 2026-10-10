"use client";

import React, { useState } from "react";
import type { Incident, IncidentPipelineResult } from "@/lib/types";

interface IncidentIntakeSectionProps {
  onIncidentLogged?: (result: IncidentPipelineResult) => void;
}

const PRESETS = [
  {
    title: "Franchise Kitchen (Fryer Burn / Hot Oil)",
    vertical: "Food Franchise (Mochachos / Wimpy)",
    narrative:
      "Cook at Mochachos branch was filtering oil on the Henny Penny open fryer during lunch peak rush. The oil was still at 180°C. When transferring the bucket, the handle slipped and hot oil splashed onto his right forearm causing 2nd-degree blistering burns. Assistant cook applied cool water and burn shield from the first aid kit. Worker was transported to Mediclinic for outpatient burn treatment. Fryer area had no splash guards installed.",
  },
  {
    title: "Retail / Wholesale (Heavy Sack Back Strain)",
    vertical: "Wholesale (Cash & Carry / Retail)",
    narrative:
      "Receiving worker was offloading a delivery of 25kg bulk maize meal sacks manually from a high pallet stack in the receiving bay. The hydraulic pallet jack was broken and waiting for parts. While twisting to place the sack onto a low platform, felt sharp lumbar spasm in lower back. Unable to lift further. Booked off for 3 days by local clinic. No Ergonomics Risk Assessment done for receiving bay.",
  },
  {
    title: "Pharmacy (Dispensing Dose Near-Miss)",
    vertical: "Retail Pharmacy",
    narrative:
      "Pharmacy dispensary assistant accidentally pulled Metformin 850mg instead of prescribed Metformin 500mg during evening peak queue rush. The look-alike packaging was stored side-by-side on shelf 4B. The patient noticed the higher dosage imprint on the blister strip before ingesting at home and called the dispensary. No adverse health event, but near-miss dangerous occurrence.",
  },
  {
    title: "Manufacturing (Infeed Conveyor Nip-Point)",
    vertical: "Industrial Manufacturing",
    narrative:
      "Infeed conveyor belt jammed with carton debris at the secondary packaging line. Machine operator reached behind the plastic guard to clear the blockage with gloved hand while the drive motor was still energized. Glove got caught in the roller nip point. Emergency stop button hit by adjacent operator within 2 seconds. Bruising and minor hand abrasion; narrowly avoided bone crush amputation.",
  },
];

export function IncidentIntakeSection({ onIncidentLogged }: IncidentIntakeSectionProps) {
  const [narrative, setNarrative] = useState(PRESETS[0].narrative);
  const [siteId, setSiteId] = useState("site_mochachos_centurion");
  const [channel, setChannel] = useState<"text" | "voice" | "whatsapp">("voice");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<IncidentPipelineResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    setChannel("voice");
    setTimeout(() => {
      setIsRecording(false);
      setNarrative(
        "Voice intake captured from WhatsApp audio note: 'Supervisor reports that Thabo in the butchery cold room slipped on ice build-up near the blast freezer door around 09:30 this morning. He bruised his left hip and knocked against the metal shelving. The door defroster strip has been broken for 4 days and reported to maintenance.'"
      );
    }, 2200);
  };

  const handleRunPipeline = async () => {
    if (!narrative.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": "tenant_sa_retail_group",
          "x-user-id": "user_safety_officer_sarah",
        },
        body: JSON.stringify({
          narrative,
          siteId,
          channel,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to process incident");
      }

      const data: IncidentPipelineResult = await res.json();
      setCurrentResult(data);
      if (onIncidentLogged) onIncidentLogged(data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass p-5 sm:p-6 border-l-4 border-l-brand-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-brand-600 dark:text-brand-400">Autonomous Intake & RCA Engine</div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink mt-0.5">
              Frictionless Voice/Text Incident Intake
            </h2>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Eliminate clunky 20-field spreadsheets. Frontline supervisors log raw speech or WhatsApp notes.
              Autonomous agents instantly parse facts, classify statutory risk, map ISO clauses, execute 5-Whys & 6M Ishikawa RCA, and propose CAPAs.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20 font-mono">
              ISO 45001 §10.2
            </span>
            <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20 font-mono">
              OHS Act s24
            </span>
          </div>
        </div>

        {/* Quick SA Presets */}
        <div className="mt-4 pt-4 border-t border-line/60">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            Load South African Industry Benchmark Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setNarrative(p.narrative);
                  if (idx === 0) setSiteId("site_mochachos_centurion");
                  if (idx === 1) setSiteId("site_makro_crown_mines");
                  if (idx === 2) setSiteId("site_clicks_sandton_city");
                  if (idx === 3) setSiteId("site_tigerbrands_durban");
                }}
                className="text-left p-2.5 rounded-xl border border-line bg-surface-strong/40 hover:bg-surface-strong/80 hover:border-brand-400/50 transition-all text-xs group"
              >
                <div className="font-semibold text-ink group-hover:text-brand-600 dark:group-hover:text-brand-300">
                  {p.title}
                </div>
                <div className="text-[11px] text-muted truncate mt-0.5">{p.vertical}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Box & Action Controls */}
      <div className="glass p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Intake Channel:
            </label>
            <div className="inline-flex rounded-lg border border-line bg-surface-strong/50 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setChannel("voice")}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  channel === "voice" ? "bg-brand-500 text-white shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                🎙️ Voice / WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setChannel("text")}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  channel === "text" ? "bg-brand-500 text-white shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                ✍️ Text Narrative
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">Branch / Site:</label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="rounded-lg border border-line bg-surface-strong/60 px-2.5 py-1 text-xs text-ink font-mono focus:outline-none focus:border-brand-400"
            >
              <option value="site_mochachos_centurion">Mochachos #14 (Centurion, GP)</option>
              <option value="site_wimpy_gateview">Wimpy Gateway (Umhlanga, KZN)</option>
              <option value="site_makro_crown_mines">Wholesale Bay #3 (Crown Mines, GP)</option>
              <option value="site_clicks_sandton_city">Pharmacy Hub (Sandton City, GP)</option>
              <option value="site_tigerbrands_durban">Manufacturing Plant A (Durban, KZN)</option>
            </select>
          </div>
        </div>

        {/* Narrative Textarea */}
        <div className="relative">
          <textarea
            rows={4}
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Type or paste frontline incident / near-miss report (e.g., 'Cook slipped near fryer while filtering hot oil during lunch peak...')"
            className="w-full rounded-xl border border-line bg-surface-strong/70 p-3.5 text-sm text-ink placeholder:text-muted/60 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition font-sans"
          />

          {isRecording && (
            <div className="absolute inset-0 rounded-xl bg-surface/90 backdrop-blur-md flex items-center justify-center gap-3">
              <span className="h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-sm font-semibold text-ink font-mono">
                Listening to WhatsApp voice note... Transcribing South African accented audio
              </span>
            </div>
          )}
        </div>

        {/* Action Button Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={simulateVoiceRecording}
            disabled={isRecording || loading}
            className="btn-ghost text-xs"
          >
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 003-3V5a3 3 0 00-3-3 3 3 0 00-3 3v6a3 3 0 003 3z" />
            </svg>
            <span>Simulate Voice / Audio Note Capture</span>
          </button>

          <button
            type="button"
            onClick={handleRunPipeline}
            disabled={loading || !narrative.trim()}
            className="btn-primary"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Orchestrating 7 Multi-Agents...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Trigger Autonomous Multi-Agent Investigation</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            <strong>Engine Error:</strong> {errorMsg}
          </div>
        )}
      </div>

      {/* Pipeline Output Visualization */}
      {currentResult && (
        <PipelineResultViewer result={currentResult} />
      )}
    </div>
  );
}

/* ───────────────────────── Pipeline Result Inspection Component ───────────────────────── */

function PipelineResultViewer({ result }: { result: IncidentPipelineResult }) {
  const { incident, sla, run } = result;
  const [activeSubTab, setActiveSubTab] = useState<"rca" | "fishbone" | "capa" | "clauses" | "traces">("rca");

  const riskBadgeColor =
    incident.risk.band === "critical"
      ? "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400"
      : incident.risk.band === "high"
      ? "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400"
      : incident.risk.band === "medium"
      ? "bg-yellow-500/15 text-yellow-600 border-yellow-500/30 dark:text-yellow-400"
      : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400";

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Top Incident Summary Card */}
      <div className="glass p-5 border-l-4 border-l-brand-500">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                {incident.id}
              </span>
              <span className={`chip border font-semibold uppercase ${riskBadgeColor}`}>
                Risk {incident.risk.band} ({incident.risk.rating}/25)
              </span>
              <span className="chip font-mono text-[11px]">
                {incident.classification.incidentClass.replace(/_/g, " ")}
              </span>
              {incident.classification.reportableToDEL && (
                <span className="chip border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 font-bold">
                  ⚠️ DEL s24 Reportable
                </span>
              )}
              {incident.classification.coidaClaimRequired && (
                <span className="chip border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                  COIDA W.Cl.2 Required
                </span>
              )}
            </div>
            <h3 className="font-display text-lg font-bold text-ink mt-1.5">{incident.parsed.summary}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1">
              <span>Site: <strong className="text-ink font-mono">{incident.siteId}</strong></span>
              <span>•</span>
              <span>Occurred: <strong className="text-ink font-mono">{new Date(incident.parsed.occurredAt).toLocaleString("en-ZA")}</strong></span>
              <span>•</span>
              <span>Pipeline Duration: <strong className="text-ink font-mono">{run.totalMs}ms</strong></span>
            </div>
          </div>

          {/* HITL Safety Officer Status */}
          <div className="text-right">
            <div className="eyebrow">Human-in-the-Loop</div>
            {incident.requiresHumanReview ? (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Queued for Safety Officer Sign-off</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <span>✓ Pre-Approved by Multi-Agent Consensus</span>
              </div>
            )}
            {incident.reviewReasons.length > 0 && (
              <div className="text-[11px] text-muted mt-1 max-w-xs text-right">
                Trigger: {incident.reviewReasons.join(" • ")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex border-b border-line gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSubTab("rca")}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeSubTab === "rca"
              ? "border-brand-500 text-brand-600 dark:text-brand-300"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          🔍 5-Whys Root Cause Chain
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("fishbone")}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeSubTab === "fishbone"
              ? "border-brand-500 text-brand-600 dark:text-brand-300"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          🐟 6M Ishikawa Fishbone
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("capa")}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeSubTab === "capa"
              ? "border-brand-500 text-brand-600 dark:text-brand-300"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          🛡️ CAPA Hierarchy of Controls ({incident.capas.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("clauses")}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeSubTab === "clauses"
              ? "border-brand-500 text-brand-600 dark:text-brand-300"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          📜 ISO & Statutory Clauses ({incident.clauses.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("traces")}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeSubTab === "traces"
              ? "border-brand-500 text-brand-600 dark:text-brand-300"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          ⚡ Multi-Agent Traces ({run.traces.length})
        </button>
      </div>

      {/* Sub-tab 1: 5-Whys Tree */}
      {activeSubTab === "rca" && (
        <div className="glass p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="card-title flex items-center gap-2">
              <span>Systemic 5-Whys Investigation</span>
              <span className="text-[11px] font-normal text-muted">(Just-Culture Guardrail Active)</span>
            </h4>
            <span className="chip font-mono text-[11px] text-brand-600 dark:text-brand-400">
              Confidence: {(incident.rca.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <div className="space-y-3">
            {incident.rca.whys.map((step: { level: number; question: string; answer: string; evidence: string[] }) => (
              <div
                key={step.level}
                className="relative pl-6 before:absolute before:left-2 before:top-3 before:bottom-0 before:w-0.5 before:bg-line last:before:hidden"
              >
                <div className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                  {step.level}
                </div>
                <div className="rounded-xl border border-line bg-surface-strong/60 p-3 text-xs">
                  <div className="font-semibold text-muted">{step.question}</div>
                  <div className="font-medium text-ink mt-0.5">{step.answer}</div>
                  {step.evidence.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-brand-600 dark:text-brand-400">
                      <span className="font-semibold">Evidence Grounding:</span>
                      {step.evidence.map((ev: string, i: number) => (
                        <span key={i} className="rounded bg-brand-500/10 px-1.5 py-0.5 font-mono">
                          {ev}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Root Cause Banner */}
          <div className="rounded-xl border border-brand-500/40 bg-gradient-to-r from-brand-500/10 to-transparent p-4">
            <div className="eyebrow text-brand-600 dark:text-brand-400">Validated Systemic Root Cause:</div>
            <div className="font-display text-sm font-bold text-ink mt-0.5">{incident.rca.rootCause}</div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: 6M Ishikawa Fishbone */}
      {activeSubTab === "fishbone" && (
        <div className="glass p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="card-title">6M Ishikawa Fishbone Breakdown</h4>
            <span className="chip font-mono text-[11px]">ISO 45001 §10.2 / TQM</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(
              [
                ["people", "People (Competence & Training)"],
                ["method", "Method (SOPs & Procedures)"],
                ["machine", "Machine (Plant & Equipment)"],
                ["material", "Material (Chemicals, Stock & Tools)"],
                ["environment", "Environment (Lighting, Floor & Heat)"],
                ["management", "Management (Audits, HIRA & Leadership)"],
              ] as const
            ).map(([key, label]) => {
              const causes = incident.rca.fishbone[key] || [];
              return (
                <div key={key} className="rounded-xl border border-line bg-surface-strong/50 p-3 space-y-2">
                  <div className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide">
                    {label}
                  </div>
                  {causes.length > 0 ? (
                    <ul className="space-y-1 text-xs text-ink">
                      {causes.map((c: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-brand-500">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-[11px] text-muted italic">No contributory factors identified</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 3: CAPA Hierarchy of Controls */}
      {activeSubTab === "capa" && (
        <div className="glass p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="card-title">Corrective & Preventive Action Plan (CAPA)</h4>
              <p className="text-xs text-muted mt-0.5">
                Enforces ISO 45001 §8.1.2 Hierarchy of Controls. At least one engineering or elimination action mandatory.
              </p>
            </div>
            <span className="chip font-mono text-[11px] text-brand-600 dark:text-brand-400 self-start sm:self-auto">
              Measurable V&V Criteria
            </span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-muted uppercase text-[10px] tracking-wider">
                  <th className="pb-2">Control Level</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Action Description</th>
                  <th className="pb-2">Owner Role</th>
                  <th className="pb-2">Target SLA</th>
                  <th className="pb-2">V&V Verification Metric</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {incident.capas.map((capa: { id: string; controlLevel: string; type: string; description: string; ownerRole: string; dueAt: string; verification: string; status: string }) => {
                  const levelColor =
                    capa.controlLevel === "elimination" || capa.controlLevel === "substitution"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : capa.controlLevel === "engineering"
                      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                      : capa.controlLevel === "administrative"
                      ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
                      : "bg-purple-500/15 text-purple-600 dark:text-purple-400";

                  return (
                    <tr key={capa.id} className="hover:bg-surface-strong/30">
                      <td className="py-2.5 pr-2">
                        <span className={`chip uppercase font-bold text-[10px] ${levelColor}`}>
                          {capa.controlLevel}
                        </span>
                      </td>
                      <td className="py-2.5 pr-2 font-mono uppercase text-[11px] text-muted">{capa.type}</td>
                      <td className="py-2.5 pr-2 font-medium text-ink max-w-xs">{capa.description}</td>
                      <td className="py-2.5 pr-2 font-mono text-muted">{capa.ownerRole}</td>
                      <td className="py-2.5 pr-2 font-mono text-muted">
                        {new Date(capa.dueAt).toLocaleDateString("en-ZA")}
                      </td>
                      <td className="py-2.5 pr-2 text-ink/90 font-mono text-[11px]">{capa.verification}</td>
                      <td className="py-2.5">
                        <span className="chip border text-[10px] font-mono capitalize">
                          {capa.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden space-y-3">
            {incident.capas.map((capa: { id: string; controlLevel: string; type: string; description: string; ownerRole: string; dueAt: string; verification: string; status: string }) => {
              const levelColor =
                capa.controlLevel === "elimination" || capa.controlLevel === "substitution"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : capa.controlLevel === "engineering"
                  ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                  : capa.controlLevel === "administrative"
                  ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
                  : "bg-purple-500/15 text-purple-600 dark:text-purple-400";

              return (
                <div key={capa.id} className="rounded-xl border border-line bg-surface-strong/60 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`chip uppercase font-bold text-[10px] ${levelColor}`}>
                      {capa.controlLevel}
                    </span>
                    <span className="chip font-mono text-[10px] capitalize">
                      {capa.status}
                    </span>
                  </div>
                  <div className="font-semibold text-ink text-sm">
                    {capa.description}
                  </div>
                  <div className="text-[11px] text-muted">
                    V&V Metric: <strong className="text-ink font-mono">{capa.verification}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-line/60 text-[11px] text-muted font-mono">
                    <span>Role: {capa.ownerRole}</span>
                    <span>Due: {new Date(capa.dueAt).toLocaleDateString("en-ZA")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 4: ISO & Statutory Clauses */}
      {activeSubTab === "clauses" && (
        <div className="glass p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="card-title">Mapped Standards & South African Statutory Clauses</h4>
            <span className="chip font-mono text-[11px] text-brand-600 dark:text-brand-400">
              Closed Catalogue Guardrail (0% Hallucination)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incident.clauses.map((clause: { standard: string; clause: string; title: string; confidence: number; rationale: string }, idx: number) => (
              <div key={idx} className="rounded-xl border border-line bg-surface-strong/50 p-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="chip font-mono font-bold text-brand-600 dark:text-brand-400">
                    {clause.standard} §{clause.clause}
                  </span>
                  <span className="text-[11px] font-mono text-muted">
                    Match: {(clause.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="font-semibold text-ink">{clause.title}</div>
                <div className="text-[11px] text-muted italic">Rationale: {clause.rationale}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 5: Multi-Agent Traces */}
      {activeSubTab === "traces" && (
        <div className="glass p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="card-title">ISO 9001 §7.5 / ISO 45001 §7.5 Execution Traces</h4>
              <p className="text-xs text-muted mt-0.5">
                Every agent step is audited with latency, confidence score, and deterministic fallback paths.
              </p>
            </div>
            <span className="chip font-mono text-[11px] text-brand-600 dark:text-brand-400 self-start sm:self-auto">
              Run ID: {run.id}
            </span>
          </div>

          {/* Desktop Traces Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-line text-muted uppercase text-[10px]">
                  <th className="pb-2">Agent Name</th>
                  <th className="pb-2">Provider / Model</th>
                  <th className="pb-2">Duration</th>
                  <th className="pb-2">Confidence</th>
                  <th className="pb-2">Attempts</th>
                  <th className="pb-2">Audit Reasoning Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {run.traces.map((trace: { agent: string; provider: string; model?: string; durationMs: number; confidence: number; attempts: number; note?: string }, idx: number) => (
                  <tr key={idx} className="hover:bg-surface-strong/30">
                    <td className="py-2 text-brand-600 dark:text-brand-400 font-bold">{trace.agent}</td>
                    <td className="py-2 text-muted">{trace.provider} ({trace.model || "heuristic"})</td>
                    <td className="py-2 text-ink">{trace.durationMs}ms</td>
                    <td className="py-2">
                      <span className={`chip text-[10px] ${trace.confidence >= 0.7 ? "text-emerald-600" : "text-amber-600"}`}>
                        {(trace.confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-2 text-muted">{trace.attempts}</td>
                    <td className="py-2 text-ink/80 text-[11px] font-sans">{trace.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Traces Cards */}
          <div className="md:hidden space-y-2.5">
            {run.traces.map((trace: { agent: string; provider: string; model?: string; durationMs: number; confidence: number; attempts: number; note?: string }, idx: number) => (
              <div key={idx} className="rounded-xl border border-line bg-surface-strong/60 p-3 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-600 dark:text-brand-400">{trace.agent}</span>
                  <span className="chip text-[10px] font-bold text-emerald-600">
                    {(trace.confidence * 100).toFixed(0)}% Conf
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span>Provider: {trace.provider}</span>
                  <span>Latency: {trace.durationMs}ms</span>
                </div>
                {trace.note && (
                  <div className="text-[11px] text-ink font-sans pt-1 border-t border-line/60">
                    {trace.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pre-V&V SLA Escalation Strip */}
      {sla && (
        <div className="glass p-4 bg-gradient-to-r from-brand-500/5 to-transparent border border-brand-500/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping"></span>
              <span className="font-display text-xs font-bold text-ink uppercase tracking-wider">
                Active Pre-V&V Stage Clock:
              </span>
              <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">
                {sla.clocks[0]?.stage} due by {new Date(sla.clocks[0]?.dueAt).toLocaleTimeString("en-ZA")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted">
              <span>Escalation Ladder:</span>
              <span className="font-mono text-[11px] text-ink font-semibold">
                Site Manager ➔ Safety Officer ➔ GM ➔ Executive
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
