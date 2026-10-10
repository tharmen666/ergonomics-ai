"use client";

import React, { useState } from "react";
import type { FitnessStatus, MedicalBaseline } from "@/lib/types";

export function MedicalsTrackerSection() {
  const [baselines] = useState<MedicalBaseline[]>([
    {
      employeeId: "emp_thabo_01" as any,
      tenantId: "tenant_sa_retail" as any,
      siteId: "site_mochachos_centurion" as any,
      fitness: "fit_with_restrictions",
      restrictions: ["Max 15kg lift; avoid prolonged standing >2hr"],
      riskFactors: ["musculoskeletal", "hypertension"],
      lastMedicalAt: "2025-06-12T08:00:00Z" as any,
      nextMedicalDueAt: "2026-06-12T08:00:00Z" as any,
      wellbeingPulse: 7.2,
      consentRecordedAt: "2025-06-12T08:30:00Z" as any,
    },
    {
      employeeId: "emp_nomvula_02" as any,
      tenantId: "tenant_sa_retail" as any,
      siteId: "site_mochachos_centurion" as any,
      fitness: "fit",
      restrictions: [],
      riskFactors: [],
      lastMedicalAt: "2025-09-01T08:00:00Z" as any,
      nextMedicalDueAt: "2026-09-01T08:00:00Z" as any,
      wellbeingPulse: 8.5,
      consentRecordedAt: "2025-09-01T08:30:00Z" as any,
    },
    {
      employeeId: "emp_sipho_03" as any,
      tenantId: "tenant_sa_retail" as any,
      siteId: "site_mochachos_centurion" as any,
      fitness: "fit_with_restrictions",
      restrictions: ["No work at heights or open machinery"],
      riskFactors: ["epilepsy"],
      lastMedicalAt: "2025-02-18T08:00:00Z" as any,
      nextMedicalDueAt: "2026-02-18T08:00:00Z" as any,
      wellbeingPulse: 6.8,
      consentRecordedAt: "2025-02-18T08:30:00Z" as any,
    },
    {
      employeeId: "emp_kevin_04" as any,
      tenantId: "tenant_sa_retail" as any,
      siteId: "site_mochachos_centurion" as any,
      fitness: "temporarily_unfit",
      restrictions: ["Medical certificate issued; off-duty following hand burn"],
      riskFactors: [],
      lastMedicalAt: "2025-10-05T08:00:00Z" as any,
      nextMedicalDueAt: "2025-10-19T08:00:00Z" as any,
      wellbeingPulse: 5.4,
      consentRecordedAt: "2025-10-05T08:30:00Z" as any,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass p-5 sm:p-6 border-l-4 border-l-brand-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-brand-600 dark:text-brand-400">Proactive People Intelligence</div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink mt-0.5">
              Medicals & Mental Health Baseline Tracker
            </h2>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              &quot;Do you know your people?&quot; Track chronic ergonomic vulnerabilities, fitness-for-duty restrictions, and anonymised psychosocial wellbeing pulses BEFORE incidents occur.
              Fully POPIA Section 26 compliant (clinical diagnostic data remains strictly with the Occupational Medical Practitioner).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="chip font-mono text-xs bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20">
              POPIA §26 Sealed
            </span>
            <span className="chip font-mono text-xs bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20">
              OMP Certified
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Health & Psychosocial Pulse Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase text-muted">Site Fit-For-Duty Rate</div>
          <div className="font-display text-2xl font-bold text-ink">92.5%</div>
          <div className="text-[11px] text-emerald-500 font-medium">✓ 37 of 40 fully fit for operational tasks</div>
        </div>

        <div className="glass p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase text-muted">Ergonomic Restrictions</div>
          <div className="font-display text-2xl font-bold text-amber-500">2 Active</div>
          <div className="text-[11px] text-muted">Pre-assigned to waist-height golden zone picking</div>
        </div>

        <div className="glass p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase text-muted">Surveillance Renewals</div>
          <div className="font-display text-2xl font-bold text-ink">100%</div>
          <div className="text-[11px] text-muted">0 annual baseline medicals overdue</div>
        </div>

        <div className="glass p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase text-muted">Psychosocial Wellbeing Pulse</div>
          <div className="font-display text-2xl font-bold text-brand-500">7.6 / 10</div>
          <div className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">Anonymised monthly team score</div>
        </div>
      </div>

      {/* Roster Fitness & Baseline Registry Table */}
      <div className="glass p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="card-title">Employee Fitness & Work Restriction Registry</h3>
            <p className="text-xs text-muted mt-0.5">
              Supervisors can view operational restrictions without accessing confidential medical diagnosis.
            </p>
          </div>
          <span className="chip font-mono text-xs">
            {baselines.length} Sample Profiles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-muted uppercase text-[10px] tracking-wider">
                <th className="pb-2">Employee ID</th>
                <th className="pb-2">Fitness Status</th>
                <th className="pb-2">Operational Restriction Mandate</th>
                <th className="pb-2">Coded Risk Factor (POPIA)</th>
                <th className="pb-2">Last Medical Exam</th>
                <th className="pb-2">Next Periodic Due</th>
                <th className="pb-2">Consent Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {baselines.map((b) => {
                const fitColor =
                  b.fitness === "fit"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : b.fitness === "fit_with_restrictions"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-red-500/15 text-red-600 dark:text-red-400";

                return (
                  <tr key={b.employeeId} className="hover:bg-surface-strong/30">
                    <td className="py-2.5 pr-2 font-mono font-bold text-ink">{b.employeeId}</td>
                    <td className="py-2.5 pr-2">
                      <span className={`chip uppercase font-bold text-[10px] ${fitColor}`}>
                        {b.fitness.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-2.5 pr-2 font-medium text-ink max-w-xs">
                      {b.restrictions.length > 0 ? b.restrictions.join("; ") : "None — Unrestricted duty"}
                    </td>
                    <td className="py-2.5 pr-2">
                      <div className="flex flex-wrap gap-1">
                        {b.riskFactors.length > 0 ? (
                          b.riskFactors.map((r, i) => (
                            <span key={i} className="chip font-mono text-[10px] uppercase bg-surface-strong">
                              {r}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted text-[11px]">Standard Baseline</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 pr-2 font-mono text-muted">
                      {b.lastMedicalAt ? new Date(b.lastMedicalAt).toLocaleDateString("en-ZA") : "—"}
                    </td>
                    <td className="py-2.5 pr-2 font-mono text-muted">
                      {b.nextMedicalDueAt ? new Date(b.nextMedicalDueAt).toLocaleDateString("en-ZA") : "—"}
                    </td>
                    <td className="py-2.5">
                      <span className="chip font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                        ✓ Recorded
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
