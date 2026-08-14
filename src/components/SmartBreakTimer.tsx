import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, Activity, Footprints, Flame, CheckCircle, Play, Pause, RotateCcw, 
  X, AlertCircle, ArrowRight, ShieldCheck, Heart, Sparkles, Volume2, Bell 
} from 'lucide-react';
import { speak } from '../utils/speech';

interface StretchStep {
  title: string;
  durationSec: number;
  instruction: string;
  icon: string;
}

const STRETCHES_90MIN: StretchStep[] = [
  {
    title: "Gentle Neck & Shoulder Rolls",
    durationSec: 60,
    instruction: "Slowly tilt your head right, hold 5s, then roll left. Perform 5 continuous shoulder rolls backwards.",
    icon: "🧘"
  },
  {
    title: "Wrist & Forearm Flexor Release",
    durationSec: 60,
    instruction: "Extend your right arm forward, pull fingers back gently with left hand. Switch sides after 30 seconds.",
    icon: "🖐️"
  },
  {
    title: "20-20-20 Eye Focus & Spinal Extension",
    durationSec: 60,
    instruction: "Look at an object 20 feet away for 20 seconds. Interlock fingers behind back, chest open, deep breath.",
    icon: "👀"
  }
];

const MOBILITY_4HR: StretchStep[] = [
  {
    title: "Hydrated Brisk Walk",
    durationSec: 240,
    instruction: "Stand up immediately, pour a 250ml glass of water, and walk continuously around your workspace.",
    icon: "🚶"
  },
  {
    title: "Standing Hip Flexor & Hamstring Stretch",
    durationSec: 180,
    instruction: "Place one foot back, press hips forward to open flexors. Switch sides, then lean down for hamstrings.",
    icon: "🦵"
  },
  {
    title: "Deep Diaphragmatic Breath & Posture Reset",
    durationSec: 180,
    instruction: "Inhale for 4 seconds into stomach, hold for 4, exhale slowly for 6. Reset neutral lumbar alignment.",
    icon: "🫁"
  }
];

export const SmartBreakTimer: React.FC = () => {
  // Global timers
  const [secondsUntil90Min, setSecondsUntil90Min] = useState<number>(90 * 60);
  const [secondsUntil4Hr, setSecondsUntil4Hr] = useState<number>(240 * 60);

  // Break modal states
  const [activeModal, setActiveModal] = useState<'90min' | '4hr' | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState<number>(0);
  const [isBreakPaused, setIsBreakPaused] = useState<boolean>(false);

  // Gamification stats
  const [breakStreak, setBreakStreak] = useState<number>(7);
  const [totalBreaksCompleted, setTotalBreaksCompleted] = useState<number>(24);
  const [complianceScore, setComplianceScore] = useState<number>(96);

  // Ticking global timers
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsUntil90Min(prev => (prev > 0 ? prev - 1 : 90 * 60));
      setSecondsUntil4Hr(prev => (prev > 0 ? prev - 1 : 240 * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ticking active break step countdown
  useEffect(() => {
    if (!activeModal || isBreakPaused) return;

    const timer = setInterval(() => {
      setStepSecondsLeft(prev => {
        if (prev > 1) return prev - 1;

        // Step completed, move to next or finish
        const steps = activeModal === '90min' ? STRETCHES_90MIN : MOBILITY_4HR;
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(c => c + 1);
          return steps[currentStepIndex + 1].durationSec;
        } else {
          // Break finished!
          completeBreak();
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeModal, isBreakPaused, currentStepIndex]);

  const playChimeSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio chime unavailable', e);
    }
  };

  const startBreak = (type: '90min' | '4hr') => {
    playChimeSound();
    setActiveModal(type);
    setCurrentStepIndex(0);
    const steps = type === '90min' ? STRETCHES_90MIN : MOBILITY_4HR;
    setStepSecondsLeft(steps[0].durationSec);
    setIsBreakPaused(false);
    speak(`Starting ${type === '90min' ? '90-minute desk micro-stretch' : '4-hour dynamic walk'}. ${steps[0].instruction}`);
  };

  const completeBreak = () => {
    playChimeSound();
    setActiveModal(null);
    setBreakStreak(s => s + 1);
    setTotalBreaksCompleted(b => b + 1);
    setComplianceScore(c => Math.min(100, c + 2));

    if (activeModal === '90min') setSecondsUntil90Min(90 * 60);
    if (activeModal === '4hr') setSecondsUntil4Hr(240 * 60);
  };

  const formatMinSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSteps = activeModal === '90min' ? STRETCHES_90MIN : MOBILITY_4HR;
  const currentStep = currentSteps[currentStepIndex] || currentSteps[0];

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-ohs-navy to-slate-900 p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Timer size={24} />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                Smart Break & <span className="text-cyan-400">Mobility Engine</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              Automated OHS ergonomics engine featuring 90-minute desk nudges (3-min stretches) and 4-hour dynamic mobility walk guides to eliminate postural strain and burnout.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => startBreak('90min')}
              className="bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              <Activity size={16} /> Simulate 90-Min Nudge
            </button>
            <button
              onClick={() => startBreak('4hr')}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              <Footprints size={16} /> Simulate 4-Hr Walk
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next 90-Min Nudge */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Next 90-Min Nudge</span>
            <span className="p-2 bg-ohs-orange/20 text-ohs-orange rounded-xl"><Activity size={18} /></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {formatMinSec(secondsUntil90Min)}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">3-min guided neck & shoulder rolls</p>
        </div>

        {/* Next 4-Hour Walk */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Next 4-Hour Walk</span>
            <span className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl"><Footprints size={18} /></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {formatMinSec(secondsUntil4Hr)}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">10-min hydration & mobility walk</p>
        </div>

        {/* Break Streak */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Break Streak</span>
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl"><Flame size={18} /></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            {breakStreak} <span className="text-xs text-emerald-400 font-semibold">Days Streak</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">{totalBreaksCompleted} total breaks logged</p>
        </div>

        {/* OHS Score */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ergo Compliance</span>
            <span className="p-2 bg-purple-500/20 text-purple-400 rounded-xl"><ShieldCheck size={18} /></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            {complianceScore}% <span className="text-xs text-purple-400 font-semibold">Optimal</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">OHS Section 8 standard compliant</p>
        </div>
      </div>

      {/* Interactive Stretch Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 90-Min Routine Card */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-ohs-orange/20 border border-ohs-orange/30 text-ohs-orange rounded-xl">
                <Activity size={20} />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white uppercase">90-Minute Desk Nudge Protocol</h3>
                <p className="text-xs text-gray-400">3-Minute Rapid Micro-Stretch</p>
              </div>
            </div>
            <button
              onClick={() => startBreak('90min')}
              className="bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Start 3-Min Session
            </button>
          </div>

          <div className="space-y-3">
            {STRETCHES_90MIN.map((s, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">{s.title}</p>
                    <span className="text-[10px] font-mono text-ohs-orange bg-ohs-orange/10 px-2 py-0.5 rounded-full">{s.durationSec}s</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{s.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Hour Mobility Card */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl">
                <Footprints size={20} />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white uppercase">4-Hour Dynamic Walk Protocol</h3>
                <p className="text-xs text-gray-400">10-Minute Walk & Spinal Reset</p>
              </div>
            </div>
            <button
              onClick={() => startBreak('4hr')}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Start 10-Min Session
            </button>
          </div>

          <div className="space-y-3">
            {MOBILITY_4HR.map((s, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">{s.title}</p>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">{Math.floor(s.durationSec / 60)} min</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{s.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Screen Interactive Break Nudge Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-ohs-orange via-cyan-400 to-emerald-400" />

              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentStep.icon}</span>
                  <div>
                    <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block">
                      {activeModal === '90min' ? '90-Min Desk Micro-Nudge' : '4-Hour Dynamic Walk Break'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">{currentStep.title}</h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Step Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-300 font-semibold">
                  <span>Step {currentStepIndex + 1} of {currentSteps.length}</span>
                  <span className="font-mono text-ohs-orange">{formatMinSec(stepSecondsLeft)}</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-ohs-orange to-cyan-400 rounded-full"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(stepSecondsLeft / currentStep.durationSec) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </div>
              </div>

              {/* Instruction Display */}
              <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-5 text-center space-y-3">
                <p className="text-sm sm:text-base font-semibold text-gray-100 leading-relaxed">
                  "{currentStep.instruction}"
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck size={14} /> Guided by Nelly OHS Safety Engine
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setIsBreakPaused(!isBreakPaused)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isBreakPaused ? <><Play size={16} /> Resume</> : <><Pause size={16} /> Pause</>}
                </button>

                <button
                  onClick={() => {
                    if (currentStepIndex < currentSteps.length - 1) {
                      setCurrentStepIndex(c => c + 1);
                      setStepSecondsLeft(currentSteps[currentStepIndex + 1].durationSec);
                    } else {
                      completeBreak();
                    }
                  }}
                  className="flex-1 py-3 bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy font-black rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartBreakTimer;
