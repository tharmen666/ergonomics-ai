import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Scale, Flame, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';
import { RebaCalculator } from './RebaCalculator';
import { RulaCalculator } from './RulaCalculator';
import { NioshCalculator } from './NioshCalculator';
import { WbgtCalculator } from './WbgtCalculator';

export type CalculatorTab = 'reba' | 'rula' | 'niosh' | 'wbgt';

interface BiomechanicalCalculatorsSuiteProps {
  initialTab?: CalculatorTab;
}

export const BiomechanicalCalculatorsSuite: React.FC<BiomechanicalCalculatorsSuiteProps> = ({ 
  initialTab = 'reba' 
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(initialTab);

  const tabs = [
    {
      id: 'reba' as CalculatorTab,
      label: 'REBA',
      title: 'Rapid Entire Body Assessment',
      icon: Activity,
      desc: 'Whole-body posture & pallet unstacking'
    },
    {
      id: 'rula' as CalculatorTab,
      label: 'RULA',
      title: 'Rapid Upper Limb Assessment',
      icon: Activity,
      desc: 'Cashiers, butcher knife grip & VDU arms'
    },
    {
      id: 'niosh' as CalculatorTab,
      label: 'NIOSH MMH',
      title: 'NIOSH Lifting Equation',
      icon: Scale,
      desc: 'RWL, Lifting Index & 25kg bulk limits'
    },
    {
      id: 'wbgt' as CalculatorTab,
      label: 'WBGT Thermal',
      title: 'Wet Bulb Globe Temperature',
      icon: Flame,
      desc: 'Bakery oven heat & Physical Agents Regs'
    }
  ];

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-2 rounded-2xl border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === tab.id
                ? 'bg-ohs-orange text-ohs-navy border-ohs-orange shadow-lg shadow-ohs-orange/20 font-black'
                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black uppercase tracking-wider">{tab.label}</span>
              <tab.icon size={16} />
            </div>
            <p className={`text-[10px] leading-tight ${activeTab === tab.id ? 'text-ohs-navy/80 font-bold' : 'text-gray-400'}`}>
              {tab.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Render Selected Calculator */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'reba' && <RebaCalculator />}
        {activeTab === 'rula' && <RulaCalculator />}
        {activeTab === 'niosh' && <NioshCalculator />}
        {activeTab === 'wbgt' && <WbgtCalculator />}
      </motion.div>
    </div>
  );
};

export default BiomechanicalCalculatorsSuite;
