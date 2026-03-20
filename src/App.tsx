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

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isWingmanActive, setWingmanActive } = useMellyStore();

  if (activeTab === 'demo') {
    return <TechnicalDemo onExit={() => setActiveTab('dashboard')} />;
  }

  return (
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
          <div className="hidden lg:flex flex-col items-end gap-2 text-right">
            <div className="flex gap-3">
              <button
                onClick={() => setWingmanActive(!isWingmanActive)}
                className={`inline-flex items-center gap-2 ${isWingmanActive ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'} text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md`}
              >
                {isWingmanActive ? 'DISABLE WINGMAN' : 'ACTIVATE WINGMAN'}
              </button>
              <button
                onClick={() => setActiveTab('executive')}
                className="inline-flex items-center gap-2 bg-ohs-orange/20 hover:bg-ohs-orange/30 border border-ohs-orange/50 text-ohs-orange px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(249,168,37,0.2)]"
              >
                EXECUTIVE BRIEFING
              </button>
              <button
                onClick={() => setActiveTab('demo')}
                className="inline-flex items-center gap-2 bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-6 py-2.5 rounded-xl font-black text-sm transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(249,168,37,0.3)]"
              >
                150s HQ DEMO
              </button>
            </div>
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

      {/* Route Content */}
      <main className="min-h-screen pb-24 md:pb-0 pt-0 md:pt-4">
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
  );
}

export default App;
