import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Save, RefreshCw, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useInvoiceStore, InvoiceRecord, InvoiceItem } from '../../store/invoiceStore';

export const InvoicePortal: React.FC = () => {
    const { invoices, addInvoice, deleteInvoice, updateInvoiceStatus } = useInvoiceStore();

    // Form States
    const [id, setId] = useState<string>('');
    const [invoiceNumber, setInvoiceNumber] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [clientName, setClientName] = useState<string>('');
    const [clientVat, setClientVat] = useState<string>('');
    const [travelCosts, setTravelCosts] = useState<number>(0);
    const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Unpaid' | 'Pending'>('Unpaid');
    const [items, setItems] = useState<InvoiceItem[]>([
        { description: 'Freelance Ergonomic Assessment Services', quantity: 8, rate: 850 }
    ]);

    // Validation/Notification message
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Auto-generate invoice number and set current date on load
    useEffect(() => {
        if (!id) {
            generateNewInvoiceNumber();
        }
    }, [invoices.length, id]);

    const generateNewInvoiceNumber = () => {
        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const count = invoices.length + 1;
        const paddedCount = String(count).padStart(3, '0');
        setInvoiceNumber(`DT-INV-${year}-${paddedCount}`);
        setDate(dateObj.toISOString().split('T')[0]);
    };

    // Calculations
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const tax = 0; // Locked to R0.00
    const total = subtotal + Number(travelCosts || 0);

    // Form Handlers
    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const updatedItems = [...items];
        if (field === 'description') {
            updatedItems[index].description = String(value);
        } else {
            updatedItems[index][field] = Number(value);
        }
        setItems(updatedItems);
    };

    const addItemRow = () => {
        setItems([...items, { description: '', quantity: 1, rate: 0 }]);
    };

    const removeItemRow = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        } else {
            setItems([{ description: '', quantity: 1, rate: 0 }]);
        }
    };

    const resetForm = () => {
        setId('');
        generateNewInvoiceNumber();
        setClientName('');
        setClientVat('');
        setTravelCosts(0);
        setPaymentStatus('Unpaid');
        setItems([{ description: 'Freelance Services', quantity: 1, rate: 0 }]);
        setMessage(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!invoiceNumber.trim()) {
            setMessage({ type: 'error', text: 'Invoice number is required.' });
            return;
        }
        if (!clientName.trim()) {
            setMessage({ type: 'error', text: 'Client name is required.' });
            return;
        }

        const newRecord: InvoiceRecord = {
            id: id || Date.now().toString(),
            invoiceNumber,
            date,
            clientName,
            clientVat,
            items,
            subtotal,
            travelCosts,
            total,
            paymentStatus
        };

        addInvoice(newRecord);
        setId(newRecord.id);
        setMessage({ type: 'success', text: `Invoice ${invoiceNumber} successfully saved to records.` });
        setTimeout(() => setMessage(null), 4000);
    };

    const loadInvoiceIntoForm = (record: InvoiceRecord) => {
        setId(record.id);
        setInvoiceNumber(record.invoiceNumber);
        setDate(record.date);
        setClientName(record.clientName);
        setClientVat(record.clientVat);
        setItems(record.items);
        setTravelCosts(record.travelCosts);
        setPaymentStatus(record.paymentStatus);
        setMessage({ type: 'success', text: `Loaded invoice ${record.invoiceNumber} for editing.` });
        setTimeout(() => setMessage(null), 3000);
    };

    const triggerPrint = () => {
        window.print();
    };

    // Format currency to South African Rand (R)
    const formatCurrency = (val: number) => {
        return `R ${val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    };

    const getStatusStyles = (status: 'Paid' | 'Unpaid' | 'Pending') => {
        switch (status) {
            case 'Paid':
                return 'bg-ohs-green/20 text-ohs-green border border-ohs-green/30';
            case 'Pending':
                return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case 'Unpaid':
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
        }
    };

    const getStatusIcon = (status: 'Paid' | 'Unpaid' | 'Pending') => {
        switch (status) {
            case 'Paid':
                return <CheckCircle size={14} className="inline mr-1" />;
            case 'Pending':
                return <Clock size={14} className="inline mr-1" />;
            case 'Unpaid':
                return <AlertTriangle size={14} className="inline mr-1" />;
        }
    };

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                        <FileText className="text-ohs-orange" size={32} />
                        FREELANCE BILLING HUBS
                    </h2>
                    <p className="text-sm text-gray-400 font-medium">
                        Local-first ledgering & billing generator for independent consultations.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={resetForm}
                        className="bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl border border-white/15 font-bold text-sm transition-all flex items-center gap-2"
                        title="Start New Invoice"
                    >
                        <RefreshCw size={16} />
                        New Invoice
                    </button>
                    <button
                        onClick={triggerPrint}
                        className="bg-ohs-blue hover:bg-ohs-blue/80 text-white px-4 py-2.5 rounded-xl border border-white/10 font-bold text-sm transition-all flex items-center gap-2"
                    >
                        <Printer size={16} />
                        Print / Export
                    </button>
                </div>
            </div>

            {/* Notification Bar */}
            {message && (
                <div className={`p-4 rounded-xl border ${
                    message.type === 'success' 
                        ? 'bg-ohs-green/10 border-ohs-green/30 text-ohs-green' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                } font-bold text-sm transition-all shadow-md`}>
                    {message.text}
                </div>
            )}

            {/* Grid Layout: Input Form & Print Preview */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Invoice Form Control (xl:col-span-5) */}
                <form onSubmit={handleSave} className="xl:col-span-5 space-y-6 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-xl form-container no-print">
                    <h3 className="text-lg font-black tracking-tight text-white border-b border-white/5 pb-2 text-glow-orange">
                        INVOICE TELEMETRY
                    </h3>

                    {/* Invoice Number & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Invoice ID #</label>
                            <input
                                type="text"
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ohs-orange transition-colors text-xs font-bold"
                                placeholder="INV-2026-001"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ohs-orange transition-colors text-xs"
                                required
                            />
                        </div>
                    </div>

                    {/* Client & VAT Info */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Bill To (Client Details)</label>
                            <textarea
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ohs-orange transition-colors text-xs"
                                placeholder="Client Company Name / Address"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Client VAT Number</label>
                            <input
                                type="text"
                                value={clientVat}
                                onChange={(e) => setClientVat(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ohs-orange transition-colors text-xs font-mono"
                                placeholder="e.g. ZA4123456789"
                            />
                        </div>
                    </div>

                    {/* Dynamic Line Items */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Line Items (Service Log)</label>
                            <button
                                type="button"
                                onClick={addItemRow}
                                className="text-ohs-orange hover:text-white transition-colors text-xs font-bold flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Row
                            </button>
                        </div>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center bg-white/5 p-2.5 rounded-xl border border-white/5 relative group">
                                    <div className="col-span-6 space-y-1">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                            className="w-full bg-transparent border-b border-white/10 focus:border-ohs-orange text-white focus:outline-none text-xs"
                                            placeholder="Service Description"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                            className="w-full bg-transparent border-b border-white/10 focus:border-ohs-orange text-white focus:outline-none text-xs text-center"
                                            min="0"
                                            step="any"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-3 space-y-1">
                                        <input
                                            type="number"
                                            value={item.rate}
                                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                            className="w-full bg-transparent border-b border-white/10 focus:border-ohs-orange text-white focus:outline-none text-xs text-right"
                                            min="0"
                                            step="any"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeItemRow(index)}
                                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                            title="Delete Row"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Travel Costs & Payment Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Travel Costs (R)</label>
                            <input
                                type="number"
                                value={travelCosts}
                                onChange={(e) => setTravelCosts(Number(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ohs-orange transition-colors text-xs text-right"
                                min="0"
                                step="any"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Payment Status</label>
                            <select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value as any)}
                                className="w-full bg-[#00121e] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ohs-orange transition-colors text-xs"
                            >
                                <option value="Unpaid">Unpaid / Outstanding</option>
                                <option value="Pending">Pending Sync</option>
                                <option value="Paid">Cleared / Paid</option>
                            </select>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="w-full bg-ohs-orange text-ohs-navy hover:bg-ohs-orange/90 font-black py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm mt-4"
                    >
                        <Save size={16} />
                        {id ? 'Update Record Log' : 'Save to Records'}
                    </button>
                </form>

                {/* Right Side: Professional Invoice Wrapper (xl:col-span-7) */}
                <div className="xl:col-span-7 bg-white text-gray-900 border border-white/10 rounded-2xl p-6 xs:p-8 md:p-12 shadow-2xl relative overflow-hidden print-invoice-wrapper max-w-full">
                    {/* A4 Sheet Border Indicator (Only in preview mode) */}
                    <div className="absolute top-0 right-0 bg-ohs-orange/10 border-b border-l border-ohs-orange/20 text-ohs-orange font-bold text-[8px] tracking-widest px-2 py-1 uppercase no-print select-none">
                        A4 Live Sheets Preview
                    </div>

                    {/* Invoice Inner Sheet Layout */}
                    <div className="space-y-8 text-xs text-gray-700">
                        
                        {/* Header: Branding Emblem & Corporate Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-gray-200 pb-8">
                            <div className="flex items-center gap-4">
                                {/* Corporate "DT" Emblem */}
                                <div className="w-16 h-16 bg-[#001b2e] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md border-2 border-ohs-orange">
                                    <span className="text-white text-2xl font-black tracking-tighter text-glow-orange select-none">DT</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-black tracking-tight text-gray-900 leading-none">Desigan Tharmen</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Independent Consultant</p>
                                    <div className="text-[10px] text-gray-400 mt-2 space-y-0.5">
                                        <p>Email: tharmendesigan36@gmail.com</p>
                                        <p>Phone: +27 622 655 708</p>
                                        <p>Durban, South Africa</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Invoice Summary */}
                            <div className="text-left sm:text-right space-y-1">
                                <h1 className="text-3xl font-black tracking-tighter text-gray-900">INVOICE</h1>
                                <div className="text-[10px] font-bold text-gray-500 space-y-0.5 pt-2">
                                    <p>Invoice #: <span className="text-gray-800 font-mono">{invoiceNumber || 'DT-INV-XXXX-XXX'}</span></p>
                                    <p>Date: <span className="text-gray-800">{date}</span></p>
                                    <p className="mt-1 flex items-center sm:justify-end gap-1">
                                        Status: 
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${getStatusStyles(paymentStatus)}`}>
                                            {getStatusIcon(paymentStatus)}{paymentStatus}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-150 pb-6">
                            <div>
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Bill To</h5>
                                <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg min-h-[50px] whitespace-pre-line text-gray-800 font-medium">
                                    {clientName || <span className="text-gray-400 italic">Enter client billing details...</span>}
                                </div>
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Client VAT Telemetry</h5>
                                <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg min-h-[50px] text-gray-800 font-mono">
                                    {clientVat ? (
                                        <p>VAT #: <span className="font-bold">{clientVat}</span></p>
                                    ) : (
                                        <span className="text-gray-400 italic">No Client VAT Provided</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider bg-gray-50">
                                        <th className="py-2.5 px-3 w-8">#</th>
                                        <th className="py-2.5 px-3">Description</th>
                                        <th className="py-2.5 px-3 text-center w-20">Qty/Hrs</th>
                                        <th className="py-2.5 px-3 text-right w-28">Rate</th>
                                        <th className="py-2.5 px-3 text-right w-32">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items.map((item, idx) => {
                                        const amount = item.quantity * item.rate;
                                        return (
                                            <tr key={idx} className="hover:bg-gray-50/50">
                                                <td className="py-3 px-3 text-gray-400 font-mono">{idx + 1}</td>
                                                <td className="py-3 px-3 font-semibold text-gray-800">
                                                    {item.description || <span className="text-gray-300 italic">Unspecified service item</span>}
                                                </td>
                                                <td className="py-3 px-3 text-center text-gray-700 font-medium">{item.quantity}</td>
                                                <td className="py-3 px-3 text-right text-gray-700 font-mono">{formatCurrency(item.rate)}</td>
                                                <td className="py-3 px-3 text-right font-bold text-gray-900 font-mono">{formatCurrency(amount)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Block */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4">
                            {/* Notes / Terms */}
                            <div className="text-[10px] text-gray-400 max-w-sm">
                                <p className="font-bold text-gray-500 uppercase tracking-wider mb-1">Freelance Terms & Conditions</p>
                                <p>Standard South African freelancer operating in an individual capacity. Invoices are non-taxable since the freelancer is a non-VAT vendor. Payment is appreciated within 14 business days.</p>
                            </div>

                            {/* Totals Calculation */}
                            <div className="w-full sm:w-72 space-y-1.5 text-[11px] border-t sm:border-t-0 pt-4 sm:pt-0">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-mono">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Travel & Logistic Expenses</span>
                                    <span className="font-mono">{formatCurrency(travelCosts)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 border-b border-gray-150 pb-2">
                                    <span>VAT / Tax (0% locked)</span>
                                    <span className="font-mono text-gray-400">R 0.00</span>
                                </div>
                                <div className="flex justify-between text-gray-900 font-black text-sm pt-1">
                                    <span>TOTAL DUE</span>
                                    <span className="font-mono text-glow-orange">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Banking Details Block (Anchored Static Footer) */}
                        <div className="border-t-2 border-dashed border-gray-200 pt-6 mt-10">
                            <div className="bg-[#001b2e]/5 border border-[#001b2e]/10 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-[10px] font-black text-[#001b2e] uppercase tracking-wider mb-1">DESIGNATED BANKING DETAILS</h4>
                                    <p className="text-[9px] text-gray-500">Provide direct electronic funds transfers (EFT) to the following node:</p>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10px]">
                                    <p className="text-gray-500">Bank: <span className="font-bold text-gray-900">First National Bank (FNB)</span></p>
                                    <p className="text-gray-500">Account Type: <span className="font-bold text-gray-900">Cheque / Smart</span></p>
                                    <p className="text-gray-500">Account #: <span className="font-bold text-gray-900 font-mono">62265570899</span></p>
                                    <p className="text-gray-500">Branch Code: <span className="font-bold text-gray-900 font-mono">250655</span></p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Historical Invoices Logs List (Zustand State Ledger) */}
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-xl logs-container no-print">
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                            SALES RECORD LEDGER
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">Historical logs tracking saved freelance consultations.</p>
                    </div>
                    <span className="bg-ohs-blue/40 border border-white/10 text-white font-bold text-xs px-3 py-1 rounded-full">
                        {invoices.length} {invoices.length === 1 ? 'Record' : 'Records'} Saved
                    </span>
                </div>

                {invoices.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-sm font-medium">
                        No historical invoice records detected. Fill out the telemetry and click "Save to Records".
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 font-black uppercase tracking-wider">
                                    <th className="py-3 px-2">Invoice #</th>
                                    <th className="py-3 px-2">Date</th>
                                    <th className="py-3 px-2">Client Name</th>
                                    <th className="py-3 px-2">Client VAT</th>
                                    <th className="py-3 px-2 text-right">Subtotal</th>
                                    <th className="py-3 px-2 text-right">Travel Costs</th>
                                    <th className="py-3 px-2 text-right">Total</th>
                                    <th className="py-3 px-2 text-center">Status</th>
                                    <th className="py-3 px-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-2 font-mono font-bold text-ohs-orange">{inv.invoiceNumber}</td>
                                        <td className="py-4 px-2 text-gray-300">{inv.date}</td>
                                        <td className="py-4 px-2 font-semibold text-white max-w-xs truncate">{inv.clientName}</td>
                                        <td className="py-4 px-2 font-mono text-gray-400">{inv.clientVat || 'N/A'}</td>
                                        <td className="py-4 px-2 text-right font-mono text-gray-300">{formatCurrency(inv.subtotal)}</td>
                                        <td className="py-4 px-2 text-right font-mono text-gray-400">{formatCurrency(inv.travelCosts)}</td>
                                        <td className="py-4 px-2 text-right font-mono font-bold text-white">{formatCurrency(inv.total)}</td>
                                        <td className="py-4 px-2 text-center">
                                            <select
                                                value={inv.paymentStatus}
                                                onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as any)}
                                                className={`text-[10px] font-bold rounded px-1.5 py-0.5 text-center focus:outline-none cursor-pointer ${getStatusStyles(inv.paymentStatus)}`}
                                            >
                                                <option value="Unpaid">Unpaid</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Paid">Paid</option>
                                            </select>
                                        </td>
                                        <td className="py-4 px-2 text-center space-x-1.5 whitespace-nowrap">
                                            <button
                                                onClick={() => loadInvoiceIntoForm(inv)}
                                                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded px-2.5 py-1 font-bold text-[10px] transition-colors"
                                            >
                                                Load Form
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Delete record for invoice ${inv.invoiceNumber}?`)) {
                                                        deleteInvoice(inv.id);
                                                        if (id === inv.id) {
                                                            resetForm();
                                                        }
                                                    }
                                                }}
                                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded px-2.5 py-1 font-bold text-[10px] transition-colors"
                                                title="Delete Record"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
