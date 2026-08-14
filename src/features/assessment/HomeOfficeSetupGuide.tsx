import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, Armchair, Keyboard, CheckCircle, AlertTriangle, ShieldCheck, 
  Sparkles, Info, ChevronRight, Award, Zap, HeartPulse 
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: 'monitor' | 'chair' | 'wrist';
  title: string;
  desc: string;
  weight: number;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'm1',
    category: 'monitor',
    title: 'Monitor Eye-Level Alignment',
    desc: 'The top third of your display is at horizontal eye level, eliminating forward head tilt.',
    weight: 20
  },
  {
    id: 'm2',
    category: 'monitor',
    title: 'Arm’s Length Screen Distance',
    desc: 'Display is positioned 50cm - 70cm (one arm length) away to prevent eye strain.',
    weight: 20
  },
  {
    id: 'c1',
    category: 'chair',
    title: 'Lumbar Spine Backrest Support',
    desc: 'Chair backrest supports the natural lower back curve (L1-L5 lumbar region).',
    weight: 20
  },
  {
    id: 'c2',
    category: 'chair',
    title: '90° Knee Angle & Feet Flat',
    desc: 'Feet rest flat on the floor or footrest with thighs parallel to the ground.',
    weight: 20
  },
  {
    id: 'w1',
    category: 'wrist',
    title: 'Neutral Wrist & Elbow Posture',
    desc: 'Elbows rested at 90-100° with wrists straight while typing and using mouse.',
    weight: 20
  }
];

export const HomeOfficeSetupGuide: React.FC = () => {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({
    m1: true,
    m2: true,
    c1: true,
    c2: false,
    w1: false
  });

  const toggleItem = (id: string) => {
    setCheckedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalScore = CHECKLIST_ITEMS.reduce((sum, item) => {
    return sum + (checkedState[item.id] ? item.weight : 0);
  }, 0);

  const getScoreGrade = (score: number) => {
    if (score >= 90) {
      return {
        label: 'Discovery Gold Standard',
        status: 'Optimal Low Risk',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        desc: 'Your home office matches ISO 45001 & Section 8 ergonomic guidelines.'
      };
    } else if (score >= 60) {
      return {
        label: 'Moderate Ergonomic Risk',
        status: 'Action Recommended',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        desc: 'Minor adjustments needed to prevent lower back and cervical spine fatigue.'
      };
    } else {
      return {
        label: 'High Strain Hazard',
        status: 'Section 37 Breach Vector',
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30',
        desc: 'Suboptimal setup detected. Engage guided break & posture adjustment immediately.'
      };
    }
  };

  const grade = getScoreGrade(totalScore);

  return (
    <div className="w-full space-y-8 my-8">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-ohs-navy via-slate-900 to-ohs-navy p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-ohs-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block mb-1">
              Discovery OHS Corporate Wellness Guide
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              Home Office <span className="text-ohs-orange">Ergonomic Setup & Scoring</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
              Biomechanical visual benchmarks and interactive risk scoring to optimize remote workstations for employee safety and OHS Act Section 8 compliance.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Ergonomic Safety Score</span>
              <span className={`text-2xl font-black ${grade.color}`}>{totalScore}%</span>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${grade.bg}`}>
              <ShieldCheck className={grade.color} size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Vector SVG Ergonomic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Monitor Setup */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-ohs-orange/40 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 bg-ohs-orange/20 border border-ohs-orange/30 text-ohs-orange rounded-xl">
                <Monitor size={22} />
              </span>
              <span className="text-[10px] font-bold text-ohs-orange bg-ohs-orange/10 px-2 py-0.5 rounded-full border border-ohs-orange/20">
                Eye & Neck Protection
              </span>
            </div>

            <h3 className="text-base font-bold text-white">1. Screen Height & Distance</h3>

            {/* SVG Illustration: Monitor Alignment */}
            <div className="w-full h-36 bg-slate-950/80 rounded-xl border border-white/10 p-3 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 200 120" className="w-full h-full text-ohs-orange">
                {/* Desk Line */}
                <line x1="20" y1="100" x2="180" y2="100" stroke="#475569" strokeWidth="3" />
                {/* Monitor Stand */}
                <rect x="140" y="55" width="6" height="45" fill="#94a3b8" />
                <rect x="130" y="97" width="26" height="3" fill="#94a3b8" />
                {/* Screen */}
                <rect x="135" y="25" width="45" height="35" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                {/* User Head */}
                <circle cx="50" cy="40" r="14" fill="#334155" stroke="#f9a825" strokeWidth="2" />
                {/* Torso */}
                <path d="M50 54 L50 95" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                {/* Sightline (Eye Level to Screen Top) */}
                <line x1="64" y1="36" x2="135" y2="30" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="135" cy="30" r="2.5" fill="#10b981" />
                {/* Distance Indicator Arrow */}
                <line x1="64" y1="75" x2="135" y2="75" stroke="#f9a825" strokeWidth="1" strokeDasharray="2 2" />
                <text x="75" y="70" fill="#f9a825" fontSize="8" fontWeight="bold">50 - 70 cm</text>
              </svg>
            </div>

            <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-ohs-orange font-bold">•</span>
                <span>Top of screen aligns with horizontal eye level.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-ohs-orange font-bold">•</span>
                <span>Arm's length distance prevents eye fatigue.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 2: Chair & Lumbar Support */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-cyan-400/40 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl">
                <Armchair size={22} />
              </span>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Spinal Alignment
              </span>
            </div>

            <h3 className="text-base font-bold text-white">2. Chair & Lumbar Support</h3>

            {/* SVG Illustration: Chair & Posture */}
            <div className="w-full h-36 bg-slate-950/80 rounded-xl border border-white/10 p-3 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 200 120" className="w-full h-full text-cyan-400">
                {/* Floor */}
                <line x1="20" y1="105" x2="180" y2="105" stroke="#475569" strokeWidth="2" />
                {/* Chair Seat */}
                <rect x="70" y="65" width="45" height="6" rx="2" fill="#0284c7" />
                {/* Chair Backrest */}
                <path d="M68 25 Q62 45 68 65" stroke="#0284c7" strokeWidth="6" fill="none" strokeLinecap="round" />
                {/* User Spine (Lumbar Curve) */}
                <path d="M85 30 Q78 50 85 65" stroke="#38bdf8" strokeWidth="3" fill="none" />
                {/* Legs (90 Degree Knee) */}
                <path d="M85 65 L115 65 L115 105" stroke="#94a3b8" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* 90 Degree Angle Arc */}
                <path d="M100 65 A 15 15 0 0 1 115 80" stroke="#10b981" strokeWidth="1.5" fill="none" />
                <text x="120" y="78" fill="#10b981" fontSize="9" fontWeight="bold">90°</text>
                {/* Lumbar Support Highlight */}
                <circle cx="70" cy="52" r="6" fill="#f9a825" opacity="0.8" />
              </svg>
            </div>

            <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Active backrest lumbar support engaging L1-L5.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Feet flat on floor with 90° knee flex.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 3: Keyboard & Wrist Ergonomics */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-purple-400/40 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-xl">
                <Keyboard size={22} />
              </span>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                RSI Prevention
              </span>
            </div>

            <h3 className="text-base font-bold text-white">3. Keyboard & Mouse Positioning</h3>

            {/* SVG Illustration: Wrist & Arm Placement */}
            <div className="w-full h-36 bg-slate-950/80 rounded-xl border border-white/10 p-3 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 200 120" className="w-full h-full text-purple-400">
                {/* Desk Surface */}
                <line x1="10" y1="75" x2="190" y2="75" stroke="#475569" strokeWidth="3" />
                {/* Keyboard & Mouse Pad */}
                <rect x="110" y="70" width="35" height="5" rx="1" fill="#a855f7" />
                <rect x="155" y="71" width="12" height="4" rx="2" fill="#c084fc" />
                {/* Upper Arm */}
                <path d="M40 30 L40 65" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                {/* Forearm (Parallel to Desk) */}
                <path d="M40 65 L110 65" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
                {/* Hand / Wrist */}
                <path d="M110 65 L125 70" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                {/* 90-100 Degree Elbow Indicator */}
                <path d="M40 50 A 15 15 0 0 1 55 65" stroke="#10b981" strokeWidth="1.5" fill="none" />
                <text x="48" y="55" fill="#10b981" fontSize="9" fontWeight="bold">90°</text>
                {/* Gel Support Cushion */}
                <ellipse cx="105" cy="73" rx="6" ry="2" fill="#10b981" />
              </svg>
            </div>

            <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span>Forearms parallel to desk with 90° elbow angle.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span>Straight neutral wrists on gel palm support.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Home Office Risk Checklist */}
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black text-ohs-orange uppercase tracking-wider block">
              Interactive Self-Audit Matrix
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Home Office Ergonomic Risk Checklist
            </h3>
          </div>

          {/* Dynamic Score Badge */}
          <div className={`p-4 rounded-2xl border ${grade.bg} flex items-center gap-3`}>
            <div className="text-right">
              <span className="text-[9px] font-black uppercase text-gray-300 block">{grade.label}</span>
              <span className={`text-xs font-extrabold ${grade.color}`}>{grade.status}</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{totalScore}/100</div>
          </div>
        </div>

        {/* Checklist Switch List */}
        <div className="space-y-3">
          {CHECKLIST_ITEMS.map(item => {
            const isChecked = checkedState[item.id] || false;
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start sm:items-center justify-between gap-4 ${
                  isChecked
                    ? 'bg-white/10 border-ohs-orange/50 shadow-md'
                    : 'bg-white/5 border-white/5 opacity-70 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 sm:mt-0 ${
                    isChecked ? 'bg-ohs-orange border-ohs-orange text-ohs-navy' : 'border-gray-500 bg-transparent'
                  }`}>
                    {isChecked && <CheckCircle size={16} strokeWidth={3} />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-gray-300 mt-0.5">{item.desc}</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-ohs-orange bg-ohs-orange/10 px-2.5 py-1 rounded-full border border-ohs-orange/20 flex-shrink-0">
                  +{item.weight} pts
                </span>
              </button>
            );
          })}
        </div>

        {/* Discovery Action Footer */}
        <div className="bg-slate-950/80 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <HeartPulse size={20} />
            </span>
            <div>
              <p className="text-xs font-bold text-white">Discovery Vitality Ergonomic Verification</p>
              <p className="text-[11px] text-gray-400">{grade.desc}</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-bold text-ohs-orange">
            <span>Section 8 Compliance Handshake Validated</span>
            <Sparkles size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeOfficeSetupGuide;
