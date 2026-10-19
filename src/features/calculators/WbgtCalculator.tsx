import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Award, ShieldAlert, AlertTriangle, Droplets, Wind, Sun, Building } from 'lucide-react';
import { StatutoryDisclaimerBanner } from '../../components/common/StatutoryDisclaimerBanner';
import { CompetentPersonSignOffModal } from '../../components/compliance/CompetentPersonSignOffModal';

export const WbgtCalculator: React.FC = () => {
  // Environmental Sensor / Reading Inputs
  const [environmentMode, setEnvironmentMode] = useState<'indoor' | 'outdoor'>('indoor');
  const [tnwDegC, setTnwDegC] = useState<number>(24.0); // Natural Wet Bulb Temperature
  const [tgDegC, setTgDegC] = useState<number>(32.0); // Globe Temperature (radiation)
  const [tdbDegC, setTdbDegC] = useState<number>(29.0); // Dry Bulb (ambient air temp)
  const [metabolicRate, setMetabolicRate] = useState<'light' | 'moderate' | 'heavy' | 'very_heavy'>('moderate');
  const [clothingAdjustment, setClothingAdjustment] = useState<number>(0); // CAV: 0 normal, +1.5 double layer, +2 coveralls

  const [isSignOffOpen, setIsSignOffOpen] = useState(false);

  // Compute WBGT Index
  // Indoor: 0.7 Tnw + 0.3 Tg
  // Outdoor (direct solar): 0.7 Tnw + 0.2 Tg + 0.1 Tdb
  const baseWbgt = environmentMode === 'indoor'
    ? (0.7 * tnwDegC) + (0.3 * tgDegC)
    : (0.7 * tnwDegC) + (0.2 * tgDegC) + (0.1 * tdbDegC);

  const effectiveWbgt = parseFloat((baseWbgt + clothingAdjustment).toFixed(2));

  // Threshold Limit Values (TLV) under Physical Agents Regulations 2024 / ACGIH standards:
  const getThresholdLimits = (workload: 'light' | 'moderate' | 'heavy' | 'very_heavy') => {
    switch (workload) {
      case 'light': // ~180W (Till cashier, sorting, bench inspect)
        return { continuous: 30.0, work75: 30.6, work50: 31.4, work25: 32.2, label: 'Light Work (~180 W)' };
      case 'moderate': // ~300W (Bakery ovens, deboning, continuous walking/handling)
        return { continuous: 28.0, work75: 28.6, work50: 29.4, work25: 30.5, label: 'Moderate Work (~300 W)' };
      case 'heavy': // ~415W (Heavy pallet unstacking, shovel work)
        return { continuous: 26.0, work75: 26.8, work50: 27.9, work25: 29.0, label: 'Heavy Work (~415 W)' };
      case 'very_heavy': // ~500W (Maximal manual exertion, intense bulk lifting)
        return { continuous: 25.0, work75: 25.7, work50: 26.8, work25: 28.0, label: 'Very Heavy Work (~500 W)' };
    }
  };

  const tlv = getThresholdLimits(metabolicRate);

  // Determine work-rest regimen
  const evaluateRegimen = (wbgt: number, limits: typeof tlv) => {
    if (wbgt <= limits.continuous) {
      return {
        regimen: 'Continuous Work (100% Work / 0% Rest)',
        waterRequirement: '250 ml cool water every 20 minutes',
        riskLevel: 'Nominal Thermal Envelope',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30'
      };
    }
    if (wbgt <= limits.work75) {
      return {
        regimen: '75% Work / 25% Rest each hour in cool area',
        waterRequirement: '500 ml cool electrolyte beverage every hour',
        riskLevel: 'Moderate Thermal Heat Strain',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30'
      };
    }
    if (wbgt <= limits.work50) {
      return {
        regimen: '50% Work / 50% Rest each hour in cool area',
        waterRequirement: '750 ml cool fluid per hour with active misting/fan',
        riskLevel: 'High Heat Stress - Regulatory Work/Rest Mandate',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10 border-orange-500/30'
      };
    }
    if (wbgt <= limits.work25) {
      return {
        regimen: '25% Work / 75% Rest each hour',
        waterRequirement: '1000 ml fluid per hour, physiological pulse monitoring',
        riskLevel: 'Severe Heat Disorder Risk',
        color: 'text-red-400',
        bg: 'bg-red-500/15 border-red-500/40'
      };
    }
    return {
      regimen: 'IMMEDIATE WORK STOPPAGE MANDATE',
      waterRequirement: 'Evacuate to shaded, air-conditioned refuge immediately',
      riskLevel: 'CRITICAL STATUTORY BREACH - Physical Agents Regs 2024',
      color: 'text-red-500',
      bg: 'bg-red-500/20 border-red-500/60'
    };
  };

  const heatStatus = evaluateRegimen(effectiveWbgt, tlv);

  return (
    <div className="space-y-6 text-white font-sans">
      <StatutoryDisclaimerBanner />

      <CompetentPersonSignOffModal
        isOpen={isSignOffOpen}
        onClose={() => setIsSignOffOpen(false)}
        reportTitle="Thermal Heat Stress Assessment (WBGT)"
        reportType="Thermal WBGT Index (Physical Agents Regulations 2024 & GN R1589)"
        assessmentData={{
          'Effective WBGT Index': `${effectiveWbgt} °C`,
          'Raw Calculated WBGT': `${baseWbgt.toFixed(2)} °C`,
          'Environment Mode': environmentMode === 'indoor' ? 'Indoor / Shaded (0.7 Tnw + 0.3 Tg)' : 'Outdoor with Solar (0.7 Tnw + 0.2 Tg + 0.1 Tdb)',
          'Natural Wet Bulb Temp (Tnw)': `${tnwDegC} °C`,
          'Globe Temperature (Tg)': `${tgDegC} °C`,
          'Dry Bulb Air Temp (Tdb)': `${tdbDegC} °C`,
          'Metabolic Workload Category': tlv.label,
          'Clothing Adjustment Value (CAV)': `+${clothingAdjustment} °C`,
          'Permissible Work/Rest Regimen': heatStatus.regimen,
          'Hydration & Control Protocol': heatStatus.waterRequirement,
          'Statutory Risk Classification': heatStatus.riskLevel
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-white/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-ohs-orange block mb-1">
            Physical Agents Regulations, 2024 (GN 5952)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Flame className="text-ohs-orange" size={24} />
            Thermal WBGT Index Calculator
          </h2>
          <p className="text-xs text-gray-400">
            Wet Bulb Globe Temperature calculation for bakery ovens, deli fryers, boiler rooms, and outdoor forecourts.
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
        {/* Environmental Inputs */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
          {/* Environment Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-300">Radiation & Solar Setting</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setEnvironmentMode('indoor')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  environmentMode === 'indoor'
                    ? 'bg-ohs-orange text-ohs-navy border-ohs-orange font-black shadow-md'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Building size={16} />
                <span>Indoor / No Direct Solar</span>
              </button>
              <button
                onClick={() => setEnvironmentMode('outdoor')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  environmentMode === 'outdoor'
                    ? 'bg-ohs-orange text-ohs-navy border-ohs-orange font-black shadow-md'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Sun size={16} />
                <span>Outdoor / Direct Solar Radiation</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-400">
              Formula: {environmentMode === 'indoor' ? 'WBGT = 0.7 Tnw + 0.3 Tg' : 'WBGT = 0.7 Tnw + 0.2 Tg + 0.1 Tdb'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
            {/* Tnw */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                  <Droplets size={14} className="text-cyan-400" /> Wet Bulb (Tnw)
                </label>
                <span className="text-sm font-mono font-black text-cyan-400">{tnwDegC} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="0.5"
                value={tnwDegC}
                onChange={(e) => setTnwDegC(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <p className="text-[10px] text-gray-400">Evaporative cooling potential.</p>
            </div>

            {/* Tg */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                  <Flame size={14} className="text-red-400" /> Globe Temp (Tg)
                </label>
                <span className="text-sm font-mono font-black text-red-400">{tgDegC} °C</span>
              </div>
              <input
                type="range"
                min="15"
                max="65"
                step="0.5"
                value={tgDegC}
                onChange={(e) => setTgDegC(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-400"
              />
              <p className="text-[10px] text-gray-400">Radiant heat (ovens, boilers, direct sun).</p>
            </div>

            {/* Tdb */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                  <Wind size={14} className="text-emerald-400" /> Air Temp (Tdb)
                </label>
                <span className="text-sm font-mono font-black text-emerald-400">{tdbDegC} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="0.5"
                value={tdbDegC}
                onChange={(e) => setTdbDegC(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <p className="text-[10px] text-gray-400">Standard dry-bulb ambient thermometer.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
            {/* Workload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">Metabolic Workload Category</label>
              <select
                value={metabolicRate}
                onChange={(e) => setMetabolicRate(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
              >
                <option value="light">Light Work (~180 W: Cashier, VDU, small tool assembly)</option>
                <option value="moderate">Moderate Work (~300 W: Bakery prep, meat cutting, brisk walk)</option>
                <option value="heavy">Heavy Work (~415 W: Pallet unstacking, loading dock freight)</option>
                <option value="very_heavy">Very Heavy Work (~500 W: Intense bulk sack lifting, furnace)</option>
              </select>
            </div>

            {/* Clothing */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">Clothing Adjustment Factor (CAV)</label>
              <select
                value={clothingAdjustment}
                onChange={(e) => setClothingAdjustment(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ohs-orange"
              >
                <option value={0}>0.0 °C: Standard cotton shirt & trousers</option>
                <option value={1.5}>+1.5 °C: Double-cloth work garments / butcher aprons</option>
                <option value={2.0}>+2.0 °C: Woven polyolefin coveralls</option>
                <option value={3.0}>+3.0 °C: Vapor barrier / impervious PPE (suits)</option>
              </select>
            </div>
          </div>
        </div>

        {/* WBGT Output & Regimen */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-ohs-orange block">Thermal Index</span>
              <h3 className="text-sm font-black text-white">Effective WBGT Index</h3>
            </div>

            <div className={`p-5 rounded-2xl border ${heatStatus.bg} text-center space-y-2`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Calculated WBGT</span>
              <div className={`text-4xl sm:text-5xl font-black font-mono ${heatStatus.color}`}>
                {effectiveWbgt} <span className="text-lg text-gray-400 font-normal">°C</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase border border-current ${heatStatus.color}`}>
                {heatStatus.riskLevel}
              </span>
            </div>

            {/* Mandated Regimen */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block">
                Permissible Work / Rest Regimen
              </span>
              <p className="text-sm font-black text-white">
                {heatStatus.regimen}
              </p>
              <div className="pt-2 border-t border-white/10 flex items-start gap-2 text-xs text-gray-300">
                <Droplets size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Hydration:</strong> {heatStatus.waterRequirement}</span>
              </div>
            </div>

            {/* TLV Benchmark */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] font-mono text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>100% Continuous Threshold:</span>
                <span className="text-white font-bold">{tlv.continuous} °C</span>
              </div>
              <div className="flex justify-between">
                <span>75% Work / 25% Rest:</span>
                <span className="text-white font-bold">{tlv.work75} °C</span>
              </div>
              <div className="flex justify-between">
                <span>50% Work / 50% Rest:</span>
                <span className="text-white font-bold">{tlv.work50} °C</span>
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

export default WbgtCalculator;
