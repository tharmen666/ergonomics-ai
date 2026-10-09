export type ContentFormat = 'fun' | 'technical' | 'case-based';
export type LibraryCategory = 'executive' | 'office' | 'wfh' | 'manual' | 'fleet' | 'mining';

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

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
    quiz: QuizQuestion[];
}

export const NOTEBOOK_LM_LIBRARIES: OperationalLibrary[] = [
    {
        id: 'LIB-OFFICE-01',
        category: 'office',
        title: 'Office & WFH Workstation Ergonomics',
        description: 'Comprehensive ISO 9241 & SA OHS Act workstation alignment: monitor eye-level ratio, 90° elbow bend, lumbar support, and glare reduction.',
        duration: '10 min',
        sections: [
            {
                format: 'technical',
                title: 'Monitor Eye-Level Ratio & 90° Alignment',
                content: 'Align the top third of your display directly at eye level at an arm\'s length distance (50-70cm). Maintain 90-100° angles at the elbows, hips, and knees. Keep wrist joints straight and uncompressed against desk edges.',
            },
            {
                format: 'case-based',
                title: 'Glare Reduction & Cervical Tilt',
                content: 'A corporate analyst experienced chronic tension headaches due to overhead light glare. Repositioning the monitor perpendicular to windows and tilting the screen 10° back eliminated 85% of cervical eye strain.',
            },
            {
                format: 'fun',
                title: 'The 20-20-20 Micro-Reset',
                content: 'Every 20 minutes, gaze at a focal point 20 feet away for 20 seconds. It lubricates your eyes and interrupts continuous forward head posture before neck stiffness sets in!',
            }
        ],
        quiz: [
            {
                id: 1,
                question: 'What is the optimal height for the top third of your computer monitor?',
                options: ['Below chest level', 'Directly at eye level', 'Above head level', 'Angle up at 45 degrees'],
                correctIndex: 1,
                explanation: 'Positioning the top third at eye level maintains neutral cervical spine alignment.'
            },
            {
                id: 2,
                question: 'What angle should be maintained at your elbows and knees while seated?',
                options: ['45 degrees', '120 degrees', '90 to 100 degrees', 'Straightened at 180 degrees'],
                correctIndex: 2,
                explanation: 'Maintaining 90-100° prevents joint compression and promotes healthy vascular flow.'
            }
        ]
    },
    {
        id: 'LIB-MANUAL-01',
        category: 'manual',
        title: 'Manual Material Handling & Biomechanics',
        description: 'Kinetic chain principles, safe lifting techniques, power-zone positioning, packing, loading & unloading to prevent lumbar disc compression.',
        duration: '12 min',
        sections: [
            {
                format: 'technical',
                title: 'Power-Zone Lifting & Spine Neutrality',
                content: 'Always lift within the power zone (mid-thigh to chest level). Bend at the knees and hips while maintaining the natural S-curve of the lumbar spine. Never twist or rotate the torso while carrying heavy loads.',
            },
            {
                format: 'case-based',
                title: 'Warehouse Kinetic Load Management',
                content: 'A logistics team reduced lower back injuries by 70% by introducing two-person team lifts for items over 20kg and positioning pallet jacks at waist height during loading.',
            },
            {
                format: 'fun',
                title: 'Hugging the Load',
                content: 'Keep heavy boxes as close to your body as possible! The further the object is from your belly button, the higher the leverage pressure on your spinal discs!',
            }
        ],
        quiz: [
            {
                id: 1,
                question: 'Where is the biomechanical "Power Zone" located for safe material handling?',
                options: ['Above the shoulders', 'Mid-thigh to chest height', 'Below knees to ankles', 'Extended at arm length'],
                correctIndex: 1,
                explanation: 'Lifting between mid-thigh and chest reduces spinal shear forces significantly.'
            },
            {
                id: 2,
                question: 'What movement must NEVER be combined with lifting heavy loads?',
                options: ['Bending knees', 'Torso twisting/rotation', 'Exhaling on lift', 'Holding load close'],
                correctIndex: 1,
                explanation: 'Twisting while lifting places severe torsional stress on vulnerable lumbar discs.'
            }
        ]
    },
    {
        id: 'LIB-FLEET-01',
        category: 'fleet',
        title: 'Professional Driving & Fleet Ergonomics',
        description: 'Prizm fleet safety protocol: vehicle seat setup, pedal distance, lumbar support for long-haul drivers, and road vibration fatigue management.',
        duration: '15 min',
        sections: [
            {
                format: 'technical',
                title: 'Long-Haul Seat & Pedal Geometry',
                content: 'Position the vehicle seat so your knees are slightly bent when pressing pedals fully. Adjust seat back angle to 100-110° and position the headrest within 2cm of the back of your head to mitigate whiplash risk.',
            },
            {
                format: 'case-based',
                title: 'Road Vibration & Whole-Body Fatigue',
                content: 'Long-distance freight drivers experienced high lower back numbness due to whole-body vibration. Installing active suspension seat cushions and mandating 60-second power breathing resets every 2.5 hours eliminated driver fatigue incidents.',
            },
            {
                format: 'fun',
                title: 'The Steering Wheel Handshake',
                content: 'Hold the steering wheel at 9 and 3 o\'clock with relaxed shoulders. Avoid death-gripping the wheel—it transmits micro-vibrations straight into your shoulders!',
            }
        ],
        quiz: [
            {
                id: 1,
                question: 'What is the recommended seat back recline angle for professional drivers?',
                options: ['70 degrees forward', '100 to 110 degrees', '140 degrees reclined', 'Straight at 90 degrees'],
                correctIndex: 1,
                explanation: 'A 100-110° recline reduces disc pressure while maintaining full road visibility.'
            }
        ]
    },
    {
        id: 'LIB-MINING-01',
        category: 'mining',
        title: 'Industrial & Mining Heavy Equipment Safety',
        description: 'Surface & underground heavy machinery ergonomics, standing posture fatigue, anti-vibration footwear, and shift rotation protocols.',
        duration: '14 min',
        sections: [
            {
                format: 'technical',
                title: 'Heavy Equipment Cab & Standing Posture',
                content: 'Operators must adjust hydraulic seat damping to match terrain roughness. Standing operators must use anti-fatigue matting and alternate weight distribution between legs every 15 minutes to reduce spinal compression.',
            },
            {
                format: 'case-based',
                title: 'Underground Excavator Vibration Reduction',
                content: 'Mining operators logged continuous musculoskeletal fatigue during 12-hour shifts. Implementing 15-second BBS micro-interventions and cab joystick armrest height customization boosted alertness by 40%.',
            },
            {
                format: 'fun',
                title: 'The Heavy Equipment Stance',
                content: 'Keep a shoulder-width athletic base when operating joysticks or heavy levers. Lock your core, keep your chin level, and command the machine with zero slouch!',
            }
        ],
        quiz: [
            {
                id: 1,
                question: 'How often should standing operators shift weight or adjust posture matting?',
                options: ['Every 2 hours', 'Every 15 minutes', 'Once per shift', 'Never'],
                correctIndex: 1,
                explanation: 'Frequent micro-adjustments prevent blood pooling and localized joint strain.'
            }
        ]
    },
    {
        id: 'LIB-EXEC-01',
        category: 'executive',
        title: 'Master Framework: Executive Accountability',
        description: 'High-level risk management, compliance standards, and regulatory accountability for corporate leaders under the SA OHS Act & voluntary ISO 45001:2018 standard.',
        duration: '12 min',
        sections: [
            {
                format: 'technical',
                title: 'Section 37 & 38 OHS Act Statutory Governance',
                content: 'Under Section 38 of the Occupational Health and Safety Act 85 of 1993, non-compliance carries statutory penalties, while Section 37 governs liability for acts or omissions of employees and mandataries. A robust risk-mitigation framework requires active stewardship and continuous evaluation across the enterprise.',
            },
            {
                format: 'case-based',
                title: 'Workplace Ergonomic Risk Governance',
                // TODO(legal-verify): removed fabricated claim of '2025 Tier-1 Bank fined $2.5M'
                content: 'The Ergonomics Regulations, 2019 (GN R1589) require employers to ensure that ergonomic risk assessments are conducted where ergonomic risks exist, reinforcing the employer’s general duty of care under Section 8 of the OHS Act.',
            },
            {
                format: 'fun',
                title: 'Proactive Health & Safety Culture',
                // TODO(legal-verify): removed 'The Legal Immunity Shield' and claim to 'turn liability into legal immunity'
                content: 'Active stewardship and structured ergonomic assessments create a resilient safety culture. Ensuring safe workstations safeguards employee health and aligns workplace practices with statutory requirements.',
            }
        ],
        quiz: [
            {
                id: 1,
                question: 'Under Section 8 of the SA OHS Act, who bears the general duty to ensure a safe working environment?',
                options: ['Only junior staff', 'The employer and executive management', 'Equipment suppliers', 'No one'],
                correctIndex: 1,
                explanation: 'Section 8 places the general duty on every employer to provide and maintain a working environment that is safe and without risk to health.'
            }
        ]
    }
];
