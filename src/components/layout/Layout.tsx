import React, { ReactNode, useEffect, memo } from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useNellyStore } from '../../store/nellyStore';
import { Menu } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
    activeTab: string;
    setActiveTab: (id: string) => void;
}

export const Layout = memo(({ children, activeTab, setActiveTab }: LayoutProps) => {
    const { 
        isSidebarCollapsed, 
        setSidebarCollapsed, 
        isWingmanActive, 
        setWingmanActive 
    } = useNellyStore();

    // Force sidebar to be closed on initial load to prevent overlay blocking
    useEffect(() => {
        setSidebarCollapsed(true);
    }, [setSidebarCollapsed]);

    return (
        <div className="flex flex-col min-h-screen w-full relative overflow-x-hidden bg-ohs-navy text-white font-sans">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-ohs-blue/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-ohs-orange/10 rounded-full blur-[120px]" />
            </div>

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setSidebarCollapsed}
            />

            {/* Unified Premium Responsive Header Grid */}
            <header className={`sticky top-0 z-40 bg-ohs-navy/90 backdrop-blur-md flex items-center justify-between gap-2 px-4 py-3 sm:px-6 md:px-8 border-b border-white/10 relative z-50 transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'md:pl-8' : 'md:pl-[300px]'
            }`}>
                {/* Left Branding and Navigation Toggle */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button 
                        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2.5 min-h-[48px] min-w-[48px] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-ohs-orange shadow-lg flex-shrink-0 cursor-pointer"
                        title="Toggle Sidebar"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="text-xs xs:text-sm sm:text-lg md:text-2xl font-black text-white tracking-tighter uppercase whitespace-nowrap leading-none flex-shrink-0">
                        ERGOSAFE <span className="text-ohs-orange">REBORN</span>
                    </h1>
                </div>

                {/* Right Status, Actions & Glowing NellyAvatar */}
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    {/* Compact, Adaptive System Status Block */}
                    <div className="bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 flex flex-col justify-center min-h-[44px] flex-shrink-0 text-center">
                        <p className="text-[8px] sm:text-[10px] text-ohs-orange font-bold uppercase tracking-wider leading-none mb-1">Status</p>
                        <p className="text-[10px] sm:text-xs font-bold leading-none whitespace-nowrap text-emerald-400">NOMINAL</p>
                    </div>
                    
                    {/* Action controls row */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={() => setWingmanActive(!isWingmanActive)}
                            className={`inline-flex items-center justify-center text-center ${
                                isWingmanActive ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'
                            } text-white px-3 py-2.5 min-h-[48px] rounded-xl font-bold text-xs transition-all shadow-md leading-none cursor-pointer`}
                        >
                            <span className="xs:hidden">{isWingmanActive ? 'OFF' : 'ON'}</span>
                            <span className="hidden xs:inline">{isWingmanActive ? 'DISABLE' : 'ACTIVATE'} WINGMAN</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('executive')}
                            className="hidden sm:inline-flex items-center justify-center bg-ohs-orange/20 hover:bg-ohs-orange/30 border border-ohs-orange/50 text-ohs-orange px-3 py-2.5 min-h-[48px] rounded-xl font-bold text-xs transition-all whitespace-nowrap leading-none cursor-pointer"
                        >
                            EXEC BRIEFING
                        </button>
                        <button
                            onClick={() => setActiveTab('demo')}
                            className="bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-3 py-2.5 min-h-[48px] rounded-xl font-black text-xs transition-all shadow-lg whitespace-nowrap leading-none cursor-pointer"
                        >
                            HQ DEMO
                        </button>
                    </div>

                    {/* Glowing Vector NellyAvatar Component - inline and always visible */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 flex-shrink-0 aspect-square">
                        <NellyAvatar />
                    </div>
                </div>
            </header>

            <main className={`flex-1 px-4 py-6 sm:px-8 sm:py-8 pb-32 md:pb-16 relative z-10 flex flex-col w-full transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'md:pl-8' : 'md:pl-[300px]'
            }`}>
                <div className="flex-1 w-full max-w-full overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-7xl mx-auto w-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <Footer />
            </main>
        </div>
    );
});
Layout.displayName = 'Layout';

export const NellyAvatar: React.FC = () => {
  return (
    <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#F9A825] to-[#E65100] p-[1.5px] shadow-lg shadow-ohs-orange/20 flex items-center justify-center border border-white/10 hover:scale-105 hover:shadow-ohs-orange/40 hover:border-ohs-orange/40 transition-all duration-300">
      <div className="w-full h-full bg-[#00121e] rounded-[10px] flex items-center justify-center overflow-hidden relative group">
        {/* Premium glowing overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-ohs-orange/15 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Glowing Shield Iconic Safety Knight Vector */}
        <svg className="w-3/5 h-3/5 text-[#F9A825] relative z-10 filter drop-shadow-[0_0_8px_rgba(249,168,37,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
    </div>
  );
};

export default NellyAvatar;

