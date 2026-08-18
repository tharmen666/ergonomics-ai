import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTenantStore } from '../../store/tenantStore';
import { GlassCard } from '../ui/GlassCard';
import { Shield, Key, Building2, UserCircle } from 'lucide-react';

export const TenantLogin: React.FC = () => {
    const { companies, login } = useTenantStore();
    const [mode, setMode] = useState<'demo' | 'sso'>('demo');
    const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || 'COMP-001');
    const [userId, setUserId] = useState(mode === 'demo' ? 'usr-sarah' : '');
    const [ssoDomain, setSsoDomain] = useState('');
    const [role, setRole] = useState<'employee' | 'admin'>('employee');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (mode === 'demo') {
            login('COMP-001', 'usr-sarah', false);
            return;
        }

        if (!userId.trim()) {
            setError('Please enter a valid User ID or Enterprise SSO Identity.');
            return;
        }

        if (role === 'admin') {
            if (userId === 'admin' || userId === 'owner') {
                login('', userId, true);
            } else {
                setError('Invalid Master Admin credentials. Hint: use "admin" or "owner".');
            }
        } else {
            login(selectedCompanyId, userId, false);
        }
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-ohs-navy/95 backdrop-blur-md p-4">
            <div className="absolute inset-0 opacity-5 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <GlassCard className="p-8 sm:p-10 border border-white/10 shadow-[0_0_80px_rgba(249,168,37,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-ohs-orange via-yellow-500 to-ohs-green" />
                    
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="bg-ohs-orange/10 p-4 rounded-3xl border border-ohs-orange/20 mb-4">
                            <Shield className="text-ohs-orange animate-pulse" size={44} />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase">ERGOSAFE REBORN</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1.5">Secure Multi-Tenant Auth Portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Explicit Entry Toggle (P0 Audit Fix) */}
                        <div className="grid grid-cols-2 gap-2 bg-[#050B14] p-1.5 rounded-2xl border border-ohs-orange/40 shadow-inner">
                            <button
                                type="button"
                                onClick={() => { setMode('demo'); setError(''); }}
                                className={`py-3 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                    mode === 'demo'
                                        ? 'bg-gradient-to-r from-ohs-orange to-yellow-400 text-ohs-navy shadow-lg shadow-ohs-orange/20'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                🚀 Explore Demo Workspace
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode('sso'); setError(''); }}
                                className={`py-3 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                    mode === 'sso'
                                        ? 'bg-ohs-blue text-white shadow-lg shadow-ohs-blue/20'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                🔐 Enterprise SSO Login
                            </button>
                        </div>

                        {mode === 'demo' ? (
                            <div className="p-5 rounded-2xl bg-ohs-orange/10 border border-ohs-orange/30 space-y-3">
                                <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block">Instant Demo Access</span>
                                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                                    Pre-configured Sovereign Health Ltd workspace (`COMP-001`) initialized with active 3D spine telemetry, Prizm fatigue checks, and full OHS audit ledger access.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Role selection tabs */}
                                <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => { setRole('employee'); setError(''); }}
                                        className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            role === 'employee' ? 'bg-ohs-orange text-ohs-navy' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Tenant Client
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setRole('admin'); setError(''); }}
                                        className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            role === 'admin' ? 'bg-ohs-blue text-white' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Master Admin
                                    </button>
                                </div>

                        {role === 'employee' ? (
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Building2 size={14} className="text-ohs-orange" /> Select Tenant Company
                                </label>
                                <select
                                    value={selectedCompanyId}
                                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ohs-orange backdrop-blur-md cursor-pointer transition-all"
                                >
                                    {companies.map((c) => (
                                        <option key={c.id} value={c.id} className="bg-ohs-navy text-white">
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="bg-ohs-blue/10 border border-ohs-blue/20 p-4 rounded-2xl">
                                <span className="text-[10px] font-black text-ohs-blue uppercase tracking-widest block mb-1">Owner Credentials</span>
                                <p className="text-xs text-gray-400 leading-relaxed">System administrator mode. Log in as "admin" to reconcile billing cycles and monitor real-time audit streaming.</p>
                            </div>
                        )}

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <UserCircle size={14} className={role === 'admin' ? 'text-ohs-blue' : 'text-ohs-orange'} /> User ID / Enterprise SSO Identity
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            placeholder={role === 'admin' ? 'Enter "admin"' : 'e.g. mike_ross, sarah_j, user@company.com'}
                                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 text-sm font-semibold placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ohs-orange transition-all"
                                        />
                                        <Key className="absolute left-4 top-3.5 text-gray-500" size={16} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all transform hover:scale-[1.02] shadow-lg cursor-pointer ${
                                mode === 'demo'
                                    ? 'bg-gradient-to-r from-ohs-orange to-yellow-400 text-ohs-navy shadow-ohs-orange/30'
                                    : (role === 'admin' ? 'bg-ohs-blue hover:bg-ohs-blue/90 text-white shadow-ohs-blue/20' : 'bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy shadow-ohs-orange/20')
                            }`}
                        >
                            {mode === 'demo' ? '🚀 Launch Demo Workspace (COMP-001)' : 'Establish Enterprise SSO Connection'}
                        </button>
                    </form>
                </GlassCard>
            </motion.div>
        </div>
    );
};
