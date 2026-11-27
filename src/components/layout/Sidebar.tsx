import { useEffect } from 'react';
import {
  Users,
  Award,
  ClipboardCheck,
  CheckSquare,
  Bot,
  FileText,
  BarChart2,
  X,
  ShieldAlert,
  Building2,
  HeartHandshake,
  Timer,
  Sparkles,
  Activity,
  ShieldCheck,
  BrainCircuit,
  Calculator,
  Lock,
} from 'lucide-react';
import { useNellyStore } from '../../store/nellyStore';
import { useTenantStore } from '../../store/tenantStore';

const navItems = [
  { icon: ShieldCheck, label: 'Stewardship Overview', id: 'executive' },
  { icon: Bot, label: 'Nelly Posture & Hazard Monitoring Engine (3D Spine)', id: 'nelly' },
  { icon: ClipboardCheck, label: 'Statutory Risk & Governance (GN R1589)', id: 'statutory-governance' },
  { icon: Award, label: 'Ergonomics Training & Certification', id: 'training' },
  { icon: Timer, label: 'Smart Break & Mobility Engine', id: 'smart-breaks' },
  { icon: Activity, label: 'Prizm Fatigue & Shift Checks', id: 'fatigue' },
  { icon: Lock, label: 'Trust & Enterprise Licensing', id: 'trust-center' },
  { icon: ClipboardCheck, label: 'GN R1589 Statutory Assessment Workspaces', id: 'assessment' },
  { icon: Calculator, label: 'Biomechanical Calculators (REBA/RULA/NIOSH/WBGT)', id: 'calculators' },
  { icon: BrainCircuit, label: 'Ergonomics Cognitive Handshake', id: 'cognitive-handshake' },
  { icon: HeartHandshake, label: 'Ground-Zero Human Co-Pilot Companion', id: 'companion-hub' },
  { icon: Sparkles, label: 'Organic SOP & ISO 45001 Generator', id: 'sop-generator' },
  { icon: CheckSquare, label: 'Daily Workstation Safety Checklist', id: 'checklist' },
  { icon: Users, label: 'HR & Compliance Dashboard', id: 'hr' },
  { icon: Activity, label: 'Risky Behaviours Monitoring', id: 'risks' },
  { icon: FileText, label: 'Assessment PDF Invoices & Billing', id: 'invoices' },
  { icon: BarChart2, label: 'Analytics & Regulatory Audit Logs', id: 'reports' },
];

export const isTabActive = (itemId: string, currentTab: string): boolean => {
  if (itemId === currentTab) return true;
  const norm = (currentTab || '').toLowerCase().trim();
  if (itemId === 'trust-center' && ['trust-center', 'trust', 'enterprise-licensing'].includes(norm)) return true;
  if (itemId === 'statutory-governance' && ['statutory-governance', 'statutory-ergonomics', 'gn-r1589'].includes(norm)) return true;
  if (itemId === 'fatigue' && ['fatigue', 'telemetry', 'gear', 'prizm', 'driver-telemetry'].includes(norm)) return true;
  if (itemId === 'nelly' && ['nelly', 'posture', '3d-spine', '3d-spinal', 'spinal-3d', 'spinal3d', 'spinal', 'spine', '3d', 'spine-viewer', 'spine-simulation'].includes(norm)) return true;
  if (itemId === 'risks' && ['risks', 'risk', 'risky-behaviours', 'risky-behaviors', 'riskybehaviours', 'riskybehaviors', 'risky-behaviour', 'risky-behavior', 'behaviours', 'behaviors'].includes(norm)) return true;
  if (itemId === 'training' && ['training', 'trainings', 'training-module', 'trainingmodule', 'certification', 'curriculum'].includes(norm)) return true;
  if (itemId === 'assessment' && ['assessment', 'assessments', 'self-assessment', 'self-assessments', 'selfassessment', 'selfassessments', 'workspaces', 'statutory-assessment', 'wfh-assessment'].includes(norm)) return true;
  if (itemId === 'calculators' && ['calculators', 'calculator', 'biomechanical-calculators', 'reba', 'rula', 'niosh', 'wbgt'].includes(norm)) return true;
  if (itemId === 'checklist' && ['checklist', 'kiosk', 'daily-checklist'].includes(norm)) return true;
  if (itemId === 'hr' && ['hr', 'hr-dashboard', 'hr-compliance', 'compliance'].includes(norm)) return true;
  if (itemId === 'executive' && ['executive', 'stewardship', 'executive-briefing', 'dashboard'].includes(norm)) return true;
  return false;
};

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const { setIsWorkspaceModalOpen } = useNellyStore();
  const { companyId, isAdmin, userId, companies } = useTenantStore();
  const companyName = isAdmin
    ? 'Master Owner Admin'
    : companies.find((c) => c.id === companyId)?.name || 'Sovereign Health Ltd';

  useEffect(() => {
    if (!isCollapsed && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCollapsed]);

  return (
    <>
      {/* Global Overlay Backdrop - Mobile/Tablet Only */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[999] lg:hidden cursor-pointer"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
        data-testid="sidebar-drawer"
        className={`fixed left-0 top-0 h-[100dvh] w-[264px] bg-[#060d1b]/95 backdrop-blur-2xl border-r border-white/15 p-3.5 flex flex-col min-h-0 z-[1000] text-white shadow-[12px_0_48px_rgba(0,0,0,0.75)] transition-transform duration-300 ease-in-out ${
          isCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Top specular highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

        {/* Close Button (Mobile / Drawer Collapse) */}
        <button
          onClick={() => setIsCollapsed(true)}
          className="lg:hidden absolute right-3 top-3 p-2 min-h-[40px] min-w-[40px] bg-white/5 hover:bg-white/15 border border-white/10 transition-colors rounded-xl text-[#D97706] flex items-center justify-center cursor-pointer"
          aria-label="Close Sidebar"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pr-10 lg:pr-0 overflow-hidden whitespace-nowrap shrink-0">
          <div className="min-w-[36px] h-9 bg-gradient-to-br from-[#064E3B] via-emerald-500 to-cyan-500 border border-[#D97706]/80 rounded-xl flex items-center justify-center font-black text-xs text-white flex-shrink-0 shadow-[0_0_18px_rgba(16,185,129,0.4)]">
            OHS
          </div>
          <div className="min-w-0">
            <span className="font-black text-base tracking-wide truncate block leading-tight">
              ErgoSafe Reborn
            </span>
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">
              Command Workspace
            </span>
          </div>
        </div>

        <nav data-testid="sidebar-nav" className="flex-1 min-h-0 space-y-1 overflow-y-auto pr-1 scrollbar-thin">
          <span className="text-[9px] font-black text-cyan-300/90 uppercase tracking-widest block mb-1.5 px-2">
            Core System Modules
          </span>
          {navItems.map((item) => {
            const isActive = isTabActive(item.id, activeTab);
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    setIsCollapsed(true);
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 min-h-[38px] rounded-xl transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#064E3B] via-emerald-800/80 to-cyan-900/60 border border-emerald-400/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] font-bold'
                    : 'text-slate-300 border border-transparent hover:bg-white/8 hover:border-white/10 hover:text-white'
                }`}
              >
                <item.icon
                  size={16}
                  className={`flex-shrink-0 ${isActive ? 'text-emerald-300' : 'text-[#D97706]'}`}
                />
                <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                  {item.label}
                </span>
              </button>
            );
          })}

          {isAdmin && (
            <div className="pt-2 border-t border-white/10 mt-2">
              <button
                onClick={() => {
                  setActiveTab('master-admin');
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    setIsCollapsed(true);
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 min-h-[38px] rounded-xl transition-all text-left cursor-pointer ${
                  activeTab === 'master-admin'
                    ? 'cta-gradient-amber text-slate-950 font-black shadow-lg'
                    : 'text-[#D97706] hover:bg-white/8 hover:text-amber-300'
                }`}
              >
                <ShieldAlert size={16} className="flex-shrink-0" />
                <span className="text-[11px] font-bold whitespace-nowrap">
                  Master Admin Portal
                </span>
              </button>
            </div>
          )}
        </nav>

        <div className="mt-3 pt-3 overflow-hidden border-t border-white/10 flex flex-col gap-2 shrink-0">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
            <img
              src="/assets/nelly-male-avatar.png"
              alt="Nelly Advisor Avatar"
              className="w-8 h-8 rounded-full object-cover object-top border border-[#D97706]/60 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest truncate">
                  Active Tenant
                </span>
                <span className="text-[8px] font-mono text-amber-300 shrink-0">
                  en-ZA Luke
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate">{companyName}</p>
              <p className="text-[10px] text-slate-400 truncate">
                {companyId || 'ADMIN'} • {userId || 'usr-sarah'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWorkspaceModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 text-cyan-200 py-2.5 min-h-[40px] rounded-xl font-bold text-xs transition-colors cursor-pointer border border-cyan-400/25"
          >
            <Building2 size={14} className="text-[#D97706]" />
            <span>Switch Workspace / Login</span>
          </button>
        </div>
      </div>
    </>
  );
};
