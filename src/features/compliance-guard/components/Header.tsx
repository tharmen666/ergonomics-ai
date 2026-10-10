"use client";

import React, { useEffect, useState } from "react";
import type { SAProvince } from "@/lib/types";

interface HeaderProps {
  activeProvince: SAProvince;
  onProvinceChange: (p: SAProvince) => void;
  tenantName: string;
}

export function Header({ activeProvince, onProvinceChange, tenantName }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cg-theme", next ? "dark" : "light");
    } catch {}
  };

  const provinces: SAProvince[] = ["GP", "WC", "KZN", "EC", "FS", "MP", "LP", "NW", "NC"];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Codename */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-brand-500 border-2 border-surface"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-ink">
                ComplianceGuard <span className="text-brand-500 dark:text-brand-400">AI</span>
              </span>
              <span className="rounded-md border border-brand-500/30 bg-brand-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-brand-600 dark:text-brand-300">
                ErgoSMS Engine
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>{tenantName}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span> Multi-Agent Active
              </span>
            </div>
          </div>
        </div>

        {/* Right side controls: Province, DEL Status, Theme toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* SA Province selector for DEL Inspectorate routing */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-line bg-surface-strong/60 px-2.5 py-1 text-xs">
            <span className="text-muted text-[11px] font-medium uppercase tracking-wider">DEL Reg:</span>
            <select
              value={activeProvince}
              onChange={(e) => onProvinceChange(e.target.value as SAProvince)}
              className="bg-transparent font-semibold text-ink focus:outline-none cursor-pointer"
            >
              {provinces.map((p) => (
                <option key={p} value={p} className="bg-surface text-ink">
                  {p} (Inspectorate)
                </option>
              ))}
            </select>
          </div>

          {/* Rolling window indicator */}
          <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-line bg-surface-strong/40 px-2.5 py-1 text-xs text-muted">
            <svg className="h-3.5 w-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono text-[11px]">3Y Rolling Window</span>
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface-strong/60 text-muted transition hover:border-brand-400 hover:text-ink"
          >
            {isDark ? (
              <svg className="h-4 w-4 text-caution-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </header>
  );
}
