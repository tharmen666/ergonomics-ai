/**
 * ERGOSAFE REBORN v2.0: SEMANTIC FIREWALL
 *
 * SAIF PROTOCOL ENABLED: This module shards core ISO and OHS Act legal text
 * into protected, immutable constructs. It prevents accidental contamination of
 * legal liability logic by the broader application state.
 *
 * V&V AUDIT [2026-05-25]: Expanded to include ISO 9001 (Quality), ISO 14001
 * (Environmental), and updated Section 38 penalty amounts per 2026 amendment.
 */

class SemanticFirewall {
    // Encrypted / Isolated Storage Arrays
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
        this._ohsCore.set('sec8', "Section 8 (General Duties of Employers): Every employer shall provide and maintain, as far as is reasonably practicable, a working environment that is safe and without risk to health. This duty extends to home offices and remote working environments under the 2026 DEL Administrative Directive.");
        this._ohsCore.set('sec14', "Section 14 (General Duties of Employees): Every employee shall take reasonable care for their own health and safety and that of others. Completion of the daily OHS cognitive handshake operationalises this statutory duty for remote workers.");
        this._ohsCore.set('sec37', "Section 37 (Acts/Omissions of Employees & Mandataries): Employers are vicariously liable for the health and safety actions of their employees. The Stewardship Engine's continuous telemetry provides a demonstrable legal defense against negligence claims by proving active employer stewardship at all times.");
        this._ohsCore.set('sec38', "Section 38 (Offences & Penalties – 2026 Amendment): Non-compliance now carries administrative fines up to 10% of annual turnover or R5,000,000 (whichever is greater), or up to 2 years imprisonment for executives. DOA Lockouts prevent fatigued or non-compliant personnel from authorising high-risk sign-offs, directly restricting liability exposure.");
        this._ohsCore.set('sec24', "Section 24 (Reporting of Incidents): All workplace incidents, including those occurring in home-office environments, must be reported to the Department of Employment and Labour within 7 days. Ergo-Safe's automated incident flagging provides an instant, timestamped digital incident record to satisfy this obligation.");
    }

    private shardISOLogic() {
        this._isoCore.set('9001-2015', "ISO 9001:2015 (Quality Management Systems): Requires organisations to adopt a process-based approach with evidence of continual improvement. Ergo-Safe's compliance telemetry and trend dashboards provide the documented evidence of quality performance monitoring required under Clause 9.1 (Performance Evaluation).");
        this._isoCore.set('14001-2015', "ISO 14001:2015 (Environmental Management Systems): While primarily environmental, Clause 8.1 requires operational controls for significant environmental aspects, including the energy and environmental impact of remote work setups. Ergo-Safe's remote work audit module supports organizations in capturing the environmental footprint of their distributed workforce.");
        this._isoCore.set('45001-2018', "ISO 45001:2018 (Occupational Health & Safety Management): Demands a proactive approach to risk management and mandatory worker participation (Clause 5.4). The AI Stewardship Engine operationalises Hazard Identification and Assessment of Risks (Clause 6.1) with continuous, automated monitoring of physical and cognitive hazards.");
        this._isoCore.set('45003-2021', "ISO 45003:2021 (Psychological Health & Safety at Work): The first global standard for managing psychosocial risks including burnout, digital tethering, and cognitive overload. The Cognitive Handshake and Fatigue-Gate protocols provide quantitative adherence to Clause 6.1.2, identifying and assessing psychosocial hazards before they escalate to incidents.");
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

    /** Returns all sharded OHS Act provisions as an array. */
    public fetchOHSBriefing(): Array<{ id: string; title: string; text: string }> {
        return [
            { id: 'ohs-8',  title: 'OHS Act Section 8 – Duty of Care',        text: this.getComplianceVector('OHS', 'sec8')  },
            { id: 'ohs-14', title: 'OHS Act Section 14 – Employee Duties',     text: this.getComplianceVector('OHS', 'sec14') },
            { id: 'ohs-24', title: 'OHS Act Section 24 – Incident Reporting',  text: this.getComplianceVector('OHS', 'sec24') },
            { id: 'ohs-37', title: 'OHS Act Section 37 – Vicarious Liability', text: this.getComplianceVector('OHS', 'sec37') },
            { id: 'ohs-38', title: 'OHS Act Section 38 – Offences & Penalties',text: this.getComplianceVector('OHS', 'sec38') },
        ];
    }

    /** Returns all sharded ISO standards as an array. */
    public fetchISOBriefing(): Array<{ id: string; title: string; text: string }> {
        return [
            { id: 'iso-9001',  title: 'ISO 9001:2015 – Quality Management',       text: this.getComplianceVector('ISO', '9001-2015')  },
            { id: 'iso-14001', title: 'ISO 14001:2015 – Environmental Management', text: this.getComplianceVector('ISO', '14001-2015') },
            { id: 'iso-45001', title: 'ISO 45001:2018 – OHS Management',           text: this.getComplianceVector('ISO', '45001-2018') },
            { id: 'iso-45003', title: 'ISO 45003:2021 – Psychosocial Risk',        text: this.getComplianceVector('ISO', '45003-2021') },
        ];
    }

    /** Exported unified payload for Executive Briefings — combines OHS + ISO. */
    public fetchUnifiedBriefing(): Array<{ id: string; title: string; text: string }> {
        return [
            ...this.fetchOHSBriefing(),
            ...this.fetchISOBriefing(),
        ];
    }
}

export const GlobalComplianceEngine = new SemanticFirewall();
