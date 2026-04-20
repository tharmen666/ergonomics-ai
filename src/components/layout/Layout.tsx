import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
    children: ReactNode;
    activeTab: string;
    setActiveTab: (id: string) => void;
}

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
    return (
        <div className="flex min-h-screen w-full relative">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-ohs-blue/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-ohs-orange/10 rounded-full blur-[120px]" />
            </div>

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-32 md:pb-16 relative z-10 flex flex-col min-h-screen w-full">
                <div className="flex-1 w-full max-w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-7xl mx-auto"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <Footer />
            </main>
        </div>
    );
};
