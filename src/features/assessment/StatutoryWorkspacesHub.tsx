import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Building2, 
  Fuel, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  ChevronRight, 
  Layers, 
  Activity, 
  Scale, 
  Flame, 
  FileCheck,
  ShieldCheck,
  Timer,
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { StatutoryDisclaimerBanner } from '../../components/common/StatutoryDisclaimerBanner';
import { CompetentPersonSignOffModal } from '../../components/compliance/CompetentPersonSignOffModal';
import { BiomechanicalCalculatorsSuite, CalculatorTab } from '../calculators/BiomechanicalCalculatorsSuite';

export type WorkspaceId = 'retail-wholesale' | 'corporate-callcentre' | 'petroleum-forecourt' | 'biomechanical-calculators';

interface StatutoryWorkspacesHubProps {
  initialWorkspace?: WorkspaceId;
  initialCalculatorTab?: CalculatorTab;
}

export const StatutoryWorkspacesHub: React.FC<StatutoryWorkspacesHubProps> = ({
  initialWorkspace = 'retail-wholesale',
  initialCalculatorTab = 'reba'
}) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceId>(initialWorkspace);
  const [activeTaskTemplate, setActiveTaskTemplate] = useState<string>('butchery');
  const [isSignOffOpen, setIsSignOffOpen] = useState(false);

  // Sign-off modal payload
  const [signOffPayload, setSignOffPayload] = useState<{
    title: string;
    type: string;
    data: Record<string, any>;
  }>({
    title: 'Retail Wholesale Ergonomic Audit',
    type: 'GN R1589 Statutory Assessment',
    data: {}
  });

  // Workspaces Definition
  const workspaces = [
    {
      id: 'retail-wholesale' as WorkspaceId,
      name: 'Retail & Wholesale (Cash & Carry)',
      sector: 'FMCG & Bulk Retail Distribution',
      icon: ShoppingBag,
      statute: 'Ergonomics Regulations 2019 (GN R1589) & GSR 13H/13J',
      badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
      description: 'Pre-configured task assessments for Butchery, Bakery & Deli, Receiving, and Tills/Cashiers.'
    },
    {
      id: 'corporate-callcentre' as WorkspaceId,
      name: 'Corporate & Call Centres',
      sector: 'VDU Workstations & Intensive Contact Centres',
      icon: Building2,
      statute: 'GN R1589 & BCEA Section 15 Regulated Rest Periods',
      badgeColor: 'border-blue-500/30 text-blue-300 bg-blue-500/10',
      description: 'ROSA screen ergonomics, cervical/lumbar postural loads, and RSIP typing strain controls.'
    },
    {
      id: 'petroleum-forecourt' as WorkspaceId,
      name: 'Petroleum Forecourt & Convenience',
      sector: 'Fuel Retail, Forecourt Attendants & Quick-Service',
      icon: Fuel,
      statute: 'SANS 10089 Part 1 & 2 / OHS Act Section 8',
      badgeColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
      description: 'SANS 10089 nozzle trigger handling, dipstick reach, and under-counter safe drops.'
    },
    {
      id: 'biomechanical-calculators' as WorkspaceId,
      name: 'Biomechanical Calculators',
      sector: 'Statutory Screening Tools Suite',
      icon: Calculator,
      statute: 'Standalone REBA, RULA, NIOSH MMH & Thermal WBGT',
      badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
      description: 'Precision ergonomic calculators with action level lookup and countersignature gate.'
    }
  ];

  // Open signoff helper
  const triggerSignOff = (title: string, type: string, data: Record<string, any>) => {
    setSignOffPayload({ title, type, data });
    setIsSignOffOpen(true);
  };

  return (
    <div className="space-y-6 text-white font-sans max-w-full">
      {/* Competent Person Sign-Off Modal */}
      <CompetentPersonSignOffModal
        isOpen={isSignOffOpen}
        onClose={() => setIsSignOffOpen(false)}
        reportTitle={signOffPayload.title}
        reportType={signOffPayload.type}
        assessmentData={signOffPayload.data}
      />

      {/* Main Statutory Disclaimer Banner */}
      <StatutoryDisclaimerBanner />

      {/* Workspace Selector Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-ohs-orange block">
            GN R1589 Core Assessment Workspaces
          </span>
          <span className="text-xs text-gray-400 font-mono">
            Active Workspace: <strong className="text-white uppercase font-bold">{selectedWorkspace.replace('-', ' ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {workspaces.map((ws) => {
            const isSelected = selectedWorkspace === ws.id;
            const Icon = ws.icon;
            return (
              <button
                key={ws.id}
                onClick={() => {
                  setSelectedWorkspace(ws.id);
                  if (ws.id === 'retail-wholesale') setActiveTaskTemplate('butchery');
                  if (ws.id === 'corporate-callcentre') setActiveTaskTemplate('rosa-vdu');
                  if (ws.id === 'petroleum-forecourt') setActiveTaskTemplate('nozzle');
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-ohs-navy via-slate-900 to-black border-ohs-orange shadow-lg shadow-ohs-orange/20 scale-[1.01]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-ohs-orange text-ohs-navy' : 'bg-white/5 text-gray-300'}`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${ws.badgeColor}`}>
                      {ws.sector.split('&')[0]}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white leading-tight">
                    {ws.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">
                    {ws.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 truncate max-w-[170px]">{ws.statute.split('/')[0]}</span>
                  <ChevronRight size={14} className={isSelected ? 'text-ohs-orange' : 'text-gray-500'} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WORKSPACE 1: RETAIL & WHOLESALE (CASH & CARRY) */}
      {/* ========================================================================= */}
      {selectedWorkspace === 'retail-wholesale' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                Sector Workspace: Retail & Wholesale Cash & Carry
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="text-amber-400" size={24} />
                High-Volume Cash & Carry Task Profiles
              </h2>
              <p className="text-xs text-gray-400">
                Statutory risk assessments configured under Ergonomics Regulations 2019 (GN R1589) Reg 6.
              </p>
            </div>

            {/* Task Template Switcher */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'butchery', label: 'Butchery (RULA/Knife)', icon: Activity },
                { id: 'bakery', label: 'Bakery & Deli (NIOSH/WBGT)', icon: Flame },
                { id: 'receiving', label: 'Receiving (REBA/Pallet)', icon: Scale },
                { id: 'tills', label: 'Tills / Cashiers (RULA/Scan)', icon: Layers }
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTaskTemplate(tmpl.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTaskTemplate === tmpl.id
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <tmpl.icon size={14} />
                  <span>{tmpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Template 1: Butchery */}
          {activeTaskTemplate === 'butchery' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                    Task Template: Deboning Block & Meat Portioning
                  </span>
                  <h3 className="text-lg font-black text-white">Butchery Knife Grip & Repetitive Carcass Deboning</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Evaluates sustained power-grip on boning knives (&gt;30 cuts/minute), wrist ulnar deviation, and awkward shoulder elevation while processing beef quarters and mutton sides.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Biomechanical Method</span>
                      <strong className="text-white font-mono">RULA + Tendon Frequency</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Primary Risk</span>
                      <strong className="text-amber-400">Carpal Tunnel & Epicondylitis</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Statute Reference</span>
                      <strong className="text-white">GN R1589 Reg 6 & COIDA Sch 3</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ohs-orange">Prescribed Control Hierarchy</h4>
                  <ul className="text-xs space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Engineering:</strong> Provide textured, ergonomically contoured slip-resistant knife handles and motorized hollow-ground sharpeners maintained daily (logs kept 3 years under Reg 9).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Administrative:</strong> Mandatory 30-minute task rotation between deboning, retail counter service, and tray packaging; micro-stretch resets.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>PPE:</strong> Stainless steel chainmail cut-resistant gloves on non-knife hand, Kevlar forearm guards.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action / Countersign Box */}
              <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-amber-400">Screening Index</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                      RULA Score: 6 / 7
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">Action Level 3: Change Required Soon</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Sustained tendon friction exceeds safe ergonomic threshold. Mandatory OMP medical surveillance referral under Regulation 8(1) recommended.
                  </p>
                </div>

                <button
                  onClick={() => triggerSignOff(
                    'Retail Butchery Knife Grip & Deboning Task Audit',
                    'RULA Butchery Assessment (GN R1589 Reg 6)',
                    {
                      'Task': 'Butchery Carcass Deboning & Portioning',
                      'RULA Score': '6 / 7 (High Action Level 3)',
                      'Repetition Rate': '> 30 forceful cuts per minute',
                      'Hand-Arm Vibration': 'Bandsaw intermittent vibration',
                      'OMP Referral Required': 'Yes (Regulation 8(1) Tendon Strain)',
                      'Control Actions': 'Daily knife sharpening, 30m rotation, chainmail glove'
                    }
                  )}
                  className="w-full py-3 bg-amber-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Countersign Butchery Report
                </button>
              </div>
            </div>
          )}

          {/* Template 2: Bakery & Deli */}
          {activeTaskTemplate === 'bakery' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Task Template: Bakery & Hot Deli Operations
                  </span>
                  <h3 className="text-lg font-black text-white">Flour Bag Handling (NIOSH) & Oven Heat Stress (WBGT)</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Covers manual material handling of 25kg bulk flour/sugar sacks into mixing hoppers coupled with thermal radiant heat exposure from deck ovens.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">NIOSH Lifting Index</span>
                      <strong className="text-orange-400 font-mono">LI = 1.95 (25 kg bag)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">WBGT Thermal Index</span>
                      <strong className="text-amber-400 font-mono">29.4 °C (Oven Front)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Statute Reference</span>
                      <strong className="text-white">GN R1589 & Physical Agents Regs 2024</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ohs-orange">Prescribed Control Hierarchy</h4>
                  <ul className="text-xs space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Engineering:</strong> Install pneumatic scissor hopper lift tables to eliminate ground-to-chest lifting; exhaust heat hoods over ovens.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Work-Rest Regimen:</strong> Enforce 75% work / 25% rest hourly cycle in cool room when WBGT exceeds 28.6 °C for moderate work.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-amber-400">Screening Index</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Dual Hazard Alert
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">Thermal & Lumbar Load</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    25kg sack weight reaches the statutory manual handling ceiling. Recommend team lifting and thermal hydration protocol.
                  </p>
                </div>

                <button
                  onClick={() => triggerSignOff(
                    'Bakery & Hot Deli Combined Ergonomic & Thermal Audit',
                    'NIOSH MMH & Thermal WBGT (GN R1589 & GN 5952)',
                    {
                      'Task': 'Bakery Bulk Sack Mixing & Oven Loading',
                      'Lifting Index (LI)': '1.95 (RWL: 12.8 kg vs Actual: 25.0 kg)',
                      'Effective WBGT': '29.4 °C (Indoor radiant oven heat)',
                      'Permissible Regimen': '75% Work / 25% Rest hourly in cool area',
                      'Single Lift Ceiling': '25.0 kg (At statutory ceiling)',
                      'Hydration Protocol': '500 ml cool fluid per hour'
                    }
                  )}
                  className="w-full py-3 bg-amber-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Countersign Bakery Report
                </button>
              </div>
            </div>
          )}

          {/* Template 3: Receiving */}
          {activeTaskTemplate === 'receiving' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Task Template: Inbound Receiving Dock
                  </span>
                  <h3 className="text-lg font-black text-white">Receiving Pallet Unstacking & Awkward Reaching</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Full-body biomechanical assessment of warehouse freight unstacking from pallets (&gt;1.8m height and &lt;0.3m ground level) with awkward torso rotation.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">REBA Score</span>
                      <strong className="text-red-400 font-mono">REBA = 9 (High Risk)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Housekeeping Standard</span>
                      <strong className="text-white">GSR 13H (Clear 2.25m² Staging)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Statute Reference</span>
                      <strong className="text-white">GN R1589 Reg 6 & DMR 18</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ohs-orange">Prescribed Control Hierarchy</h4>
                  <ul className="text-xs space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Engineering:</strong> Hydraulic turntable pallet positioners to maintain stock in golden zone (knuckle to chest height).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Administrative:</strong> Maximum stack height limits and mandatory team lift for loads &gt;25kg.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-amber-400">Screening Index</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                      REBA Score: 9 / 15
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">Level 3: High Risk (Action Soon)</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Torso twisting with ground-level bending causes high shear forces on L4-L5 vertebrae. Redesign pallet staging.
                  </p>
                </div>

                <button
                  onClick={() => triggerSignOff(
                    'Inbound Receiving Pallet Unstacking Audit',
                    'REBA Whole-Body Assessment (GN R1589 Reg 6)',
                    {
                      'Task': 'Receiving Pallet Unstacking & Heavy Carton Transfer',
                      'REBA Score': '9 / 15 (High Risk Action Level 3)',
                      'Trunk Flexion': '>60° stoop with lateral twist',
                      'Average Carton Weight': '18.5 kg',
                      'Controls Prescribed': 'Hydraulic self-leveling pallet table, team-lift for >25kg',
                      'GSR 13H Compliance': 'Aisle clearway maintained'
                    }
                  )}
                  className="w-full py-3 bg-amber-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Countersign Receiving Report
                </button>
              </div>
            </div>
          )}

          {/* Template 4: Tills / Cashiers */}
          {activeTaskTemplate === 'tills' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Task Template: Front-End Tills & Cashiers
                  </span>
                  <h3 className="text-lg font-black text-white">Standing Cashier Scan Envelopes & Bi-Directional Reach</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Evaluates barcode scanning envelopes, prolonged standing, repetitive wrist flexion/extension, and customer bag transfers over checkout counter.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">RULA Score</span>
                      <strong className="text-amber-400 font-mono">RULA = 5 (Action Level 3)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Posture Factor</span>
                      <strong className="text-white">Prolonged Static Standing</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Statute Reference</span>
                      <strong className="text-white">GN R1589 & BCEA Section 15</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ohs-orange">Prescribed Control Hierarchy</h4>
                  <ul className="text-xs space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Engineering:</strong> Multi-plane bi-optic barcode scanners to eliminate manual item twisting; anti-fatigue polyurethane floor matting.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Administrative:</strong> Sit-stand height-adjustable till stools; 15-minute rotation to restocking or packaging duties.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-amber-400">Screening Index</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      RULA Score: 5 / 7
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">Action Level 3: Investigate Soon</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Repetitive wrist flexion over scanner glass requires adjustment of conveyor belt height and sit-stand stool installation.
                  </p>
                </div>

                <button
                  onClick={() => triggerSignOff(
                    'Front-End Cashier Standing Scan Audit',
                    'RULA Cashier Checkout Assessment (GN R1589)',
                    {
                      'Task': 'Front-End Till Checkout & Scanning',
                      'RULA Score': '5 / 7 (Medium Risk)',
                      'Wrist Deviation': 'Repeated ulnar deviation over flatbed scanner',
                      'Standing Hours': 'Average 6 hours per shift',
                      'Controls Prescribed': 'Anti-fatigue matting, sit-stand stool, bi-optic scanner'
                    }
                  )}
                  className="w-full py-3 bg-amber-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Countersign Cashier Report
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 2: CORPORATE & CALL CENTRES */}
      {/* ========================================================================= */}
      {selectedWorkspace === 'corporate-callcentre' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-1">
                Sector Workspace: Corporate & Call Centres
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Building2 className="text-blue-400" size={24} />
                Intensive VDU Screen & Postural Strain Profiles
              </h2>
              <p className="text-xs text-gray-400">
                Screen ergonomics, spinal lordosis alignment, and micro-break compliance under BCEA Section 15.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'rosa-vdu', label: 'ROSA / Screen Ergonomics', icon: Activity },
                { id: 'cervical-lumbar', label: 'Cervical & Lumbar Posture', icon: Scale },
                { id: 'rsip-typing', label: 'RSIP Typing Strain', icon: Timer }
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTaskTemplate(tmpl.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTaskTemplate === tmpl.id
                      ? 'bg-blue-500 text-white font-black shadow-md'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <tmpl.icon size={14} />
                  <span>{tmpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ROSA / VDU Screen */}
          {activeTaskTemplate === 'rosa-vdu' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                    Task Template: ROSA (Rapid Office Strain Assessment)
                  </span>
                  <h3 className="text-lg font-black text-white">VDU Screen Ergonomics, Line-of-Sight & Chair Fit</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Evaluates chair pan height, seat depth, armrest support, screen viewing distance (50-70cm), and monitor top bezel eye-line alignment.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">ROSA Score</span>
                      <strong className="text-blue-400 font-mono">Score 6 / 10 (Action Required)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">VDU Monitor Height</span>
                      <strong className="text-amber-400 font-mono">12 cm Below Horizontal</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Statute Reference</span>
                      <strong className="text-white">GN R1589 Reg 6 & 7</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ohs-orange">Prescribed Control Hierarchy</h4>
                  <ul className="text-xs space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Engineering:</strong> Supply adjustable gas-spring monitor arms; provide footrests for personnel whose feet do not rest firmly on floor.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Administrative:</strong> Implement BCEA Section 15 regulated 5-minute VDU micro-break intervals after every 60 minutes of intensive screen viewing.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 border-2 border-blue-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-blue-400">ROSA Evaluation</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Score: 6 / 10
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">Action Category: Further Review</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Viewing angle requires elevation to avoid continuous cervical extension and trapezius fatigue.
                  </p>
                </div>

                <button
                  onClick={() => triggerSignOff(
                    'Corporate VDU Screen & ROSA Assessment Audit',
                    'ROSA Screen Ergonomics (GN R1589)',
                    {
                      'Task': 'Corporate VDU Computer Workstation',
                      'ROSA Score': '6 / 10 (Action Required)',
                      'Chair Pan Height': 'Compliant (90° knee flex)',
                      'Screen Distance': '55 cm (Acceptable)',
                      'Monitor Height Line': '12 cm below eye-line (Requires arm mount)',
                      'Rest Regimen': 'BCEA Section 15 Regulated Rest Periods & VDU Micro-Breaks'
                    }
                  )}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Countersign ROSA Report
                </button>
              </div>
            </div>
          )}

          {/* Cervical & Lumbar */}
          {activeTaskTemplate === 'cervical-lumbar' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                    Task Template: Spinal Alignment Telemetry
                  </span>
                  <h3 className="text-lg font-black text-white">Cervical (C1-C7) Load & Lumbar Support Audit</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Analyzes cervical torque load multiplier (forward head posture from 10° up to 45° multiplies head gravitational load from 5kg to 22kg) and lumbar lordosis flattening.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Cervical Forward Tilt</span>
                      <strong className="text-orange-400 font-mono">32° (18 kg effective load)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Pelvic-Spine Angle</span>
                      <strong className="text-amber-400 font-mono">115° (Sacral slumping)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Statute Reference</span>
                      <strong className="text-white">GN R1589 Reg 6</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ohs-orange">Prescribed Control Hierarchy</h4>
                  <ul className="text-xs space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Engineering:</strong> Synchronous tilt mechanism with dynamic lumbar support to maintain the natural S-curve of the spine.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Administrative:</strong> Nelly postural chin-tuck and thoracic extension reminders every 45 minutes.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 border-2 border-blue-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-blue-400">Posture Metric</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      C1-C7 Flexion: 32°
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">Moderate Cervical Strain</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Sustained forward cervical tilt quadruples pressure on intervertebral discs. Correct chair backrest tension.
                  </p>
                </div>

                <button
                  onClick={() => triggerSignOff(
                    'Cervical & Lumbar Postural Biomechanical Audit',
                    'Spinal Telemetry Assessment (GN R1589)',
                    {
                      'Task': 'Contact Centre Call Agent Seated Posture',
                      'Cervical Tilt Angle': '32° forward (Equivalent head weight: 18.2 kg)',
                      'Pelvic-to-Spine Angle': '115° (Sub-optimal lordosis)',
                      'Controls Prescribed': 'Dynamic lumbar support adjustment, chin-tuck resets',
                      'Rest Regimen': 'BCEA Section 15 Regulated Rest Periods & VDU Micro-Breaks'
                    }
                  )}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Countersign Cervical Report
                </button>
              </div>
            </div>
          )}

          {/* RSIP Typing */}
          {activeTaskTemplate === 'rsip-typing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                    Task Template: Repetitive Strain Injury Prevention
                  </span>
                  <h3 className="text-lg font-black text-white">RSIP Typing Strain & Keyboard Envelope Controls</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Evaluates key-strike velocity, wrist extension (&gt;15°), ulnar deviation during numerical entry, and continuous keyboarding without forearm rests.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Wrist Extension</span>
                      <strong className="text-amber-400 font-mono">18° (Target &lt;10°)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Keystrokes / Hour</span>
                      <strong className="text-white font-mono">9,200 keys/hr</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Statute Reference</span>
                      <strong className="text-white">GN R1589 & BCEA Section 15</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ohs-orange">Prescribed Control Hierarchy</h4>
                  <ul className="text-xs space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Engineering:</strong> Provide padded wrist rests and low-profile compact keyboards to prevent outward wrist angling.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>BCEA Mandate:</strong> Enforce BCEA Section 15 Regulated Rest Periods & VDU Micro-Breaks: 20-second ocular & wrist relaxation intervals.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 border-2 border-blue-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-blue-400">RSIP Status</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Moderate Risk
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">Carpal Tunnel Prevention</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Median nerve compression risk detected due to unpadded desk edge contact. Provide gel palm rest.
                  </p>
                </div>

                <button
                  onClick={() => triggerSignOff(
                    'RSIP Typing Strain & Keyboard Audit',
                    'RSIP Keyboard Assessment (GN R1589 & BCEA Sec 15)',
                    {
                      'Task': 'High-Speed Call Centre Keyboarding & Ticket Processing',
                      'Wrist Extension Angle': '18° (Threshold <10°)',
                      'Keystroke Density': '9,200 strokes/hour',
                      'Controls Prescribed': 'Low-profile ergonomic keyboard, gel palm rest',
                      'Rest Regimen': 'BCEA Section 15 Regulated Rest Periods & VDU Micro-Breaks'
                    }
                  )}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Countersign RSIP Report
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 3: PETROLEUM FORECOURT & CONVENIENCE */}
      {/* ========================================================================= */}
      {selectedWorkspace === 'petroleum-forecourt' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1">
                Sector Workspace: Petroleum Forecourt & Convenience
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Fuel className="text-emerald-400" size={24} />
                SANS 10089 Fuel Handling & Forecourt Tasks
              </h2>
              <p className="text-xs text-gray-400">
                Dispensing nozzle trigger strain, underground dipstick reaches, and drop-safe convenience store reaches.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'nozzle', label: 'SANS 10089 Nozzle Grip', icon: Activity },
                { id: 'dipstick', label: 'Dipstick Reach & Flexion', icon: Scale },
                { id: 'safe-drops', label: 'Safe Drops & POS Counter', icon: FileCheck }
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTaskTemplate(tmpl.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTaskTemplate === tmpl.id
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <tmpl.icon size={14} />
                  <span>{tmpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SANS 10089 Nozzle */}
          {activeTaskTemplate === 'nozzle' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                    Task Template: Fuel Dispensing Forecourt
                  </span>
                  <h3 className="text-lg font-black text-white">SANS 10089 Fuel Nozzle Trigger Squeeze & Hose Drag</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Evaluates continuous isometric hand-grip force (40-60N) required to hold fuel dispensing nozzles during high-volume commercial vehicle fills, coupled with heavy rubber hose drag torque.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Trigger Grip Force</span>
                      <strong className="text-amber-400 font-mono">48 N (Sustained Grip)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Hose Drag Weight</span>
                      <strong className="text-white font-mono">6.5 kg per pull</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Standard Reference</span>
                      <strong className="text-white">SANS 10089-1 & GN R1589</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ohs-orange">Prescribed Control Hierarchy</h4>
                  <ul className="text-xs space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Engineering:</strong> Maintain low-friction hose retractor springs and swivel hose couplings (tested quarterly under GMR 2); verify auto-shutoff calibration.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Administrative:</strong> Forecourt rotation: alternate between vehicle fueling islands and forecourt cashier duties every 2 hours.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>PPE:</strong> Fuel-resistant nitrile-coated grip gloves with static earthing compliance.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-emerald-400">Forecourt Index</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      RULA: 5 / 7
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">Forearm Grip Strain</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Sustained trigger squeeze across 80+ fills per shift causes flexor tendon fatigue. Enforce island rotation.
                  </p>
                </div>

                <button
                  onClick={() => triggerSignOff(
                    'SANS 10089 Fuel Dispensing Nozzle Ergonomic Audit',
                    'SANS 10089 Fuel Handling (GN R1589)',
                    {
                      'Task': 'Forecourt Vehicle Fueling & Nozzle Trigger Operation',
                      'Standards': 'SANS 10089 Part 1 & Ergonomics Regulations 2019',
                      'Grip Force Required': '48 N sustained trigger hold',
                      'Average Fills Per Shift': '85 vehicles',
                      'Hose Retractor Status': 'Operational (Swivel coupling verified)',
                      'Controls Prescribed': '2-hour forecourt island rotation, fuel-resistant grip gloves'
                    }
                  )}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Countersign Nozzle Report
                </button>
              </div>
            </div>
          )}

          {/* Dipstick Reach */}
          {activeTaskTemplate === 'dipstick' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                    Task Template: Tank Farm / Manhole Dipping
                  </span>
                  <h3 className="text-lg font-black text-white">Underground Dipstick Reach & Lumbar Flexion</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Manual dipping of underground storage tanks (UST) for daily fuel inventory: deep lumbar forward stooping (&gt;75°) to lift heavy manhole covers and extract 4-metre calibrated brass dipsticks.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">REBA Score</span>
                      <strong className="text-red-400 font-mono">REBA = 8 (High Risk)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Manhole Cover Weight</span>
                      <strong className="text-orange-400 font-mono">22 kg (Manual lever)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Standard Reference</span>
                      <strong className="text-white">SANS 10089-1 & GN R1589</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ohs-orange">Prescribed Control Hierarchy</h4>
                  <ul className="text-xs space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Engineering:</strong> Wheeled manhole cover lifters; promote automatic electronic tank gauging (ATG) consoles to eliminate manual dipping.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Administrative:</strong> Two-person operation for deep tank dipping; upright dipstick wipe-down techniques to prevent lower back twisting.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-emerald-400">Dipping Risk</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                      REBA: 8 / 15
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">Lumbar Stoop Risk</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Deep flexion over UST manhole combined with 4m dipstick withdrawal causes acute spinal torque.
                  </p>
                </div>

                <button
                  onClick={() => triggerSignOff(
                    'Underground Tank Dipstick Reach Ergonomic Audit',
                    'UST Dipstick REBA Screening (SANS 10089 & GN R1589)',
                    {
                      'Task': 'Underground Storage Tank (UST) Daily Fuel Dipping',
                      'REBA Score': '8 / 15 (High Risk Action Level 3)',
                      'Trunk Flexion': '>75° ground level reach',
                      'Dipstick Length': '4.0 metres calibrated brass',
                      'Manhole Cover': '22 kg with mechanical lifting lever',
                      'Controls Prescribed': 'Wheeled manhole lifter, phased transition to electronic ATG'
                    }
                  )}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Countersign Dipstick Report
                </button>
              </div>
            </div>
          )}

          {/* Safe Drops & POS */}
          {activeTaskTemplate === 'safe-drops' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                    Task Template: Forecourt Convenience Store
                  </span>
                  <h3 className="text-lg font-black text-white">Safe Drops & POS Cash Drawer Reach Envelope</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Evaluates awkward bending and twisting under retail service counters to access under-counter cash drop chutes, heavy coin roll transfers, and beverage coolers.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">RULA Score</span>
                      <strong className="text-amber-400 font-mono">Score 5 (Action Level 2)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Drop Chute Height</span>
                      <strong className="text-white font-mono">42 cm (Below knee)</strong>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Standard Reference</span>
                      <strong className="text-white">GN R1589 Reg 6</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ohs-orange">Prescribed Control Hierarchy</h4>
                  <ul className="text-xs space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Engineering:</strong> Elevate drop-safe rotary deposit drum to 85cm knuckle height to eliminate stooped reaches.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange mt-1.5 shrink-0" />
                      <span><strong>Administrative:</strong> Restock beverage cold rooms using gravity-feed rear-loading shelves rather than front reaching.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-emerald-400">Convenience POS</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      RULA: 5 / 7
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">Awkward Counter Reach</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Under-counter rotary safe reach causes lateral lumbar twisting. Elevate safe slot.
                  </p>
                </div>

                <button
                  onClick={() => triggerSignOff(
                    'Convenience Store POS & Safe Drop Audit',
                    'POS Under-Counter RULA (GN R1589)',
                    {
                      'Task': 'Convenience Counter Cash Drop & POS Reach',
                      'RULA Score': '5 / 7 (Medium Risk)',
                      'Drop Slot Location': '42 cm (Below knee level)',
                      'Coin Bag Weight': '14 kg max transfer',
                      'Controls Prescribed': 'Elevate rotary chute to 85cm, gravity feed cooler shelves'
                    }
                  )}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Countersign Safe Drop Report
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 4: BIOMECHANICAL CALCULATORS SUITE */}
      {/* ========================================================================= */}
      {selectedWorkspace === 'biomechanical-calculators' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <BiomechanicalCalculatorsSuite initialTab={initialCalculatorTab} />
        </motion.div>
      )}
    </div>
  );
};

export default StatutoryWorkspacesHub;
