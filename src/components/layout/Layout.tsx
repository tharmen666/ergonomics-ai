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

    // Force sidebar to be closed on initial load to prevent overlay blocking
    useEffect(() => {
        setSidebarCollapsed(true);
    }, [setSidebarCollapsed]);

    return (
        <div className="flex flex-col min-h-screen w-full max-w-full relative overflow-x-hidden bg-ohs-navy text-white font-sans box-border">
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

            <main className={`box-border flex-1 px-3 sm:px-6 md:px-8 pt-6 pb-40 md:pb-28 relative z-10 flex flex-col w-full max-w-full overflow-x-hidden transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'md:ml-0 md:w-full' : 'md:ml-[280px] md:w-[calc(100%-280px)]'
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
