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

function App() {
  const { companyId, isAdmin } = useTenantStore();
  const [activeTab, setActiveTab] = useState(() => isAdmin ? 'master-admin' : 'hr');

  if (!companyId && !isAdmin) {
    return <TenantLogin />;
  }

  if (activeTab === 'demo') {
    return <HQTechnicalDemo onExit={() => setActiveTab('hr')} />;
  }

  return (
    <div className="w-full min-h-[100svh] overflow-x-hidden bg-ohs-navy text-white font-sans">
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <PrivacyHandshake />
        <CognitiveHandshake />
        <TourManager setActiveTab={setActiveTab} />

        <NellyAvatar />
        <GEAROverlay />
        <BBSCorrectiveActionOverlay />

        <main className="flex-1 pb-32 md:pb-10 pt-0 md:pt-4">
          {activeTab === 'hr' && <HRDashboard />}
          {activeTab === 'training' && <TrainingPage />}
          {activeTab === 'assessment' && <SelfAssessmentPage />}
          {activeTab === 'nelly' && <RiskyBehaviorsPage />}
          {(activeTab === 'fatigue' || activeTab === 'gear') && <GEARDashboardPage />}
          {activeTab === 'reports' && <ReportsPage />}

          {/* Additional Utility Views */}
          {activeTab === 'dashboard' && <DashboardPage />}
          {(activeTab === 'kiosk' || activeTab === 'checklist') && <ChecklistPage />}
          {activeTab === 'settings' && <SettingsPage />}
          {activeTab === 'executive' && <ExecutiveBriefing />}
          {activeTab === 'risk' && <RiskPage />}
          {activeTab === 'team' && <TeamPage />}
          {activeTab === 'admin' && <AdminPortal />}
          {activeTab === 'master-admin' && <MasterAdminPortal />}
        </main>
      </Layout>
    </div>
  );
}

export default App;
