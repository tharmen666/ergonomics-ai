import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Award, ShieldAlert, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { StatutoryDisclaimerBanner } from '../../components/common/StatutoryDisclaimerBanner';
import { CompetentPersonSignOffModal } from '../../components/compliance/CompetentPersonSignOffModal';

export const NioshCalculator: React.FC = () => {
  // Input parameters
  const [actualWeightKg, setActualWeightKg] = useState<number>(25); // Actual object weight L
  const [horizontalDistanceCm, setHorizontalDistanceCm] = useState<number>(35); // H (25cm to 63cm)
  const [verticalOriginCm, setVerticalOriginCm] = useState<number>(75); // V (0cm to 175cm)
  const [verticalTravelDistanceCm, setVerticalTravelDistanceCm] = useState<number>(50); // D (25cm to 175cm)
  const [asymmetryAngleDeg, setAsymmetryAngleDeg] = useState<number>(15); // A (0° to 135°)
  const [frequencyLiftsPerMin, setFrequencyLiftsPerMin] = useState<number>(4); // F (0.2 to 15)
  const [durationHours, setDurationHours] = useState<'short' | 'moderate' | 'long'>('short'); // <=1h, 1-2h, 2-8h
  const [couplingQuality, setCouplingQuality] = useState<'good' | 'fair' | 'poor'>('fair');

  const [isSignOffOpen, setIsSignOffOpen] = useState(false);

  // Constants
  const LC = 23.0; // Load Constant (23 kg)

  // 1. Horizontal Multiplier HM = 25 / H
  const clampedH = Math.max(25, Math.min(63, horizontalDistanceCm));
  const HM = parseFloat((25 / clampedH).toFixed(3));

  // 2. Vertical Multiplier VM = 1 - (0.003 * |V - 75|)
  const clampedV = Math.max(0, Math.min(175, verticalOriginCm));
  const VM = parseFloat(Math.max(0, 1 - (0.003 * Math.abs(clampedV - 75))).toFixed(3));

  // 3. Distance Multiplier DM = 0.82 + (4.5 / D)
  const clampedD = Math.max(25, Math.min(175, verticalTravelDistanceCm));
  const DM = parseFloat(Math.max(0.70, Math.min(1.0, 0.82 + (4.5 / clampedD))).toFixed(3));

  // 4. Asymmetric Multiplier AM = 1 - (0.0032 * A)
  const clampedA = Math.max(0, Math.min(135, asymmetryAngleDeg));
  const AM = parseFloat(Math.max(0, 1 - (0.0032 * clampedA)).toFixed(3));

  // 5. Frequency Multiplier FM
  const getFM = (freq: number, dur: 'short' | 'moderate' | 'long'): number => {
    if (dur === 'short') { // <= 1 hour
      if (freq <= 0.2) return 1.00;
      if (freq <= 1) return 0.94;
      if (freq <= 4) return 0.84;
      if (freq <= 8) return 0.72;
      if (freq <= 12) return 0.60;
      return 0.45;
    } else if (dur === 'moderate') { // 1 to 2 hours
      if (freq <= 0.2) return 0.95;
      if (freq <= 1) return 0.88;
      if (freq <= 4) return 0.72;
      if (freq <= 8) return 0.58;
      if (freq <= 12) return 0.45;
      return 0.27;
    } else { // 2 to 8 hours
      if (freq <= 0.2) return 0.85;
      if (freq <= 1) return 0.75;
      if (freq <= 4) return 0.55;
      if (freq <= 8) return 0.35;
      return 0.18;
    }
  };

  const FM = getFM(frequencyLiftsPerMin, durationHours);

  // 6. Coupling Multiplier CM
  const getCM = (coupling: 'good' | 'fair' | 'poor', v: number): number => {
    if (coupling === 'good') return 1.00;
    if (coupling === 'fair') return v >= 75 ? 0.95 : 0.95;
    return 0.90;
  };

  const CM = getCM(couplingQuality, clampedV);

  // Recommended Weight Limit RWL
  const RWL = parseFloat((LC * HM * VM * DM * AM * FM * CM).toFixed(2));

  // Lifting Index LI = Actual Weight / RWL
  const LI = RWL > 0 ? parseFloat((actualWeightKg / RWL).toFixed(2)) : 99.9;

  const isStatutoryHeavyBreach = actualWeightKg > 25; // GN R1589 & SA OHS Act 25kg single manual lift ceiling

  const getRiskStatus = (li: number, weight: number) => {
    if (weight > 25) {
      return {
        level: 'CRITICAL STATUTORY BREACH',
        badge: 'Exceeds 25 kg Maximum',
        color: 'text-red-500',
        bg: 'bg-red-500/15 border-red-500/40',
        advice: 'GN R1589 & OHS Act 85 violation: Single manual lift exceeds 25 kg ceiling. Mandatory 2-person team lift or pneumatic hoist required.'
      };
    }
    if (li <= 1.0) {
      return {
        level: 'Nominal / Low Risk',
        badge: 'LI <= 1.0 (Optimal)',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        advice: 'Safe lifting envelope. The load is within recommended ergonomic parameters for standard workforce.'
      };
    }
    if (li <= 2.0) {
      return {
        level: 'Moderate Musculoskeletal Risk',
        badge: '1.0 < LI <= 2.0',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        advice: 'Increased risk of lumbar disc strain. Re-slot origin/destination heights and implement task rotation.'
      };
    }
    if (li <= 3.0) {
      return {
        level: 'High Risk (Priority Action)',
        badge: '2.0 < LI <= 3.0',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10 border-orange-500/30',
        advice: 'Severe lumbar torque. Engineering controls (hydraulic scissor table / conveyors) must be prioritized under GN R1589.'
      };
    }
    return {
      level: 'Extreme Injury Hazard',
      badge: 'LI > 3.0',
      color: 'text-red-400',
      bg: 'bg-red-500/15 border-red-500/40',
      advice: 'Immediate task stoppage. High incidence of acute disc herniation. Complete redesign or automation mandated.'
    };
  };

  const riskInfo = getRiskStatus(LI, actualWeightKg);

  return (
    <div className="space-y-6 text-white font-sans">
      <StatutoryDisclaimerBanner />

      <CompetentPersonSignOffModal
        isOpen={isSignOffOpen}
        onClose={() => setIsSignOffOpen(false)}
        reportTitle="NIOSH Manual Material Handling (MMH) Lifting Audit"
        reportType="NIOSH Lifting Equation (GN R1589 Manual Handling)"
        assessmentData={{
          'Actual Object Weight (L)': `${actualWeightKg} kg`,
          'Recommended Weight Limit (RWL)': `${RWL} kg`,
          'Lifting Index (LI)': `${LI}`,
          'Statutory Evaluation': riskInfo.level,
          'Load Constant (LC)': '23.0 kg',
          'Horizontal Multiplier (HM)': `${HM} (H: ${horizontalDistanceCm}cm)`,
          'Vertical Multiplier (VM)': `${VM} (V: ${verticalOriginCm}cm)`,
          'Distance Multiplier (DM)': `${DM} (D: ${verticalTravelDistanceCm}cm)`,
          'Asymmetric Multiplier (AM)': `${AM} (A: ${asymmetryAngleDeg}°)`,
          'Frequency Multiplier (FM)': `${FM} (${frequencyLiftsPerMin} lifts/min)`,
          'Coupling Multiplier (CM)': `${CM} (${couplingQuality})`,
          'Single Lift >25kg Breach': isStatutoryHeavyBreach ? 'YES (Breach Flagged)' : 'NO'
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-white/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-ohs-orange block mb-1">
            Manual Material Handling Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Scale className="text-ohs-orange" size={24} />
            NIOSH Lifting Equation Calculator
          </h2>
          <p className="text-xs text-gray-400">
            Calculates Recommended Weight Limit (RWL) and Lifting Index (LI) for warehouse sacks, bulk flour, receiving pallets, and parcels.
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
        {/* Form Inputs */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Actual Weight */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-gray-300">
                  Actual Load Weight (L) <span className="text-red-400">*</span>
                </label>
                <span className={`text-sm font-mono font-black ${actualWeightKg > 25 ? 'text-red-400 animate-pulse' : 'text-ohs-orange'}`}>
                  {actualWeightKg} kg
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                step="0.5"
                value={actualWeightKg}
                onChange={(e) => setActualWeightKg(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ohs-orange"
              />
              <div className="flex gap-2">
                {[12.5, 20, 25, 32].map((w) => (
                  <button
                    key={w}
                    onClick={() => setActualWeightKg(w)}
                    className={`flex-1 py-1 text-[10px] rounded-lg border transition-all ${
                      actualWeightKg === w ? 'bg-ohs-orange text-ohs-navy font-bold' : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {w}kg
                  </button>
                ))}
              </div>
              {actualWeightKg > 25 && (
                <p className="text-[10px] text-red-400 font-bold flex items-center gap-1">
                  <AlertTriangle size={12} /> Exceeds GN R1589 25kg single manual lift limit!
                </p>
              )}
            </div>

            {/* Horizontal Distance H */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-gray-300">
                  Horizontal Distance (H)
                </label>
                <span className="text-sm font-mono font-black text-cyan-400">{horizontalDistanceCm} cm</span>
              </div>
              <input
                type="range"
                min="25"
                max="63"
                value={horizontalDistanceCm}
                onChange={(e) => setHorizontalDistanceCm(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <p className="text-[10px] text-gray-400">Distance from midpoint between ankles to hands (25 - 63 cm).</p>
            </div>

            {/* Vertical Origin V */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-gray-300">
                  Vertical Origin Height (V)
                </label>
                <span className="text-sm font-mono font-black text-amber-400">{verticalOriginCm} cm</span>
              </div>
              <input
                type="range"
                min="0"
                max="175"
                value={verticalOriginCm}
                onChange={(e) => setVerticalOriginCm(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <p className="text-[10px] text-gray-400">Height of hands at start of lift. 75 cm is knuckle height (optimal).</p>
            </div>

            {/* Vertical Travel Distance D */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-gray-300">
                  Travel Distance (D)
                </label>
                <span className="text-sm font-mono font-black text-purple-400">{verticalTravelDistanceCm} cm</span>
              </div>
              <input
                type="range"
                min="25"
                max="175"
                value={verticalTravelDistanceCm}
                onChange={(e) => setVerticalTravelDistanceCm(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <p className="text-[10px] text-gray-400">Vertical distance between origin and destination.</p>
            </div>

            {/* Asymmetry Angle A */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-gray-300">
                  Asymmetry Twist Angle (A)
                </label>
                <span className="text-sm font-mono font-black text-pink-400">{asymmetryAngleDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="135"
                step="5"
                value={asymmetryAngleDeg}
                onChange={(e) => setAsymmetryAngleDeg(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
              <p className="text-[10px] text-gray-400">Angular displacement from sagittal plane (torso twist).</p>
            </div>

            {/* Lifting Frequency F */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-gray-300">
                  Frequency (lifts / min)
                </label>
                <span className="text-sm font-mono font-black text-teal-400">{frequencyLiftsPerMin} /min</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="15"
                step="0.5"
                value={frequencyLiftsPerMin}
                onChange={(e) => setFrequencyLiftsPerMin(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <p className="text-[10px] text-gray-400">Average number of lifts per minute.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">Shift Duration Pattern</label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
              >
                <option value="short">Short Duration (≤ 1 hour with recovery)</option>
                <option value="moderate">Moderate Duration (1 to 2 hours)</option>
                <option value="long">Long Duration (2 to 8 hours full shift)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">Coupling / Handhold Quality</label>
              <select
                value={couplingQuality}
                onChange={(e) => setCouplingQuality(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
              >
                <option value="good">Good (Handles or comfortable cutouts)</option>
                <option value="fair">Fair (Handles less than ideal or flat hand)</option>
                <option value="poor">Poor (Bulky, slippery, awkward fingers)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calculated Results Panel */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-ohs-orange block">Output</span>
              <h3 className="text-sm font-black text-white">Lifting Index (LI) & Limits</h3>
            </div>

            {/* Big LI Metric */}
            <div className={`p-5 rounded-2xl border ${riskInfo.bg} text-center space-y-2`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Lifting Index (LI)</span>
              <div className={`text-4xl sm:text-5xl font-black font-mono ${riskInfo.color}`}>
                {LI}
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase border border-current ${riskInfo.color}`}>
                {riskInfo.badge}
              </span>
              <p className="text-xs text-gray-200 font-medium pt-2 leading-relaxed">
                {riskInfo.advice}
              </p>
            </div>

            {/* Recommended Weight Limit (RWL) */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                Recommended Weight Limit (RWL)
              </span>
              <span className="text-2xl font-black font-mono text-emerald-400">{RWL} kg</span>
              <p className="text-[10px] text-gray-400">
                Formula: LC(23kg) × HM({HM}) × VM({VM}) × DM({DM}) × AM({AM}) × FM({FM}) × CM({CM})
              </p>
            </div>

            {/* Individual Multiplier Table */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
              <div className="p-1.5 bg-black/40 rounded border border-white/5">
                <span className="text-gray-400 block">HM</span>
                <span className="font-bold text-white">{HM}</span>
              </div>
              <div className="p-1.5 bg-black/40 rounded border border-white/5">
                <span className="text-gray-400 block">VM</span>
                <span className="font-bold text-white">{VM}</span>
              </div>
              <div className="p-1.5 bg-black/40 rounded border border-white/5">
                <span className="text-gray-400 block">DM</span>
                <span className="font-bold text-white">{DM}</span>
              </div>
              <div className="p-1.5 bg-black/40 rounded border border-white/5">
                <span className="text-gray-400 block">AM</span>
                <span className="font-bold text-white">{AM}</span>
              </div>
              <div className="p-1.5 bg-black/40 rounded border border-white/5">
                <span className="text-gray-400 block">FM</span>
                <span className="font-bold text-white">{FM}</span>
              </div>
              <div className="p-1.5 bg-black/40 rounded border border-white/5">
                <span className="text-gray-400 block">CM</span>
                <span className="font-bold text-white">{CM}</span>
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

export default NioshCalculator;
