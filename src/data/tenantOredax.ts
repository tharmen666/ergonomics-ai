export interface TenantConfig {
  tenantId: string;
  companyName: string;
  industry: string;
  regulatoryFramework: string[];
  workstationSettings: {
    screenBreakIntervalMinutes: number;
    microStretchDurationSeconds: number;
    ambientNoiseWarningDba: number;
    headsetCeilingDba: number;
    maxContinuousSeatedHours: number;
  };
  pilotUsers: {
    userId: string;
    label: string;
    role: 'Supervisor' | 'Operator';
    station: string;
  }[];
}

export const oredaxPilotConfig: TenantConfig = {
  tenantId: 'oredax-za-001',
  companyName: 'Oredax (Pty) Ltd',
  industry: 'Customer Support / Inbound Call Centre',
  regulatoryFramework: [
    'Occupational Health and Safety Act (Act 85 of 1993)',
    'Ergonomics Regulations (2019)',
    'Environmental Regulations for Workplaces (ERW)'
  ],
  workstationSettings: {
    screenBreakIntervalMinutes: 60,
    microStretchDurationSeconds: 60,
    ambientNoiseWarningDba: 65,
    headsetCeilingDba: 85,
    maxContinuousSeatedHours: 2
  },
  pilotUsers: [
    { userId: 'ODX-SUP-01', label: 'Operations Lead', role: 'Supervisor', station: 'Desk 0' },
    ...Array.from({ length: 10 }, (_, i) => ({
      userId: `ODX-AGT-${String(i + 1).padStart(2, '0')}`,
      label: `Agent Station ${i + 1}`,
      role: 'Operator' as const,
      station: `Station ${i + 1}`
    }))
  ]
};

export const getOredaxUser = (userId: string) => {
  return oredaxPilotConfig.pilotUsers.find(u => u.userId === userId) || oredaxPilotConfig.pilotUsers[1];
};
