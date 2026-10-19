import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { StatutoryWorkspacesHub, WorkspaceId } from './StatutoryWorkspacesHub';
import { SelfAssessment } from '../training/SelfAssessment';
import { HomeOfficeSetupGuide } from './HomeOfficeSetupGuide';
import { Activity, Layers, ClipboardCheck, Calculator, Sparkles } from 'lucide-react';
import { CalculatorTab } from '../calculators/BiomechanicalCalculatorsSuite';

const SpineViewer = lazy(() => import('../../components/agent/SpineViewer').then(m => ({ default: m.SpineViewer })));

interface SelfAssessmentPageProps {
  initialView?: 'workspaces' | 'calculators' | '3d' | 'questionnaire';
  initialWorkspace?: WorkspaceId;
  initialCalculatorTab?: CalculatorTab;
}

export const SelfAssessmentPage: React.FC<SelfAssessmentPageProps> = ({
  initialView = 'workspaces',
  initialWorkspace = 'retail-wholesale',
  initialCalculatorTab = 'reba'
}) => {
  const [currentView, setCurrentView] = useState<'workspaces' | 'calculators' | '3d' | 'questionnaire'>(
    initialView === 'calculators' ? 'calculators' : initialView
  );

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto pb-32 space-y-6 sm:space-y-8 font-sans">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 sm:space-y-4 text-center md:text-left"
      >
        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
          <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.25em] bg-ohs-orange/15 px-3 py-1 rounded-full border border-ohs-orange/30">
            Ergonomics Regulations 2019 (GN R1589)
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Section 16.2 Competent Person Review
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ohs-orange via-yellow-300 to-white tracking-tight">
          STATUTORY ERGONOMIC ASSESSMENT SUITE
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-3xl font-medium">
          Deterministic biomechanical screening across Retail & Wholesale (Cash & Carry), Corporate VDU Call Centres, Petroleum Forecourts, and Standalone Calculators (REBA, RULA, NIOSH, WBGT).
        </p>
      </motion.div>

      {/* Top Level Section Switcher */}
      <div className="flex flex-wrap gap-2.5 p-2 bg-slate-900/90 rounded-2xl border border-white/10">
        <button
          onClick={() => setCurrentView('workspaces')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            currentView === 'workspaces'
              ? 'bg-ohs-orange text-ohs-navy shadow-lg shadow-ohs-orange/20 font-black'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Layers size={16} />
          <span>4 Core Workspaces</span>
        </button>

        <button
          onClick={() => setCurrentView('calculators')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            currentView === 'calculators'
              ? 'bg-ohs-orange text-ohs-navy shadow-lg shadow-ohs-orange/20 font-black'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Calculator size={16} />
          <span>Biomechanical Calculators</span>
        </button>

        <button
          onClick={() => setCurrentView('3d')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            currentView === '3d'
              ? 'bg-ohs-orange text-ohs-navy shadow-lg shadow-ohs-orange/20 font-black'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Activity size={16} />
          <span>3D Spine Telemetry</span>
        </button>

        <button
          onClick={() => setCurrentView('questionnaire')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            currentView === 'questionnaire'
              ? 'bg-ohs-orange text-ohs-navy shadow-lg shadow-ohs-orange/20 font-black'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          <ClipboardCheck size={16} />
          <span>WFH Desk Checklist</span>
        </button>
      </div>

      {/* VIEW 1: Core Statutory Workspaces */}
      {currentView === 'workspaces' && (
        <StatutoryWorkspacesHub initialWorkspace={initialWorkspace} />
      )}

      {/* VIEW 2: Biomechanical Calculators Standalone Suite */}
      {currentView === 'calculators' && (
        <StatutoryWorkspacesHub initialWorkspace="biomechanical-calculators" initialCalculatorTab={initialCalculatorTab} />
      )}

      {/* VIEW 3: 3D Spine Telemetry & Home Office Setup Guide */}
      {currentView === '3d' && (
        <div className="space-y-6">
          <HomeOfficeSetupGuide />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 border border-white/10 rounded-2xl sm:rounded-3xl p-4 md:p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-ohs-orange/20 rounded-xl text-ohs-orange border border-ohs-orange/30">
                <Activity size={22} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Interactive 3D Spinal Alignment Telemetry
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  Select posture scenarios to test lumbar, thoracic, and cervical C1-C7 load calculations.
                </p>
              </div>
            </div>

            <div className="w-full h-[400px] md:h-[450px]">
              <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl animate-pulse text-gray-400 gap-2">
                  <Activity className="animate-spin text-ohs-orange" size={24} />
                  <span className="text-xs font-mono uppercase tracking-widest text-ohs-orange">Loading 3D Biomechanical Telemetry Engine...</span>
                </div>
              }>
                <SpineViewer />
              </Suspense>
            </div>
          </motion.div>
        </div>
      )}

      {/* VIEW 4: WFH Desk Questionnaire */}
      {currentView === 'questionnaire' && (
        <SelfAssessment />
      )}
    </div>
  );
};

export default SelfAssessmentPage;
