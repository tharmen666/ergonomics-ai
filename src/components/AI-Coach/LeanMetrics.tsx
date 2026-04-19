import { useEffect } from 'react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useMellyStore } from '../../store/mellyStore';

export const LeanMetrics = () => {
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
    let mudaPercent = 0;
    if (fatigueLevel === 'high') mudaPercent = 25;
    else if (fatigueLevel === 'warning') mudaPercent = 15;
    else if (reactionMemory.length > 0) {
        const lastReact = reactionMemory[reactionMemory.length - 1];
        if (lastReact > 600) mudaPercent = Math.min(10, Math.floor((lastReact - 600) / 20));
    }

    const ohe = Math.max(0, 100 - mudaPercent);

    // Takt: Assuming 3600 seconds per standard cycle, mandatory reset
    const taktRemaining = Math.max(0, 3600 - productiveStreak);
    const minutes = Math.floor(taktRemaining / 60);
    const seconds = taktRemaining % 60;

    return (
        <div className="fixed bottom-16 md:bottom-8 left-0 w-full z-50 flex items-center justify-center pointer-events-none px-4">
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
