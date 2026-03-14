import { GlassCard } from '../../components/ui/GlassCard';
import { Download, FileText } from 'lucide-react';
import { useAgentLog } from '../../store/agentLogStore';

const invoices = [
    { id: "INV-2024-001", date: "Jan 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-002", date: "Feb 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-003", date: "Mar 1, 2024", amount: "$149.99", status: "Paid" }, // Includes Merch
    { id: "INV-2024-004", date: "Apr 1, 2024", amount: "$99.00", status: "Due" },
];

export const InvoicesPage = () => {
    const { addLog } = useAgentLog();

    const handleDownload = (id: string) => {
        addLog('Finance', `Requesting invoice PDF generation for ${id}...`);
        setTimeout(() => addLog('System', `PDF Asset compiled. Starting download stream.`), 1000);
    };

    const handleSubscription = () => {
        addLog('Finance', 'Accessing secure subscription gateway...');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Billing & Invoices</h2>
            <p className="text-gray-400 mb-8">Manage your subscription and purchase history.</p>

            <GlassCard className="mb-8 p-8 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Current Plan</p>
                    <h3 className="2xl font-bold">Enterprise Safety</h3>
                    <p className="text-ohs-green text-sm">$99.00 / mo</p>
                </div>
                <button
                    className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    onClick={handleSubscription}
                >
                    Manage Subscription
                </button>
            </GlassCard>

            <GlassCard>
                <h3 className="text-xl font-bold mb-6">Invoice History</h3>
                <div className="space-y-4">
                    {invoices.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-ohs-blue/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-ohs-blue/20 rounded-lg text-ohs-blue">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="font-bold">{inv.id}</p>
                                    <p className="text-xs text-gray-400">{inv.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="font-bold">{inv.amount}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded ${inv.status === 'Paid' ? 'bg-ohs-green/20 text-ohs-green' : 'bg-orange-500/20 text-orange-400'
                                        }`}>
                                        {inv.status}
                                    </span>
                                </div>
                                <button
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Download PDF"
                                    onClick={() => handleDownload(inv.id)}
                                >
                                    <Download size={18} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};
