"use client";

import React, { useState } from "react";
import type { RiskBand, SlaStage } from "@/lib/types";
import { SLA_POLICIES } from "@/lib/sla/policies";

interface SlaEscalationPanelProps {
  onIncidentSelected?: (id: string) => void;
}

export function SlaEscalationPanel({ onIncidentSelected }: SlaEscalationPanelProps) {
  const [selectedBand, setSelectedBand] = useState<RiskBand>("critical");
  const [escalationFeedback, setEscalationFeedback] = useState<string | null>(null);

  const [activeQueue, setActiveQueue] = useState([
    {
      id: "inc_01_fryer_centurion",
      title: "Mochachos Centurion — Commercial Open Fryer Oil Burn",
      stage: "contain" as SlaStage,
      band: "critical" as RiskBand,
      assignedRole: "site_manager",
      assignedPerson: "Thabo M.",
      timeLeftMinutes: 14,
      escalationLevel: 1,
      reportableDel: true,
    },
    {
      id: "inc_02_pallet_crown",
      title: "Makro Crown Mines — Receiving Bay 25kg Bulk Sack Lumbar Sprain",
      stage: "investigate" as SlaStage,
      band: "high" as RiskBand,
      assignedRole: "safety_officer",
      assignedPerson: "Sarah K.",
      timeLeftMinutes: 194,
      escalationLevel: 1,
      reportableDel: false,
    },
    {
      id: "inc_03_pharma_sandton",
      title: "Clicks Sandton City — Schedule 5 Metformin Look-Alike Dispense Near-Miss",
      stage: "validate" as SlaStage,
      band: "medium" as RiskBand,
      assignedRole: "safety_officer",
      assignedPerson: "Sipho D.",
      timeLeftMinutes: 840,
      escalationLevel: 0,
      reportableDel: false,
    },
  ]);

  const currentPolicy = SLA_POLICIES[selectedBand];

  const handleTriggerEscalation = (id: string, title: string) => {
    setActiveQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, escalationLevel: item.escalationLevel + 1 } : item
      )
    );
    setEscalationFeedback(
      `✓ Proactive Agent Escalation fired for "${title}". WhatsApp & Push alert dispatched to Area General Manager.`
    );
    setTimeout(() => setEscalationFeedback(null), 4000);
  };

  const handleAcknowledge = (id: string) => {
    setActiveQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stage: "investigate" as SlaStage, timeLeftMinutes: 1440 } : item
      )
    );
    setEscalationFeedback(`✓ Stage advanced to Multi-Agent RCA investigation.`);
    setTimeout(() => setEscalationFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass p-5 sm:p-6 border-l-4 border-l-brand-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-brand-600 dark:text-brand-400">
              Pre-V&V (Validate & Verify) Escalation Engine
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink mt-0.5">
              Live SLA Enforcement & Escalation Queue
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl">
              Eliminate stalled management approval loops. Inline measurable SLAs trigger automated agent nudges to frontline store managers, SHEQ officers, and area directors before safety deadlines breach.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="chip font-mono text-xs bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30">
              ● {activeQueue.filter((q) => q.timeLeftMinutes < 60).length} Urgent Deadlines
            </span>
          </div>
        </div>
      </div>

      {/* Escalation Feedback Notification */}
      {escalationFeedback && (
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3.5 text-xs text-brand-600 dark:text-brand-300 font-medium animate-fade-up">
          {escalationFeedback}
        </div>
      )}

      {/* Risk Band Policy Matrix Filter */}
      <div className="glass p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">
            Inspect SLA Timers by Risk Category:
          </div>

          <div className="inline-flex rounded-xl border border-line bg-surface-strong/70 p-1 text-xs">
            {(["critical", "high", "medium", "low"] as RiskBand[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBand(b)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                  selectedBand === b
                    ? b === "critical"
                      ? "bg-red-500 text-white shadow-sm"
                      : b === "high"
                      ? "bg-amber-500 text-white shadow-sm"
                      : b === "medium"
                      ? "bg-yellow-500 text-black shadow-sm"
                      : "bg-emerald-500 text-white shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Policy Stage Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 text-xs">
          {Object.entries(currentPolicy.targetsMinutes).map(([stage, mins]) => (
            <div key={stage} className="p-2.5 rounded-xl border border-line bg-surface-strong/40">
              <div className="text-[10px] font-mono text-muted uppercase capitalize">
                {stage.replace(/_/g, " ")}
              </div>
              <div className="font-bold text-ink mt-0.5 font-mono">
                {mins < 60 ? `${mins}m` : mins < 1440 ? `${Math.round(mins / 60)}h` : `${Math.round(mins / 1440)}d`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────── DESKTOP QUEUE TABLE (hidden on mobile, visible on md:) ────────────────── */}
      <div className="hidden md:block glass p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="card-title">Active Pre-V&V Escalation Queue</h3>
          <span className="chip font-mono text-xs">{activeQueue.length} Active Incidents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-muted uppercase text-[10px] tracking-wider">
                <th className="pb-2.5">Urgency</th>
                <th className="pb-2.5">Incident Reference & Site</th>
                <th className="pb-2.5">Current Stage</th>
                <th className="pb-2.5">Assigned Owner</th>
                <th className="pb-2.5">Remaining SLA</th>
                <th className="pb-2.5">Escalation</th>
                <th className="pb-2.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {activeQueue.map((item) => {
                const isUrgent = item.timeLeftMinutes < 60;
                return (
                  <tr key={item.id} className="hover:bg-surface-strong/30 transition-colors">
                    <td className="py-3 pr-2">
                      <span
                        className={`chip uppercase font-bold text-[10px] border ${
                          item.band === "critical"
                            ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
                            : item.band === "high"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                            : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {item.band}
                      </span>
                    </td>
                    <td className="py-3 pr-2 font-medium text-ink max-w-xs">
                      <div>{item.title}</div>
                      {item.reportableDel && (
                        <span className="inline-block mt-0.5 text-[10px] text-red-600 dark:text-red-400 font-bold font-mono">
                          ⚠️ OHS Act s24 Reportable
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-2 font-mono uppercase text-[11px] text-muted">
                      {item.stage.replace(/_/g, " ")}
                    </td>
                    <td className="py-3 pr-2 text-ink">
                      <div className="font-semibold">{item.assignedPerson}</div>
                      <div className="text-[10px] text-muted capitalize font-mono">
                        {item.assignedRole.replace(/_/g, " ")}
                      </div>
                    </td>
                    <td className="py-3 pr-2">
                      <span
                        className={`chip font-mono font-bold text-[11px] ${
                          isUrgent ? "bg-red-500/15 text-red-600 animate-pulse" : "text-muted"
                        }`}
                      >
                        {item.timeLeftMinutes < 60
                          ? `${item.timeLeftMinutes} min left`
                          : `${Math.round(item.timeLeftMinutes / 60)} hrs left`}
                      </span>
                    </td>
                    <td className="py-3 pr-2 font-mono text-[11px]">
                      Level {item.escalationLevel}
                    </td>
                    <td className="py-3 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleAcknowledge(item.id)}
                        className="btn-ghost text-xs py-1 px-2.5"
                      >
                        Advance
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTriggerEscalation(item.id, item.title)}
                        className="btn-primary text-xs py-1 px-2.5"
                      >
                        Escalate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ────────────────── MOBILE CARD-BASED QUEUE (visible on <md) ────────────────── */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Urgent Pre-V&V Queue ({activeQueue.length})
          </span>
          <span className="text-[11px] text-muted">Touch-friendly triggers</span>
        </div>

        {activeQueue.map((item) => {
          const isUrgent = item.timeLeftMinutes < 60;
          return (
            <div
              key={item.id}
              className="glass p-4 border border-line space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`chip uppercase font-bold text-[9px] border ${
                        item.band === "critical"
                          ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {item.band}
                    </span>
                    <span className="chip font-mono text-[9px] uppercase">
                      Stage: {item.stage}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-ink mt-1.5">
                    {item.title}
                  </div>
                </div>

                <span
                  className={`chip font-mono font-bold text-[10px] shrink-0 ${
                    isUrgent ? "bg-red-500/20 text-red-600 animate-pulse" : "text-muted"
                  }`}
                >
                  {item.timeLeftMinutes < 60
                    ? `${item.timeLeftMinutes}m left`
                    : `${Math.round(item.timeLeftMinutes / 60)}h left`}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted border-t border-line/60 pt-2 font-mono">
                <div>Assigned: <strong className="text-ink">{item.assignedPerson}</strong></div>
                <div>Escalation: <strong className="text-ink">L{item.escalationLevel}</strong></div>
              </div>

              {/* Mobile Thumb-Friendly Action Triggers (min 44px height) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleAcknowledge(item.id)}
                  className="btn-ghost w-full justify-center min-h-[44px] text-xs font-semibold"
                >
                  Confirm Action
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerEscalation(item.id, item.title)}
                  className="btn-primary w-full justify-center min-h-[44px] text-xs font-semibold"
                >
                  Trigger Nudge
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
