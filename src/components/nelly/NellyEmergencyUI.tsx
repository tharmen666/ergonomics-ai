import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTenantStore, SA_PUBLIC_EMERGENCY_CONTACTS, type EmergencyContact } from '../../store/tenantStore';
import { useComplianceStore } from '../../store/complianceStore';
import { Phone, MapPin, AlertTriangle } from 'lucide-react';

interface NellyEmergencyUIProps {
    onDeescalate: () => void;
}

/** Digits, spaces and a leading + only. Anything else is dropped rather than put in a tel: link. */
const isDialable = (n: string | undefined): n is string => !!n && /^\+?[0-9 ]{3,20}$/.test(n.trim());
const telHref = (n: string) => `tel:${n.replace(/\s+/g, '')}`;

export const NellyEmergencyUI = ({ onDeescalate }: NellyEmergencyUIProps) => {
    const currentTenant = useTenantStore((state) => state.getCurrentTenant());
    const userId = useTenantStore((state) => state.userId);
    const reduceMotion = useReducedMotion();
    const titleId = useId();
    const descId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const [confirmingDeescalate, setConfirmingDeescalate] = useState(false);

    // Tenant numbers first, then the public SA numbers (deduplicated), so 10177 / 10111 / 112 are always there.
    const tenantContacts = (currentTenant?.emergencyContacts ?? []).filter((c) => isDialable(c.number));
    const contacts: EmergencyContact[] = [...tenantContacts];
    for (const pub of SA_PUBLIC_EMERGENCY_CONTACTS) {
        if (!contacts.some((c) => c.number.replace(/\s+/g, '') === pub.number)) contacts.push(pub);
    }
    const primaryNumber = isDialable(currentTenant?.emergencyContactNumber) ? currentTenant!.emergencyContactNumber!.trim() : '10177';
    const assemblyPoint = currentTenant?.assemblyPoint || 'Follow your site evacuation plan';

    // Move focus into the panel so keyboard and screen-reader users land on it immediately.
    useEffect(() => {
        panelRef.current?.focus();
    }, []);

    const confirmDeescalate = () => {
        const timestamp = new Date().toISOString();
        const who = userId || 'unknown user';
        useComplianceStore.setState((s) => ({
            logs: [{ timestamp, score: 100, threshold: 80, reason: `Emergency panel de-escalated by ${who}` }, ...s.logs]
        }));
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('EMERGENCY_DEESCALATED', { detail: { userId: who, timestamp } }));
        }
        onDeescalate();
    };

    return (
        <motion.div
            ref={panelRef}
            role="alertdialog"
            aria-modal="false"
            aria-labelledby={titleId}
            aria-describedby={descId}
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-red-700 border-2 border-white rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] pointer-events-auto outline-none focus-visible:ring-4 focus-visible:ring-white"
        >
            <h4 id={titleId} className="text-white font-black uppercase text-base mb-2 flex items-center gap-2">
                <span aria-hidden="true" className={`w-2.5 h-2.5 bg-white rounded-full ${reduceMotion ? '' : 'motion-safe:animate-ping'}`} />
                Critical Escalation Active
            </h4>
            <p id={descId} className="text-sm text-white font-semibold mb-3 leading-snug">
                Someone may need urgent help. Call emergency services now, then follow your site evacuation plan.
            </p>

            {/* Primary call button. The number is always shown in large text because tel: links do nothing on most desktops. */}
            <div className="mb-3">
                <a
                    href={telHref(primaryNumber)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white text-red-800 rounded-lg font-black hover:bg-gray-100 transition-colors shadow-md border-2 border-red-800"
                >
                    <span className="flex items-center gap-2 text-sm">
                        <AlertTriangle size={18} aria-hidden="true" className="text-red-700" />
                        <span>Call Emergency Services</span>
                    </span>
                    <span className="font-mono text-2xl tracking-wider">{primaryNumber}</span>
                </a>
            </div>

            <div className="bg-black/20 p-3 rounded-lg border border-white/30 mb-3">
                <p className="text-xs text-white uppercase font-black flex items-center gap-1">
                    <MapPin size={14} aria-hidden="true" /> Assembly Point
                </p>
                <p className="text-sm text-white font-bold mt-0.5">{assemblyPoint}</p>
            </div>

            <ul className="space-y-1.5 mb-2" aria-label="Emergency numbers">
                {contacts.map((contact) => (
                    <li key={`${contact.label}-${contact.number}`}>
                        <a
                            href={telHref(contact.number)}
                            className="w-full flex items-center justify-between px-3 py-2.5 bg-white text-red-800 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            <span className="flex items-center gap-1.5 text-sm">
                                <Phone size={15} aria-hidden="true" />
                                <span>{contact.label}</span>
                            </span>
                            <span className="font-mono text-lg">{contact.number}</span>
                        </a>
                    </li>
                ))}
            </ul>
            <p className="text-xs text-white/90 mb-2">112 works from cellphones only. From a landline use 10177 (ambulance/fire) or 10111 (police).</p>

            {confirmingDeescalate ? (
                <div className="flex gap-2 mt-2" role="group" aria-label="Confirm de-escalation">
                    <button
                        onClick={confirmDeescalate}
                        className="flex-1 text-sm text-red-800 bg-white font-black uppercase py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        Yes, situation is safe
                    </button>
                    <button
                        onClick={() => setConfirmingDeescalate(false)}
                        className="flex-1 text-sm text-white border border-white font-black uppercase py-2 rounded-lg hover:bg-white/10 cursor-pointer"
                    >
                        Keep open
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setConfirmingDeescalate(true)}
                    className="w-full text-sm text-white underline font-bold uppercase mt-2 hover:text-gray-100 transition-colors cursor-pointer"
                >
                    De-escalate
                </button>
            )}
        </motion.div>
    );
};
