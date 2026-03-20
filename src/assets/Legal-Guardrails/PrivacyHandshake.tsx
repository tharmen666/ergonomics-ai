import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const PrivacyHandshake = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show if not previously accepted
        const accepted = localStorage.getItem('popiHandshakeAccepted');
        if (!accepted) {
            // slight delay before popping up
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        setIsVisible(false);
        localStorage.setItem('popiHandshakeAccepted', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-ohs-navy/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 50 }}
                        className="bg-black border border-white/10 p-8 rounded-3xl max-w-xl shadow-[0_0_50px_rgba(249,168,37,0.15)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ohs-orange to-yellow-500" />

                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-ohs-orange/10 p-4 rounded-2xl">
                                <ShieldCheck className="text-ohs-orange" size={36} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">YOUR DATA IS YOUR SHIELD</h2>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Privacy-First OHS Architecture</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-gray-300 leading-relaxed text-sm">
                                ErgoSafe Reborn operates strictly as a <strong>Digital Wingman</strong>. This is a <strong>performance tool, not a spy tool</strong>. Your cognitive and ergonomic assessment data is end-to-end encrypted and completely anonymized.
                            </p>
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start gap-4">
                                <Lock className="text-white opacity-50 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Human in the Loop Guarantee</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Safety is our #1 priority. We do not track you to punish you. We coach you to keep you at peak performance. All compliance reports and behavioral audits are filed securely into zero-knowledge dossiers.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAccept}
                            className="w-full flex items-center justify-center gap-3 bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy font-black text-sm py-4 rounded-xl transition-all transform hover:scale-[1.02]"
                        >
                            <CheckCircle2 size={18} />
                            ACCEPT PRIVACY HANDSHAKE
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
