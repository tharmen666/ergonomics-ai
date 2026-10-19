import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { StatutoryDisclaimerBanner } from '../../components/common/StatutoryDisclaimerBanner';
import { CompetentPersonSignOffModal } from '../../components/compliance/CompetentPersonSignOffModal';

export const RulaCalculator: React.FC = () => {
  // Group A: Arm & Wrist Posture
  const [upperArm, setUpperArm] = useState<number>(2); // 1: -20 to 20, 2: 20-45, 3: 45-90, 4: >90
  const [shoulderRaised, setShoulderRaised] = useState<boolean>(false); // +1
  const [armAbducted, setArmAbducted] = useState<boolean>(false); // +1
  const [lowerArm, setLowerArm] = useState<number>(1); // 1: 60-100, 2: <60 or >100
  const [lowerArmMidline, setLowerArmMidline] = useState<boolean>(false); // +1 across midline
  const [wrist, setWrist] = useState<number>(2); // 1: neutral, 2: 0-15 flex/ext, 3: >15
  const [wristDeviated, setWristDeviated] = useState<boolean>(false); // +1 radial/ulnar
  const [wristTwist, setWristTwist] = useState<number>(1); // 1: mid-range, 2: near end of range
  const [armMuscleUse, setArmMuscleUse] = useState<boolean>(true); // +1 posture static or repeated >4x/min
  const [armForce, setArmForce] = useState<number>(1); // 0: <2kg, 1: 2-10kg interm, 2: 2-10kg static, 3: >10kg

  // Group B: Neck, Trunk, Legs
  const [neck, setNeck] = useState<number>(2); // 1: 0-10, 2: 10-20, 3: >20, 4: extension
  const [neckTwisted, setNeckTwisted] = useState<boolean>(false); // +1
  const [trunk, setTrunk] = useState<number>(2); // 1: 0-10, 2: 10-20, 3: 20-60, 4: >60
  const [trunkTwisted, setTrunkTwisted] = useState<boolean>(false); // +1
  const [legsSupported, setLegsSupported] = useState<boolean>(true); // 1: well supported, 2: not
  const [neckMuscleUse, setNeckMuscleUse] = useState<boolean>(false); // +1
  const [neckForce, setNeckForce] = useState<number>(1); // 0-3

  const [isSignOffOpen, setIsSignOffOpen] = useState(false);

  // Computations
  const finalUpperArm = Math.min(6, upperArm + (shoulderRaised ? 1 : 0) + (armAbducted ? 1 : 0));
  const finalLowerArm = Math.min(3, lowerArm + (lowerArmMidline ? 1 : 0));
  const finalWrist = Math.min(4, wrist + (wristDeviated ? 1 : 0));
  const finalWristTwist = wristTwist;

  // Table A simulation: Upper arm, lower arm, wrist, twist
  const rawTableA = Math.min(8, Math.max(1, Math.round(finalUpperArm * 0.9 + finalLowerArm * 0.8 + finalWrist * 0.7 + finalWristTwist * 0.5)));
  const wristArmScore = Math.min(8, rawTableA + (armMuscleUse ? 1 : 0) + armForce);

  const finalNeck = Math.min(6, neck + (neckTwisted ? 1 : 0));
  const finalTrunk = Math.min(6, trunk + (trunkTwisted ? 1 : 0));
  const finalLegs = legsSupported ? 1 : 2;

  // Table B simulation: Neck, trunk, legs
  const rawTableB = Math.min(7, Math.max(1, Math.round(finalNeck * 0.8 + finalTrunk * 0.8 + finalLegs * 0.6)));
  const neckTrunkLegScore = Math.min(7, rawTableB + (neckMuscleUse ? 1 : 0) + neckForce);

  // Table C simulation: Wrist/Arm vs Neck/Trunk/Leg
  const computeTableC = (wa: number, ntl: number) => {
    const raw = Math.round((wa * 0.55) + (ntl * 0.55));
    return Math.min(7, Math.max(1, raw));
  };

  const finalRulaScore = computeTableC(wristArmScore, neckTrunkLegScore);

  const getRulaAction = (score: number) => {
    if (score <= 2) return { level: 1, text: 'Acceptable Posture', action: 'Posture is acceptable if not maintained or repeated for long periods', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score <= 4) return { level: 2, text: 'Further Investigation Needed', action: 'Further investigation is needed and changes may be required', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' };
    if (score <= 6) return { level: 3, text: 'Investigation & Change Required Soon', action: 'Investigation and changes are required soon to prevent upper limb disorders', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { level: 4, text: 'Immediate Ergonomic Change Required', action: 'Investigate and implement change immediately under GN R1589', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
  };

  const actionInfo = getRulaAction(finalRulaScore);

  return (
    <div className="space-y-6 text-white font-sans">
      <StatutoryDisclaimerBanner />

      <CompetentPersonSignOffModal
        isOpen={isSignOffOpen}
        onClose={() => setIsSignOffOpen(false)}
        reportTitle="Rapid Upper Limb Assessment (RULA) Screening"
        reportType="RULA (GN R1589 Upper Limb Biomechanical Audit)"
        assessmentData={{
          'Final RULA Score': `${finalRulaScore} / 7`,
          'Action Category': actionInfo.text,
          'Prescribed Remedy': actionInfo.action,
          'Wrist & Arm Score': wristArmScore,
          'Neck, Trunk & Leg Score': neckTrunkLegScore,
          'Upper Arm Flexion/Elevation': `${finalUpperArm}`,
          'Lower Arm & Midline': `${finalLowerArm}`,
          'Wrist & Deviation': `${finalWrist}`,
          'Wrist Twist': `${finalWristTwist}`,
          'Neck Posture': `${finalNeck} (Twist: ${neckTwisted ? 'Yes' : 'No'})`,
          'Trunk Posture': `${finalTrunk} (Twist: ${trunkTwisted ? 'Yes' : 'No'})`,
          'Arm Force Category': armForce
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-white/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-ohs-orange block mb-1">
            Upper Limb Assessment
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Activity className="text-ohs-orange" size={24} />
            RULA: Rapid Upper Limb Assessment
          </h2>
          <p className="text-xs text-gray-400">
            Assesses postural load on neck, trunk, shoulders, arms, and wrists (ideal for cashier tills, butcher knife grip, and VDU typing).
          </p>
        </div>

        <button
          onClick={() => setIsSignOffOpen(true)}
          className="px-5 py-2.5 bg-ohs-orange hover:bg-yellow-400 text-ohs-navy rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Award size={16} /> Sign-Off & Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Arm & Wrist Analysis */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="border-b border-white/10 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">Arm & Wrist</span>
            <h3 className="text-sm font-black text-white">Shoulder, Arm & Wrist Posture</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Upper Arm Position</span>
              <span className="text-ohs-orange font-mono">+{upperArm}</span>
            </label>
            <select
              value={upperArm}
              onChange={(e) => setUpperArm(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: 20° ext to 20° flex (neutral)</option>
              <option value={2}>2: 20° to 45° flexion</option>
              <option value={3}>3: 45° to 90° flexion</option>
              <option value={4}>4: &gt;90° flexion (overhead)</option>
            </select>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-1.5 text-[11px] text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shoulderRaised}
                  onChange={(e) => setShoulderRaised(e.target.checked)}
                  className="w-3.5 h-3.5 text-ohs-orange rounded"
                />
                <span>Shoulder raised (+1)</span>
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={armAbducted}
                  onChange={(e) => setArmAbducted(e.target.checked)}
                  className="w-3.5 h-3.5 text-ohs-orange rounded"
                />
                <span>Arm abducted (+1)</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Lower Arm Position</span>
              <span className="text-ohs-orange font-mono">+{lowerArm}</span>
            </label>
            <select
              value={lowerArm}
              onChange={(e) => setLowerArm(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: 60° to 100° flexion</option>
              <option value={2}>2: &lt;60° or &gt;100° flexion</option>
            </select>
            <label className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={lowerArmMidline}
                onChange={(e) => setLowerArmMidline(e.target.checked)}
                className="w-3.5 h-3.5 text-ohs-orange rounded"
              />
              <span>Working across midline or out to side (+1)</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Wrist Position & Twist</span>
              <span className="text-ohs-orange font-mono">+{wrist}</span>
            </label>
            <select
              value={wrist}
              onChange={(e) => setWrist(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: Neutral</option>
              <option value={2}>2: 0° to 15° flexion or extension</option>
              <option value={3}>3: &gt;15° flexion or extension</option>
            </select>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <label className="flex items-center gap-1.5 text-[11px] text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wristDeviated}
                  onChange={(e) => setWristDeviated(e.target.checked)}
                  className="w-3.5 h-3.5 text-ohs-orange rounded"
                />
                <span>Wrist bent away from midline (+1)</span>
              </label>
              <select
                value={wristTwist}
                onChange={(e) => setWristTwist(Number(e.target.value))}
                className="bg-slate-950 border border-white/15 rounded-lg px-2 py-1 text-[11px] text-white"
              >
                <option value={1}>Twist: Mid-range (1)</option>
                <option value={2}>Twist: At end range (2)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Muscle Use & Load Force</span>
              <span className="text-ohs-orange font-mono">+{armForce}</span>
            </label>
            <select
              value={armForce}
              onChange={(e) => setArmForce(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={0}>0: &lt; 2 kg intermittent load</option>
              <option value={1}>1: 2 kg to 10 kg intermittent load</option>
              <option value={2}>2: 2 kg to 10 kg static or repetitive load</option>
              <option value={3}>3: &gt; 10 kg or shock force</option>
            </select>
            <label className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={armMuscleUse}
                onChange={(e) => setArmMuscleUse(e.target.checked)}
                className="w-3.5 h-3.5 text-ohs-orange rounded"
              />
              <span>Posture static &gt;1 min or repeated &gt;4x/min (+1)</span>
            </label>
          </div>
        </div>

        {/* Neck, Trunk & Leg Analysis */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="border-b border-white/10 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 block">Neck & Trunk</span>
            <h3 className="text-sm font-black text-white">Axial Spine & Stance</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Neck Flexion / Extension</span>
              <span className="text-ohs-orange font-mono">+{neck}</span>
            </label>
            <select
              value={neck}
              onChange={(e) => setNeck(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: 0° to 10° flexion</option>
              <option value={2}>2: 10° to 20° flexion</option>
              <option value={3}>3: &gt;20° flexion</option>
              <option value={4}>4: In extension (looking up)</option>
            </select>
            <label className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={neckTwisted}
                onChange={(e) => setNeckTwisted(e.target.checked)}
                className="w-3.5 h-3.5 text-ohs-orange rounded"
              />
              <span>Neck twisted or side-bending (+1)</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Trunk Flexion</span>
              <span className="text-ohs-orange font-mono">+{trunk}</span>
            </label>
            <select
              value={trunk}
              onChange={(e) => setTrunk(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: 0° to 10° (neutral upright)</option>
              <option value={2}>2: 10° to 20° flexion</option>
              <option value={3}>3: 20° to 60° flexion</option>
              <option value={4}>4: &gt;60° flexion</option>
            </select>
            <label className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={trunkTwisted}
                onChange={(e) => setTrunkTwisted(e.target.checked)}
                className="w-3.5 h-3.5 text-ohs-orange rounded"
              />
              <span>Trunk twisted or side-bending (+1)</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Legs Stance Support</label>
            <select
              value={legsSupported ? 1 : 2}
              onChange={(e) => setLegsSupported(e.target.value === '1')}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
            >
              <option value={1}>1: Legs and feet are well supported & balanced</option>
              <option value={2}>2: Legs not supported / uneven weight distribution</option>
            </select>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-gray-300">Spine Muscle Use & Load</label>
            <label className="flex items-center gap-1.5 text-[11px] text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={neckMuscleUse}
                onChange={(e) => setNeckMuscleUse(e.target.checked)}
                className="w-3.5 h-3.5 text-ohs-orange rounded"
              />
              <span>Trunk/neck held static &gt;1 min or repeated &gt;4x/min (+1)</span>
            </label>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-ohs-orange block">Results</span>
              <h3 className="text-sm font-black text-white">RULA Action Level</h3>
            </div>

            <div className={`p-5 rounded-2xl border ${actionInfo.bg} text-center space-y-2`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total RULA Score</span>
              <div className={`text-4xl sm:text-5xl font-black font-mono ${actionInfo.color}`}>
                {finalRulaScore} <span className="text-lg text-gray-500 font-normal">/ 7</span>
              </div>
              <div className={`text-xs font-black uppercase tracking-wider ${actionInfo.color}`}>
                Action Level {actionInfo.level}: {actionInfo.text}
              </div>
              <p className="text-xs text-gray-200 font-medium pt-1">
                {actionInfo.action}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-gray-400 uppercase block">Wrist & Arm Score</span>
                <span className="text-sm font-bold text-white">{wristArmScore}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-gray-400 uppercase block">Neck/Trunk/Leg Score</span>
                <span className="text-sm font-bold text-white">{neckTrunkLegScore}</span>
              </div>
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

export default RulaCalculator;
