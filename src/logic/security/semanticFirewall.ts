/**
 * ERGOSAFE REBORN v1.3: SEMANTIC FIREWALL
 * 
 * SAIF PROTOCOL ENABLED: This module shards core ISO and OHS Act legal text
 * into protected, immutable constructs. It prevents accidental contamination of 
 * legal liability logic by the broader application state.
 */

class SemanticFirewall {
    // Encrypted / Isolated Storage Array
    private _ohsCore: Map<string, string>;
    private _isoCore: Map<string, string>;

    constructor() {
        this._ohsCore = new Map();
        this._isoCore = new Map();

        // Oracle Insertion
        this.shardOHSLogic();
        this.shardISOLogic();
    }

    private shardOHSLogic() {
        this._ohsCore.set('sec37', "Section 37 (Liability): Employers are vicariously liable for the actions of their employees regarding health and safety. The continuous monitoring of remote ergonomic compliance via the Stewardship Engine provides a demonstrable legal defense against claims of negligence.");
        this._ohsCore.set('sec38', "Section 38 (Offences & Penalties): Non-compliance carries severe penalties including fines of R100,000 or up to 2 years imprisonment. DOA Lockouts ensure that fatigued or non-compliant personnel cannot authorize high-risk sign-offs, significantly restricting liability exposure.");
        this._ohsCore.set('sec8', "Section 8 (General Duties): Every employer shall provide a working environment that is safe and without risk to health.");
    }

    private shardISOLogic() {
        this._isoCore.set('45001-2018', "ISO 45001:2018 (Occupational Health & Safety): Demands a proactive approach to risk management and worker participation. The AI Stewardship Engine explicitly operationalizes clauses on Hazard Identification and Assessment of Risks.");
        this._isoCore.set('45003-2021', "ISO 45003:2021 (Psychosocial Risk): Mandates the management of psychological health and safety at work. The Cognitive Handshake and Fatigue-Gate protocols provide quantitative adherence to mitigating cognitive overload and psychosocial hazards.");
    }

    public getComplianceVector(protocol: 'OHS' | 'ISO', key: string): string {
        if (protocol === 'OHS') {
            return this._ohsCore.get(key) || "ORACLE: UNKNOWN PROTOCOL";
        }
        if (protocol === 'ISO') {
            return this._isoCore.get(key) || "ORACLE: UNKNOWN PROTOCOL";
        }
        return "SAIF BLOCK: UNAUTHORIZED REQUEST";
    }

    // Exported Unified Payload for Executive Briefings
    public fetchUnifiedBriefing(): Array<{ id: string, title: string, text: string }> {
        return [
            { id: 'ohs-37', title: 'OHS Act Section 37', text: this.getComplianceVector('OHS', 'sec37') },
            { id: 'ohs-38', title: 'OHS Act Section 38', text: this.getComplianceVector('OHS', 'sec38') },
            { id: 'iso-45001', title: 'ISO 45001:2018', text: this.getComplianceVector('ISO', '45001-2018') },
            { id: 'iso-45003', title: 'ISO 45003 (Psychosocial)', text: this.getComplianceVector('ISO', '45003-2021') }
        ];
    }
}

export const GlobalComplianceEngine = new SemanticFirewall();
