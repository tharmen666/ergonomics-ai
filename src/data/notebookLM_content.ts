export type ContentFormat = 'fun' | 'technical' | 'case-based';
export type LibraryCategory = 'executive' | 'office' | 'wfh';

export interface ModuleSection {
    title: string;
    content: string;
    format: ContentFormat;
    audioMockUrl?: string; // Simulating NotebookLM audio output
}

export interface OperationalLibrary {
    id: string;
    category: LibraryCategory;
    title: string;
    description: string;
    duration: string;
    sections: ModuleSection[];
}

export const NOTEBOOK_LM_LIBRARIES: OperationalLibrary[] = [
    {
        id: 'LIB-EXEC-01',
        category: 'executive',
        title: 'Master Framework: Executive Accountability',
        description: 'High-level risk management, compliance standards, and regulatory accountability for corporate leaders.',
        duration: '12 min',
        sections: [
            {
                format: 'technical',
                title: 'Section 37 & 38 OHS Act Liability',
                content: 'Corporate directors are directly liable for systemic OHS failures. A robust risk-mitigation framework requires active stewardship and continuous telemetry across the enterprise. Negligence carries severe statutory penalties.',
            },
            {
                format: 'case-based',
                title: 'Landmark Case: Remote Ergonomics',
                content: 'In 2025, a Tier-1 Bank was fined $2.5M when remote workers suffered repetitive strain injuries without employer-provided ergonomic assessments. The precedent establishes WFH Duty of Care parity.',
            },
            {
                format: 'fun',
                title: 'The "Get Out of Jail" Card',
                content: 'Think of Active Stewardship as your ultimate shield! By proving you actively monitored and remediated risks, you turn liability into legal immunity. Safe employees = Safe executives!',
            }
        ]
    },
    {
        id: 'LIB-OFFICE-01',
        category: 'office',
        title: 'Corporate Office Ergonomics',
        description: 'Practical workstation ergonomics, dynamic sitting adjustments, and micro-break routines for traditional office layouts.',
        duration: '8 min',
        sections: [
            {
                format: 'technical',
                title: 'The 90-90-90 Rule',
                content: 'Maintain 90-degree angles at the elbows, hips, and knees. Monitors must be positioned so the top third of the screen is at eye level to prevent cervical spine load. Chairs must provide active lumbar support.',
            },
            {
                format: 'case-based',
                title: 'The Standing Desk Trap',
                content: 'Sarah switched to a standing desk for 8 hours straight. Result? Plantar fasciitis and venous pooling. The solution: The 20-8-2 rule (20 mins sitting, 8 mins standing, 2 mins moving).',
            },
            {
                format: 'fun',
                title: 'Desk Yoga: Ninja Edition',
                content: 'Want to stretch without anyone noticing? Try the "Stealth Shoulder Roll" and the "Under-Desk Ankle Alphabet". Stay loose, stay stealthy!',
            }
        ]
    },
    {
        id: 'LIB-WFH-01',
        category: 'wfh',
        title: 'WFH Safety & Domestic Boundaries',
        description: 'Creating a compliant home workstation, balancing remote work habits, and maintaining domestic ergonomic boundaries.',
        duration: '10 min',
        sections: [
            {
                format: 'technical',
                title: 'Statutory Home Office Requirements',
                content: 'Employers must ensure the home workspace is free from tripping hazards (cable management) and has adequate lighting (300-500 lux) to prevent eye strain. Seating must meet ISO 9241 standards.',
            },
            {
                format: 'case-based',
                title: 'The Couch Surfer',
                content: 'Working from the sofa seems cozy until week 3. An employee developed severe "tech neck" from looking down at a laptop. Provision of a laptop riser and external keyboard eliminated the hazard in 48 hours.',
            },
            {
                format: 'fun',
                title: 'Claiming Your Turf',
                content: 'Your kitchen table is NOT a desk! Declare independence. Set up a dedicated zone, even if it\'s just a corner, and defend it like a fortress. Your spine will thank you.',
            }
        ]
    }
];
