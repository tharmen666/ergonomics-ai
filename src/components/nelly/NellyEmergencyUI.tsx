import { motion } from 'framer-motion';
import { useTenantStore, SA_PUBLIC_EMERGENCY_CONTACTS } from '../../store/tenantStore';
import { Phone, MapPin, AlertTriangle } from 'lucide-react';

interface NellyEmergencyUIProps {
    onDeescalate: () => void;
}

export const NellyEmergencyUI = ({ onDeescalate }: NellyEmergencyUIProps) => {
    const currentTenant = useTenantStore((state) => state.getCurrentTenant());
    const emergencyContacts = currentTenant?.emergencyContacts?.length 
        ? currentTenant.emergencyContacts 
        : SA_PUBLIC_EMERGENCY_CONTACTS;
    const statutoryEmergencyDialer = currentTenant?.emergencyContactNumber || '112';
    const assemblyPoint = currentTenant?.assemblyPoint || 'Follow your site evacuation plan';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-red-600/90 border-2 border-white rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] pointer-events-auto"
        >
            <h4 className="text-white font-black uppercase text-xs mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                Critical Escalation Active
            </h4>
            <p className="text-[10px] text-white font-bold mb-3 leading-tight">
                High-risk event detected. Immediate evacuation or emergency medical assistance required.
            </p>

            {/* Statutory Emergency Dispatcher Link */}
            <div className="mb-3">
                <a
                    href={`tel:${statutoryEmergencyDialer}`}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white text-red-700 rounded-lg font-black text-xs hover:bg-gray-100 transition-all shadow-md border-2 border-red-700"
                >
                    <span className="flex items-center gap-2">
                        <AlertTriangle size={15} className="text-red-600 animate-pulse" />
                        <span>DISPATCH STATUTORY EMS:</span>
                    </span>
                    <span className="font-mono text-sm tracking-wider">{statutoryEmergencyDialer}</span>
                </a>
            </div>

            <div className="bg-white/10 p-2.5 rounded-lg border border-white/20 mb-3">
                <p className="text-[9px] text-white opacity-80 uppercase font-black flex items-center gap-1">
                    <MapPin size={12} /> Assembly Point
                </p>
                <p className="text-[11px] text-white font-bold mt-0.5">{assemblyPoint}</p>
            </div>
            
            <div className="space-y-1.5 mb-2">
                {emergencyContacts.map((contact) => (
                    <a
                        key={contact.number}
                        href={`tel:${contact.number}`}
                        className="w-full flex items-center justify-between px-3 py-2 bg-white/90 text-red-600 rounded-lg font-bold text-xs hover:bg-white transition-all shadow-sm"
                    >
                        <span className="flex items-center gap-1.5">
                            <Phone size={13} />
                            <span>{contact.label}</span>
                        </span>
                        <span className="font-mono text-xs">{contact.number}</span>
                    </a>
                ))}
            </div>

            <button
                onClick={onDeescalate}
                className="w-full text-[9px] text-white/70 font-black uppercase mt-2 hover:text-white transition-colors cursor-pointer"
            >
                De-escalate
            </button>
        </motion.div>
    );
};
