import { useState } from 'react';
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
import { HRDashboard } from './features/admin/HRDashboard';
import { TechnicalDemo } from './features/demo/TechnicalDemo';
import { ExecutiveBriefing } from './features/dashboard/ExecutiveBriefing';
import { PrivacyHandshake } from './assets/Privacy-Shield/PrivacyHandshake';
import { CognitiveHandshake } from './components/AI-Coach/CognitiveHandshake';

import { TourManager } from './components/agent/TourManager';
import { useMellyStore } from './store/mellyStore';
import { GEAROverlay } from './components/ui/GEAROverlay';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isWingmanActive, setWingmanActive } = useMellyStore();

  if (activeTab === 'demo') {
    return <TechnicalDemo onExit={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between overflow-x-hidden w-full safe-area-y">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col p-4 w-full overflow-y-auto">
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          <PrivacyHandshake />
          <CognitiveHandshake />
          <TourManager setActiveTab={setActiveTab} />

          <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                OHS <span className="text-ohs-orange">HAVEN</span>
              </h1>
              <p className="text-gray-400 mt-2 font-medium">
                {activeTab === 'dashboard' ? 'Welcome back, Desigan. Your safety score is 98% today.' :
                  activeTab === 'training' ? 'Boost your wellbeing with these active sessions.' :
                    activeTab === 'shop' ? 'Premium ergonomic gear for your workspace.' :
                      activeTab === 'team' ? 'Meet the intelligence behind OHS Haven.' :
                        activeTab === 'assessment' ? 'Let Melly check your workspace setup.' :
                          activeTab === 'risks' ? 'Identify and MITIGATE common hazards.' :
                            'Manage compliance and operations.'}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="fixed bottom-0 left-0 w-full md:static md:w-auto p-4 md:p-0 grid grid-cols-2 md:flex md:flex-row gap-2 z-50 bg-[#0b0f19]/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t border-white/10 md:border-none safe-area-bottom-nav">
                <button
                  onClick={() => setWingmanActive(!isWingmanActive)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 ${isWingmanActive ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'} text-white px-2 md:px-4 py-3 md:py-2.5 rounded-xl font-bold text-[10px] md:text-sm transition-all shadow-md`}
                >
                  {isWingmanActive ? 'DISABLE WINGMAN' : 'ACTIVATE WINGMAN'}
                </button>
                <button
                  onClick={() => setActiveTab('executive')}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-ohs-orange/20 hover:bg-ohs-orange/30 border border-ohs-orange/50 text-ohs-orange px-2 md:px-4 py-3 md:py-2.5 rounded-xl font-bold text-[10px] md:text-sm transition-all shadow-[0_0_15px_rgba(249,168,37,0.2)]"
                >
                  EXEC BRIEFING
                </button>
                <button
                  onClick={() => setActiveTab('demo')}
                  className="col-span-2 md:col-span-1 inline-flex items-center justify-center gap-2 bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-4 md:px-6 py-3 md:py-2.5 rounded-xl font-black text-[10px] md:text-sm transition-all transform md:hover:scale-105 shadow-[0_0_20px_rgba(249,168,37,0.3)]"
                >
                  150s HQ DEMO
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 hidden md:block">
                  <p className="text-xs text-ohs-orange font-bold uppercase tracking-wider mb-1">Status</p>
                  <p className="text-sm font-medium">All Systems Nominal</p>
                </div>
              </div>
            </div>
          </header>

          <MellyAvatar />
          <GEAROverlay />

          {/* Route Content */}
          <main className="flex-1 pb-20 md:pb-10 pt-0 md:pt-4">
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
            {activeTab === 'admin' && <HRDashboard />}
            {activeTab === 'reports' && <div className="text-center p-20 text-gray-500">Analytics Module - Coming Soon</div>}
            {activeTab === 'settings' && <div className="text-center p-20 text-gray-500">Settings Module - Coming Soon</div>}
          </main>

        </Layout>
      </div>
    </div>
  );
}

export default App;
