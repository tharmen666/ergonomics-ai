import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Layout } from './components/layout/Layout';
import { MellyAvatar } from './components/melly/MellyAvatar';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { TrainingPage } from './features/training/TrainingPage';
import { ChecklistPage } from './features/checklist/ChecklistPage';
import { RiskPage } from './features/risk/RiskPage';
import { TeamPage } from './features/team/TeamPage';
import { ShopPage } from './features/shop/ShopPage';
import { InvoicesPage } from './features/finance/InvoicesPage';

import { SelfAssessmentPage } from './features/assessment/SelfAssessmentPage';
import { RiskyBehaviorsPage } from './features/risks/RiskyBehaviorsPage';
import { AdminPortal } from './features/admin/AdminPortal';
import { HQTechnicalDemo } from './features/demo/HQTechnicalDemo';
import { ExecutiveBriefing } from './features/dashboard/ExecutiveBriefing';
import { PrivacyHandshake } from './assets/Privacy-Shield/PrivacyHandshake';
import { CognitiveHandshake } from './components/AI-Coach/CognitiveHandshake';

import { TourManager } from './components/agent/TourManager';
import { useMellyStore } from './store/mellyStore';
import { GEAROverlay } from './components/ui/GEAROverlay';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isWingmanActive, setWingmanActive, isSidebarCollapsed, setSidebarCollapsed } = useMellyStore();

  if (activeTab === 'demo') {
    return <HQTechnicalDemo onExit={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="w-full min-h-[100svh] overflow-x-hidden bg-ohs-navy text-white font-sans">
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <PrivacyHandshake />
        <CognitiveHandshake />
        <TourManager setActiveTab={setActiveTab} />

        <header className="sticky top-0 z-40 bg-ohs-navy/80 backdrop-blur-md flex items-center justify-between mb-8 gap-4 px-4 md:px-8 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center text-ohs-orange shadow-lg"
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase">
                ERGOSAFE <span className="text-ohs-orange">REBORN</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-xs text-ohs-orange font-bold uppercase tracking-wider mb-1">Status</p>
                <p className="text-sm font-medium">All Systems Nominal</p>
              </div>
            </div>
            
            {/* Action Buttons (Desktop Only in Header) */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setWingmanActive(!isWingmanActive)}
                className={`inline-flex items-center justify-center gap-2 ${isWingmanActive ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'} text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md`}
              >
                {isWingmanActive ? 'DISABLE' : 'ACTIVATE'}
              </button>
              <button
                onClick={() => setActiveTab('executive')}
                className="bg-ohs-orange/20 hover:bg-ohs-orange/30 border border-ohs-orange/50 text-ohs-orange px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
              >
                EXEC BRIEFING
              </button>
              <button
                onClick={() => setActiveTab('demo')}
                className="bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-4 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg"
              >
                150s HQ DEMO
              </button>
            </div>
          </div>
        </header>

        <MellyAvatar />
        <GEAROverlay />

        {/* Route Content */}
        <main className="flex-1 pb-32 md:pb-10 pt-0 md:pt-4">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'executive' && <ExecutiveBriefing />}
          {activeTab === 'training' && <TrainingPage />}
          {activeTab === 'checklist' && <ChecklistPage />}
          {activeTab === 'risk' && <RiskPage />}
          {activeTab === 'team' && <TeamPage />}
          {activeTab === 'shop' && <ShopPage />}
          {activeTab === 'finance' && <InvoicesPage />}
          {activeTab === 'assessment' && <SelfAssessmentPage />}
          {activeTab === 'risks' && <RiskyBehaviorsPage />}
          {activeTab === 'admin' && <AdminPortal />}
          {activeTab === 'reports' && <div className="text-center p-20 text-gray-500">Analytics Module - Coming Soon</div>}
          {activeTab === 'settings' && <div className="text-center p-20 text-gray-500">Settings Module - Coming Soon</div>}
        </main>

      </Layout>
    </div>
  );
}

export default App;
