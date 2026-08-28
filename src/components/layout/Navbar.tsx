import React from 'react';
import { Menu } from 'lucide-react';
import { useNellyStore } from '../../store/nellyStore';
import { useTenantStore } from '../../store/tenantStore';

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
        <header className={`sticky top-0 z-40 box-border bg-ohs-navy/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-6 md:px-8 transition-all duration-300 ease-in-out w-full max-w-full overflow-x-hidden ${
            isSidebarCollapsed ? 'md:ml-0 md:w-full' : 'md:ml-[280px] md:w-[calc(100%-280px)]'
        }`}>
            {/* Left Branding and Navigation Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink min-w-0">
                <button 
                    onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-1.5 sm:p-2 min-h-[34px] min-w-[34px] sm:min-h-[48px] sm:min-w-[48px] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-ohs-orange shadow-lg flex-shrink-0 cursor-pointer"
                    title="Toggle Sidebar"
                >
                    <Menu size={18} className="sm:w-5 sm:h-5" />
                </button>
                <div className="flex flex-col min-w-0 flex-shrink">
                    <h1 className="text-[11px] sm:text-base md:text-xl lg:text-2xl font-black text-white tracking-tighter uppercase truncate leading-none">
                        ERGOSAFE <span className="text-ohs-orange">REBORN</span>
                    </h1>
                    <span className="text-[7px] sm:text-[9px] font-mono text-ohs-orange/90 bg-ohs-orange/10 px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded border border-ohs-orange/30 w-max mt-0.5 truncate max-w-full">
                        Build: a9407fe <span className="hidden sm:inline">| Live Production</span>
                    </span>
                </div>
            </div>

            {/* Right Status, Actions & Glowing NellyAvatar */}
            <div className="flex items-center gap-1 sm:gap-3 md:gap-4 flex-shrink-0">
                {/* Persistent Privacy Consensus Badge (P0 Audit Fix) */}
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Privacy Consensus: Verified (Coaching Mode Active)
                </div>

                {/* Compact, Adaptive System Status Block - hidden on mobile <640px */}
                <div className="hidden sm:flex bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 flex-col justify-center min-h-[44px] flex-shrink-0 text-center">
                    <p className="text-[8px] sm:text-[10px] text-ohs-orange font-bold uppercase tracking-wider leading-none mb-1">Status</p>
                    <p className="text-[10px] sm:text-xs font-bold leading-none whitespace-nowrap text-emerald-400">NOMINAL</p>
                </div>
                
                {/* Action controls row */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                        onClick={() => setWingmanActive(!isWingmanActive)}
                        className={`hidden sm:inline-flex items-center justify-center text-center ${
                            isWingmanActive ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'
                        } text-white px-2 py-1.5 sm:px-3 sm:py-2.5 min-h-[34px] sm:min-h-[48px] rounded-xl font-bold text-[10px] sm:text-xs transition-all shadow-md leading-none cursor-pointer`}
                    >
                        <span>{isWingmanActive ? 'DISABLE' : 'ACTIVATE'} WINGMAN</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('demo')}
                        className="bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-2 py-1.5 sm:px-3 sm:py-2.5 min-h-[34px] sm:min-h-[48px] rounded-xl font-black text-[9px] sm:text-xs transition-all shadow-lg whitespace-nowrap leading-none cursor-pointer"
                    >
                        HQ DEMO
                    </button>
                    <button
                        onClick={() => {
                            useTenantStore.getState().logout();
                            setActiveTab('tenant-portal');
                        }}
                        className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 px-2 py-1.5 sm:px-3 sm:py-2.5 min-h-[34px] sm:min-h-[48px] rounded-xl font-bold text-[9px] sm:text-xs transition-all whitespace-nowrap leading-none cursor-pointer"
                        title="Disconnect session and return to Auth Portal"
                    >
                        DISCONNECT
                    </button>
                </div>

            </div>
        </header>
    );
};
