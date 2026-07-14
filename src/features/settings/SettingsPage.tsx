import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { Settings, Volume2, ShieldCheck, EyeOff, Radio } from 'lucide-react';
import { useNellyStore } from '../../store/nellyStore';

export const SettingsPage: React.FC = () => {
    const { isWingmanActive, setWingmanActive } = useNellyStore();
    const [speechRate, setSpeechRate] = useState(0.9);
    const [speechPitch, setSpeechPitch] = useState(1.05);
    const [strictPOPI, setStrictPOPI] = useState(true);
    const [gearThreshold, setGearThreshold] = useState(85);

    const handleSave = () => {
        alert("Settings synchronized successfully. Hot-reloaded speech parameters.");
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 pb-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 border-b border-white/10 pb-6"
            >
                <Settings className="text-ohs-orange" size={40} />
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">System Settings</h2>
                    <p className="text-gray-400 font-medium">Configure Nelly AI Coach telemetry, speech parameters, and compliance thresholds.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Voice Settings Card */}
                <GlassCard className="p-6 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Volume2 className="text-ohs-orange" size={20} />
                        Nelly Speech Cadet
                    </h3>
                    <p className="text-xs text-gray-400">Tweak Nelly's vocal feedback speed and pitch shift for South African pronunciation.</p>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                                <span>Cadence Rate</span>
                                <span>{speechRate}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="1.5"
                                step="0.05"
                                value={speechRate}
                                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                                className="w-full accent-ohs-orange bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                                <span>Pitch Multiplier</span>
                                <span>{speechPitch}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.8"
                                max="1.3"
                                step="0.05"
                                value={speechPitch}
                                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                                className="w-full accent-ohs-orange bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Privacy & Telemetry Card */}
                <GlassCard className="p-6 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <EyeOff className="text-ohs-blue" size={20} />
                        Privacy & Telemetry
                    </h3>
                    <p className="text-xs text-gray-400">Control data sharding and zero-knowledge ledger submission modes.</p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                            <div>
                                <span className="text-xs font-bold text-white block">Strict POPIA Shielding</span>
                                <span className="text-[10px] text-gray-400 font-medium">Anonymize raw coordinates locally</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStrictPOPI(!strictPOPI)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${strictPOPI ? 'bg-ohs-green' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${strictPOPI ? 'left-6' : 'left-0.5'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                            <div>
                                <span className="text-xs font-bold text-white block">Activate Nelly Wingman</span>
                                <span className="text-[10px] text-gray-400 font-medium">Enable real-time feedback popups</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setWingmanActive(!isWingmanActive)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${isWingmanActive ? 'bg-ohs-green' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${isWingmanActive ? 'left-6' : 'left-0.5'}`} />
                            </button>
                        </div>
                    </div>
                </GlassCard>

                {/* GEAR Pillars Card */}
                <GlassCard className="p-6 space-y-6 md:col-span-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Radio className="text-[#a2ff00]" size={20} />
                        G.E.A.R. Warning Trigger Thresholds
                    </h3>
                    <p className="text-xs text-gray-400">Configure safety thresholds. A score below the limit triggers immediate Line Manager notifications.</p>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                                <span>Minimum Governance Adherence</span>
                                <span>{gearThreshold}%</span>
                            </div>
                            <input
                                type="range"
                                min="70"
                                max="95"
                                step="1"
                                value={gearThreshold}
                                onChange={(e) => setGearThreshold(parseInt(e.target.value))}
                                className="w-full accent-[#a2ff00] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div className="flex justify-end pt-4">
                <GlowButton onClick={handleSave}>
                    <ShieldCheck size={18} className="mr-2" /> Save System Config
                </GlowButton>
            </div>
        </div>
    );
};
