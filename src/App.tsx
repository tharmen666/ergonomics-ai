import { useState, useEffect, lazy, Suspense } from 'react';
import { Layout } from './components/layout/Layout';
import { NellyAvatar } from './components/nelly/NellyAvatar';
import { PrivacyHandshake } from './assets/Privacy-Shield/PrivacyHandshake';
import { CognitiveHandshake } from './components/AI-Coach/CognitiveHandshake';
import { TenantLogin } from './components/auth/TenantLogin';
import { useTenantStore } from './store/tenantStore';
import { useNellyStore } from './store/nellyStore';
import { AnimatePresence, motion } from 'framer-motion';

import { TourManager } from './components/agent/TourManager';
import { GEAROverlay } from './components/ui/GEAROverlay';
import { BBSCorrectiveActionOverlay } from './components/agent/BBSCorrectiveActionOverlay';
import { ErgoMicroPrompt } from './components/callcenter/ErgoMicroPrompt';

// Dynamic React.lazy Code-Splitting for all feature pages
const LivePostureTelemetry = lazy(() => import('./features/posture/LivePostureTelemetry').then(m => ({ default: m.LivePostureTelemetry })));
const ExecutiveBriefing = lazy(() => import('./features/dashboard/ExecutiveBriefing').then(m => ({ default: m.ExecutiveBriefing })));
const GEARDashboardPage = lazy(() => import('./features/dashboard/GEARDashboardPage').then(m => ({ default: m.GEARDashboardPage })));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const TrainingPage = lazy(() => import('./features/training/TrainingPage').then(m => ({ default: m.TrainingPage })));
const ChecklistPage = lazy(() => import('./features/checklist/ChecklistPage').then(m => ({ default: m.ChecklistPage })));
const RiskPage = lazy(() => import('./features/risk/RiskPage').then(m => ({ default: m.RiskPage })));
const TeamPage = lazy(() => import('./features/team/TeamPage').then(m => ({ default: m.TeamPage })));
const SelfAssessmentPage = lazy(() => import('./features/assessment/SelfAssessmentPage').then(m => ({ default: m.SelfAssessmentPage })));
const RiskyBehaviorsPage = lazy(() => import('./features/risk/RiskyBehaviorsPage').then(m => ({ default: m.RiskyBehaviorsPage })));
const AdminPortal = lazy(() => import('./features/admin/AdminPortal').then(m => ({ default: m.AdminPortal })));
const MasterAdminPortal = lazy(() => import('./features/admin/MasterAdminPortal').then(m => ({ default: m.MasterAdminPortal })));
const HRDashboard = lazy(() => import('./features/hr/HRDashboard').then(m => ({ default: m.HRDashboard })));
const HQTechnicalDemo = lazy(() => import('./features/demo/HQTechnicalDemo').then(m => ({ default: m.HQTechnicalDemo })));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ReportsPage = lazy(() => import('./features/reports/ReportsPage').then(m => ({ default: m.ReportsPage })));
const InvoicePage = lazy(() => import('./features/invoices/InvoicePage').then(m => ({ default: m.InvoicePage })));
const CompanionHub = lazy(() => import('./components/CompanionHub').then(m => ({ default: m.CompanionHub })));
const SmartBreakTimer = lazy(() => import('./components/SmartBreakTimer').then(m => ({ default: m.SmartBreakTimer })));
const SOPGenerator = lazy(() => import('./components/SOPGenerator').then(m => ({ default: m.SOPGenerator })));

function renderTabContent(activeTab: string) {
  switch (activeTab) {
    case 'executive':
    case 'stewardship':
      return <ExecutiveBriefing />;
    case 'telemetry':
    case 'gear':
      return <GEARDashboardPage />;
    case 'cognitive-handshake':
    case 'handshake':
    case 'ergonomics-handshake':
      return <CognitiveHandshake isInlinePage={true} />;
    case 'nelly':
    case 'posture':
      return <RiskyBehaviorsPage />;
    case 'hr':
    case 'hr-dashboard':
    case 'hr-compliance':
    case 'compliance':
      return <HRDashboard />;
    case 'companion-hub':
    case 'ground-zero':
      return <CompanionHub />;
    case 'smart-breaks':
      return <SmartBreakTimer />;
    case 'sop-generator':
      return <SOPGenerator />;
    case 'training':
      return <TrainingPage />;
    case 'assessment':
    case 'workspaces':
    case 'calculators':
      return <SelfAssessmentPage />;
    case 'kiosk':
    case 'checklist':
    case 'daily-checklist':
      return <ChecklistPage />;
    case 'risks':
    case 'risky-behaviors':
    case 'risk':
      return <RiskPage />;
    case 'invoices':
    case 'invoice':
      return <InvoicePage />;
    case 'reports':
    case 'analytics':
    case 'audit-logs':
    case 'regulatory-logs':
      return <ReportsPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'settings':
      return <SettingsPage />;
    case 'team':
      return <TeamPage />;
    case 'admin':
      return <AdminPortal />;
    case 'master-admin':
      return <MasterAdminPortal />;
    default:
      return <ExecutiveBriefing />;
  }
}

function App() {
  const { companyId, isAdmin, userId } = useTenantStore();
  const [activeTab, setActiveTab] = useState('executive');
  const { isLiveTelemetryOpen, setIsLiveTelemetryOpen } = useNellyStore();

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLiveTelemetryOpen) {
        setIsLiveTelemetryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLiveTelemetryOpen, setIsLiveTelemetryOpen]);

  if (!companyId && !isAdmin) {
    return <TenantLogin onSuccess={() => setActiveTab('executive')} />;
  }

  if (activeTab === 'tenant-portal') {
    return <TenantLogin onSuccess={() => setActiveTab('executive')} />;
  }

  if (activeTab === 'demo') {
    return (
      <Suspense fallback={<div className="p-8 text-center text-ohs-orange font-mono">Loading Demo...</div>}>
        <HQTechnicalDemo onExit={() => setActiveTab('executive')} />
      </Suspense>
    );
  }

  return (
    <div className="w-full max-w-full min-h-screen overflow-x-hidden bg-ohs-navy text-white font-sans flex flex-col box-border">
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <PrivacyHandshake />
        <CognitiveHandshake />
        <TourManager setActiveTab={setActiveTab} />

        <NellyAvatar />
        <GEAROverlay />
        <BBSCorrectiveActionOverlay />
        
        {/* Isolated to Oredax Pilot Tenant; never loads hardcoded across other tenants */}
        {companyId === 'COMP-ODX-01' && (
          <ErgoMicroPrompt currentUser={userId || 'ODX-AGT-01'} />
        )}

        {/* Global Live Posture Telemetry Modal (Instant 1-Click Launch from Any Screen) */}
        <AnimatePresence>
          {isLiveTelemetryOpen && (
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
              onClick={() => setIsLiveTelemetryOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-950/95 border-2 border-emerald-500/50 rounded-3xl shadow-[0_0_80px_rgba(16,185,129,0.3)] overflow-hidden"
              >
                {/* Modal Top Bar */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-slate-900/95 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-3.5 h-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base md:text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
                        AI Posture Wingman <span className="text-emerald-400">— Live Edge Telemetry</span>
                      </h2>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                        Real-Time MediaPipe Vision • GN R1589 & POPIA Compliant • Zero Cloud Uploads
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsLiveTelemetryOpen(false)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 border border-white/20 hover:border-red-500/40 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer"
                    title="Exit Live Posture Monitor"
                  >
                    <span>✕ Exit Monitor</span>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-3 sm:p-6 overflow-y-auto flex-1">
                  <Suspense fallback={
                    <div className="p-12 text-center text-emerald-400 font-mono text-sm flex items-center justify-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Initializing Edge Vision Engine...</span>
                    </div>
                  }>
                    <LivePostureTelemetry autoStart={true} onClose={() => setIsLiveTelemetryOpen(false)} />
                  </Suspense>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-full min-h-screen flex flex-col flex-1 overflow-x-hidden">
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center p-12 text-slate-400 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ohs-orange animate-ping" />
                <span>Loading Module...</span>
              </div>
            </div>
          }>
            {renderTabContent(activeTab)}
          </Suspense>
        </div>
      </Layout>
    </div>
  );
}

export default App;
