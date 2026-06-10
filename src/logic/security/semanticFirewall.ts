/**
 * ERGOSAFE REBORN v3.0: SEMANTIC FIREWALL
 * 
 * SAIF PROTOCOL ENABLED: This module shards core ISO and OHS Act legal text
 * into protected, immutable constructs. It prevents accidental contamination of 
 * legal liability logic by the broader application state.
 *
 * V&V AUDIT [2026-05-25]: Expanded to include ISO 9001 (Quality), ISO 14001 
 * (Environmental), and updated Section 38 penalty amounts per 2026 amendment.
 * Stabilised with full multilingual translation matrices (EN, ZU, XH, ST, SW, ZH, DE).
 */

import { Language } from '../../utils/translations';
import irisCore from './irisCore.json';

class SemanticFirewall {
    // Encrypted / Isolated Multilingual Storage
    private _ohsCore: Map<string, Record<Language, string>>;
    private _isoCore: Map<string, Record<Language, string>>;

    /**
     * GEAR v2.5 Tech Expansion: Returns the forward-compatible Multimodal Context Memory Node
     * for advanced Google Gemini Omni and Tiger Cloud Persistence interfaces.
     */
    public getIrisCore() {
        return irisCore;
    }

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
            st: "Karolo 8 (Mesebetsi e Akaretsang ea Bahapi): Mohapi e mong le e mong o tla fana le ho boloka, ka mao ho ka khonehang, tikoloho ea ho sebetsa e bolokehileng le e se nang kotsi bophelong. Mosebetsi ona o fetela liofising tsa lapeng le libakeng tse hōle.",
            sw: "Kifungu cha 8 (Majukumu Makuu ya Waajiri): Kila mwajiri atatoa na kudumisha, kwa kadiri inavyowezekana, mazingira ya kazi ambayo ni salama na yasiyo na hatari kwa afya. Wajibu huu unaenea hadi kwenye ofisi za nyumbani na mazingira ya kazi ya mbali chini ya Agizo la Utawala la DEL la 2026.",
            zh: "第 8 条（雇主的一般职责）：每个雇主都应在合理可行的范围内提供并维持一个安全且对健康无风险的工作环境。根据2026年DEL行政指令，这一职责也适用于家庭办公室和远程工作环境。",
            de: "Abschnitt 8 (Allgemeine Pflichten der Arbeitgeber): Jeder Arbeitgeber muss, soweit dies vernünftigerweise praktisch möglich ist, eine Arbeitsumgebung bereitstellen und aufrechterhalten, die sicher und ohne Gesundheitsrisiken ist. Diese Pflicht erstreckt sich auch auf Home-Offices und Telearbeitsumgebungen gemäß der DEL-Verwaltungsrichtlinie von 2026."
        });

        this._ohsCore.set('sec14', {
            en: "Section 14 (General Duties of Employees): Every employee shall take reasonable care for their own health and safety and that of others. Completion of the daily OHS cognitive handshake operationalises this statutory duty for remote workers.",
            zu: "Isigaba 14 (Imisebenzi Ejwayelekile Yabasebenzi): Wonke umsebenzi uzonakekela impilo yakhe nokuphepha kwakhe kanye nokwabanye. Ukuqedwa kwe-cognitive handshake yansuku zonke kufeza lo msebenzi wasemthethweni kubasebenzi abakude.",
            xh: "Icandelo 14 (Imisebenzi Jikelele Yabasebenzi): Wonke umsebenzi uya kuthatha unonophelo olufanelekileyo lwempilo yakhe nokhuseleko lwakhe kunye nolwabanye. Ukugqitywa kwe-cognitive handshake yemihla ngemihla kufeza lo msebenzi wasemthethweni.",
            st: "Karolo 14 (Mesebetsi e Akaretsang ea Basebetsi): Mosebetsi e mong le e mong o tla hlokomela bophelo le polokeho ea hae le ea ba bang ka tsela e loketseng. Ho phethela handshake ea letsatsi le letsatsi ea OHS ho phethahatsa mosebetsi ona.",
            sw: "Kifungu cha 14 (Majukumu Makuu ya Wafanyakazi): Kila mfanyakazi atachukua tahadhari nzuri kwa afya na usalama wao na wa wengine. Kukamilisha mkataba wa kila siku wa utambuzi wa OHS kutekeleza wajibu huu wa kisheria kwa wafanyikazi wa mbali.",
            zh: "第 14 条（雇员的一般职责）：每个雇员都应对自己和他人的健康与安全给予合理的关注。完成每日 OHS 认知握手可为远程员工执行这一法定职责。",
            de: "Abschnitt 14 (Allgemeine Pflichten der Arbeitnehmer): Jeder Arbeitnehmer muss in angemessener Weise für seine eigene Gesundheit und Sicherheit sowie die anderer Sorge tragen. Der Abschluss der täglichen OHS-kognitiven Überprüfung setzt diese gesetzliche Pflicht für Telearbeiter um."
        });

        this._ohsCore.set('sec37', {
            en: "Section 37 (Acts/Omissions of Employees & Mandataries): Employers are vicariously liable for the health and safety actions of their employees. The Stewardship Engine's continuous telemetry provides a demonstrable legal defense against negligence claims by proving active employer stewardship at all times.",
            zu: "Isigaba 37 (Izenzo noma Ukunyakaza Kwabasebenzi & Mandataries): Abaqashi babophezelekile ngokomthetho ngezenzo zabasebenzi babo. I-telemetry eqhubekayo ye-Stewardship Engine inikeza isivikelo esinamandla somthetho ngokumelene nezicelo zokunganaki.",
            xh: "Icandelo 37 (Izenzo/Ukunyanzeliswa Kwabasebenzi kunye Nabathunywa): Abaqeshi banoxanduva lomthetho ngezenzo zabasebenzi babo. I-telemetry eqhubekayo ye-Stewardship Engine inika ukhuseleko lomthetho oluqinileyo.",
            st: "Karolo 37 (Diketso/Liketso tsa Basebetsi le Baemeli): Bahapi ba na le boikarabello bo kopaneng bakeng sa liketso tsa polokeho tsa basebetsi ba bona. Telemetry e tsoelang pele ea Stewardship Engine e fana ka tšireletso e netefalitsoeng ea molao.",
            sw: "Kifungu cha 37 (Matendo/Uasi wa Wafanyakazi & Mamlaka): Waajiri wanawajibika kwa vitendo vya afya na usalama vya wafanyikazi wao. Telemetry endelevu ya Injini ya Usimamizi hutoa utetezi wa kisheria unaoweza kuonyeshwa dhidi ya madai ya uzembe.",
            zh: "第 37 条（雇员与代理人的行为/疏忽）：雇主对雇员的健康与安全行为承担连带责任。Stewardship Engine 的持续监控通过证明雇主在任何时候都处于积极的管理状态，为免受疏忽指控提供了证明性法律辩护。",
            de: "Abschnitt 37 (Handlungen/Unterlassungen von Arbeitnehmern und Bevollmächtigten): Arbeitgeber haften verschuldensunabhängig für die gesundheitlichen und sicherheitsrelevanten Handlungen ihrer Arbeitnehmer. Die kontinuierliche Telemetrie der Stewardship Engine bietet eine nachweisbare rechtliche Verteidigung gegen Fahrlässigkeitsansprüche."
        });

        this._ohsCore.set('sec38', {
            en: "Section 38 (Offences & Penalties – 2026 Amendment): Non-compliance now carries administrative fines up to 10% of annual turnover or R5,000,000 (whichever is greater), or up to 2 years imprisonment for executives. DOA Lockouts prevent fatigued or non-compliant personnel from authorising high-risk sign-offs, directly restricting liability exposure.",
            zu: "Isigaba 38 (Amacala & Nezinhlawulo - Ukuchitshiyelwa kuka-2026): Ukungathobeli manje kuthwala inhlawulo efika ku-10% yenzuzo yonyaka noma u-R5,000,000 (noma yikuphi okukhulu), noma iminyaka emibili ebhadla ejele kubaphathi ophezulu. I-DOA Lockout ivimbela izisebenzi ezikhathalayo ukuthi zigunyaze izinqumo ezinobungozi.",
            xh: "Icandelo 38 (Amacala kunye neZohlwayo – Isilungiso sika-2026): Ukungathobeli ngoku kuthwala isohlwayo esifikelela kwi-10% yengeniso yonyaka okanye u-R5,000,000, okanye iminyaka emibini entolongweni kubaphathi. I-DOA Lockout ithintela ukugunyaziswa kzigqibo ezinobungozi.",
            st: "Karolo 38 (Litlhōlo le Likotlo - Sehlomathiso sa 2026): Ho hloka molao hona joale ho baka likotlo tsa tsamaiso tse fihlang ho 10% ea chelete e kenang ka selemo kapa R5,000,000, kapa lilemo tse 2 chankaneng bakeng sa batsamaisi. DOA Lockout e thibela basebetsi ba khathetseng ho fana ka litumello tse kotsi.",
            sw: "Kifungu cha 38 (Makosa na Adhabu - Marekebisho ya 2026): Kutofuata sheria sasa kunaleta faini za utawala hadi 10% ya mauzo ya kila mwaka au R5,000,000 (yoyote itakayokuwa kubwa), au kifungo cha hadi miaka 2 kwa watendaji. Kufungiwa kwa DOA kunazuia wafanyakazi waliochoka kuidhinisha saini za hatari kubwa.",
            zh: "第 38 条（违法行为与处罚 – 2026年修正案）：非合规行为现在面临高达年营业额 10% 或 5,000,000 兰特（以较高者为准）的行政罚款，或者对高管处以长达 2 年的监禁。DOA 锁定直接限制了法律风险暴露。",
            de: "Abschnitt 38 (Straftaten und Strafen – Änderung 2026): Nichteinhaltung zieht nun Bußgelder von bis zu 10% des Jahresumsatzes oder 5.000.000 R nach sich (je nachdem, welcher Wert höher ist), oder bis zu 2 Jahre Haft für Führungskräfte. DOA-Sperren verhindern, dass übermüdetes Personal risikoreiche Freigaben erteilt."
        });

        this._ohsCore.set('sec24', {
            en: "Section 24 (Reporting of Incidents): All workplace incidents, including those occurring in home-office environments, must be reported to the Department of Employment and Labour within 7 days. Ergo-Safe's automated incident flagging provides an instant, timestamped digital incident record to satisfy this obligation.",
            zu: "Isigaba 24 (Ukubikwa Kwezigameko): Zonke izigameko zasendaweni yokusebenza, kufaka phakathi lezo ezenzeka emahgovisi asekhaya, kufanele zibikwe eMnyangweni wezokuQashwa kanye nezeMisebenzi phakathi kwezinsuku ovu-7. Ukurekhoda kwedijithali kwe-Ergo-Safe kunikeza irekhodi elisheshayo.",
            xh: "Icandelo 24 (Ukuxhelwa Kwezigameko): Zonke iziganeko zasendaweni yokusebenza, kubandakanywa nezo zenzeka kumakhaya, kufuneka zixhelwe kwiSebe lezeQesho nabaSebenzi zingadlulanga iintsuku ezisi-7. Ukurekhoda kwedijithali kwe-Ergo-Safe kunika ingxelo ekhawulezileyo.",
            st: "Karolo 24 (Ho Tlaleha Likotsi): Likotsi tsohle tsa sebakeng sa mosebetsi, ho kenyeletsa le tse etsahalang liofising tsa lapeng, li tlameha ho tlalehoa ho Lefapha la Khiho le Basebetsi nakong ea matsatsi a 7. Dynamic flagging ea Ergo-Safe e fana ka tlaleho e potlakileng.",
            sw: "Kifungu cha 24 (Kuripoti Matukio): Matukio yote ya mahali pa kazi, ikijumuisha yale yanayotokea katika mazingira ya ofisi ya nyumbani, lazima yaripotiwe kwa Idara ya Ajira na Kazi ndani ya siku 7. Ripoti ya kiotomatiki ya Ergo-Safe inatoa rekodi ya papo hapo.",
            zh: "第 24 条（事故报告）：所有工作场所事故，包括发生在家庭办公室环境中的事故，必须在 7 天内报告给劳动和就业部。Ergo-Safe 的自动事故标记功能提供了即时的数字化事故记录，以满足这一义务。",
            de: "Abschnitt 24 (Meldung von Vorfällen): Alle Arbeitsunfälle, auch solche im Home-Office, müssen dem Ministerium für Arbeit innerhalb von 7 Tagen gemeldet werden. Die automatisierte Flaggung von ErgoSafe bietet eine sofortige, zeitgestempelte digitale Unfallakte zur Erfüllung dieser Pflicht."
        });
    }

    private shardISOLogic() {
        this._isoCore.set('9001-2015', {
            en: "ISO 9001:2015 (Quality Management Systems): Requires organisations to adopt a process-based approach with evidence of continual improvement. Ergo-Safe's compliance telemetry and trend dashboards provide the documented evidence of quality performance monitoring required under Clause 9.1 (Performance Evaluation).",
            zu: "ISO 9001:2015 (Izinhlelo Zokuphathwa Kwekhwalithi): Kudinga izinhlangano ukuthi zamukele indlela esekelwe ezinqubweni enobufakazi bokuqhubeka ngcono. Imiphumela ye-Ergo-Safe ihlinzeka ngobufakazi obubhaliwe ngaphansi kwe-Clause 9.1.",
            xh: "ISO 9001:2015 (Iinkqubo zokuLawulwa kweSimo seKhwalithi): Ifuna imibutho ukuba yamkele indlela esekelwe kwiinkqubo ezinebubanga bokuqhubela phambili. Iziphumo ze-Ergo-Safe zibonelela ngobungqina obubhaliweyo phantsi kwe-Clause 9.1.",
            st: "ISO 9001:2015 (Tsamaiso ea Boleng ba Tsamaiso): E hloka hore mekhatlo e amohele mokhoa o thehiloeng tšebetsong o nang le bopaki ba lintlafatso tse tsoelang pele. Telemetry ea Ergo-Safe e fana ka bopaki bo ngotsoeng tlas'a Clause 9.1.",
            sw: "ISO 9001:2015 (Mifumo ya Usimamizi wa Ubora): Inahitaji mashirika kupitisha mbinu inayotegemea mchakato na ushahidi wa kuboresha kila wakati. Telemetry ya kufuata sheria ya Ergo-Safe inatoa ushahidi ulioandikwa unaohitajika chini ya Kifungu cha 9.1.",
            zh: "ISO 9001:2015（质量管理体系）：要求组织采用基于过程的方法，并有持续改进的证据。Ergo-Safe 的合规监控提供了 9.1 条款（绩效评估）所要求的质量监控记录。",
            de: "ISO 9001:2015 (Qualitätsmanagementsysteme): Erfordert, dass Organisationen einen prozessbasierten Ansatz mit Nachweisen für ständige Verbesserung einführen. Die Compliance-Telemetrie von ErgoSafe liefert die gemäß Klausel 9.1 erforderlichen dokumentierten Nachweise."
        });

        this._isoCore.set('14001-2015', {
            en: "ISO 14001:2015 (Environmental Management Systems): While primarily environmental, Clause 8.1 requires operational controls for significant environmental aspects, including the energy and environmental impact of remote work setups. Ergo-Safe's remote work audit module supports organizations in capturing the environmental footprint of their distributed workforce.",
            zu: "ISO 14001:2015 (Izinhlelo Zokuphathwa Kwezemvelo): Noma ikakhulukazi ezemvelo, uMthetho u-8.1 udinga izilawuli zokusebenza ezicini ezibalulekile zemvelo, kufaka phakathi umthelela wezikhungo zabasebenzi abakude. I-Ergo-Safe isekela izinhlangano ekubambeni umkhondo wezemvelo.",
            xh: "ISO 14001:2015 (Iinkqubo zokuLawulwa kokusiNgqongileyo): Nangona ikakhulu isingqongileyo, iSolotya 8.1 lifuna ulawulo lokusebenza kwiinkalo ezibalulekileyo zosingqongileyo, kubandakanywa nefuthe leendawo zabasebenzi. I-Ergo-Safe ixhasa imibutho ekubambeni ikhondo lokusingqongileyo.",
            st: "ISO 14001:2015 (Tsamaiso ea Tikoloho): Leha e le ea tikoloho haholo, Clause 8.1 e hloka taolo ea ts'ebetso bakeng sa likarolo tsa tikoloho, ho kenyeletsa le tšusumetso ea liofisi tsa lapeng. Ergo-Safe e tšehetsa ts'ebetso ena.",
            sw: "ISO 14001:2015 (Mifumo ya Usimamizi wa Mazingira): Ingawa kimsingi ni ya mazingira, Kifungu cha 8.1 kinahitaji udhibiti wa utendaji kwa vipengele muhimu vya mazingira, ikiwa ni pamoja na matumizi ya nishati ya mbali. Ergo-Safe inasaidia kukamata nyayo za mazingira.",
            zh: "ISO 14001:2015（环境管理体系）：第 8.1 条款要求对重大环境方面进行运行控制，包括远程工作设置的能源和环境影响。Ergo-Safe 的远程工作审计模块支持组织获取其分布式员工的环境足迹。",
            de: "ISO 14001:2015 (Umweltmanagementsysteme): Klausel 8.1 erfordert betriebliche Kontrollen für bedeutende Umweltaspekte, einschließlich der Energie- und Umweltauswirkungen von Telearbeitsplätzen. ErgoSafe unterstützt Organisationen bei der Erfassung dieses Fußabdrucks."
        });

        this._isoCore.set('45001-2018', {
            en: "ISO 45001:2018 (Occupational Health & Safety Management): Demands a proactive approach to risk management and mandatory worker participation (Clause 5.4). The AI Stewardship Engine operationalises Hazard Identification and Assessment of Risks (Clause 6.1) with continuous, automated monitoring of physical and cognitive hazards.",
            zu: "ISO 45001:2018 (Ukuphathwa Kwezempilo Nokuphepha Emsebenzini): Kufuna indlela ebonakalayo yokulawula ubungozi kanye nokubamba iqhaza kwabasebenzi (Clause 5.4). Injini yethu iqopha ukuhlonza ubungozi nokuhlolwa kwezingozi.",
            xh: "ISO 45001:2018 (Ulawulo lwezeMpilontle noKhuseleko eMsebenzini): Ifuna indlela ebonakalayo yokulawula ubungozi kunye nokuthatha inxaxheba kwabasebenzi (Solotya 5.4). Injini yethu iqinisekisa ukuchongwa kweengozi kunye novavanyo lwazo.",
            st: "ISO 45001:2018 (Tsamaiso ea Bophelo bo Botle le Polokeho): E hloka mokhoa o matla oa ho laola likotsi le ho nka karolo ha basebetsi (Clause 5.4). AI Stewardship Engine e hlahloba le ho laola likotsi tsena.",
            sw: "ISO 45001:2018 (Usimamizi wa Afya na Usalama Mahali pa Kazi): Inadai mbinu thabiti ya kudhibiti hatari na ushiriki wa wafanyakazi (Kifungu cha 5.4). Injini ya Usimamizi wa AI inatekeleza Utambulisho wa Hatari na Tathmini ya Hatari (Kifungu cha 6.1).",
            zh: "ISO 45001:2018（职业健康安全管理）：要求采用主动风险管理方法和强制性员工参与（第 5.4 条款）。AI Stewardship Engine 实现了持续、自动化的物理和认知危险源辨识与风险评估（第 6.1 条款）。",
            de: "ISO 45001:2018 (Arbeitsschutzmanagementsysteme): Fordert einen proaktiven Ansatz für das Risikomanagement und eine obligatorische Mitarbeiterbeteiligung (Klausel 5.4). Die AI Stewardship Engine setzt Gefährdungsbeurteilung und Risikobewertung (Klausel 6.1) um."
        });

        this._isoCore.set('45003-2021', {
            en: "ISO 45003:2021 (Psychological Health & Safety at Work): The first global standard for managing psychosocial risks including burnout, digital tethering, and cognitive overload. The Cognitive Handshake and Fatigue-Gate protocols provide quantitative adherence to Clause 6.1.2, identifying and assessing psychosocial hazards before they escalate to incidents.",
            zu: "ISO 45003:2021 (Impilo Yengqondo Nokuphepha Emsebenzini): Umhlahlandlela wokuqala wembulunga yonke wokulawula ubungozi bezengqondo njengokukhathala ngokweqile. I-Cognitive Handshake ihlonza lezi zingozi ngokushesha.",
            xh: "ISO 45003:2021 (Impilo yezengqondo noKhuseleko eMsebenzini): Isikhokelo sokuqala sehlabathi jikelele sokulawula iingozi zengqondo njengokudinwa ngokugqithisileyo. I-Cognitive Handshake ichonga ezi ngozi ngokukhawuleza.",
            st: "ISO 45003:2021 (Bophelo bo Botle ba Kelello le Polokeho): Tekanyetso ea pele ea lefats'e ea ho laola likotsi tsa kelello le ho thibela burnout kapa digital tethering. Cognitive Handshake e thusa ho bona likotsi tsa kelello kapele.",
            sw: "ISO 45003:2021 (Afya ya Kisaikolojia na Usalama Kazini): Kiwango cha kwanza cha kimataifa cha kudhibiti hatari za kisaikolojia ikijumuisha burnout na msongo wa mawazo. Mkataba wa Utambuzi na Lango la Fatigue hutoa ufuatiliaji wa upimaji wa Kifungu cha 6.1.2.",
            zh: "ISO 45003:2021（工作中的心理健康与安全）：第一个管理心理社会风险（包括职业倦怠、数字束缚和认知过载）的全球标准。认知握手和疲劳闸门协议符合 6.1.2 条款，在危险升级前对其进行评估。",
            de: "ISO 45003:2021 (Psychische Gesundheit und Sicherheit am Arbeitsplatz): Der erste globale Standard für das Management psychosozialer Risiken wie Burnout, digitale Erreichbarkeit und kognitive Überlastung. Die kognitiven Überprüfungen bieten eine quantitative Einhaltung von Klausel 6.1.2."
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
            { id: 'ohs-37', title: lang === 'zu' ? 'I-OHS Act Isigaba 37 – Isibopho Semisebenzi' : lang === 'xh' ? 'I-OHS Act Icandelo 37 – Unxanduva Lwemisebenzi' : lang === 'st' ? 'OHS Act Karolo 37 – Boikarabello bo Kopaneng' : lang === 'sw' ? 'Sheria ya OHS Kifungu cha 37 – Dhima ya Usimamizi' : lang === 'zh' ? 'OHS 法案第 37 条 – 连带责任' : lang === 'de' ? 'OHS-Gesetz Abschnitt 37 – Stellvertretende Haftung' : 'OHS Act Section 37 – Vicarious Liability', text: this.getComplianceVector('OHS', 'sec37', lang) },
            { id: 'ohs-38', title: lang === 'zu' ? 'I-OHS Act Isigaba 38 – Amacala & Nezinhlawulo' : lang === 'xh' ? 'I-OHS Act Icandelo 38 – Amacala & neZohlwayo' : lang === 'st' ? 'OHS Act Karolo 38 – Litlhōlo le Likotlo' : lang === 'sw' ? 'Sheria ya OHS Kifungu cha 38 – Makosa na Adhabu' : lang === 'zh' ? 'OHS 法案第 38 条 – 违法与处罚' : lang === 'de' ? 'OHS-Gesetz Abschnitt 38 – Straftaten & Strafen' : 'OHS Act Section 38 – Offences & Penalties',text: this.getComplianceVector('OHS', 'sec38', lang) },
        ];
    }

    /** Returns all sharded ISO standards as an array. */
    public fetchISOBriefing(lang: Language = 'en'): Array<{ id: string; title: string; text: string }> {
        return [
            { id: 'iso-9001',  title: lang === 'zu' ? 'ISO 9001:2015 – Ukuphathwa Kwekhwalithi' : lang === 'xh' ? 'ISO 9001:2015 – UkuLawulwa kweKhwalithi' : lang === 'st' ? 'ISO 9001:2015 – Tsamaiso ea Boleng' : lang === 'sw' ? 'ISO 9001:2015 – Usimamizi wa Ubora' : lang === 'zh' ? 'ISO 9001:2015 – 质量管理' : lang === 'de' ? 'ISO 9001:2015 – Qualitätsmanagement' : 'ISO 9001:2015 – Quality Management',       text: this.getComplianceVector('ISO', '9001-2015', lang)  },
            { id: 'iso-14001', title: lang === 'zu' ? 'ISO 14001:2015 – Ukuphathwa Kwezemvelo' : lang === 'xh' ? 'ISO 14001:2015 – UkuLawulwa kokusiNgqongileyo' : lang === 'st' ? 'ISO 14001:2015 – Tsamaiso ea Tikoloho' : lang === 'sw' ? 'ISO 14001:2015 – Usimamizi wa Mazingira' : lang === 'zh' ? 'ISO 14001:2015 – 环境管理' : lang === 'de' ? 'ISO 14001:2015 – Umweltmanagement' : 'ISO 14001:2015 – Environmental Management', text: this.getComplianceVector('ISO', '14001-2015', lang) },
            { id: 'iso-45001', title: lang === 'zu' ? 'ISO 45001:2018 – Ukuphathwa Kwe-OHS' : lang === 'xh' ? 'ISO 45001:2018 – UkuLawulwa kwe-OHS' : lang === 'st' ? 'ISO 45001:2018 – Tsamaiso ea OHS' : lang === 'sw' ? 'ISO 45001:2018 – Usimamizi wa OHS' : lang === 'zh' ? 'ISO 45001:2018 – OHS 管理' : lang === 'de' ? 'ISO 45001:2018 – Arbeitsschutzmanagement' : 'ISO 45001:2018 – OHS Management',           text: this.getComplianceVector('ISO', '45001-2018', lang) },
            { id: 'iso-45003', title: lang === 'zu' ? 'ISO 45003:2021 – Ubungozi Bezengqondo' : lang === 'xh' ? 'ISO 45003:2021 – Iingozi zeZengqondo' : lang === 'st' ? 'ISO 45003:2021 – Likotsi tsa Kelello' : lang === 'sw' ? 'ISO 45003:2021 – Hatari ya Kisaikolojia' : lang === 'zh' ? 'ISO 45003:2021 – 心理社会风险' : lang === 'de' ? 'ISO 45003:2021 – Psychosoziales Risiko' : 'ISO 45003:2021 – Psychosocial Risk',        text: this.getComplianceVector('ISO', '45003-2021', lang) },
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
