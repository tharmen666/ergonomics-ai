import React from 'react';
import { Menu } from 'lucide-react';
import { useNellyStore } from '../../store/nellyStore';
import { NellyAvatar } from './Layout';

interface NavbarProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
    const { 
        isSidebarCollapsed, 
        setSidebarCollapsed, 
        isWingmanActive, 
        setWingmanActive 
    } = useNellyStore();

    return (
        <header className={`sticky top-0 z-40 bg-ohs-navy/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-2 px-3 py-2 sm:px-6 md:px-8 transition-all duration-300 ease-in-out w-full max-w-full overflow-x-hidden ${
            isSidebarCollapsed ? 'md:ml-0' : 'md:ml-[280px]'
        }`}>
            {/* Left Branding and Navigation Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
                <button 
                    onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-2 min-h-[38px] min-w-[38px] sm:min-h-[48px] sm:min-w-[48px] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-ohs-orange shadow-lg flex-shrink-0 cursor-pointer"
                    title="Toggle Sidebar"
                >
                    <Menu size={18} className="sm:w-5 sm:h-5" />
                </button>
                <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-black text-white tracking-tighter uppercase whitespace-nowrap leading-none flex-shrink-0">
                    ERGOSAFE <span className="text-ohs-orange">REBORN</span>
                </h1>
            </div>

            {/* Right Status, Actions & Glowing NellyAvatar */}
            <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 flex-shrink-0">
                {/* Compact, Adaptive System Status Block - hidden on mobile <640px */}
                <div className="hidden sm:flex bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 flex-col justify-center min-h-[44px] flex-shrink-0 text-center">
                    <p className="text-[8px] sm:text-[10px] text-ohs-orange font-bold uppercase tracking-wider leading-none mb-1">Status</p>
                    <p className="text-[10px] sm:text-xs font-bold leading-none whitespace-nowrap text-emerald-400">NOMINAL</p>
                </div>
                
                {/* Action controls row */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <button
                        onClick={() => setWingmanActive(!isWingmanActive)}
                        className={`hidden sm:inline-flex items-center justify-center text-center ${
                            isWingmanActive ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'
                        } text-white px-2 py-1.5 sm:px-3 sm:py-2.5 min-h-[36px] sm:min-h-[48px] rounded-xl font-bold text-[10px] sm:text-xs transition-all shadow-md leading-none cursor-pointer`}
                    >
                        <span>{isWingmanActive ? 'DISABLE' : 'ACTIVATE'} WINGMAN</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('executive')}
                        className="hidden md:inline-flex items-center justify-center bg-ohs-orange/20 hover:bg-ohs-orange/30 border border-ohs-orange/50 text-ohs-orange px-2.5 py-1.5 sm:px-3 sm:py-2.5 min-h-[36px] sm:min-h-[48px] rounded-xl font-bold text-[10px] sm:text-xs transition-all whitespace-nowrap leading-none cursor-pointer"
                    >
                        EXEC BRIEFING
                    </button>
                    <button
                        onClick={() => setActiveTab('demo')}
                        className="bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-2.5 py-1.5 sm:px-3 sm:py-2.5 min-h-[36px] sm:min-h-[48px] rounded-xl font-black text-[10px] sm:text-xs transition-all shadow-lg whitespace-nowrap leading-none cursor-pointer"
                    >
                        HQ DEMO
                    </button>
                </div>

                {/* Glowing Vector NellyAvatar Component */}
                <div className="w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11 flex-shrink-0 aspect-square">
                    <NellyAvatar />
                </div>
            </div>
        </header>
    );
};
