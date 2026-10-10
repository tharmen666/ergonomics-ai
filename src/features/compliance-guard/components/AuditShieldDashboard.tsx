"use client";

import React, { useState } from "react";
import type { DelArtefact, SAProvince } from "@/lib/types";

interface AuditShieldDashboardProps {
  activeProvince: SAProvince;
}

export function AuditShieldDashboard({ activeProvince }: AuditShieldDashboardProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>("del_era_01");
  const [exporting, setExporting] = useState(false);

  const artefacts: DelArtefact[] = [
    {
      id: "del_era_01",
      tenantId: "tenant_sa_retail" as any,
      siteId: "site_mochachos_centurion" as any,
      kind: "ergonomics_risk_assessment",
      title: "Ergonomics Risk Assessment (ERA) — Kitchen & Receiving",
      status: "compliant",
      issuedAt: "2025-11-10T08:00:00Z" as any,
      expiresAt: "2027-11-10T08:00:00Z" as any,
      evidenceDocumentIds: ["doc_era_kitch_2025"],
      clauses: [{ standard: "ERGO_REGS", clause: "Reg 3", title: "Ergonomic risk assessment" }],
    },
    {
      id: "del_coc_01",
      tenantId: "tenant_sa_retail" as any,
      siteId: "site_mochachos_centurion" as any,
      kind: "electrical_coc",
      title: "Electrical Certificate of Compliance (EIR CoC) — Distribution Board",
      status: "compliant",
      issuedAt: "2024-05-14T08:00:00Z" as any,
      expiresAt: "2026-05-14T08:00:00Z" as any,
      evidenceDocumentIds: ["doc_elec_coc_centurion"],
      clauses: [{ standard: "EMR", clause: "EIR Reg 7", title: "Certificate of Compliance" }],
    },
    {
      id: "del_hs_rep_01",
      tenantId: "tenant_sa_retail" as any,
      siteId: "site_mochachos_centurion" as any,
      kind: "hs_rep_appointment",
      title: "OHS Act s17 H&S Representatives (1 rep per 50 headcount ratio)",
      status: "compliant",
      issuedAt: "2025-01-15T08:00:00Z" as any,
      evidenceDocumentIds: ["doc_s17_appointment_letters"],
      clauses: [{ standard: "OHSA", clause: "s17", title: "Health and safety representatives" }],
    },
    {
      id: "del_fire_01",
      tenantId: "tenant_sa_retail" as any,
      siteId: "site_mochachos_centurion" as any,
      kind: "fire_equipment_service",
      title: "Fire Protection Equipment Annual Service (SANS 1475 Extinguishers)",
      status: "expiring",
      issuedAt: "2025-04-10T08:00:00Z" as any,
      expiresAt: "2026-04-10T08:00:00Z" as any,
      evidenceDocumentIds: ["doc_sans1475_certificate"],
      clauses: [{ standard: "GSR", clause: "Reg 9", title: "Fire precautions" }],
    },
    {
      id: "del_coida_01",
      tenantId: "tenant_sa_retail" as any,
      siteId: "site_mochachos_centurion" as any,
      kind: "coida_registration",
      title: "COIDA Letter of Good Standing (Compensation Fund Ref: 99000123456)",
      status: "compliant",
      issuedAt: "2025-05-01T08:00:00Z" as any,
      expiresAt: "2026-04-30T08:00:00Z" as any,
      evidenceDocumentIds: ["doc_coida_good_standing"],
      clauses: [{ standard: "COIDA", clause: "s80", title: "Registration of employers" }],
    },
  ];

  const handleExportAuditPack = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert(
        `✓ Department of Employment & Labour (${activeProvince}) Statutory Audit Readiness Pack generated!\n\nIncluded in signed bundle:\n1. Ergonomics Risk Assessment (Reg 3)\n2. Electrical Installation CoC (EIR Reg 7)\n3. OHS Act s17 H&S Rep Certified Register\n4. SANS 1475 Fire Inspection Certificates\n5. COIDA Return of Earnings & Letter of Good Standing`
      );
    }, 1400);
  };

  const toggleAccordion = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass p-5 sm:p-6 border-l-4 border-l-brand-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-brand-600 dark:text-brand-400">
              Statutory Department of Employment & Labour Shield
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink mt-0.5">
              DEL Audit Shield & Statutory ERA Tracker
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl">
              South African employers face immediate prohibition notices and fines during unannounced labour inspections.
              ComplianceGuard AI continuously maintains proof of Ergonomics Risk Assessments, valid Electrical CoCs, and Section 17 H&S representative ratios.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportAuditPack}
            disabled={exporting}
            className="btn-primary text-xs py-3 w-full sm:w-auto self-start sm:self-auto"
          >
            {exporting ? (
              <span>Compiling Signed Pack...</span>
            ) : (
              <span>Export {activeProvince} DEL Audit Readiness Pack</span>
            )}
          </button>
        </div>
      </div>

      {/* Inspectorate Status Banner */}
      <div className="glass p-4 bg-surface-strong/50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-ink">
            Target Inspectorate: Provincial Office ({activeProvince})
          </span>
          <span className="text-muted hidden sm:inline">•</span>
          <span className="text-muted hidden sm:inline">OHS Act 85 of 1993 statutory compliance verified</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-muted">
          <span>H&S Rep Ratio: <strong className="text-ink">1:50</strong></span>
          <span>Status: <strong className="text-emerald-500">Certified</strong></span>
        </div>
      </div>

      {/* ────────────────── DESKTOP TABLE VIEW (hidden on mobile, visible on md:) ────────────────── */}
      <div className="hidden md:block glass p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="card-title">Statutory Compliance Artefacts</h3>
          <span className="chip font-mono text-xs">{artefacts.length} Active Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-muted uppercase text-[10px] tracking-wider">
                <th className="pb-2.5">Category</th>
                <th className="pb-2.5">Statutory Description</th>
                <th className="pb-2.5">Mandated Standard</th>
                <th className="pb-2.5">Issued / Validated</th>
                <th className="pb-2.5">Renewal Due</th>
                <th className="pb-2.5">Shield Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {artefacts.map((art) => {
                const statusColor =
                  art.status === "compliant"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : art.status === "expiring"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                    : "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30";

                return (
                  <tr key={art.id} className="hover:bg-surface-strong/30 transition-colors">
                    <td className="py-3 pr-2">
                      <span className="chip font-mono uppercase text-[10px]">
                        {art.kind.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 pr-2 font-medium text-ink max-w-sm">{art.title}</td>
                    <td className="py-3 pr-2">
                      {art.clauses.map((c, i) => (
                        <span key={i} className="chip font-mono text-[10px] text-brand-600 dark:text-brand-400">
                          {c.standard} §{c.clause}
                        </span>
                      ))}
                    </td>
                    <td className="py-3 pr-2 font-mono text-muted">
                      {art.issuedAt ? new Date(art.issuedAt).toLocaleDateString("en-ZA") : "—"}
                    </td>
                    <td className="py-3 pr-2 font-mono text-muted">
                      {art.expiresAt ? new Date(art.expiresAt).toLocaleDateString("en-ZA") : "Perpetual"}
                    </td>
                    <td className="py-3">
                      <span className={`chip uppercase font-bold text-[10px] border ${statusColor}`}>
                        {art.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ────────────────── MOBILE ACCORDION STACK VIEW (visible on <md) ────────────────── */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Statutory Artefacts ({artefacts.length})
          </span>
          <span className="text-[11px] text-muted">Tap to expand details</span>
        </div>

        {artefacts.map((art) => {
          const isExpanded = expandedRow === art.id;
          const statusColor =
            art.status === "compliant"
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : art.status === "expiring"
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
              : "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30";

          return (
            <div
              key={art.id}
              className="glass overflow-hidden border border-line"
            >
              {/* Accordion Header (min-h-[48px] touch target) */}
              <button
                type="button"
                onClick={() => toggleAccordion(art.id)}
                className="flex w-full items-center justify-between p-4 text-left min-h-[48px]"
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="chip font-mono text-[9px] uppercase">
                      {art.kind.replace(/_/g, " ")}
                    </span>
                    <span className={`chip uppercase font-bold text-[9px] border ${statusColor}`}>
                      {art.status}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-ink mt-1.5 line-clamp-1">
                    {art.title}
                  </div>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg text-muted">
                  <svg
                    className={`h-4 w-4 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Accordion Expanded Body */}
              {isExpanded && (
                <div className="border-t border-line/60 bg-surface-strong/50 p-4 text-xs space-y-2.5 animate-fade-up">
                  <div className="text-muted leading-relaxed">
                    {art.title}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-muted pt-1">
                    <div>Issued: <strong className="text-ink">{art.issuedAt ? new Date(art.issuedAt).toLocaleDateString("en-ZA") : "—"}</strong></div>
                    <div>Renewal: <strong className="text-ink">{art.expiresAt ? new Date(art.expiresAt).toLocaleDateString("en-ZA") : "Perpetual"}</strong></div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {art.clauses.map((c, i) => (
                      <span key={i} className="chip font-mono text-[10px] text-brand-600 dark:text-brand-400">
                        {c.standard} §{c.clause} — {c.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
