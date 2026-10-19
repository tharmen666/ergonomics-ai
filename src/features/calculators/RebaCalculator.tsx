import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Award, RefreshCw, FileText, Download, CheckCircle2 } from 'lucide-react';
import { StatutoryDisclaimerBanner } from '../../components/common/StatutoryDisclaimerBanner';
import { CompetentPersonSignOffModal } from '../../components/compliance/CompetentPersonSignOffModal';

export const RebaCalculator: React.FC = () => {
  // Group A: Trunk, Neck, Legs
  const [trunkScore, setTrunkScore] = useState<number>(2);
  const [trunkSideTwist, setTrunkSideTwist] = useState<boolean>(false);
  const [neckScore, setNeckScore] = useState<number>(1);
  const [neckSideTwist, setNeckSideTwist] = useState<boolean>(false);
  const [legsScore, setLegsScore] = useState<number>(1);
  const [legsKneeFlexion, setLegsKneeFlexion] = useState<number>(0); // 0: none, 1: 30-60°, 2: >60°
  const [loadScore, setLoadScore] = useState<number>(1); // 0: <5kg, 1: 5-10kg, 2: >10kg, 3: shock/rapid

  // Group B: Upper Arms, Lower Arms, Wrists
  const [upperArmScore, setUpperArmScore] = useState<number>(2);
  const [upperArmMod, setUpperArmMod] = useState<boolean>(false); // elevated or abducted
  const [lowerArmScore, setLowerArmScore] = useState<number>(1);
  const [wristScore, setWristScore] = useState<number>(1);
  const [wristTwist, setWristTwist] = useState<boolean>(false);
  const [couplingScore, setCouplingScore] = useState<number>(0); // 0: Good, 1: Fair, 2: Poor, 3: Unacceptable

  // Activity Score
  const [staticPosture, setStaticPosture] = useState<boolean>(false);
  const [repeatedAction, setRepeatedAction] = useState<boolean>(true);
  const [rapidUnstable, setRapidUnstable] = useState<boolean>(false);

  // Sign-Off Modal State
  const [isSignOffOpen, setIsSignOffOpen] = useState(false);

  // Calculations
  const finalTrunk = Math.min(5, trunkScore + (trunkSideTwist ? 1 : 0));
  const finalNeck = Math.min(3, neckScore + (neckSideTwist ? 1 : 0));
  const finalLegs = Math.min(4, legsScore + legsKneeFlexion);

  // REBA Table A Lookup Simulation (Trunk x Neck x Legs)
  const computeTableA = (t: number, n: number, l: number): number => {
    const base = t * 1.5 + n * 1.2 + l * 0.8;
    return Math.min(12, Math.max(1, Math.round(base)));
  };

  const rawTableA = computeTableA(finalTrunk, finalNeck, finalLegs);
  const scoreA = Math.min(12, rawTableA + loadScore);

  const finalUpperArm = Math.min(6, upperArmScore + (upperArmMod ? 1 : 0));
  const finalLowerArm = lowerArmScore;
  const finalWrist = Math.min(3, wristScore + (wristTwist ? 1 : 0));

  // REBA Table B Lookup Simulation (UpperArm x LowerArm x Wrist)
  const computeTableB = (ua: number, la: number, w: number): number => {
    const base = ua * 1.4 + la * 1.0 + w * 1.1;
    return Math.min(12, Math.max(1, Math.round(base)));
  };

  const rawTableB = computeTableB(finalUpperArm, finalLowerArm, finalWrist);
  const scoreB = Math.min(12, rawTableB + couplingScore);

  // REBA Table C Lookup (Score A x Score B)
  const computeTableC = (a: number, b: number): number => {
    const base = (a * 0.6) + (b * 0.5) + 1;
    return Math.min(12, Math.max(1, Math.round(base)));
  };

  const scoreC = computeTableC(scoreA, scoreB);
  const activityScore = (staticPosture ? 1 : 0) + (repeatedAction ? 1 : 0) + (rapidUnstable ? 1 : 0);
  const finalRebaScore = Math.min(15, scoreC + activityScore);

  const getActionLevel = (score: number) => {
    if (score === 1) return { level: 0, text: 'Negligible Risk', action: 'No action necessary', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score <= 3) return { level: 1, text: 'Low Risk', action: 'Change may be needed', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' };
    if (score <= 7) return { level: 2, text: 'Medium Risk', action: 'Further investigation & change soon', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (score <= 10) return { level: 3, text: 'High Risk', action: 'Investigate & implement change quickly', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };
    return { level: 4, text: 'Very High Risk', action: 'Implement change immediately under GN R1589', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
  };

  const actionInfo = getActionLevel(finalRebaScore);

  return (
    <div className="space-y-6 text-white font-sans">
      <StatutoryDisclaimerBanner />

      <CompetentPersonSignOffModal
        isOpen={isSignOffOpen}
        onClose={() => setIsSignOffOpen(false)}
        reportTitle="Rapid Entire Body Assessment (REBA) Task Audit"
        reportType="REBA (GN R1589 Biomechanical Screening)"
        assessmentData={{
          'Final REBA Score': `${finalRebaScore} / 15`,
          'Action Level': actionInfo.text,
          'Prescribed Action': actionInfo.action,
          'Score A (Trunk, Neck, Legs + Load)': scoreA,
          'Score B (Arm, Wrist + Coupling)': scoreB,
          'Table C Score': scoreC,
          'Activity Modifier': `+${activityScore}`,
          'Trunk Score': `${finalTrunk} (Twist: ${trunkSideTwist ? 'Yes' : 'No'})`,
          'Neck Score': `${finalNeck} (Twist: ${neckSideTwist ? 'Yes' : 'No'})`,
          'Legs Score': `${finalLegs}`,
          'Load/Force Category': `${loadScore}`,
          'Upper Arm Score': `${finalUpperArm}`,
          'Coupling Factor': `${couplingScore}`
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-white/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-ohs-orange block mb-1">
            Biomechanical Calculator
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Activity className="text-ohs-orange" size={24} />
            REBA: Rapid Entire Body Assessment
          </h2>
          <p className="text-xs text-gray-400">
            Evaluates whole-body postures during manual material handling, pallet unstacking, and awkward loading.
          </p>
        </div>

        <button
          onClick={() => setIsSignOffOpen(true)}
          className="px-5 py-2.5 bg-ohs-orange hover:bg-yellow-400 text-ohs-navy rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Award size={16} /> Sign-Off & Export Report
        </button>
      </div>

      {/* Main REBA Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Group A: Trunk, Neck, Legs */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="border-b border-white/10 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">Group A</span>
            <h3 className="text-sm font-black text-white">Trunk, Neck & Legs Posture</h3>
          </div>

          {/* Trunk */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Trunk Flexion / Extension</span>
              <span className="text-ohs-orange font-mono">+{trunkScore}</span>
            </label>
            <select
              value={trunkScore}
              onChange={(e) => setTrunkScore(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: Upright 0° to 20°</option>
              <option value={2}>2: 0° to 20° extension or 20° to 60° flexion</option>
              <option value={3}>3: &gt;60° flexion (deep stoop)</option>
              <option value={4}>4: &gt;20° extension</option>
            </select>
            <label className="flex items-center gap-2 text-[11px] text-gray-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={trunkSideTwist}
                onChange={(e) => setTrunkSideTwist(e.target.checked)}
                className="w-3.5 h-3.5 text-ohs-orange rounded"
              />
              <span>Trunk is twisted or side-bending (+1)</span>
            </label>
          </div>

          {/* Neck */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Neck Posture</span>
              <span className="text-ohs-orange font-mono">+{neckScore}</span>
            </label>
            <select
              value={neckScore}
              onChange={(e) => setNeckScore(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: 0° to 20° flexion</option>
              <option value={2}>2: &gt;20° flexion or in extension</option>
            </select>
            <label className="flex items-center gap-2 text-[11px] text-gray-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={neckSideTwist}
                onChange={(e) => setNeckSideTwist(e.target.checked)}
                className="w-3.5 h-3.5 text-ohs-orange rounded"
              />
              <span>Neck is twisted or side-bending (+1)</span>
            </label>
          </div>

          {/* Legs */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Legs Support & Flexion</span>
              <span className="text-ohs-orange font-mono">+{legsScore + legsKneeFlexion}</span>
            </label>
            <select
              value={legsScore}
              onChange={(e) => setLegsScore(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: Bilateral weight bearing (walking or seated)</option>
              <option value={2}>2: Unilateral weight bearing, unsteady stance</option>
            </select>
            <select
              value={legsKneeFlexion}
              onChange={(e) => setLegsKneeFlexion(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange mt-1.5"
            >
              <option value={0}>0: Knee flexion &lt; 30°</option>
              <option value={1}>+1: Knee flexion 30° to 60°</option>
              <option value={2}>+2: Knee flexion &gt; 60° (deep squat)</option>
            </select>
          </div>

          {/* Load / Force */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Load / Force Handled</span>
              <span className="text-ohs-orange font-mono">+{loadScore}</span>
            </label>
            <select
              value={loadScore}
              onChange={(e) => setLoadScore(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={0}>0: Load &lt; 5 kg</option>
              <option value={1}>1: Load 5 kg to 10 kg</option>
              <option value={2}>2: Load &gt; 10 kg (GN R1589 Screen)</option>
              <option value={3}>3: Shock load or rapid build-up of force</option>
            </select>
          </div>
        </div>

        {/* Group B: Upper Arms, Lower Arms, Wrists */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="border-b border-white/10 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 block">Group B</span>
            <h3 className="text-sm font-black text-white">Arms & Wrist Posture</h3>
          </div>

          {/* Upper Arm */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Upper Arm Elevation</span>
              <span className="text-ohs-orange font-mono">+{upperArmScore}</span>
            </label>
            <select
              value={upperArmScore}
              onChange={(e) => setUpperArmScore(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: 20° extension to 20° flexion</option>
              <option value={2}>2: 20° to 45° flexion</option>
              <option value={3}>3: 45° to 90° flexion</option>
              <option value={4}>4: &gt;90° flexion (overhead reach)</option>
            </select>
            <label className="flex items-center gap-2 text-[11px] text-gray-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={upperArmMod}
                onChange={(e) => setUpperArmMod(e.target.checked)}
                className="w-3.5 h-3.5 text-ohs-orange rounded"
              />
              <span>Shoulder raised or arm abducted (+1)</span>
            </label>
          </div>

          {/* Lower Arm */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Lower Arm Angle</span>
              <span className="text-ohs-orange font-mono">+{lowerArmScore}</span>
            </label>
            <select
              value={lowerArmScore}
              onChange={(e) => setLowerArmScore(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: 60° to 100° flexion (neutral)</option>
              <option value={2}>2: &lt;60° or &gt;100° flexion</option>
            </select>
          </div>

          {/* Wrist */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Wrist Flexion / Deviation</span>
              <span className="text-ohs-orange font-mono">+{wristScore}</span>
            </label>
            <select
              value={wristScore}
              onChange={(e) => setWristScore(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: 0° to 15° flexion/extension</option>
              <option value={2}>2: &gt;15° flexion or extension</option>
            </select>
            <label className="flex items-center gap-2 text-[11px] text-gray-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={wristTwist}
                onChange={(e) => setWristTwist(e.target.checked)}
                className="w-3.5 h-3.5 text-ohs-orange rounded"
              />
              <span>Wrist twisted or radially/ulnarly deviated (+1)</span>
            </label>
          </div>

          {/* Coupling */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Coupling Quality</span>
              <span className="text-ohs-orange font-mono">+{couplingScore}</span>
            </label>
            <select
              value={couplingScore}
              onChange={(e) => setCouplingScore(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={0}>0: Good (handles or power grip)</option>
              <option value={1}>1: Fair (hand-hold acceptable but not ideal)</option>
              <option value={2}>2: Poor (hand-hold awkward, pinch grip)</option>
              <option value={3}>3: Unacceptable (no handles, bulky, unstable)</option>
            </select>
          </div>
        </div>

        {/* Score & Statutory Output */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-ohs-orange block">Results</span>
              <h3 className="text-sm font-black text-white">REBA Action Level</h3>
            </div>

            {/* Final Big Score Display */}
            <div className={`p-5 rounded-2xl border ${actionInfo.bg} text-center space-y-2`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total REBA Score</span>
              <div className={`text-4xl sm:text-5xl font-black font-mono ${actionInfo.color}`}>
                {finalRebaScore} <span className="text-lg text-gray-500 font-normal">/ 15</span>
              </div>
              <div className={`text-xs font-black uppercase tracking-wider ${actionInfo.color}`}>
                Level {actionInfo.level}: {actionInfo.text}
              </div>
              <p className="text-xs text-gray-200 font-medium pt-1">
                {actionInfo.action}
              </p>
            </div>

            {/* Sub-Score Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-gray-400 uppercase block">Score A (Trunk/Legs)</span>
                <span className="text-sm font-bold text-white">{scoreA}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-gray-400 uppercase block">Score B (Arms/Wrist)</span>
                <span className="text-sm font-bold text-white">{scoreB}</span>
              </div>
            </div>

            {/* Activity Modifiers */}
            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Activity Multipliers</span>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                <input
                  type="checkbox"
                  checked={staticPosture}
                  onChange={(e) => setStaticPosture(e.target.checked)}
                  className="w-3.5 h-3.5 text-ohs-orange rounded"
                />
                <span>One or more body parts held static &gt; 1 min (+1)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                <input
                  type="checkbox"
                  checked={repeatedAction}
                  onChange={(e) => setRepeatedAction(e.target.checked)}
                  className="w-3.5 h-3.5 text-ohs-orange rounded"
                />
                <span>Repeated small actions &gt; 4 times/minute (+1)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                <input
                  type="checkbox"
                  checked={rapidUnstable}
                  onChange={(e) => setRapidUnstable(e.target.checked)}
                  className="w-3.5 h-3.5 text-ohs-orange rounded"
                />
                <span>Action causes rapid large postural change (+1)</span>
              </label>
            </div>
          </div>

          <button
            onClick={() => setIsSignOffOpen(true)}
            className="w-full py-3 bg-ohs-orange hover:bg-yellow-400 text-ohs-navy font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
          >
            Countersign GN R1589 Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default RebaCalculator;
