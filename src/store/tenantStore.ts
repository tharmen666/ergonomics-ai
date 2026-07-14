import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompanyTenant {
    id: string;
    name: string;
    activeSeats: number;
}

export interface AuthSessionLog {
    id: string;
    timestamp: string;
    companyId: string;
    userId: string;
}

export interface TenantBillingInfo {
    total_usage_count: number;
    login_count: number;
}

interface TenantState {
    companyId: string | null;
    userId: string | null;
    isAdmin: boolean;
    companies: CompanyTenant[];
    logs: AuthSessionLog[];
    usage: Record<string, TenantBillingInfo>;
    login: (companyId: string, userId: string, isAdmin: boolean) => void;
    logout: () => void;
    recordUsage: (companyId?: string) => void;
}

const DEFAULT_COMPANIES: CompanyTenant[] = [
    { id: 'COMP-001', name: 'Sovereign Health Ltd', activeSeats: 12 },
    { id: 'COMP-002', name: 'Vanguard Logistics', activeSeats: 45 },
    { id: 'COMP-003', name: 'Apex Financials', activeSeats: 8 },
];

const DEFAULT_USAGE: Record<string, TenantBillingInfo> = {
    'COMP-001': { total_usage_count: 142, login_count: 24 },
    'COMP-002': { total_usage_count: 512, login_count: 88 },
    'COMP-003': { total_usage_count: 86, login_count: 14 },
};

export const useTenantStore = create<TenantState>()(
    persist(
        (set, get) => ({
            companyId: null,
            userId: null,
            isAdmin: false,
            companies: DEFAULT_COMPANIES,
            logs: [
                { id: 'log-1', timestamp: '2026-07-07T08:15:00Z', companyId: 'COMP-001', userId: 'usr-sarah' },
                { id: 'log-2', timestamp: '2026-07-07T09:30:00Z', companyId: 'COMP-002', userId: 'usr-louis' },
                { id: 'log-3', timestamp: '2026-07-07T11:45:00Z', companyId: 'COMP-003', userId: 'usr-apex-admin' },
            ],
            usage: DEFAULT_USAGE,

            login: (companyId, userId, isAdmin) => set((state) => {
                const timestamp = new Date().toISOString();
                const newLog: AuthSessionLog = {
                    id: `log-${Date.now()}`,
                    timestamp,
                    companyId: isAdmin ? 'ADMIN' : companyId,
                    userId,
                };

                const updatedLogs = [newLog, ...state.logs];
                const updatedUsage = { ...state.usage };

                if (!isAdmin) {
                    if (!updatedUsage[companyId]) {
                        updatedUsage[companyId] = { total_usage_count: 0, login_count: 0 };
                    }
                    updatedUsage[companyId] = {
                        ...updatedUsage[companyId],
                        login_count: updatedUsage[companyId].login_count + 1
                    };
                }

                return {
                    companyId: isAdmin ? null : companyId,
                    userId,
                    isAdmin,
                    logs: updatedLogs,
                    usage: updatedUsage,
                };
            }),

            logout: () => set({
                companyId: null,
                userId: null,
                isAdmin: false,
            }),

            recordUsage: (companyId) => set((state) => {
                const targetCompany = companyId || state.companyId;
                if (!targetCompany) return {};

                const updatedUsage = { ...state.usage };
                if (!updatedUsage[targetCompany]) {
                    updatedUsage[targetCompany] = { total_usage_count: 0, login_count: 0 };
                }
                updatedUsage[targetCompany] = {
                    ...updatedUsage[targetCompany],
                    total_usage_count: updatedUsage[targetCompany].total_usage_count + 1
                };

                return { usage: updatedUsage };
            }),
        }),
        {
            name: 'tenant-billing-telemetry-storage',
        }
    )
);
