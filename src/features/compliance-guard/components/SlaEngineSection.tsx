"use client";

import React, { useState } from "react";
import type { AgentNudge, RiskBand, SlaClock, SlaStage } from "@/lib/types";
import { SLA_POLICIES } from "@/lib/sla/policies";

export function SlaEngineSection() {
  const [selectedBand, setSelectedBand] = useState<RiskBand>("critical");
  const [activeStage, setActiveStage] = useState<SlaStage>("acknowledge");
  const [simulatedNudges, setSimulatedNudges] = useState<AgentNudge[]>([
    {
      incidentId: "inc_sim_01" as any,
      toRole: "site_manager",
      channel: "whatsapp",
      message: "CRITICAL risk fryer burn logged at Mochachos Centurion. Confirm containment & first aid within 15 min.",
      dueAt: new Date(Date.now() + 15 * 60000).toISOString() as any,
    },
    {
      incidentId: "inc_sim_01" as any,
      toRole: "safety_officer",
      channel: "sms",
      message: "OHS Act s24 alert: Worker hospitalized. Notify DEL Inspector immediately; preserve incident scene.",
      dueAt: new Date(Date.now() + 60 * 60000).toISOString() as any,
    },
    {
      incidentId: "inc_sim_01" as any,
      toRole: "safety_officer",
      channel: "email",
      message: "COIDA CompEasy reminder: W.Cl.2 employer accident claim due within 7 days.",
      dueAt: new Date(Date.now() + 7 * 86400000).toISOString() as any,
    },
  ]);

  const stages: Array<{ id: SlaStage; label: string; desc: string }> = [
    { id: "acknowledge", label: "1. Acknowledge", desc: "Frontline manager confirmation of receipt" },
    { id: "contain", label: "2. Containment", desc: "Immediate hazard control / lockout / spill isolation" },
    { id: "investigate", label: "3. Multi-Agent RCA", desc: "Autonomous 5-Whys, 6M Fishbone & CAPA proposal" },
    { id: "validate", label: "4. HITL Validation", desc: "Safety officer sign-off & Just Culture review" },
    { id: "capa_complete", label: "5. CAPA Execution", desc: "Engineering & administrative control implementation" },
    { id: "verify_effectiveness", label: "6. V&V Verification", desc: "Measurable recurrence check (0 repeats in 60d)" },
  ];

  const currentPolicy = SLA_POLICIES[selectedBand];

  const triggerTestNudge = () => {
    const newNudge: AgentNudge = {
      incidentId: `inc_${Date.now().toString(36)}` as any,
      toRole: currentPolicy.escalation[0],
      channel: selectedBand === "critical" ? "whatsapp" : "push",
      message: `Proactive Agent Nudge: SLA approaching expiry for stage "${activeStage}". Autonomous follow-up required.`,
      dueAt: new Date(Date.now() + 30 * 60000).toISOString() as any,
    };
    setSimulatedNudges((prev) => [newNudge, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass p-5 sm:p-6 border-l-4 border-l-brand-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-brand-600 dark:text-brand-400">Pre-V&V Escalation Engine</div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink mt-0.5">
              Measurable SLAs & Proactive Agent Nudges
            </h2>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Traditional safety systems stall in manager approval inboxes. ComplianceGuard AI enforces inline, measurable time limits
              backed by autonomous WhatsApp/SMS nudges. Safety officers validate pre-compiled evidence rather than typing reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="chip font-mono text-xs bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20">
              Zero-Friction V&V
            </span>
          </div>
        </div>
      </div>

      {/* SLA Policy Selector */}
      <div className="glass p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Select Statutory Risk Band:
            </label>
            <div className="inline-flex rounded-lg border border-line bg-surface-strong/50 p-0.5 text-xs">
              {(["critical", "high", "medium", "low"] as RiskBand[]).map((band) => (
                <button
                  key={band}
                  type="button"
                  onClick={() => setSelectedBand(band)}
                  className={`px-3 py-1 rounded-md font-semibold capitalize transition ${
                    selectedBand === band
                      ? band === "critical"
                        ? "bg-red-500 text-white shadow-sm"
                        : band === "high"
                        ? "bg-amber-500 text-white shadow-sm"
                        : band === "medium"
                        ? "bg-yellow-500 text-black shadow-sm"
                        : "bg-emerald-500 text-white shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {band}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">Escalation Ladder:</span>
            <div className="flex items-center gap-1 font-mono text-ink font-semibold">
              {currentPolicy.escalation.map((role, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="chip text-[10px] uppercase">{role.replace(/_/g, " ")}</span>
                  {i < currentPolicy.escalation.length - 1 && <span className="text-muted">➔</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stages Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {stages.map((st, idx) => {
            const minutes = currentPolicy.targetsMinutes[st.id];
            const displayTime =
              minutes < 60
                ? `${minutes} min`
                : minutes < 1440
                ? `${Math.round(minutes / 60)} hrs`
                : `${Math.round(minutes / 1440)} days`;

            const isSelected = activeStage === st.id;

            return (
              <div
                key={st.id}
                onClick={() => setActiveStage(st.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-brand-500 bg-brand-500/10 shadow-sm"
                    : "border-line bg-surface-strong/40 hover:bg-surface-strong/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted uppercase">Stage 0{idx + 1}</span>
                  <span className="chip font-mono text-[10px] font-bold text-brand-600 dark:text-brand-400">
                    {displayTime}
                  </span>
                </div>
                <div className="font-semibold text-xs text-ink mt-1.5">{st.label}</div>
                <div className="text-[11px] text-muted mt-1 leading-snug">{st.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proactive Agent Nudges Feed */}
      <div className="glass p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="card-title">Proactive Autonomous Agent Nudges</h3>
            <p className="text-xs text-muted mt-0.5">
              Dispatched automatically across WhatsApp, Push, SMS, and Email to avoid compliance drag.
            </p>
          </div>

          <button
            type="button"
            onClick={triggerTestNudge}
            className="btn-ghost text-xs"
          >
            <svg className="h-3.5 w-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Simulate Live Escalation Nudge</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {simulatedNudges.map((nudge, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-line bg-surface-strong/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono text-sm">
                  {nudge.channel === "whatsapp" ? "💬" : nudge.channel === "sms" ? "📱" : "✉️"}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink uppercase text-[11px] font-mono">
                      Target Role: {nudge.toRole.replace(/_/g, " ")}
                    </span>
                    <span className="chip font-mono text-[10px] uppercase bg-surface-strong">
                      Via {nudge.channel}
                    </span>
                  </div>
                  <div className="text-ink font-medium mt-1">{nudge.message}</div>
                </div>
              </div>

              <div className="text-right sm:self-auto self-end">
                <span className="chip font-mono text-[10px] text-muted">
                  Due: {new Date(nudge.dueAt).toLocaleTimeString("en-ZA")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
