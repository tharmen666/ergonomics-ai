import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { NellyAvatar } from './components/nelly/NellyAvatar';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { TrainingPage } from './features/training/TrainingPage';
import { ChecklistPage } from './features/checklist/ChecklistPage';
import { RiskPage } from './features/risk/RiskPage';
import { TeamPage } from './features/team/TeamPage';

import { SelfAssessmentPage } from './features/assessment/SelfAssessmentPage';
import { RiskyBehaviorsPage } from './features/risk/RiskyBehaviorsPage';
import { AdminPortal } from './features/admin/AdminPortal';
import { HRDashboard } from './features/hr/HRDashboard';
import { HQTechnicalDemo } from './features/demo/HQTechnicalDemo';
import { ExecutiveBriefing } from './features/dashboard/ExecutiveBriefing';
import { PrivacyHandshake } from './assets/Privacy-Shield/PrivacyHandshake';
import { CognitiveHandshake } from './components/AI-Coach/CognitiveHandshake';
import { SettingsPage } from './features/settings/SettingsPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { TenantLogin } from './components/auth/TenantLogin';
import { MasterAdminPortal } from './features/admin/MasterAdminPortal';
import { useTenantStore } from './store/tenantStore';

import { TourManager } from './components/agent/TourManager';
import { GEAROverlay } from './components/ui/GEAROverlay';
import { GEARDashboardPage } from './features/dashboard/GEARDashboardPage';
import { BBSCorrectiveActionOverlay } from './components/agent/BBSCorrectiveActionOverlay';

import { InvoicePage } from './features/invoices/InvoicePage';
import { CompanionHub } from './components/CompanionHub';
import { SmartBreakTimer } from './components/SmartBreakTimer';
import { SOPGenerator } from './components/SOPGenerator';

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
  const { companyId, isAdmin } = useTenantStore();
  const [activeTab, setActiveTab] = useState('executive');

  if (!companyId && !isAdmin) {
    return <TenantLogin />;
  }

  if (activeTab === 'demo') {
    return <HQTechnicalDemo onExit={() => setActiveTab('executive')} />;
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-ohs-navy text-white font-sans flex flex-col">
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <PrivacyHandshake />
        <CognitiveHandshake />
        <TourManager setActiveTab={setActiveTab} />

        <NellyAvatar />
        <GEAROverlay />
        <BBSCorrectiveActionOverlay />

        <div className="w-full min-h-screen flex flex-col flex-1">
          {renderTabContent(activeTab)}
        </div>
      </Layout>
    </div>
  );
}

export default App;
