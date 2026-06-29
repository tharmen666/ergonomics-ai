import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
}

export interface InvoiceRecord {
    id: string;
    invoiceNumber: string;
    date: string;
    clientName: string;
    clientVat: string;
    items: InvoiceItem[];
    subtotal: number;
    travelCosts: number;
    total: number;
    paymentStatus: 'Paid' | 'Unpaid' | 'Pending';
}

interface InvoiceState {
    invoices: InvoiceRecord[];
    addInvoice: (invoice: InvoiceRecord) => void;
    deleteInvoice: (id: string) => void;
    updateInvoiceStatus: (id: string, status: 'Paid' | 'Unpaid' | 'Pending') => void;
}

export const useInvoiceStore = create<InvoiceState>()(
    persist(
        (set) => ({
            invoices: [],
            addInvoice: (invoice) => set((state) => {
                const exists = state.invoices.some((inv) => inv.id === invoice.id);
                const updatedInvoices = exists
                    ? state.invoices.map((inv) => inv.id === invoice.id ? invoice : inv)
                    : [invoice, ...state.invoices]; // prepend to show newest first
                return { invoices: updatedInvoices };
            }),
            deleteInvoice: (id) => set((state) => ({
                invoices: state.invoices.filter((inv) => inv.id !== id)
            })),
            updateInvoiceStatus: (id, paymentStatus) => set((state) => ({
                invoices: state.invoices.map((inv) =>
                    inv.id === id ? { ...inv, paymentStatus } : inv
                )
            })),
        }),
        {
            name: 'invoice-storage',
        }
    )
);
