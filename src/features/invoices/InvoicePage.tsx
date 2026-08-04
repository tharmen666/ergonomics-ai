import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    Plus, 
    Printer, 
    Search, 
    CheckCircle2, 
    Clock, 
    DollarSign, 
    Building2, 
    X, 
    Filter,
    Briefcase
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientName: string;
    clientVat?: string;
    assessmentType: string;
    workstationsCount: number;
    unitPrice: number;
    subtotal: number;
    vatAmount: number;
    totalAmount: number;
    currency: string;
    issueDate: string;
    dueDate: string;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    assessorName: string;
    ohsLicenseNo: string;
    notes?: string;
}

const INITIAL_INVOICES: Invoice[] = [
    {
        id: 'inv-101',
        invoiceNumber: 'INV-2026-001',
        clientName: 'Astron Energy Rosebank',
        clientVat: 'ZA4920192841',
        assessmentType: 'Full ISO 45003 Workstation Ergonomics Audit',
        workstationsCount: 45,
        unitPrice: 1250,
        subtotal: 56250,
        vatAmount: 8437.50,
        totalAmount: 64687.50,
        currency: 'ZAR',
        issueDate: '2026-07-15',
        dueDate: '2026-08-15',
        status: 'PAID',
        assessorName: 'Desigan Tharmen (HSEQ Lead)',
        ohsLicenseNo: 'OHS-SA-9042',
        notes: 'Compliant with SA OHS Act Section 8(1) Duty of Care and ISO 45003:2021.'
    },
    {
        id: 'inv-102',
        invoiceNumber: 'INV-2026-002',
        clientName: 'Noted Stone Holdings',
        clientVat: 'ZA4192049182',
        assessmentType: 'Shandray Prizm Driver Shift Fatigue Audit',
        workstationsCount: 28,
        unitPrice: 1500,
        subtotal: 42000,
        vatAmount: 6300,
        totalAmount: 48300,
        currency: 'ZAR',
        issueDate: '2026-07-22',
        dueDate: '2026-08-22',
        status: 'PENDING',
        assessorName: 'Nelly AI Automated Auditor',
        ohsLicenseNo: 'OHS-SA-AI-01',
        notes: 'Includes 15-second road hazard reflex telemetry analysis dossiers.'
    },
    {
        id: 'inv-103',
        invoiceNumber: 'INV-2026-003',
        clientName: 'Century Crown Wholesale Centre',
        clientVat: 'ZA4810293847',
        assessmentType: 'Remote WFH Desk & Posture Telemetry Certification',
        workstationsCount: 60,
        unitPrice: 950,
        subtotal: 57000,
        vatAmount: 8550,
        totalAmount: 65550,
        currency: 'ZAR',
        issueDate: '2026-08-01',
        dueDate: '2026-09-01',
        status: 'PENDING',
        assessorName: 'Desigan Tharmen (HSEQ Lead)',
        ohsLicenseNo: 'OHS-SA-9042',
        notes: 'Digital Wingman posture assessment certificates issued for all employees.'
    }
];

export const InvoicePage = () => {
    const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form state for generating new invoice
    const [newClientName, setNewClientName] = useState('');
    const [newClientVat, setNewClientVat] = useState('');
    const [newAssessmentType, setNewAssessmentType] = useState('ISO 45003 Workstation Ergonomics Audit');
    const [newWorkstations, setNewWorkstations] = useState<number>(10);
    const [newUnitPrice, setNewUnitPrice] = useState<number>(1250);
    const [newAssessor, setNewAssessor] = useState('Desigan Tharmen (HSEQ Lead)');
    const [newOhsLicense, setNewOhsLicense] = useState('OHS-SA-9042');
    const [newNotes, setNewNotes] = useState('Workstation ergonomics audit conducted in compliance with OHS Act Section 8.');

    // Calculations
    const subtotalCalc = newWorkstations * newUnitPrice;
    const vatCalc = subtotalCalc * 0.15;
    const totalCalc = subtotalCalc + vatCalc;

    const filteredInvoices = invoices.filter((inv) => {
        const matchesSearch = inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              inv.assessmentType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const totalPaid = invoices.filter(i => i.status === 'PAID').reduce((acc, inv) => acc + inv.totalAmount, 0);
    const totalPending = invoices.filter(i => i.status === 'PENDING').reduce((acc, inv) => acc + inv.totalAmount, 0);

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClientName.trim()) return;

        const nextNum = invoices.length + 1;
        const generatedInvoice: Invoice = {
            id: `inv-${Date.now()}`,
            invoiceNumber: `INV-2026-00${nextNum}`,
            clientName: newClientName,
            clientVat: newClientVat || 'ZA-PENDING',
            assessmentType: newAssessmentType,
            workstationsCount: newWorkstations,
            unitPrice: newUnitPrice,
            subtotal: subtotalCalc,
            vatAmount: vatCalc,
            totalAmount: totalCalc,
            currency: 'ZAR',
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'PENDING',
            assessorName: newAssessor,
            ohsLicenseNo: newOhsLicense,
            notes: newNotes
        };

        setInvoices([generatedInvoice, ...invoices]);
        setIsCreateModalOpen(false);
        setSelectedInvoice(generatedInvoice);

        // Reset form
        setNewClientName('');
        setNewClientVat('');
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    return (
        <div className="space-y-6 sm:space-y-8 pb-32 font-sans max-w-full overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-black/40 p-6 rounded-3xl border border-white/10">
                <div>
                    <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.3em] block mb-1">
                        Financial & Audit Ledger
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                        <FileText className="text-ohs-orange" size={28} />
                        Ergonomics Assessment Invoicing
                    </h1>
                    <p className="text-gray-300 text-xs sm:text-sm font-medium mt-1">
                        View, generate, and export official tax invoices for OHS Act & ISO 45003 ergonomics audits.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-ohs-orange hover:bg-yellow-400 text-ohs-navy px-5 py-3.5 rounded-2xl font-black text-xs transition-all shadow-lg shadow-ohs-orange/20 cursor-pointer"
                >
                    <Plus size={18} /> GENERATE NEW INVOICE
                </button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassCard className="p-5 border-white/10">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Billed</span>
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                            <DollarSign size={18} />
                        </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-white mt-2 font-mono">
                        R {totalBilled.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1">Across {invoices.length} ergonomics assessments</span>
                </GlassCard>

                <GlassCard className="p-5 border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Paid Invoices</span>
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                            <CheckCircle2 size={18} />
                        </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-2 font-mono">
                        R {totalPaid.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[10px] text-emerald-300 block mt-1">Verified in OHS digital ledger</span>
                </GlassCard>

                <GlassCard className="p-5 border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Pending Settlement</span>
                        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                            <Clock size={18} />
                        </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-amber-400 mt-2 font-mono">
                        R {totalPending.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[10px] text-amber-300 block mt-1">Due within 30 days</span>
                </GlassCard>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search client, invoice #, or assessment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-ohs-orange"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    <Filter size={16} className="text-gray-400 shrink-0 hidden sm:block" />
                    {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                                statusFilter === status
                                    ? 'bg-ohs-orange text-ohs-navy shadow-md font-bold'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Invoice List Table / Cards */}
            <div className="space-y-3">
                {filteredInvoices.map((inv) => (
                    <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/40 hover:bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                        <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-ohs-navy rounded-xl border border-white/10 text-ohs-orange shrink-0">
                                <FileText size={24} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-black text-ohs-orange">{inv.invoiceNumber}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                        inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                        inv.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                        'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                        {inv.status}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Building2 size={16} className="text-gray-400" />
                                    {inv.clientName}
                                </h3>
                                <p className="text-xs text-gray-300 flex items-center gap-2">
                                    <Briefcase size={14} className="text-ohs-orange" />
                                    {inv.assessmentType} ({inv.workstationsCount} Workstations)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                            <div className="text-left md:text-right">
                                <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Tax Invoice</span>
                                <span className="text-lg font-mono font-black text-white">
                                    R {inv.totalAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <button
                                onClick={() => setSelectedInvoice(inv)}
                                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Printer size={15} className="text-ohs-orange" /> View / Download PDF
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal: Generate New Invoice */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-ohs-navy border border-white/20 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative my-8"
                        >
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <div>
                                    <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block">Ergonomics Assessment Billing</span>
                                    <h2 className="text-xl font-bold text-white">Generate Tax Invoice</h2>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateInvoice} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-wider block mb-1.5">
                                            Client / Organization Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Astron Energy"
                                            value={newClientName}
                                            onChange={(e) => setNewClientName(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-ohs-orange"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-wider block mb-1.5">
                                            Client VAT / Tax Reg No
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. ZA4920192841"
                                            value={newClientVat}
                                            onChange={(e) => setNewClientVat(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-ohs-orange"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-wider block mb-1.5">
                                        Ergonomics Assessment Type
                                    </label>
                                    <select
                                        value={newAssessmentType}
                                        onChange={(e) => setNewAssessmentType(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-ohs-orange"
                                    >
                                        <option value="ISO 45003 Workstation Ergonomics Audit">ISO 45003 Workstation Ergonomics Audit</option>
                                        <option value="Shandray Prizm Driver Shift Fatigue Audit">Shandray Prizm Driver Shift Fatigue Audit</option>
                                        <option value="Remote WFH Desk & Posture Telemetry Certification">Remote WFH Desk & Posture Telemetry Certification</option>
                                        <option value="Executive OHS Act Compliance Dossier Assessment">Executive OHS Act Compliance Dossier Assessment</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-wider block mb-1.5">
                                            Number of Workstations
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={newWorkstations}
                                            onChange={(e) => setNewWorkstations(parseInt(e.target.value) || 1)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-ohs-orange font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-wider block mb-1.5">
                                            Unit Rate per Workstation (ZAR)
                                        </label>
                                        <input
                                            type="number"
                                            min="100"
                                            value={newUnitPrice}
                                            onChange={(e) => setNewUnitPrice(parseFloat(e.target.value) || 0)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-ohs-orange font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                                    <div className="flex justify-between text-xs text-gray-300">
                                        <span>Subtotal ({newWorkstations} units @ R{newUnitPrice}):</span>
                                        <span className="font-mono font-bold">R {subtotalCalc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-300">
                                        <span>15% SA VAT:</span>
                                        <span className="font-mono font-bold">R {vatCalc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-ohs-orange pt-2 border-t border-white/10">
                                        <span>Total Amount Due:</span>
                                        <span className="font-mono font-black">R {totalCalc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-wider block mb-1.5">
                                        OHS Compliance & Assessor Notes
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={newNotes}
                                        onChange={(e) => setNewNotes(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-ohs-orange"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-ohs-orange hover:bg-yellow-400 text-ohs-navy font-black text-xs rounded-2xl transition-all shadow-lg cursor-pointer"
                                >
                                    CREATE & PREVIEW TAX INVOICE
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: View & Print PDF Invoice Document */}
            <AnimatePresence>
                {selectedInvoice && (
                    <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-slate-100 shadow-2xl relative my-8 overflow-hidden print:p-0 print:bg-white print:text-black"
                        >
                            {/* Action Bar */}
                            <div className="flex items-center justify-between pb-6 border-b border-white/10 print:hidden">
                                <span className="text-xs font-mono font-bold text-ohs-orange">
                                    Official OHS Tax Invoice - {selectedInvoice.invoiceNumber}
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handlePrintInvoice}
                                        className="px-4 py-2 bg-ohs-orange text-ohs-navy hover:bg-yellow-400 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer shadow-md"
                                    >
                                        <Printer size={16} /> PRINT / DOWNLOAD PDF
                                    </button>
                                    <button
                                        onClick={() => setSelectedInvoice(null)}
                                        className="p-2 text-gray-400 hover:text-white bg-white/10 rounded-xl cursor-pointer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Clean Printable Invoice Layout */}
                            <div className="space-y-6 pt-4 print:space-y-4">
                                {/* Header */}
                                <div className="flex justify-between items-start border-b border-white/10 pb-6 print:border-gray-300">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-ohs-orange to-ohs-green rounded-full flex items-center justify-center font-bold text-xs text-ohs-navy">
                                                OHS
                                            </div>
                                            <h2 className="text-xl font-black text-white tracking-tighter uppercase print:text-black">
                                                ERGOSAFE <span className="text-ohs-orange">REBORN</span>
                                            </h2>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 print:text-gray-600">ErgoSafe OHS Solutions (Pty) Ltd</p>
                                        <p className="text-[10px] text-gray-400 print:text-gray-600">VAT Reg: ZA904128941 | Reg: 2026/019283/07</p>
                                        <p className="text-[10px] text-gray-400 print:text-gray-600">Sandton Office Park, Johannesburg, South Africa</p>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl font-black text-ohs-orange uppercase tracking-wider print:text-black">TAX INVOICE</h3>
                                        <p className="text-xs font-mono font-bold text-white print:text-black">{selectedInvoice.invoiceNumber}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 print:text-gray-600">Issue Date: {selectedInvoice.issueDate}</p>
                                        <p className="text-[10px] text-gray-400 print:text-gray-600">Due Date: {selectedInvoice.dueDate}</p>
                                    </div>
                                </div>

                                {/* Bill To & Assessor */}
                                <div className="grid grid-cols-2 gap-6 bg-white/5 p-4 rounded-2xl border border-white/5 print:bg-gray-100 print:border-gray-200">
                                    <div>
                                        <span className="text-[9px] font-black text-ohs-orange uppercase tracking-wider block mb-1">BILLED TO:</span>
                                        <p className="text-sm font-bold text-white print:text-black">{selectedInvoice.clientName}</p>
                                        <p className="text-xs text-gray-300 print:text-gray-700">VAT No: {selectedInvoice.clientVat}</p>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-ohs-orange uppercase tracking-wider block mb-1">OHS ASSESSOR:</span>
                                        <p className="text-sm font-bold text-white print:text-black">{selectedInvoice.assessorName}</p>
                                        <p className="text-xs text-gray-300 print:text-gray-700">License #: {selectedInvoice.ohsLicenseNo}</p>
                                    </div>
                                </div>

                                {/* Line Items Table */}
                                <div className="border border-white/10 rounded-2xl overflow-hidden print:border-gray-300">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-white/10 border-b border-white/10 text-gray-300 print:bg-gray-200 print:text-black">
                                                <th className="p-3 font-bold uppercase">Assessment Item / Scope</th>
                                                <th className="p-3 font-bold uppercase text-center">Workstations</th>
                                                <th className="p-3 font-bold uppercase text-right">Unit Price</th>
                                                <th className="p-3 font-bold uppercase text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 print:divide-gray-200">
                                            <tr>
                                                <td className="p-3 font-medium text-white print:text-black">
                                                    {selectedInvoice.assessmentType}
                                                    <span className="block text-[10px] text-gray-400 print:text-gray-600">
                                                        Includes ergonomics risk scoring, posture telemetry review & compliance certificates.
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center font-mono font-bold text-white print:text-black">
                                                    {selectedInvoice.workstationsCount}
                                                </td>
                                                <td className="p-3 text-right font-mono text-gray-300 print:text-black">
                                                    R {selectedInvoice.unitPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-3 text-right font-mono font-bold text-white print:text-black">
                                                    R {selectedInvoice.subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totals Summary */}
                                <div className="flex justify-end">
                                    <div className="w-64 space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10 print:bg-gray-100 print:border-gray-300">
                                        <div className="flex justify-between text-xs text-gray-300 print:text-black">
                                            <span>Subtotal:</span>
                                            <span className="font-mono font-bold">R {selectedInvoice.subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-300 print:text-black">
                                            <span>VAT (15%):</span>
                                            <span className="font-mono font-bold">R {selectedInvoice.vatAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-ohs-orange pt-2 border-t border-white/10 print:text-black print:border-gray-300">
                                            <span>Total (ZAR):</span>
                                            <span className="font-mono font-black">R {selectedInvoice.totalAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes & Bank Payment Details */}
                                <div className="border-t border-white/10 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] text-gray-400 print:border-gray-300 print:text-gray-700">
                                    <div>
                                        <span className="font-bold uppercase text-white block mb-1 print:text-black">Banking Details for Settlement:</span>
                                        <p>Bank: Standard Bank South Africa</p>
                                        <p>Account Name: ErgoSafe OHS Solutions</p>
                                        <p>Account #: 0918239102 | Branch Code: 051001</p>
                                        <p>Reference: {selectedInvoice.invoiceNumber}</p>
                                    </div>
                                    <div>
                                        <span className="font-bold uppercase text-white block mb-1 print:text-black">Compliance Disclaimer:</span>
                                        <p>{selectedInvoice.notes}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InvoicePage;
