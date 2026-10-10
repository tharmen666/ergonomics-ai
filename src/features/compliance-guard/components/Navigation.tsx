"use client";

import React from "react";
import type { SAProvince } from "@/lib/types";

export type ActiveTab = "intake" | "overview" | "sop" | "sla" | "del" | "medicals" | "rob";

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingHitlCount: number;
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onOpenSopModal: () => void;
  activeProvince: SAProvince;
  onProvinceChange: (p: SAProvince) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Navigation({
  activeTab,
  onTabChange,
  pendingHitlCount,
  mobileMenuOpen,
  onMobileMenuToggle,
  onOpenSopModal,
  activeProvince,
  onProvinceChange,
  isDark,
  onToggleTheme,
}: NavigationProps) {
  const provinces: SAProvince[] = ["GP", "WC", "KZN", "EC", "FS", "MP", "LP", "NW", "NC"];

  const navItems: Array<{ id: ActiveTab; label: string; shortLabel: string; badge?: number; icon: React.ReactNode }> = [
    {
      id: "overview",
      label: "Executive SHEQ Overview",
      shortLabel: "Overview",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: "rob",
      label: "Rob — Instant OHS File Generator",
      shortLabel: "Rob OHS File",
      icon: (
        <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "intake",
      label: "Frictionless NMI & Intake",
      shortLabel: "NMI Intake",
      badge: pendingHitlCount > 0 ? pendingHitlCount : undefined,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: "sla",
      label: "Pre-V&V Escalations & SLAs",
      shortLabel: "SLAs & V&V",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "del",
      label: "DEL Audit Shield & ERAs",
      shortLabel: "DEL Shield",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "sop",
      label: "Universal SOP Connector",
      shortLabel: "SOPs",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "medicals",
      label: "Medicals & Baseline Tracker",
      shortLabel: "Medicals",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* ────────────────── MOBILE TOP BAR (<md) ────────────────── */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            aria-label="Toggle mobile menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-strong/70 text-ink active:scale-95"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-tight text-ink">
              ComplianceGuard <span className="text-brand-500">AI</span>
            </span>
            <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-semibold uppercase">
              Statutory OHS Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Upload Action on Mobile */}
          <button
            type="button"
            onClick={onOpenSopModal}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20 active:scale-95"
            aria-label="Upload SOP"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-strong/70 text-muted active:scale-95"
          >
            {isDark ? (
              <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ────────────────── MOBILE COLLAPSIBLE DRAWER (<md) ────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            onClick={onMobileMenuToggle}
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col border-r border-line bg-surface-strong p-5 shadow-2xl">
            {/* Header in Drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold">
                  CG
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-ink">ComplianceGuard</div>
                  <div className="text-[10px] font-mono text-muted uppercase">South Africa SMS</div>
                </div>
              </div>
              <button
                type="button"
                onClick={onMobileMenuToggle}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:text-ink"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav list with touch targets */}
            <div className="mt-4 flex-1 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id);
                      onMobileMenuToggle();
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition min-h-[48px] ${
                      isActive
                        ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/30"
                        : "text-muted hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-brand-500" : "text-muted"}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Regulatory Engine in Mobile Drawer */}
            <div className="rounded-xl border border-line/80 bg-surface p-3 text-xs space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-muted">Platform</div>
              <div className="font-semibold text-ink flex items-center justify-between">
                <span>ComplianceGuard AI</span>
                <span className="chip text-[9px] font-mono text-brand-600 dark:text-brand-400 bg-brand-500/10 border-brand-500/20">v1.0</span>
              </div>
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="pt-2 border-t border-line space-y-3">
              <button
                type="button"
                onClick={() => {
                  onMobileMenuToggle();
                  onOpenSopModal();
                }}
                className="btn-primary w-full text-xs py-3"
              >
                <span>+ Plug & Play SOP Connector</span>
              </button>

              <div className="flex items-center justify-between text-xs text-muted pt-1">
                <span>DEL Province:</span>
                <select
                  value={activeProvince}
                  onChange={(e) => onProvinceChange(e.target.value as SAProvince)}
                  className="rounded-lg border border-line bg-surface p-1.5 font-mono text-xs text-ink focus:outline-none"
                >
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p} Inspectorate
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── PERMANENT DESKTOP SIDEBAR (md:) ────────────────── */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 border-r border-line bg-sidebar/80 backdrop-blur-xl">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Executive Brand Logo */}
          <div className="flex h-16 items-center justify-between px-5 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/25">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="font-display text-sm font-bold tracking-tight text-ink">
                  ComplianceGuard <span className="text-brand-500">AI</span>
                </div>
                <div className="text-[10px] font-mono text-muted uppercase tracking-wider">
                  ErgoSMS Engine
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="p-3.5">
            <button
              type="button"
              onClick={onOpenSopModal}
              className="btn-primary w-full text-xs shadow-md py-2.5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>+ Plug & Play SOP Connector</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/30 shadow-sm"
                      : "text-muted hover:bg-surface-strong/60 hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-brand-500" : "text-muted"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Creator Attribution in Desktop Sidebar */}
          <div className="px-3.5 py-2">
            <div className="rounded-xl border border-line bg-surface-strong/70 p-3 text-xs space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-muted">Platform</div>
              <div className="font-semibold text-ink flex items-center justify-between">
                <span>ComplianceGuard AI</span>
                <span className="chip text-[9px] font-mono text-brand-600 dark:text-brand-400 bg-brand-500/10 border-brand-500/20">v1.0</span>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="border-t border-line p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="text-[11px] font-medium uppercase tracking-wider">DEL Office:</span>
              <select
                value={activeProvince}
                onChange={(e) => onProvinceChange(e.target.value as SAProvince)}
                className="rounded-lg border border-line bg-surface p-1 font-mono text-[11px] text-ink focus:outline-none"
              >
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p} Inspectorate
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted font-mono">Theme / Mode</span>
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-strong text-muted hover:text-ink transition"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
