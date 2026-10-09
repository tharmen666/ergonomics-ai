import { useState, lazy, Suspense } from 'react';
import { Layout } from './components/layout/Layout';
import { NellyAvatar } from './components/nelly/NellyAvatar';
import { PrivacyHandshake } from './assets/Privacy-Shield/PrivacyHandshake';
import { CognitiveHandshake } from './components/AI-Coach/CognitiveHandshake';
import { TenantLogin } from './components/auth/TenantLogin';
import { useTenantStore } from './store/tenantStore';

import { TourManager } from './components/agent/TourManager';
import { GEAROverlay } from './components/ui/GEAROverlay';
import { BBSCorrectiveActionOverlay } from './components/agent/BBSCorrectiveActionOverlay';
import { ErgoMicroPrompt } from './components/callcenter/ErgoMicroPrompt';

// Dynamic React.lazy Code-Splitting for all feature pages
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
    case 'fatigue':
    case 'telemetry':
    case 'gear':
    case 'prizm':
    case 'driver-telemetry':
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
