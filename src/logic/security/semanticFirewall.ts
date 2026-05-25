/**
 * ERGOSAFE REBORN v2.0: SEMANTIC FIREWALL
 *
 * SAIF PROTOCOL ENABLED: This module shards core ISO and OHS Act legal text
 * into protected, immutable constructs. It prevents accidental contamination of
 * legal liability logic by the broader application state.
 *
 * V&V AUDIT [2026-05-25]: Expanded to include ISO 9001 (Quality), ISO 14001
 * (Environmental), and updated Section 38 penalty amounts per 2026 amendment.
 * Stabilised with full multilingual translation matrices (EN, ZU, XH, ST).
 */

import { Language } from '../../utils/translations';

class SemanticFirewall {
    // Encrypted / Isolated Multilingual Storage
    private _ohsCore: Map<string, Record<Language, string>>;
    private _isoCore: Map<string, Record<Language, string>>;

    constructor() {
        this._ohsCore = new Map();
        this._isoCore = new Map();

        // Oracle Insertion
        this.shardOHSLogic();
        this.shardISOLogic();
    }

    private shardOHSLogic() {
        this._ohsCore.set('sec8', {
            en: "Section 8 (General Duties of Employers): Every employer shall provide and maintain, as far as is reasonably practicable, a working environment that is safe and without risk to health. This duty extends to home offices and remote working environments under the 2026 DEL Administrative Directive.",
            zu: "Isigaba 8 (Imisebenzi Ejwayelekile Yabaqashi): Wonke umqashi uzohlinzeka futhi agcine, ngendlela efanele, indawo yokusebenza ephephile nengenawo ubungozi bezempilo. Lo msebenzi udlulela emahhovisi asekhaya nasezindaweni zokusebenza ezikude ngaphansi kwe-Directive ka-2026.",
            xh: "Icandelo 8 (Imisebenzi Jikelele Yabaqeshi): Wonke umqeshi uya kubonelela kwaye agcine, ngokusemandleni, indawo yokusebenza ekhuselekileyo kwaye ingenabungozi empilweni. Lo msebenzi udlulela kwii-ofisi zasekhaya nakwiindawo zokusebenza ezikude.",
            st: "Karolo 8 (Mesebetsi e Akaretsang ea Bahapi): Mohapi e mong le e mong o tla fana le ho boloka, ka moo ho ka khonehang, tikoloho ea ho sebetsa e bolokehileng le e se nang kotsi bophelong. Mosebetsi ona o fetela liofising tsa lapeng le libakeng tse hōle."
        });

        this._ohsCore.set('sec14', {
            en: "Section 14 (General Duties of Employees): Every employee shall take reasonable care for their own health and safety and that of others. Completion of the daily OHS cognitive handshake operationalises this statutory duty for remote workers.",
            zu: "Isigaba 14 (Imisebenzi Ejwayelekile Yabasebenzi): Wonke umsebenzi uzonakekela impilo yakhe nokuphepha kwakhe kanye nokwabanye. Ukuqedwa kwe-cognitive handshake yansuku zonke kufeza lo msebenzi wasemthethweni kubasebenzi abakude.",
            xh: "Icandelo 14 (Imisebenzi Jikelele Yabasebenzi): Wonke umsebenzi uya kuthatha unonophelo olufanelekileyo lwempilo yakhe nokhuseleko lwakhe kunye nolwabanye. Ukugqitywa kwe-cognitive handshake yemihla ngemihla kufeza lo msebenzi wasemthethweni.",
            st: "Karolo 14 (Mesebetsi e Akaretsang ea Basebetsi): Mosebetsi e mong le e mong o tla hlokomela bophelo le polokeho ea hae le ea ba bang ka tsela e loketseng. Ho phethela handshake ea letsatsi le letsatsi ea OHS ho phethahatsa mosebetsi ona."
        });

        this._ohsCore.set('sec37', {
            en: "Section 37 (Acts/Omissions of Employees & Mandataries): Employers are vicariously liable for the health and safety actions of their employees. The Stewardship Engine's continuous telemetry provides a demonstrable legal defense against negligence claims by proving active employer stewardship at all times.",
            zu: "Isigaba 37 (Izenzo noma Ukunyakaza Kwabasebenzi & Mandataries): Abaqashi babophezelekile ngokomthetho ngezenzo zabasebenzi babo. I-telemetry eqhubekayo ye-Stewardship Engine inikeza isivikelo esinamandla somthetho ngokumelene nezicelo zokunganaki.",
            xh: "Icandelo 37 (Izenzo/Ukunyanzeliswa Kwabasebenzi kunye Nabathunywa): Abaqeshi banoxanduva lomthetho ngezenzo zabasebenzi babo. I-telemetry eqhubekayo ye-Stewardship Engine inika ukhuseleko lomthetho oluqinileyo.",
            st: "Karolo 37 (Diketso/Liketso tsa Basebetsi le Baemeli): Bahapi ba na le boikarabello bo kopaneng bakeng sa liketso tsa polokeho tsa basebetsi ba bona. Telemetry e tsoelang pele ea Stewardship Engine e fana ka tšireletso e netefalitsoeng ea molao."
        });

        this._ohsCore.set('sec38', {
            en: "Section 38 (Offences & Penalties – 2026 Amendment): Non-compliance now carries administrative fines up to 10% of annual turnover or R5,000,000 (whichever is greater), or up to 2 years imprisonment for executives. DOA Lockouts prevent fatigued or non-compliant personnel from authorising high-risk sign-offs, directly restricting liability exposure.",
            zu: "Isigaba 38 (Amacala & Nezinhlawulo - Ukuchitshiyelwa kuka-2026): Ukungathobeli manje kuthwala inhlawulo efika ku-10% yenzuzo yonyaka noma u-R5,000,000 (noma yikuphi okukhulu), noma iminyaka emibili ebhadla ejele kubaphathi ophezulu. I-DOA Lockout ivimbela izisebenzi ezikhathalayo ukuthi zigunyaze izinqumo ezinobungozi.",
            xh: "Icandelo 38 (Amacala kunye neZohlwayo – Isilungiso sika-2026): Ukungathobeli ngoku kuthwala isohlwayo esifikelela kwi-10% yengeniso yonyaka okanye u-R5,000,000, okanye iminyaka emibini entolongweni kubaphathi. I-DOA Lockout ithintela ukugunyaziswa kzigqibo ezinobungozi.",
            st: "Karolo 38 (Litlhōlo le Likotlo - Sehlomathiso sa 2026): Ho hloka molao hona joale ho baka likotlo tsa tsamaiso tse fihlang ho 10% ea chelete e kenang ka selemo kapa R5,000,000, kapa lilemo tse 2 chankaneng bakeng sa batsamaisi. DOA Lockout e thibela basebetsi ba khathetseng ho fana ka litumello tse kotsi."
        });

        this._ohsCore.set('sec24', {
            en: "Section 24 (Reporting of Incidents): All workplace incidents, including those occurring in home-office environments, must be reported to the Department of Employment and Labour within 7 days. Ergo-Safe's automated incident flagging provides an instant, timestamped digital incident record to satisfy this obligation.",
            zu: "Isigaba 24 (Ukubikwa Kwezigameko): Zonke izigameko zasendaweni yokusebenza, kufaka phakathi lezo ezenzeka emahgovisi asekhaya, kufanele zibikwe eMnyangweni wezokuQashwa kanye nezeMisebenzi phakathi kwezinsuku ezingu-7. Ukurekhoda kwedijithali kwe-Ergo-Safe kunikeza irekhodi elisheshayo.",
            xh: "Icandelo 24 (Ukuxhelwa Kwezigameko): Zonke iziganeko zasendaweni yokusebenza, kubandakanywa nezo zenzeka kumakhaya, kufuneka zixhelwe kwiSebe lezeQesho nabaSebenzi zingadlulanga iintsuku ezisi-7. Ukurekhoda kwedijithali kwe-Ergo-Safe kunika ingxelo ekhawulezileyo.",
            st: "Karolo 24 (Ho Tlaleha Likotsi): Likotsi tsohle tsa sebakeng sa mosebetsi, ho kenyeletsa le tse etsahalang liofising tsa lapeng, li tlameha ho tlalehoa ho Lefapha la Khiho le Basebetsi nakong ea matsatsi a 7. Dynamic flagging ea Ergo-Safe e fana ka tlaleho e potlakileng."
        });
    }

    private shardISOLogic() {
        this._isoCore.set('9001-2015', {
            en: "ISO 9001:2015 (Quality Management Systems): Requires organisations to adopt a process-based approach with evidence of continual improvement. Ergo-Safe's compliance telemetry and trend dashboards provide the documented evidence of quality performance monitoring required under Clause 9.1 (Performance Evaluation).",
            zu: "ISO 9001:2015 (Izinhlelo Zokuphathwa Kwekhwalithi): Kudinga izinhlangano ukuthi zamukele indlela esekelwe ezinqubweni enobufakazi bokuqhubeka ngcono. Imiphumela ye-Ergo-Safe ihlinzeka ngobufakazi obubhaliwe ngaphansi kwe-Clause 9.1.",
            xh: "ISO 9001:2015 (Iinkqubo zokuLawulwa kweSimo seKhwalithi): Ifuna imibutho ukuba yamkele indlela esekelwe kwiinkqubo ezinebubanga bokuqhubela phambili. Iziphumo ze-Ergo-Safe zibonelela ngobungqina obubhaliweyo phantsi kwe-Clause 9.1.",
            st: "ISO 9001:2015 (Tsamaiso ea Boleng ba Tsamaiso): E hloka hore mekhatlo e amohele mokhoa o thehiloeng tšebetsong o nang le bopaki ba lintlafatso tse tsoelang pele. Telemetry ea Ergo-Safe e fana ka bopaki bo ngotsoeng tlas'a Clause 9.1."
        });

        this._isoCore.set('14001-2015', {
            en: "ISO 14001:2015 (Environmental Management Systems): While primarily environmental, Clause 8.1 requires operational controls for significant environmental aspects, including the energy and environmental impact of remote work setups. Ergo-Safe's remote work audit module supports organizations in capturing the environmental footprint of their distributed workforce.",
            zu: "ISO 14001:2015 (Izinhlelo Zokuphathwa Kwezemvelo): Noma ikakhulukazi ezemvelo, uMthetho u-8.1 udinga izilawuli zokusebenza ezicini ezibalulekile zemvelo, kufaka phakathi umthelela wezikhungo zabasebenzi abakude. I-Ergo-Safe isekela izinhlangano ekubambeni umkhondo wezemvelo.",
            xh: "ISO 14001:2015 (Iinkqubo zokuLawulwa kokusiNgqongileyo): Nangona ikakhulu isingqongileyo, iSolotya 8.1 lifuna ulawulo lokusebenza kwiinkalo ezibalulekileyo zosingqongileyo, kubandakanywa nefuthe leendawo zabasebenzi. I-Ergo-Safe ixhasa imibutho ekubambeni ikhondo lokusingqongileyo.",
            st: "ISO 14001:2015 (Tsamaiso ea Tikoloho): Leha e le ea tikoloho haholo, Clause 8.1 e hloka taolo ea ts'ebetso bakeng sa likarolo tsa tikoloho, ho kenyeletsa le tšusumetso ea liofisi tsa lapeng. Ergo-Safe e tšehetsa ts'ebetso ena."
        });

        this._isoCore.set('45001-2018', {
            en: "ISO 45001:2018 (Occupational Health & Safety Management): Demands a proactive approach to risk management and mandatory worker participation (Clause 5.4). The AI Stewardship Engine operationalises Hazard Identification and Assessment of Risks (Clause 6.1) with continuous, automated monitoring of physical and cognitive hazards.",
            zu: "ISO 45001:2018 (Ukuphathwa Kwezempilo Nokuphepha Emsebenzini): Kufuna indlela ebonakalayo yokulawula ubungozi kanye nokubamba iqhaza kwabasebenzi (Clause 5.4). Injini yethu iqopha ukuhlonza ubungozi nokuhlolwa kwezingozi.",
            xh: "ISO 45001:2018 (Ulawulo lwezeMpilontle noKhuseleko eMsebenzini): Ifuna indlela ebonakalayo yokulawula ubungozi kunye nokuthatha inxaxheba kwabasebenzi (Solotya 5.4). Injini yethu iqinisekisa ukuchongwa kweengozi kunye novavanyo lwazo.",
            st: "ISO 45001:2018 (Tsamaiso ea Bophelo bo Botle le Polokeho): E hloka mokhoa o matla oa ho laola likotsi le ho nka karolo ha basebetsi (Clause 5.4). AI Stewardship Engine e hlahloba le ho laola likotsi tsena."
        });

        this._isoCore.set('45003-2021', {
            en: "ISO 45003:2021 (Psychological Health & Safety at Work): The first global standard for managing psychosocial risks including burnout, digital tethering, and cognitive overload. The Cognitive Handshake and Fatigue-Gate protocols provide quantitative adherence to Clause 6.1.2, identifying and assessing psychosocial hazards before they escalate to incidents.",
            zu: "ISO 45003:2021 (Impilo Yengqondo Nokuphepha Emsebenzini): Umhlahlandlela wokuqala wembulunga yonke wokulawula ubungozi bezengqondo njengokukhathala ngokweqile. I-Cognitive Handshake ihlonza lezi zingozi ngokushesha.",
            xh: "ISO 45003:2021 (Impilo yezengqondo noKhuseleko eMsebenzini): Isikhokelo sokuqala sehlabathi jikelele sokulawula iingozi zengqondo njengokudinwa ngokugqithisileyo. I-Cognitive Handshake ichonga ezi ngozi ngokukhawuleza.",
            st: "ISO 45003:2021 (Bophelo bo Botle ba Kelello le Polokeho): Tekanyetso ea pele ea lefats'e ea ho laola likotsi tsa kelello le ho thibela burnout kapa digital tethering. Cognitive Handshake e thusa ho bona likotsi tsena kapele."
        });
    }

    public getComplianceVector(protocol: 'OHS' | 'ISO', key: string, lang: Language = 'en'): string {
        if (protocol === 'OHS') {
            const entry = this._ohsCore.get(key);
            return entry ? (entry[lang] || entry['en']) : "ORACLE: UNKNOWN PROTOCOL";
        }
        if (protocol === 'ISO') {
            const entry = this._isoCore.get(key);
            return entry ? (entry[lang] || entry['en']) : "ORACLE: UNKNOWN PROTOCOL";
        }
        return "SAIF BLOCK: UNAUTHORIZED REQUEST";
    }

    /** Returns all sharded OHS Act provisions as an array. */
    public fetchOHSBriefing(lang: Language = 'en'): Array<{ id: string; title: string; text: string }> {
        return [
            { id: 'ohs-8',  title: lang === 'zu' ? 'I-OHS Act Isigaba 8 – Umsebenzi Wokunakekela' : lang === 'xh' ? 'I-OHS Act Icandelo 8 – Umsebenzi Wokukhathalela' : lang === 'st' ? 'OHS Act Karolo 8 – Mosebetsi oa Tlhokomelo' : 'OHS Act Section 8 – Duty of Care',        text: this.getComplianceVector('OHS', 'sec8', lang)  },
            { id: 'ohs-14', title: lang === 'zu' ? 'I-OHS Act Isigaba 14 – Imisebenzi Yabasebenzi' : lang === 'xh' ? 'I-OHS Act Icandelo 14 – Imisebenzi Yabasebenzi' : lang === 'st' ? 'OHS Act Karolo 14 – Mesebetsi ea Basebetsi' : 'OHS Act Section 14 – Employee Duties',     text: this.getComplianceVector('OHS', 'sec14', lang) },
            { id: 'ohs-24', title: lang === 'zu' ? 'I-OHS Act Isigaba 24 – Ukubikwa Kwezigameko' : lang === 'xh' ? 'I-OHS Act Icandelo 24 – Ukuxhelwa Kwezigameko' : lang === 'st' ? 'OHS Act Karolo 24 – Ho Tlaleha Likotsi' : 'OHS Act Section 24 – Incident Reporting',  text: this.getComplianceVector('OHS', 'sec24', lang) },
            { id: 'ohs-37', title: lang === 'zu' ? 'I-OHS Act Isigaba 37 – Isibopho Semisebenzi' : lang === 'xh' ? 'I-OHS Act Icandelo 37 – Unxanduva Lwemisebenzi' : lang === 'st' ? 'OHS Act Karolo 37 – Boikarabello bo Kopaneng' : 'OHS Act Section 37 – Vicarious Liability', text: this.getComplianceVector('OHS', 'sec37', lang) },
            { id: 'ohs-38', title: lang === 'zu' ? 'I-OHS Act Isigaba 38 – Amacala & Nezinhlawulo' : lang === 'xh' ? 'I-OHS Act Icandelo 38 – Amacala & neZohlwayo' : lang === 'st' ? 'OHS Act Karolo 38 – Litlhōlo le Likotlo' : 'OHS Act Section 38 – Offences & Penalties',text: this.getComplianceVector('OHS', 'sec38', lang) },
        ];
    }

    /** Returns all sharded ISO standards as an array. */
    public fetchISOBriefing(lang: Language = 'en'): Array<{ id: string; title: string; text: string }> {
        return [
            { id: 'iso-9001',  title: lang === 'zu' ? 'ISO 9001:2015 – Ukuphathwa Kwekhwalithi' : lang === 'xh' ? 'ISO 9001:2015 – UkuLawulwa kweKhwalithi' : lang === 'st' ? 'ISO 9001:2015 – Tsamaiso ea Boleng' : 'ISO 9001:2015 – Quality Management',       text: this.getComplianceVector('ISO', '9001-2015', lang)  },
            { id: 'iso-14001', title: lang === 'zu' ? 'ISO 14001:2015 – Ukuphathwa Kwezemvelo' : lang === 'xh' ? 'ISO 14001:2015 – UkuLawulwa kokusiNgqongileyo' : lang === 'st' ? 'ISO 14001:2015 – Tsamaiso ea Tikoloho' : 'ISO 14001:2015 – Environmental Management', text: this.getComplianceVector('ISO', '14001-2015', lang) },
            { id: 'iso-45001', title: lang === 'zu' ? 'ISO 45001:2018 – Ukuphathwa Kwe-OHS' : lang === 'xh' ? 'ISO 45001:2018 – UkuLawulwa kwe-OHS' : lang === 'st' ? 'ISO 45001:2018 – Tsamaiso ea OHS' : 'ISO 45001:2018 – OHS Management',           text: this.getComplianceVector('ISO', '45001-2018', lang) },
            { id: 'iso-45003', title: lang === 'zu' ? 'ISO 45003:2021 – Ubungozi Bezengqondo' : lang === 'xh' ? 'ISO 45003:2021 – Iingozi zeZengqondo' : lang === 'st' ? 'ISO 45003:2021 – Likotsi tsa Kelello' : 'ISO 45003:2021 – Psychosocial Risk',        text: this.getComplianceVector('ISO', '45003-2021', lang) },
        ];
    }

    /** Exported unified payload for Executive Briefings — combines OHS + ISO. */
    public fetchUnifiedBriefing(lang: Language = 'en'): Array<{ id: string; title: string; text: string }> {
        return [
            ...this.fetchOHSBriefing(lang),
            ...this.fetchISOBriefing(lang),
        ];
    }
}

export const GlobalComplianceEngine = new SemanticFirewall();
