import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Scale, Flame } from 'lucide-react';
import { RebaCalculator } from './RebaCalculator';
import { RulaCalculator } from './RulaCalculator';
import { NioshCalculator } from './NioshCalculator';
import { WbgtCalculator } from './WbgtCalculator';

export type CalculatorTab = 'reba' | 'rula' | 'niosh' | 'wbgt';

const VALID_CALCULATORS: CalculatorTab[] = ['reba', 'rula', 'niosh', 'wbgt'];

interface BiomechanicalCalculatorsSuiteProps {
  initialTab?: CalculatorTab;
}

export const BiomechanicalCalculatorsSuite: React.FC<BiomechanicalCalculatorsSuiteProps> = ({ 
  initialTab = 'reba' 
}) => {
  const safeInitial: CalculatorTab = VALID_CALCULATORS.includes(initialTab) ? initialTab : 'reba';
  const [activeTab, setActiveTab] = useState<CalculatorTab>(safeInitial);

  useEffect(() => {
    setActiveTab(VALID_CALCULATORS.includes(initialTab) ? initialTab : 'reba');
  }, [initialTab]);

  const safeTab: CalculatorTab = VALID_CALCULATORS.includes(activeTab) ? activeTab : 'reba';

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
              safeTab === tab.id
                ? 'bg-ohs-orange text-ohs-navy border-ohs-orange shadow-lg shadow-ohs-orange/20 font-black'
                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black uppercase tracking-wider">{tab.label}</span>
              <tab.icon size={16} />
            </div>
            <p className={`text-[10px] leading-tight ${safeTab === tab.id ? 'text-ohs-navy/80 font-bold' : 'text-gray-400'}`}>
              {tab.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Render Selected Calculator */}
      <motion.div
        key={safeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {safeTab === 'reba' && <RebaCalculator />}
        {safeTab === 'rula' && <RulaCalculator />}
        {safeTab === 'niosh' && <NioshCalculator />}
        {safeTab === 'wbgt' && <WbgtCalculator />}
      </motion.div>
    </div>
  );
};

export default BiomechanicalCalculatorsSuite;
