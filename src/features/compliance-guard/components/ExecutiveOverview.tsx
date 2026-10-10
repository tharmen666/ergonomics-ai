"use client";

import React from "react";
import type { ActiveTab } from "./Navigation";

interface ExecutiveOverviewProps {
  onNavigate: (tab: ActiveTab) => void;
  openNmiCount: number;
  readinessScore: number;
}

export function ExecutiveOverview({
  onNavigate,
  openNmiCount,
  readinessScore,
}: ExecutiveOverviewProps) {
  const metrics = [
    {
      label: "TRIR (Total Recordable Incident Rate)",
      value: "0.78",
      subtext: "vs 2.45 SA Industry Benchmark",
      badge: "Top 5% Safe",
      badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
      trend: "↓ 42% YoY",
      trendPositive: true,
      icon: (
        <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      action: () => onNavigate("intake"),
    },
    {
      label: "Open NMIs (Near-Miss Pipeline)",
      value: `${openNmiCount || 12}`,
      subtext: "94% resolved within 24h SLA",
      badge: "High Safety Proactivity",
      badgeColor: "text-brand-500 bg-brand-500/10 border-brand-500/30",
      trend: "↑ 68% reporting rate",
      trendPositive: true,
      icon: (
        <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      action: () => onNavigate("intake"),
    },
    {
      label: "3-Year Rolling Data Integrity",
      value: "100%",
      subtext: "OHS Act GAR 9(1) & COIDA s38",
      badge: "0 Decayed Records",
      badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
      trend: "Auto-purged monthly",
      trendPositive: true,
      icon: (
        <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      action: () => onNavigate("sop"),
    },
    {
      label: "Statutory DEL Audit Shield",
      value: `${readinessScore}%`,
      subtext: "ERAs, CoCs & s17 Reps Certified",
      badge: "Audit-Shielded",
      badgeColor: "text-brand-500 bg-brand-500/10 border-brand-500/30",
      trend: "Zero-Day Fine Immunity",
      trendPositive: true,
      icon: (
        <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      action: () => onNavigate("del"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Executive South Africa Focus */}
      <div className="glass p-5 sm:p-6 border-l-4 border-l-brand-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-brand-600 dark:text-brand-400">
              Executive Safety & Quality Management System
            </div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-ink mt-0.5">
              Autonomous SHEQ Command Centre
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl">
              ComplianceGuard AI continuously monitors South African operational risk across 48 franchised & wholesale sites.
              Multi-agents process raw incident logs, enforce 3-year rolling data hygiene, and insulate businesses from Department of Employment & Labour (DEL) statutory penalties.
            </p>

            {/* Platform Status */}
            <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
              <span className="chip border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono text-xs font-semibold">
                ComplianceGuard AI Platform
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span className="chip border-line bg-surface-strong/80 font-mono text-[11px]">
              🇿🇦 South Africa (GP, WC, KZN)
            </span>
            <span className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">
              ● All Agents Healthy
            </span>
          </div>
        </div>
      </div>

      {/* Rob Assistant Highlight Card */}
      <div
        onClick={() => onNavigate("rob")}
        className="glass p-4 sm:p-5 border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-surface to-brand-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/5 transition group rounded-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/rob-avatar.jpg"
              alt="Rob - OHS AI Assistant"
              className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-500"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                MEET ROB — OHS AI ASSISTANT
              </span>
              <span className="chip text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">
                INSTANT FILE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink/90 mt-0.5">
              Describe your operations (e.g. <strong>Wimpy Southgate</strong>, <strong>Engen Service Station</strong>, <strong>Pharmacies</strong>, <strong>Mugg &amp; Bean</strong>) and Rob will automatically generate your completed statutory OHS safety file to pay and download!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("rob");
          }}
          className="btn-primary text-xs py-2 px-4 whitespace-nowrap shrink-0 group-hover:shadow-md group-hover:shadow-brand-500/25 transition"
        >
          <span>Ask Rob to Generate File →</span>
        </button>
      </div>

      {/* Responsive Metrics Grid: 1 col on mobile, 2 cols on sm, 4 cols on lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            onClick={m.action}
            className="glass p-4 sm:p-5 flex flex-col justify-between space-y-3 cursor-pointer hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/5 active:scale-[0.99] transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-muted tracking-wider">
                  {m.label}
                </span>
                <span className="p-1.5 rounded-lg bg-surface-strong/80 group-hover:scale-110 transition-transform">
                  {m.icon}
                </span>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2 tracking-tight">
                {m.value}
              </div>
              <div className="text-xs text-muted mt-1">{m.subtext}</div>
            </div>

            <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
              <span className={`chip text-[10px] uppercase font-bold border ${m.badgeColor}`}>
                {m.badge}
              </span>
              <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {m.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Operational Highlights Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Urgent Escalations Preview */}
        <div className="glass p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="card-title">Pre-V&V Escalation Queue</h3>
              <p className="text-xs text-muted mt-0.5">
                Urgent frontline actions approaching measurable SLA thresholds.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("sla")}
              className="btn-ghost text-xs py-1.5"
            >
              <span>View Full SLA Board ➔</span>
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white font-bold text-xs">
                  CRIT
                </span>
                <div>
                  <div className="font-semibold text-ink">
                    Mochachos Centurion — Open Fryer Hot Oil Splatter
                  </div>
                  <div className="text-muted text-[11px] mt-0.5">
                    Stage: <strong>Containment & First Aid Verification</strong> • Assigned: Site Manager Thabo
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <span className="chip font-mono text-[11px] text-red-600 dark:text-red-400 font-bold">
                  SLA: 12 min left
                </span>
                <span className="text-[10px] text-muted font-mono mt-0.5">
                  Escalation: Level 1
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-black font-bold text-xs">
                  HIGH
                </span>
                <div>
                  <div className="font-semibold text-ink">
                    Makro Crown Mines — Pallet Destacking Manual Handling Sprain
                  </div>
                  <div className="text-muted text-[11px] mt-0.5">
                    Stage: <strong>Multi-Agent 5-Whys RCA Review</strong> • Assigned: Safety Officer Sarah
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <span className="chip font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                  SLA: 3h 14m left
                </span>
                <span className="text-[10px] text-muted font-mono mt-0.5">
                  Escalation: Level 2
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Statutory Shield Summary */}
        <div className="glass p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="card-title">DEL Audit Immunity</h3>
            <span className="chip font-mono text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400">
              Active Shield
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-surface-strong/50">
              <span className="text-muted">Ergonomics Regs (Reg 3):</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Compliant (ERAs filed)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-surface-strong/50">
              <span className="text-muted">Electrical EIR CoC:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Valid (Expires 2026)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-surface-strong/50">
              <span className="text-muted">OHS Act s17 H&S Reps:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">2 / 2 Appointed</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-surface-strong/50">
              <span className="text-muted">COIDA Good Standing:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Current (W.As.8 filed)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("del")}
            className="btn-primary w-full text-xs py-2.5"
          >
            <span>Open DEL Statutory Shield ➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
