import React, { ReactNode, useEffect, memo } from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useNellyStore } from '../../store/nellyStore';
import { Menu } from 'lucide-react';

import { Navbar } from './Navbar';

interface LayoutProps {
    children: ReactNode;
    activeTab: string;
    setActiveTab: (id: string) => void;
}

export const Layout = memo(({ children, activeTab, setActiveTab }: LayoutProps) => {
    const { 
        isSidebarCollapsed, 
        setSidebarCollapsed, 
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

            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className={`flex-1 px-3 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-36 sm:pb-40 md:pb-28 relative z-10 flex flex-col w-full transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'md:ml-0' : 'md:ml-[280px]'
            }`}>
                <div className="flex-1 w-full max-w-7xl mx-auto overflow-x-hidden pr-0 lg:pr-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
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

