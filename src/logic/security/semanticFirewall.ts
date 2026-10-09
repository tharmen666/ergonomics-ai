/**
 * ERGOSAFE REBORN v3.0: SEMANTIC FIREWALL
 * 
 * SAIF PROTOCOL ENABLED: This module shards core ISO and OHS Act legal text
 * into protected, immutable constructs. It prevents accidental contamination of 
 * legal liability logic by the broader application state.
 *
 * V&V AUDIT [2026-05-25]: Expanded to include ISO 9001 (Quality) and ISO 14001
 * (Environmental) - both voluntary standards. Section 38 text describes offences
 * and penalties generically; no penalty amounts are stated.
 * Stabilised with full multilingual translation matrices (EN, ZU, XH, ST, SW, ZH, DE).
 */

import { Language } from '../../utils/translations';

class SemanticFirewall {
    // Isolated multilingual storage (in-memory; not encrypted)
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
        // TODO(legal-verify): removed 2026 DEL Administrative Directive across all translations
        this._ohsCore.set('sec8', {
            en: "Section 8 (General Duties of Employers): Every employer shall provide and maintain, as far as is reasonably practicable, a working environment that is safe and without risk to the health of his employees.",
            zu: "Isigaba 8 (Imisebenzi Ejwayelekile Yabaqashi): Wonke umqashi uzohlinzeka futhi agcine, ngendlela efanele, indawo yokusebenza ephephile nengenawo ubungozi bezempilo.",
            xh: "Icandelo 8 (Imisebenzi Jikelele Yabaqeshi): Wonke umqeshi uya kubonelela kwaye agcine, ngokusemandleni, indawo yokusebenza ekhuselekileyo kwaye ingenabungozi empilweni.",
            st: "Karolo 8 (Mesebetsi e Akaretsang ea Bahapi): Mohapi e mong le e mong o tla fana le ho boloka, ka moo ho ka khonehang, tikoloho ea ho sebetsa e bolokehileng le e se nang kotsi bophelong.",
            sw: "Kifungu cha 8 (Majukumu Makuu ya Waajiri): Kila mwajiri atatoa na kudumisha, kwa kadiri inavyowezekana, mazingira ya kazi ambayo ni salama na yasiyo na hatari kwa afya.",
            zh: "第 8 条（雇主的一般职责）：每个雇主都应在合理可行的范围内提供并维持一个安全且对员工健康无风险的工作环境。",
            de: "Abschnitt 8 (Allgemeine Pflichten der Arbeitgeber): Jeder Arbeitgeber muss, soweit dies vernünftigerweise praktisch möglich ist, eine Arbeitsumgebung bereitstellen und aufrechterhalten, die sicher und ohne Gesundheitsrisiken ist.",
            af: "Artikel 8 (Algemene Pligte van Werkgewers): Elke werkgewer sal so ver as wat redelikerwys prakties is, 'n werksomgewing voorsien en in stand hou wat veilig en sonder risiko vir gesondheid is."
        });

        this._ohsCore.set('sec14', {
            en: "Section 14 (General Duties of Employees): Every employee shall take reasonable care for their own health and safety and that of others who may be affected by their acts or omissions.",
            zu: "Isigaba 14 (Imisebenzi Ejwayelekile Yabasebenzi): Wonke umsebenzi uzonakekela impilo yakhe nokuphepha kwakhe kanye nokwabanye.",
            xh: "Icandelo 14 (Imisebenzi Jikelele Yabasebenzi): Wonke umsebenzi uya kuthatha unonophelo olufanelekileyo lwempilo yakhe nokhuseleko lwakhe kunye nolwabanye.",
            st: "Karolo 14 (Mesebetsi e Akaretsang ea Basebetsi): Mosebetsi e mong le e mong o tla hlokomela bophelo le polokeho ea hae le ea ba bang ka tsela e loketseng.",
            sw: "Kifungu cha 14 (Majukumu Makuu ya Wafanyakazi): Kila mfanyakazi atachukua tahadhari nzuri kwa afya na usalama wao na wa wengine.",
            zh: "第 14 条（雇员的一般职责）：每个雇员都应对自己和可能受其行为或疏忽影响的其他人的健康与安全给予合理的关注。",
            de: "Abschnitt 14 (Allgemeine Pflichten der Arbeitnehmer): Jeder Arbeitnehmer muss in angemessener Weise für seine eigene Gesundheit und Sicherheit sowie die anderer Sorge tragen.",
            af: "Artikel 14 (Algemene Pligte van Werknemers): Elke werknemer moet redelike sorg neem vir hul eie gesondheid en veiligheid en dié van ander."
        });

        // TODO(legal-verify): removed claim that Section 37 provides automatic legal defense or immunity; updated to reflect acts/omissions and s37(2) agreements
        this._ohsCore.set('sec37', {
            en: "Section 37 (Acts or Omissions of Employees and Mandataries): Governs the acts or omissions of employees and mandataries, and provides for written agreements in terms of Section 37(2) regarding compliance arrangements.",
            zu: "Isigaba 37 (Izenzo noma Ukunyakaza Kwabasebenzi & Mandataries): Silawula izenzo noma ukunganaki kwabasebenzi nabathunywa, futhi sivumela izivumelwano ezibhaliwe ngaphansi kweSigaba 37(2).",
            xh: "Icandelo 37 (Izenzo/Ukunyanzeliswa Kwabasebenzi kunye Nabathunywa): Silawula izenzo okanye ukungakhathali kwabasebenzi kunye nabathunywa, kwaye sibonelela ngezivumelwano ezibhaliweyo phantsi kweCandelo 37(2).",
            st: "Karolo 37 (Diketso/Liketso tsa Basebetsi le Baemeli): E laola liketso kapa liphoso tsa basebetsi le baemeli, 'me e lumella litumellano tse ngotsoeng tlas'a Karolo 37(2).",
            sw: "Kifungu cha 37 (Matendo/Uasi wa Wafanyakazi & Mamlaka): Inasimamia matendo au uzembe wa wafanyakazi na wawakilishi, ikitoa makubaliano ya maandishi chini ya Kifungu cha 37(2).",
            zh: "第 37 条（雇员与代理人的行为/疏忽）：规范雇员和代理人的行为或疏忽，并规定根据第 37(2) 条签订有关合规安排的书面协议。",
            de: "Abschnitt 37 (Handlungen/Unterlassungen von Arbeitnehmern und Bevollmächtigten): Regelt Handlungen und Unterlassungen von Mitarbeitern und Beauftragten und sieht schriftliche Vereinbarungen gemäß Abschnitt 37(2) vor.",
            af: "Artikel 37 (Dade/Versuim van Werknemers en Mandatarisse): Reël handelinge of versuim van werknemers en mandatarisse en maak voorsiening vir skriftelike ooreenkomste ingevolge Artikel 37(2)."
        });

        // TODO(legal-verify): removed fabricated 2026 Amendment fines (R5,000,000 / 10% turnover) and imprisonment figures
        this._ohsCore.set('sec38', {
            en: "Section 38 (Offences, Penalties and Special Orders): Outlines statutory offences and penalties for non-compliance with the provisions of the Occupational Health and Safety Act and its regulations.",
            zu: "Isigaba 38 (Amacala Nezinhlawulo): Sibeka amacala nezinhlawulo ezisemthethweni zokungalandelwa kwemibandela ye-OHS Act nemithethonqubo yayo.",
            xh: "Icandelo 38 (Amacala kunye neZohlwayo): Ichaza amacala asemthethweni nezohlwayo zokungathobeli imimiselo yomThetho we-OHS.",
            st: "Karolo 38 (Litlhōlo le Likotlo): E hlalosa litlolo tsa molao le likotlo tsa ho se latele lipehelo tsa Molao oa OHS.",
            sw: "Kifungu cha 38 (Makosa na Adhabu): Inaeleza makosa ya kisheria na adhabu kwa kutofuata masharti ya Sheria ya OHS.",
            zh: "第 38 条（违法行为与处罚）：概述违反《职业健康与安全法》及其法规规定的法定违法行为和处罚。",
            de: "Abschnitt 38 (Straftaten und Strafen): Umfasst gesetzliche Straftaten und Strafen bei Nichteinhaltung der Bestimmungen des Arbeitsschutzgesetzes.",
            af: "Artikel 38 (Misdrywe en Strawwe): Sit statutêre misdrywe en strawwe uiteen vir nie-nakoming van die Wet."
        });

        this._ohsCore.set('sec24', {
            en: "Section 24 (Reporting of Certain Incidents): Prescribes mandatory reporting to an inspector within the prescribed period for specified workplace incidents, injuries, and health hazards.",
            zu: "Isigaba 24 (Ukubikwa Kwezigameko): Sibeka ukubikwa okugunyaziwe kumhloli wezabasebenzi kwezigameko ezithile zasemsebenzini.",
            xh: "Icandelo 24 (Ukuxhelwa Kwezigameko): Simisela ukuxhelwa okusisinyanzelo kumhloli weziganeko ezithile zasemsebenzini.",
            st: "Karolo 24 (Ho Tlaleha Likotsi): E laela ho tlalehoa ho mohlahlobi ha likotsi tse itseng tsa mosebetsing.",
            sw: "Kifungu cha 24 (Kuripoti Matukio): Inaagiza kuripoti kwa lazima kwa mkaguzi kwa matukio fulani ya mahali pa kazi.",
            zh: "第 24 条（特定事件的报告）：规定在法定期限内向检查员强制报告特定的工作场所事件、伤害和健康危害。",
            de: "Abschnitt 24 (Meldung von Vorfällen): Schreibt die Meldung bestimmter Arbeitsunfälle an einen Arbeitsinspektor vor.",
            af: "Artikel 24 (Aanmelding van Voorvalle): Skryf verpligte aanmelding van sekere voorvalle by 'n inspekteur voor."
        });
    }

    private shardISOLogic() {
        this._isoCore.set('9001-2015', {
            en: "ISO 9001:2015 (Voluntary Quality Management Systems): Outlines guidance for a process-based approach with documented performance evaluation under Clause 9.1.",
            zu: "ISO 9001:2015 (Izinhlelo Zokuphathwa Kwekhwalithi - Voluntary): Isiqondiso sokuphathwa kwekhwalithi ngaphansi kwe-Clause 9.1.",
            xh: "ISO 9001:2015 (Iinkqubo zokuLawulwa kweSimo seKhwalithi - Voluntary): Isikhokelo solawulo lwekhwalithi phantsi kwe-Clause 9.1.",
            st: "ISO 9001:2015 (Tsamaiso ea Boleng ba Tsamaiso - Voluntary): Tataiso ea taolo ea boleng tlas'a Clause 9.1.",
            sw: "ISO 9001:2015 (Mifumo ya Usimamizi wa Ubora - Hiari): Mwongozo wa tathmini ya utendaji chini ya Kifungu cha 9.1.",
            zh: "ISO 9001:2015（自愿性质量管理体系）：概述第 9.1 条款下的绩效评估指导原则。",
            de: "ISO 9001:2015 (Freiwillige Qualitätsmanagementsysteme): Bietet Leitlinien für prozessbasierte Leistungsbewertung gemäß Klausel 9.1.",
            af: "ISO 9001:2015 (Vrywillige Kwaliteitbestuurstelsels): Riglyne vir prosesgebaseerde evaluering ingevolge Klousule 9.1."
        });

        this._isoCore.set('14001-2015', {
            en: "ISO 14001:2015 (Voluntary Environmental Management Systems): Voluntary international standard providing operational planning and control guidance for environmental aspects.",
            zu: "ISO 14001:2015 (Izinhlelo Zokuphathwa Kwezemvelo - Voluntary): Umhlahlandlela wokulawulwa kwezemvelo.",
            xh: "ISO 14001:2015 (Iinkqubo zokuLawulwa kokusiNgqongileyo - Voluntary): Isikhokelo solawulo lokusingqongileyo.",
            st: "ISO 14001:2015 (Tsamaiso ea Tikoloho - Voluntary): Tataiso ea tsamaiso ea tikoloho.",
            sw: "ISO 14001:2015 (Mifumo ya Usimamizi wa Mazingira - Hiari): Mwongozo wa uendeshaji wa mazingira.",
            zh: "ISO 14001:2015（自愿性环境管理体系）：提供环境因素运行策划和控制指导的自愿性国际标准。",
            de: "ISO 14001:2015 (Freiwillige Umweltmanagementsysteme): Bietet Leitlinien für betriebliche Kontrollen von Umweltaspekten.",
            af: "ISO 14001:2015 (Vrywillige Omgewingsbestuurstelsels): Riglyne vir operasionele beplanning van omgewingsaspekte."
        });

        this._isoCore.set('45001-2018', {
            en: "ISO 45001:2018 (Voluntary Occupational Health & Safety Management): Voluntary international standard outlining best practice for hazard identification, risk assessment (Clause 6.1), and worker consultation.",
            zu: "ISO 45001:2018 (Ukuphathwa Kwe-OHS - Voluntary): Umhlahlandlela wokuzithandela wokuhlola ubungozi (Clause 6.1).",
            xh: "ISO 45001:2018 (Ulawulo lwe-OHS - Voluntary): Isikhokelo sokuzithandela sokuvavanya iingozi (Solotya 6.1).",
            st: "ISO 45001:2018 (Tsamaiso ea OHS - Voluntary): Tataiso ea ho hlahloba likotsi (Clause 6.1).",
            sw: "ISO 45001:2018 (Usimamizi wa Afya na Usalama Mahali pa Kazi - Hiari): Kiwango cha hiari cha kimataifa cha kutathmini hatari (Kifungu cha 6.1).",
            zh: "ISO 45001:2018（自愿性职业健康与安全管理）：关于危险源辨识与风险评估（第 6.1 条款）及员工协商的自愿性国际最佳实践标准。",
            de: "ISO 45001:2018 (Freiwilliges Arbeitsschutzmanagement): Freiwilliger internationaler Standard für Gefährdungsbeurteilung und Risikobewertung (Klausel 6.1).",
            af: "ISO 45001:2018 (Vrywillige Beroepsgesondheid en Veiligheidsbestuur): Vrywillige internasionale standaard vir risikobepaling ingevolge Klousule 6.1."
        });

        this._isoCore.set('45003-2021', {
            en: "ISO 45003:2021 (Voluntary Psychological Health & Safety at Work): Voluntary guidelines for managing psychosocial risks and promoting wellbeing in the workplace (Clause 6.1.2).",
            zu: "ISO 45003:2021 (Impilo Yengqondo Emsebenzini - Voluntary): Isiqondiso sokuzithandela sokulawula ubungozi bezengqondo (Clause 6.1.2).",
            xh: "ISO 45003:2021 (Impilo yezengqondo eMsebenzini - Voluntary): Isikhokelo sokuzithandela sokulawula iingozi zengqondo (Solotya 6.1.2).",
            st: "ISO 45003:2021 (Bophelo bo Botle ba Kelello Mosebetsing - Voluntary): Tataiso ea ho laola likotsi tsa kelello (Clause 6.1.2).",
            sw: "ISO 45003:2021 (Afya ya Kisaikolojia Kazini - Hiari): Mwongozo wa hiari wa kudhibiti hatari za kisaikolojia (Kifungu cha 6.1.2).",
            zh: "ISO 45003:2021（自愿性工作中心理健康与安全）：管理工作场所心理社会风险的自愿性国际指南（第 6.1.2 条款）。",
            de: "ISO 45003:2021 (Freiwillige Psychische Gesundheit am Arbeitsplatz): Freiwillige Leitlinien für das Management psychosozialer Risiken (Klausel 6.1.2).",
            af: "ISO 45003:2021 (Vrywillige Sielkundige Gesondheid by die Werk): Vrywillige riglyne vir die bestuur van psigososiale risiko's (Klousule 6.1.2)."
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
            { id: 'ohs-8',  title: lang === 'zu' ? 'I-OHS Act Isigaba 8 – Umsebenzi Wokunakekela' : lang === 'xh' ? 'I-OHS Act Icandelo 8 – Umsebenzi Wokukhathalela' : lang === 'st' ? 'OHS Act Karolo 8 – Mosebetsi oa Tlhokomelo' : lang === 'sw' ? 'Sheria ya OHS Kifungu cha 8 – Wajibu wa Utunzaji' : lang === 'zh' ? 'OHS 法案第 8 条 – 关怀职责' : lang === 'de' ? 'OHS-Gesetz Abschnitt 8 – Fürsorgepflicht' : 'OHS Act Section 8 – Duty of Care',        text: this.getComplianceVector('OHS', 'sec8', lang)  },
            { id: 'ohs-14', title: lang === 'zu' ? 'I-OHS Act Isigaba 14 – Imisebenzi Yabasebenzi' : lang === 'xh' ? 'I-OHS Act Icandelo 14 – Imisebenzi Yabasebenzi' : lang === 'st' ? 'OHS Act Karolo 14 – Mesebetsi ea Basebetsi' : lang === 'sw' ? 'Sheria ya OHS Kifungu cha 14 – Majukumu ya Wafanyakazi' : lang === 'zh' ? 'OHS 法案第 14 条 – 雇员职责' : lang === 'de' ? 'OHS-Gesetz Abschnitt 14 – Pflichten der Arbeitnehmer' : 'OHS Act Section 14 – Employee Duties',     text: this.getComplianceVector('OHS', 'sec14', lang) },
            { id: 'ohs-24', title: lang === 'zu' ? 'I-OHS Act Isigaba 24 – Ukubikwa Kwezigameko' : lang === 'xh' ? 'I-OHS Act Icandelo 24 – Ukuxhelwa Kwezigameko' : lang === 'st' ? 'OHS Act Karolo 24 – Ho Tlaleha Likotsi' : lang === 'sw' ? 'Sheria ya OHS Kifungu cha 24 – Kuripoti Matukio' : lang === 'zh' ? 'OHS 法案第 24 条 – 事故报告' : lang === 'de' ? 'OHS-Gesetz Abschnitt 24 – Meldung von Vorfällen' : 'OHS Act Section 24 – Incident Reporting',  text: this.getComplianceVector('OHS', 'sec24', lang) },
            { id: 'ohs-37', title: lang === 'zu' ? 'I-OHS Act Isigaba 37 – Izenzo Zabathunywa' : lang === 'xh' ? 'I-OHS Act Icandelo 37 – Izenzo Zabathunywa' : lang === 'st' ? 'OHS Act Karolo 37 – Diketso tsa Baemeli' : lang === 'sw' ? 'Sheria ya OHS Kifungu cha 37 – Vitendo vya Wawakilishi' : lang === 'zh' ? 'OHS 法案第 37 条 – 代理人行为' : lang === 'de' ? 'OHS-Gesetz Abschnitt 37 – Handlungen von Beauftragten' : 'OHS Act Section 37 – Acts or Omissions of Employees and Mandataries', text: this.getComplianceVector('OHS', 'sec37', lang) },
            { id: 'ohs-38', title: lang === 'zu' ? 'I-OHS Act Isigaba 38 – Amacala & Nezinhlawulo' : lang === 'xh' ? 'I-OHS Act Icandelo 38 – Amacala & neZohlwayo' : lang === 'st' ? 'OHS Act Karolo 38 – Litlhōlo le Likotlo' : lang === 'sw' ? 'Sheria ya OHS Kifungu cha 38 – Makosa na Adhabu' : lang === 'zh' ? 'OHS 法案第 38 条 – 违法与处罚' : lang === 'de' ? 'OHS-Gesetz Abschnitt 38 – Straftaten & Strafen' : 'OHS Act Section 38 – Offences & Penalties',text: this.getComplianceVector('OHS', 'sec38', lang) },
        ];
    }

    /** Returns all sharded ISO standards as an array. */
    public fetchISOBriefing(lang: Language = 'en'): Array<{ id: string; title: string; text: string }> {
        return [
            { id: 'iso-9001',  title: lang === 'zu' ? 'ISO 9001:2015 – Ukuphathwa Kwekhwalithi' : lang === 'xh' ? 'ISO 9001:2015 – UkuLawulwa kweKhwalithi' : lang === 'st' ? 'ISO 9001:2015 – Tsamaiso ea Boleng' : lang === 'sw' ? 'ISO 9001:2015 – Usimamizi wa Ubora' : lang === 'zh' ? 'ISO 9001:2015 – 质量管理' : lang === 'de' ? 'ISO 9001:2015 – Qualitätsmanagement' : 'ISO 9001:2015 – Quality Management (Voluntary)',       text: this.getComplianceVector('ISO', '9001-2015', lang)  },
            { id: 'iso-14001', title: lang === 'zu' ? 'ISO 14001:2015 – Ukuphathwa Kwezemvelo' : lang === 'xh' ? 'ISO 14001:2015 – UkuLawulwa kokusiNgqongileyo' : lang === 'st' ? 'ISO 14001:2015 – Tsamaiso ea Tikoloho' : lang === 'sw' ? 'ISO 14001:2015 – Usimamizi wa Mazingira' : lang === 'zh' ? 'ISO 14001:2015 – 环境管理' : lang === 'de' ? 'ISO 14001:2015 – Umweltmanagement' : 'ISO 14001:2015 – Environmental Management (Voluntary)', text: this.getComplianceVector('ISO', '14001-2015', lang) },
            { id: 'iso-45001', title: lang === 'zu' ? 'ISO 45001:2018 (Voluntary) – Ukuphathwa Kwe-OHS' : lang === 'xh' ? 'ISO 45001:2018 (Voluntary) – UkuLawulwa kwe-OHS' : lang === 'st' ? 'ISO 45001:2018 (Voluntary) – Tsamaiso ea OHS' : lang === 'sw' ? 'ISO 45001:2018 (Voluntary) – Usimamizi wa OHS' : lang === 'zh' ? 'ISO 45001:2018 (自愿性) – OHS 管理' : lang === 'de' ? 'ISO 45001:2018 (Freiwillig) – Arbeitsschutzmanagement' : 'ISO 45001:2018 (Voluntary) – OHS Management',           text: this.getComplianceVector('ISO', '45001-2018', lang) },
            { id: 'iso-45003', title: lang === 'zu' ? 'ISO 45003:2021 (Voluntary) – Ubungozi Bezengqondo' : lang === 'xh' ? 'ISO 45003:2021 (Voluntary) – Iingozi zeZengqondo' : lang === 'st' ? 'ISO 45003:2021 (Voluntary) – Likotsi tsa Kelello' : lang === 'sw' ? 'ISO 45003:2021 (Voluntary) – Hatari ya Kisaikolojia' : lang === 'zh' ? 'ISO 45003:2021 (自愿性) – 心理社会风险' : lang === 'de' ? 'ISO 45003:2021 (Freiwillig) – Psychosoziales Risiko' : 'ISO 45003:2021 (Voluntary) – Psychosocial Risk',        text: this.getComplianceVector('ISO', '45003-2021', lang) },
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
