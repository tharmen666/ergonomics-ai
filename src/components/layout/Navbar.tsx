import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  MoreVertical,
  ShieldCheck,
  Sparkles,
  Building2,
  Radio,
  X,
  Play,
} from 'lucide-react';
import { useNellyStore } from '../../store/nellyStore';
import { useTenantStore } from '../../store/tenantStore';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  const {
    isSidebarCollapsed,
    setSidebarCollapsed,
    isWingmanActive,
    setWingmanActive,
    isLiveTelemetryOpen,
    setIsLiveTelemetryOpen,
    setIsDemoModalOpen,
    setIsWorkspaceModalOpen,
  } = useNellyStore();

  const { companyId, isAdmin, companies } = useTenantStore();
  const activeTenantLabel = isAdmin
    ? 'Admin'
    : companies.find((c) => c.id === companyId)?.id || 'COMP-001';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Reflects the user's actual consent click (set only by the privacy notice's accept button)
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  useEffect(() => {
    const read = () => {
      try {
        setPrivacyAccepted(localStorage.getItem('ergo_privacy_consent_verified') === 'true');
      } catch {
        /* storage blocked */
      }
    };
    read();
    const id = window.setInterval(read, 2000);
    return () => window.clearInterval(id);
  }, []);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 box-border bg-[#060d1b]/88 backdrop-blur-2xl border-b border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.55)] transition-all duration-300 ease-in-out w-full max-w-full ${
        isSidebarCollapsed ? 'lg:ml-0 lg:w-full' : 'lg:ml-[264px] lg:w-[calc(100%-264px)]'
      }`}
    >
      <div className="w-full max-w-full px-2 sm:px-5 md:px-6 py-2 flex items-center justify-between gap-2 relative">
        {/* Left: Branding & Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink-0">
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 sm:p-2 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] bg-white/8 border border-white/15 rounded-xl hover:bg-white/15 transition-colors flex items-center justify-center text-[#D97706] shadow-md flex-shrink-0 cursor-pointer"
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-[11px] sm:text-base lg:text-lg font-black text-white tracking-tight uppercase whitespace-nowrap leading-tight">
              ERGOSAFE <span className="text-emerald-400">REBORN</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[8px] sm:text-[9px] font-mono text-cyan-300/90 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30 truncate">
                Build: {__APP_BUILD__}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Desktop Actions & Compact Workspace Switcher (>= 768px) */}
        <div className="hidden md:flex flex-wrap items-center justify-end gap-1.5 min-w-0 flex-1">
          {/* Privacy Consensus Badge (attached in DOM for E2E verification, displayed on 2xl) */}
          <div
            className={`hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider whitespace-nowrap shadow-sm border ${
              privacyAccepted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${privacyAccepted ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>{privacyAccepted ? 'Privacy Notice Accepted' : 'Privacy Notice Pending'}</span>
          </div>

          {/* Wingman Toggle Button */}
          <button
            onClick={() => setWingmanActive(!isWingmanActive)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-xl font-bold text-[11px] transition-all shadow-md leading-none cursor-pointer whitespace-nowrap ${
              isWingmanActive
                ? 'cta-gradient-emerald text-white font-black ring-2 ring-emerald-400/70'
                : 'bg-white/8 hover:bg-white/15 text-white border border-white/15'
            }`}
            title="Toggle Voice Wingman Assistant"
          >
            <Radio size={13} className={isWingmanActive ? 'animate-pulse text-emerald-300' : 'text-emerald-400'} />
            <span>{isWingmanActive ? 'DISABLE WINGMAN' : 'ACTIVATE WINGMAN'}</span>
          </button>

          {/* Live Telemetry Modal Button */}
          <button
            onClick={() => setIsLiveTelemetryOpen(true)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-xl font-bold text-[11px] transition-all shadow-md leading-none cursor-pointer whitespace-nowrap ${
              isLiveTelemetryOpen
                ? 'cta-gradient-cyan text-slate-950 font-black'
                : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-400/40'
            }`}
            title="Launch Live Edge AI Posture Monitor"
          >
            <span>((•)) LIVE MONITOR</span>
          </button>

          {/* Watch 2-Min Executive Demo Button */}
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="inline-flex items-center gap-1.5 cta-gradient-emerald border-2 border-[#D97706] text-white px-3 py-1.5 min-h-[36px] rounded-xl font-black text-[11px] transition-all shadow-md whitespace-nowrap leading-none cursor-pointer"
            title="Watch 2-Min Executive Demo"
          >
            <Play size={12} className="fill-white text-white" />
            <span>Watch 2-Min Executive Demo</span>
          </button>

          {/* Trust Center Quick Pill (2xl+) */}
          <button
            onClick={() => setActiveTab('trust-center')}
            className="hidden 2xl:inline-flex items-center gap-1.5 bg-[#0F172A] hover:bg-[#064E3B] border border-[#D97706] text-white px-2.5 py-1.5 min-h-[36px] rounded-xl font-black text-[11px] transition-all shadow-md whitespace-nowrap leading-none cursor-pointer"
            title="Trust & Enterprise Licensing"
          >
            <ShieldCheck size={13} className="text-[#D97706]" />
            <span>Trust &amp; Enterprise Licensing</span>
          </button>

          {/* HQ 3D Demo Quick Pill (2xl+) */}
          <button
            onClick={() => setActiveTab('demo')}
            className="hidden 2xl:inline-flex items-center gap-1 cta-gradient-amber text-slate-950 px-2.5 py-1.5 min-h-[36px] rounded-xl font-black text-[11px] transition-all shadow-md whitespace-nowrap leading-none cursor-pointer"
            title="Launch Interactive 3D Demo"
          >
            <Sparkles size={13} />
            <span>HQ DEMO</span>
          </button>

          {/* Sleek Compact Workspace Switcher Button */}
          <button
            onClick={() => setIsWorkspaceModalOpen(true)}
            data-testid="workspace-switcher-btn"
            aria-label="Switch Workspace"
            title="Switch Demo Workspace or Login"
            className="inline-flex items-center gap-1.5 bg-white/8 hover:bg-white/15 border border-white/15 hover:border-emerald-400/50 text-slate-100 px-2.5 py-1.5 min-h-[36px] rounded-xl font-bold text-[11px] transition-all whitespace-nowrap leading-none cursor-pointer shadow-sm"
          >
            <Building2 size={13} className="text-[#D97706]" />
            <span>{activeTenantLabel}</span>
          </button>
        </div>

        {/* Right: Mobile Compact Controls (< 768px) with Collapsible Tray */}
        <div className="flex md:hidden items-center gap-1 flex-shrink-0" ref={menuRef}>
          {/* Watch 2-Min Executive Demo Mobile Button */}
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="cta-gradient-emerald border border-[#D97706] text-white px-2 py-1.5 min-h-[34px] rounded-lg font-black text-[9.5px] transition-all shadow-sm whitespace-nowrap leading-none cursor-pointer flex items-center gap-1"
            title="Watch 2-Min Executive Demo"
          >
            <Play size={9} className="fill-white text-white shrink-0" />
            <span>Watch 2-Min Executive Demo</span>
          </button>

          {/* Collapsible Quick Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-1.5 min-h-[34px] min-w-[32px] rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
              isMobileMenuOpen
                ? 'cta-gradient-amber text-slate-950 border-[#D97706]'
                : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
            }`}
            title="Quick Actions Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={16} /> : <MoreVertical size={16} />}
          </button>

          {/* Collapsible Dropdown Card (Mobile Tray) */}
          {isMobileMenuOpen && (
            <div className="absolute right-2 top-full mt-2 w-72 max-w-[calc(100vw-1rem)] bg-[#060d1b]/98 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-3 z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Privacy Status */}
              <div
                className={`flex items-center justify-between p-2 rounded-xl border text-[10px] font-bold ${
                  privacyAccepted
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>{privacyAccepted ? 'Privacy Notice Accepted' : 'Privacy Notice Pending'}</span>
                </div>
              </div>

              {/* Wingman Assistant Action */}
              <button
                onClick={() => {
                  setWingmanActive(!isWingmanActive);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  isWingmanActive
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Radio size={14} className={isWingmanActive ? 'animate-pulse' : ''} />
                  <span>{isWingmanActive ? 'DISABLE WINGMAN' : 'ACTIVATE WINGMAN'}</span>
                </span>
                <span className="text-[10px] uppercase font-mono">
                  {isWingmanActive ? 'Enabled' : 'Disabled'}
                </span>
              </button>

              {/* Live Monitor Action */}
              <button
                onClick={() => {
                  setIsLiveTelemetryOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  isLiveTelemetryOpen
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>((•)) LIVE MONITOR</span>
                </span>
                <span className="text-[10px] uppercase font-mono">
                  {isLiveTelemetryOpen ? 'Active' : 'Launch'}
                </span>
              </button>

              {/* Trust & Enterprise Licensing Action */}
              <button
                onClick={() => {
                  setActiveTab('trust-center');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs bg-[#064E3B] hover:bg-[#065F46] text-white border border-[#D97706] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#D97706]" />
                  <span>Trust &amp; Enterprise Licensing</span>
                </span>
              </button>

              {/* Workspace Switcher Action */}
              <button
                onClick={() => {
                  setIsWorkspaceModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-cyan-200 font-bold text-xs transition-colors cursor-pointer"
              >
                <Building2 size={14} className="text-[#D97706]" />
                <span>Switch Workspace ({activeTenantLabel})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Click-Away Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
