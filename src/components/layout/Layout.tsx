import React, { ReactNode, useEffect, memo } from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useNellyStore } from '../../store/nellyStore';
import { Menu, Settings } from 'lucide-react';

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
        isWingmanActive,
        setWingmanActive
    } = useNellyStore();

    // Dock sidebar open on desktop (>=1024px) and collapse on mobile/tablet (<1024px)
    useEffect(() => {
        const syncSidebar = () => {
            setSidebarCollapsed(window.innerWidth < 1024);
        };
        syncSidebar();
        window.addEventListener('resize', syncSidebar);
        return () => window.removeEventListener('resize', syncSidebar);
    }, [setSidebarCollapsed]);

    return (
        <div className="flex flex-col min-h-screen w-full max-w-full relative overflow-x-hidden bg-[#030712] text-white font-sans box-border">
            {/* Background Ambience: Deep Midnight-Obsidian with Radial Emerald / Cyan / Amber Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-18%] left-[-8%] w-[52%] h-[52%] bg-emerald-500/12 rounded-full blur-[140px]" />
                <div className="absolute top-[10%] right-[-10%] w-[45%] h-[45%] bg-cyan-500/10 rounded-full blur-[130px]" />
                <div className="absolute bottom-[-18%] left-[25%] w-[45%] h-[40%] bg-amber-500/8 rounded-full blur-[130px]" />
            </div>

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setSidebarCollapsed}
            />

            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className={`box-border flex-1 px-3 sm:px-6 md:px-8 pt-5 pb-32 md:pb-24 relative z-10 flex flex-col w-full max-w-full overflow-x-hidden transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'lg:ml-0 lg:w-full' : 'lg:ml-[264px] lg:w-[calc(100%-264px)]'
            }`}>
                <div className="flex-1 w-full max-w-7xl mx-auto overflow-x-hidden pr-0 lg:pr-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-full min-h-screen flex flex-col flex-1 overflow-x-hidden"
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
