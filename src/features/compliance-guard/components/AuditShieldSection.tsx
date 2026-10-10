"use client";

import React, { useState } from "react";
import type { DelArtefact, SAProvince } from "@/lib/types";

interface AuditShieldSectionProps {
  activeProvince: SAProvince;
}

export function AuditShieldSection({ activeProvince }: AuditShieldSectionProps) {
  const [readinessScore, setReadinessScore] = useState(94);
  const [downloadingPack, setDownloadingPack] = useState(false);

  const artefacts: DelArtefact[] = [
    {
      id: "del_era_01",
      tenantId: "tenant_sa_retail" as any,
      siteId: "site_mochachos_centurion" as any,
      kind: "ergonomics_risk_assessment",
      title: "Ergonomics Risk Assessment (ERA) — Kitchen & Receiving Stations",
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
      title: "Electrical Certificate of Compliance (EIR CoC) — Main Distribution Board",
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
      title: "OHS Act s17 Health & Safety Representatives (1 rep per 50 headcount ratio)",
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
      title: "Fire Protection Equipment Annual Service (SANS 1475 Extinguishers & Ansul Suppression)",
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

  const handleDownloadPack = () => {
    setDownloadingPack(true);
    setTimeout(() => {
      setDownloadingPack(false);
      alert(
        `✓ Statutory Audit Readiness Pack generated for ${activeProvince} DEL Inspectorate!\n\nIncluded:\n• Ergonomics Risk Assessments (Reg 3)\n• Valid Electrical CoC\n• Section 17 H&S Rep Register\n• 3-Year Incident Log Summary\n• Letter of Good Standing`
      );
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass p-5 sm:p-6 border-l-4 border-l-brand-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-brand-600 dark:text-brand-400">Statutory Compliance Protection</div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink mt-0.5">
              Automated DEL Audit Shield
            </h2>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Instant generation of statutory audit readiness packs for Department of Employment & Labour inspections.
              Guarantees zero-day fines for missing Ergonomics Risk Assessments (ERAs), lapsed Electrical CoCs, or s17 H&S representative appointment deficits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase text-muted">Readiness Score</div>
              <div className="font-display text-2xl font-bold text-brand-500">{readinessScore}%</div>
            </div>
            <button
              type="button"
              onClick={handleDownloadPack}
              disabled={downloadingPack}
              className="btn-primary text-xs"
            >
              {downloadingPack ? "Compiling Audit Pack..." : "Export DEL Audit Readiness Pack"}
            </button>
          </div>
        </div>
      </div>

      {/* Inspectorate Details Bar */}
      <div className="glass p-4 bg-surface-strong/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-ink">
            Target Inspectorate: DEL Provincial Office ({activeProvince})
          </span>
          <span className="text-muted">•</span>
          <span className="text-muted">OHS Act 85 of 1993 Statutory Enforcement Shield</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-muted">
          <span>Headcount: <strong className="text-ink font-mono">48 Employees</strong></span>
          <span>H&S Reps Mandated: <strong className="text-ink font-mono">1 Rep (Ratio 1:50)</strong></span>
          <span>Status: <strong className="text-emerald-500">Compliant (2 Reps Appointed)</strong></span>
        </div>
      </div>

      {/* Artefacts Matrix Table */}
      <div className="glass p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="card-title">Statutory Compliance Trackers</h3>
            <p className="text-xs text-muted mt-0.5">
              Automated renewal alerts and evidence verification mapped against South African statutory regulations.
            </p>
          </div>
          <span className="chip font-mono text-xs">
            {artefacts.length} Artefacts Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-muted uppercase text-[10px] tracking-wider">
                <th className="pb-2">Artefact Category</th>
                <th className="pb-2">Statutory Requirement</th>
                <th className="pb-2">Governing Regulation</th>
                <th className="pb-2">Issued / Validated</th>
                <th className="pb-2">Renewal Due</th>
                <th className="pb-2">Audit Shield Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {artefacts.map((art) => {
                const statusColor =
                  art.status === "compliant"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : art.status === "expiring"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-red-500/15 text-red-600 dark:text-red-400";

                return (
                  <tr key={art.id} className="hover:bg-surface-strong/30">
                    <td className="py-2.5 pr-2">
                      <span className="chip font-mono uppercase text-[10px]">{art.kind.replace(/_/g, " ")}</span>
                    </td>
                    <td className="py-2.5 pr-2 font-medium text-ink max-w-xs">{art.title}</td>
                    <td className="py-2.5 pr-2">
                      {art.clauses.map((c, i) => (
                        <span key={i} className="chip font-mono text-[10px] text-brand-600 dark:text-brand-400">
                          {c.standard} §{c.clause}
                        </span>
                      ))}
                    </td>
                    <td className="py-2.5 pr-2 font-mono text-muted">
                      {art.issuedAt ? new Date(art.issuedAt).toLocaleDateString("en-ZA") : "—"}
                    </td>
                    <td className="py-2.5 pr-2 font-mono text-muted">
                      {art.expiresAt ? new Date(art.expiresAt).toLocaleDateString("en-ZA") : "Perpetual"}
                    </td>
                    <td className="py-2.5">
                      <span className={`chip uppercase font-bold text-[10px] ${statusColor}`}>
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
    </div>
  );
}
