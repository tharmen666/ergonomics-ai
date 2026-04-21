import { useEffect } from 'react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useMellyStore } from '../../store/mellyStore';

export const LeanPerformanceRail = () => {
    const { fatigueLevel, reactionMemory } = useFatigueStore();
    const { productiveStreak, incrementStreak } = useMellyStore();

    useEffect(() => {
        if (fatigueLevel === 'nominal') {
            const timer = setInterval(() => {
                incrementStreak();
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [fatigueLevel, incrementStreak]);

    // Derived Metrics
    // Scene-based overrides for Demo Mode
    const isDemo = typeof window !== 'undefined' && window.location.pathname.includes('/demo'); // Or check a global state
    // For now, we'll check if fatiguLevel store has a specific 'showcase' flag or just let it be reactive.
    // However, the user wants "show Efficiency Gains".

    let mudaPercent = 0;
    if (fatigueLevel === 'high') mudaPercent = 25;
    else if (fatigueLevel === 'warning') mudaPercent = 15;
    else if (reactionMemory.length > 0) {
        const lastReact = reactionMemory[reactionMemory.length - 1];
        if (lastReact > 600) mudaPercent = Math.min(10, Math.floor((lastReact - 600) / 20));
    }

    let ohe = Math.max(0, 100 - mudaPercent);

    // Showcase logic: In demo mode, stats "level up" as the showcase progresses
    if (isDemo) {
        // Map productiveStreak (which grows in demo) to targets
        // Final targets: OHE 94%, Muda <5%
        const progress = Math.min(1, productiveStreak / 120); // 120s is the demo target
        mudaPercent = Math.max(4, 25 - Math.floor(progress * 21)); // Drops from 25 to 4
        ohe = Math.min(94, 75 + Math.floor(progress * 19)); // Rises from 75 to 94
    } else if (productiveStreak > 100) {
        mudaPercent = Math.max(0, mudaPercent - Math.floor(productiveStreak / 80));
        ohe = Math.max(0, 100 - mudaPercent);
    }

    // Takt: Assuming 3600 seconds per standard cycle, mandatory reset
    const taktRemaining = Math.max(0, 3600 - productiveStreak);
    const minutes = Math.floor(taktRemaining / 60);
    const seconds = taktRemaining % 60;

    return (
        <div className="fixed bottom-0 left-0 w-full z-[100] flex items-center justify-center pointer-events-none px-4">
            <div className="w-full max-w-4xl bg-ohs-navy/95 border border-white/10 backdrop-blur-xl shadow-2xl p-3 md:p-4 rounded-xl flex items-center justify-between text-[10px] sm:text-xs font-black uppercase tracking-widest text-ohs-orange pointer-events-auto">
                <div className="flex flex-col items-center">
                    <span className="text-gray-400">O.H.E.</span>
                    <span className={`${ohe > 90 ? 'text-green-500' : 'text-yellow-500'} text-xs sm:text-sm`}>{ohe}%</span>
                </div>

                <div className="h-6 w-px bg-white/20 mx-2" />

                <div className="flex flex-col items-center">
                    <span className="text-gray-400">TAKT <span className="hidden sm:inline">RESET</span></span>
                    <span className="text-white text-xs sm:text-sm">{minutes}M {seconds}S</span>
                </div>

                <div className="h-6 w-px bg-white/20 mx-2" />

                <div className="flex flex-col items-center">
                    <span className="text-gray-400">MUDA <span className="hidden sm:inline"> WASTE</span></span>
                    <span className={`${mudaPercent === 0 ? 'text-green-500' : 'text-red-500'} text-xs sm:text-sm`}>{mudaPercent}%</span>
                </div>
            </div>
        </div>
    );
};
