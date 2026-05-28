import React, { ReactNode, useEffect, memo } from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useNellyStore } from '../../store/nellyStore';

interface LayoutProps {
    children: ReactNode;
    activeTab: string;
    setActiveTab: (id: string) => void;
}

export const Layout = memo(({ children, activeTab, setActiveTab }: LayoutProps) => {
    const { isSidebarCollapsed, setSidebarCollapsed } = useNellyStore();

    // Force sidebar to be closed on initial load to prevent overlay blocking
    useEffect(() => {
        setSidebarCollapsed(true);
    }, [setSidebarCollapsed]);

    return (
        <div className="flex min-h-screen w-full relative overflow-x-hidden">
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

            <main className={`flex-1 p-0 md:p-8 pb-32 md:pb-16 relative z-10 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out`}>
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
    // Replaced all hidden restrictions to ensure visibility on mobile headers
    <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#F9A825] to-[#001c30] p-0.5 shadow-md flex items-center justify-center border border-slate-700/50">
      <div className="w-full h-full bg-[#00121e] rounded-[10px] flex items-center justify-center overflow-hidden">
        {/* Glowing Shield Iconic Safety Knight Vector */}
        <svg className="w-3/5 h-3/5 text-[#F9A825]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
    </div>
  );
};

export default NellyAvatar;
