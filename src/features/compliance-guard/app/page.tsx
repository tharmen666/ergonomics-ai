"use client";

import React, { useState, useEffect } from "react";
import type { IncidentPipelineResult, SAProvince } from "@/lib/types";
import { type ActiveTab, Navigation } from "@/components/Navigation";
import { ExecutiveOverview } from "@/components/ExecutiveOverview";
import { IncidentIntakeSection } from "@/components/IncidentIntakeSection";
import { SopConnectorSection } from "@/components/SopConnectorSection";
import { SopPlugAndPlayModal } from "@/components/SopPlugAndPlayModal";
import { AuditShieldDashboard } from "@/components/AuditShieldDashboard";
import { SlaEscalationPanel } from "@/components/SlaEscalationPanel";
import { MedicalsTrackerSection } from "@/components/MedicalsTrackerSection";
import { RobOhsGeneratorSection } from "@/components/RobOhsGeneratorSection";
import { RobFloatingWidget } from "@/components/RobFloatingWidget";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [activeProvince, setActiveProvince] = useState<SAProvince>("GP");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sopModalOpen, setSopModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [recentIncidents, setRecentIncidents] = useState<IncidentPipelineResult[]>([]);

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

  const handleIncidentLogged = (result: IncidentPipelineResult) => {
    setRecentIncidents((prev) => [result, ...prev]);
  };

  const pendingHitlCount = recentIncidents.filter((i) => i.incident.requiresHumanReview).length;

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink font-sans transition-colors">
      {/* Responsive Navigation: Mobile Drawer + Permanent Desktop Sidebar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingHitlCount={pendingHitlCount}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        onOpenSopModal={() => setSopModalOpen(true)}
        activeProvince={activeProvince}
        onProvinceChange={setActiveProvince}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area: Offset by desktop sidebar (md:pl-64) */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Top Desktop Utility Bar */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-line bg-surface/75 px-6 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold text-ink">
              Famous Brands & SA Retail Holdings
            </span>
            <span className="text-muted">•</span>
            <span className="chip font-mono text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20">
              48 Franchised Sites Active
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* System Status Pill */}
            <div className="flex items-center gap-2 rounded-lg border border-brand-500/25 bg-brand-500/10 px-3 py-1.5 shadow-xs">
              <span className="font-semibold text-ink">Statutory Compliance Active</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-muted font-mono">Agent Consensus: 98.4%</span>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("rob")}
              className="chip border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-semibold py-1.5 px-3 hover:bg-amber-500/20 transition flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>Ask Rob (Instant OHS File)</span>
            </button>

            <button
              type="button"
              onClick={() => setSopModalOpen(true)}
              className="btn-ghost text-xs py-1.5 px-3"
            >
              <span>+ Quick SOP Upload</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route View Content */}
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === "overview" && (
            <ExecutiveOverview
              onNavigate={setActiveTab}
              openNmiCount={14}
              readinessScore={94}
            />
          )}

          {activeTab === "rob" && (
            <RobOhsGeneratorSection />
          )}

          {activeTab === "intake" && (
            <IncidentIntakeSection onIncidentLogged={handleIncidentLogged} />
          )}

          {activeTab === "sla" && (
            <SlaEscalationPanel onIncidentSelected={() => setActiveTab("intake")} />
          )}

          {activeTab === "del" && (
            <AuditShieldDashboard activeProvince={activeProvince} />
          )}

          {activeTab === "sop" && (
            <SopConnectorSection />
          )}

          {activeTab === "medicals" && (
            <MedicalsTrackerSection />
          )}
        </main>

        {/* Floating Rob Assistant Widget */}
        <RobFloatingWidget onOpenRob={() => setActiveTab("rob")} />

        {/* Global Modal: SOP Plug and Play */}
        <SopPlugAndPlayModal
          isOpen={sopModalOpen}
          onClose={() => setSopModalOpen(false)}
          onIngestSuccess={() => {
            // Can switch to SOP view or show toast
          }}
        />

        {/* Mobile-Friendly Executive Footer with Creator Attribution */}
        <footer className="border-t border-line py-5 px-4 sm:px-6 text-xs text-muted mt-auto bg-surface/50 backdrop-blur-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div>
              <span className="font-semibold text-ink">ComplianceGuard AI</span>{" "}
              <span>(ErgoSMS Engine)</span> • South African SHEQ & TQM Platform
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-ink">
              <span className="font-semibold text-ink">Statutory OHS Assurance System</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px]">
              <span>ISO 45001:2018</span>
              <span>•</span>
              <span>ISO 9001:2015</span>
              <span>•</span>
              <span>OHS Act 85 of 1993</span>
              <span>•</span>
              <span>Ergonomics Regs 2019</span>
              <span>•</span>
              <span>POPIA §26</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
