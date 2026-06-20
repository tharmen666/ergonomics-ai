export type Language = 'en' | 'zu' | 'xh' | 'sw' | 'zh' | 'de' | 'st' | 'af';

export interface TranslationEntry {
    nelly_intro: string;
    stewardship_model: string;
    high_discomfort_disclaimer: string;
    legal_shock: string;
    exercise_tip: string;
    compliance_check: string;
    admin_zero: string;
    first_aid: string;
    right_to_disconnect: string;
    popi_title?: string;
    popi_subtitle?: string;
    popi_desc?: string;
    popi_guarantee_title?: string;
    popi_guarantee_desc?: string;
    popi_accept?: string;
    cognitive_title?: string;
    cognitive_subtitle?: string;
    cognitive_fail?: string;
    cognitive_pass_optimal?: string;
    cognitive_warn?: string;
    cognitive_pass?: string;
    liability_title?: string;
    liability_subtitle?: string;
    liability_desc?: string;
    liability_action?: string;
    kaizen_master?: string;
    training: {
        start_session: string;
        follow_guide: string;
        exercises: Record<string, any>;
    };
}

export const translations: Record<Language, TranslationEntry> = {
    en: {
        nelly_intro: "Hi, I'm Nelly. Your AI Safety companion. Let's make sure you're protected today.",
        stewardship_model: "The Stewardship Model ensures 100% compliance through a cascading chain of command: Employee to Supervisor, Leader, and CEO.",
        high_discomfort_disclaimer: "WARNING: High discomfort detected. This has been flagged. Failure to resolve may lead to OHS Act non-compliance.",
        legal_shock: "IMPORTANT: Continued non-compliance can result in corporate liability, including heavy fines or imprisonment under South African OHS laws.",
        exercise_tip: "Time for a quick stretch! This prevents long-term musculoskeletal strain.",
        compliance_check: "Daily safety scan required. Please complete your checklist by 12:00 PM Friday.",
        admin_zero: "Assessment complete. I've automatically filed this in your digital OHS dossier.",
        first_aid: "Stop bleeding, clean the wound, cover it.",
        right_to_disconnect: "Your Right to Disconnect is protected. After-hours contact outside agreed hours may constitute a psychosocial hazard under ISO 45003:2021 and CCMA precedent.",
        popi_title: "YOUR DATA IS YOUR SHIELD",
        popi_subtitle: "Privacy-First OHS Architecture",
        popi_desc: "ErgoSafe Reborn operates strictly as a Digital Wingman. This is a performance tool, not a spy tool. Your cognitive and ergonomic assessment data is end-to-end encrypted and completely anonymized.",
        popi_guarantee_title: "Human in the Loop Guarantee",
        popi_guarantee_desc: "Safety is our #1 priority. We do not track you to punish you. We coach you to keep you at peak performance. All compliance reports and behavioral audits are filed securely into zero-knowledge dossiers.",
        popi_accept: "ACCEPT PRIVACY HANDSHAKE",
        cognitive_title: "MANDATORY COGNITIVE HANDSHAKE",
        cognitive_subtitle: "Click the targets as quickly as possible to establish your baseline. Lag > 20% will trigger Digital Wingman protocols.",
        cognitive_fail: "PROTOCOL ALERT: {reason} detected. Handshake failed with {variance}% variance. Section 37 Liability Warning activated.",
        cognitive_pass_optimal: "KAIZEN BONUS: Optimal latency (<700ms) and low variance detected. Handshake cleared. Productive Streak multiplied.",
        cognitive_warn: "MUDA DETECTED: Variance is {variance}% from baseline. Your cognitive consistency is slipping. Consider a professional reset.",
        cognitive_pass: "Cognitive Handshake passed! You're performing safely at standard work rates.",
        liability_title: "Section 37 Liability Warning",
        liability_subtitle: "UNACCEPTABLE COGNITIVE LATENCY DETECTED. Corporate Risk Protocol: Section 8(1) OHS Act 85 of 1993",
        liability_desc: "Your reaction times have deviated significantly from safe operational baselines. To protect the organization and your personal safety, DOA Lockout has been triggered. Please contact your supervisor for a mandatory wellness check.",
        liability_action: "ACKNOWLEDGE & DE-ESCALATE",
        kaizen_master: "Kaizen Master",
        training: {
            start_session: "Starting session:",
            follow_guide: "Follow the animated guide. Step 1:",
            exercises: {
                "monitor-mastery": { title: "Monitor Mastery", desc: "Optimize screen height and distance to prevent neck strain. OHS Act Section 8 Compliance: Ensuring a safe system of work.", step1: "Sit at arm's length" },
                "lumbar-lock": { title: "Lumbar Lock-In", desc: "Secure your lower back for all-day spinal support. OHS Act Section 8 Compliance: Ensuring a safe system of work.", step1: "Sit deep in chair" },
                "20-20-20": { title: "The 20-20-20 Eye Rule", desc: "Digital eye strain prevention protocol (for digital strain). OHS Act Section 8 Compliance: Ensuring a safe system of work.", step1: "Every 20 mins" },
                "shoulder-rolls": { title: "Shoulder Rolls", desc: "Release upper body tension with simple circular motions. OHS Act Section 8 Compliance: Ensuring a safe system of work.", step1: "Sit up straight" },
                "wrist-flexor": { title: "Wrist Flexor Stretches", desc: "Prevent repetitive strain in the wrists and forearms. OHS Act Section 8 Compliance: Ensuring a safe system of work.", step1: "Extend arm forward" },
                "lateral-neck": { title: "Lateral Neck Tilts", desc: "Relieve neck stiffness from extended screen monitoring. OHS Act Section 8 Compliance: Ensuring a safe system of work.", step1: "Look straight ahead" },
                "mobile-command": { title: "Mobile Command Center", desc: "Ergonomics for laptops and temporary workstations. OHS Act Section 8 Compliance: Ensuring a safe system of work.", step1: "Elevate laptop" },
                "stress-dump": { title: "High-Volume Decompression", desc: "Micro-breaks to reset after difficult calls. OHS Act Section 8 Compliance: Ensuring a safe system of work.", step1: "Deep breath in" },
                "risk-audit": { title: "Self-Audit Procedures", desc: "How to spot your own ergonomic red flags. OHS Act Section 8 Compliance: Ensuring a safe system of work.", step1: "Scan environment" },
                "corrective-flow": { title: "Corrective Flow", desc: "Advanced stretches for chronic trouble spots. OHS Act Section 8 Compliance: Ensuring a safe system of work.", step1: "Targeted neck release" }
            }
        }
    },
    zu: {
        nelly_intro: "Sawubona, ngingu-Nelly. Umngane wakho we-AI Wezokuphepha. Masikuqinisekise ukuthi uvikelekile namuhla.",
        stewardship_model: "Imodeli ye-Stewardship iqinisekisa ukuthotshelwa kwezinhlelo okungu-100% ngochungechunge lomyalelo: Umsebenzi uye ku-Supervisor, Umholi, kanye ne-CEO.",
        high_discomfort_disclaimer: "ISEXWAYISO: Kutholwe ukungaphatheki kahle kakhulu. Lokhu kufakwe uphawu. Ukwehluleka ukuxazulula kungoholela ekungathandini uMthetho we-OHS.",
        legal_shock: "KUBALULEKILE: Ukungathobeli okuqhubekayo kungaholela ekubophelelekeni kwenkampani, kufaka phakathi inhlawulo enkulu noma ukuboshwa ngaphansi kwemithetho ye-OHS yaseNingizimu Afrika.",
        exercise_tip: "Isikhathi sokuzelula kancane! Lokhu kuvimbela ukukhathala kwemisipha yesikhathi eside.",
        compliance_check: "Kudingeka ukuskenwa kokuphepha kwansuku zonke. Sicela uqedele uhlu lwakho lokuhlola ngo-12:00 PM ngoLwesihlanu.",
        admin_zero: "Ukuhlola kuqediwe. Ngiyifayile ngokuzenzakalelayo lokhu kudossier yakho ye-OHS yedijithali.",
        first_aid: "Misa ukopha, hlambulula isilonda, usimboze.",
        right_to_disconnect: "Ilungelo lakho lokuNqamuka livikelekile. Ukuxhumana ngemuva kwamahora abekiwe kuveza ubungozi be-ISO 45003:2021 futhi kuvunyelwe i-CCMA ukuqhubela phambili amacala.",
        popi_title: "IMINININGWANO YAKHO YISIVIKELO SAKHO",
        popi_subtitle: "Isakhiwo se-OHS Esibeka Imininingwane Ngasese Phambili",
        popi_desc: "I-ErgoSafe Reborn isebenza kuphela njengoMngane Wedijithali. Leli ithuluzi lokusebenza, hhayi ithuluzi lokuhlola. Idatha yakho yokuhlola ingqondo ne-ergonomic ibhalwe ngemfihlo ekugcineni futhi ayaziwa ngokuphelele.",
        popi_guarantee_title: "Isiqinisekiso Sokuzibandakanya Komuntu",
        popi_guarantee_desc: "Ukuphepha kuyinto yethu yokuqala. Asikulandeli ukuze sikujezise. Sikuqeqeshela ukukugcina usezingeni eliphezulu. Yonke imibiko yokuthobela nemihloli yokuziphatha igcinwa ngokuphephile kuma-dossier angabonakali.",
        popi_accept: "VUMA ISIVUMELWANO SEMFIHLO",
        cognitive_title: "ISIVUMELWANO SENGQONDO EZIPHOSHELEKILE",
        cognitive_subtitle: "Chofoza imigomo ngokushesha okukhulu ukuze usethe isisekelo sakho. Ukulibiseka okungaphezu kuka-20% kuzoqhuba imithetho yoMngane Wedijithali.",
        cognitive_fail: "ISEXWAYISO SE-PROTOCOL: Kutholakale i-{reason}. Isivumelwano sehlulekile ngomehluko we-{variance}%. Isexwayiso Se-Liability Isigaba 37 sasebenza.",
        cognitive_pass_optimal: "IBHONASI YE-KAIZEN: Kutholakale isikhathi esifanele (<700ms) nomehluko omncane. Isivumelwano siphasisiwe. Ukukhula komsebenzi kuphindaphindiwe.",
        cognitive_warn: "KUTHOLAKALE I-MUDA: Umehluko ungu-{variance}% kusuka esisekelweni. Ukungaguquguquki kwakho kwengqondo kuyawohloka. Cabanga ngokuphumula kwesikhathi eside.",
        cognitive_pass: "Isivumelwano Sengqondo siphasisiwe! Usebenza ngokuphephile ngamazinga ajwayelekile omsebenzi.",
        liability_title: "Isexwayiso Semfanelo Yesigaba 37",
        liability_subtitle: "KUTHOLAKALE UKULIBISEKA KWENGQONDO OKUNGEKHO EMTHETHWENI. Umthetho Wengozi Yenkampani: Isigaba 8(1) OHS Act 85 ka-1993",
        liability_desc: "Izikhathi zakho zokuphendula zihlukile kakhulu ekusebenzeni okuphephile. Ukuze uvikele inhlangano nokuphepha kwakho siqu, i-DOA Lockout iqalisiwe. Sicela uxhumane nomphathi wakho ukuze uthole ukuhlolwa kwezempilo okuyisibopho.",
        liability_action: "AMUKELA & WEHLISE ISEXWAYISO",
        kaizen_master: "I-Kaizen Master",
        training: {
            start_session: "Ukuqala iseshini:",
            follow_guide: "Landela umhlahlandlela opopayi. Isinyathelo 1:",
            exercises: {
                "monitor-mastery": { title: "Ukuphatha Isikrini", desc: "Lungiselela ukuphakama kwebanga lesikrini ukuze ugweme ubuhlungu bentamo. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Hlala kude nebanga lengalo" },
                "lumbar-lock": { title: "Ukuvikela Umhlane Oningezansi", desc: "Vikela umhlane yakho ongezansi ukuze uthole ukusekela kosuku lonke. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Hlala ujule esihlalweni" },
                "20-20-20": { title: "Umthetho Wamehlo Ka-20-20-20", desc: "Umgomo wokuvikela ukukhathala kwamehlo ngenxa yezikrini. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Njalo ngemizuzu engama-20" },
                "shoulder-rolls": { title: "Ukuzungezisa Amahlombe", desc: "Khulula ukungezwani komzimba ongenhla ngokunyakaza okulula okuyindilinga. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Hlala uqonde" },
                "wrist-flexor": { title: "Ukunweba isihlakala", desc: "Vimbela ubuhlungu obuphindaphindiwe ezihlakaleni nasezingalweni. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Nweba ingalo phambili" },
                "lateral-neck": { title: "Uktshekisa Intamo", desc: "Khulula ukuqina kwentamo ngenxa yokubuka isikrini isikhathi eside. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Bheka phambili" },
                "mobile-command": { title: "Isikhungo Sokulawula Esiqabulekayo", desc: "I-Ergonomics yama-laptops nezindawo zokusebenza zesikhashana. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Phakamisa i-laptop" },
                "stress-dump": { title: "Ukuphumula Okukhulu", desc: "Amaphefumulo amancane okusetha kabusha ngemuva kwezingcingo ezinzima. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Phefumulela ngaphakathi kakhulu" },
                "risk-audit": { title: "Izinqubo Zokuzicwaninga", desc: "Indlela yokubona izimpawu zakho eziyingozi ze-ergonomic. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Skena indawo" },
                "corrective-flow": { title: "Ukugeleza Kokulungisa", desc: "Ukunweba okuthuthukile kwalezo zindawo eziyinkinga kakhulu. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Ukukhulula intamo okuhlosiwe" }
            }
        }
    },
    xh: {
        nelly_intro: "Molo, ndinguNelly. Iqabane lakho le-AI lokhuseleko. Masiqinisekise ukuba ukhuselekile namhlanje.",
        stewardship_model: "Imodeli yo-Stewardship iqinisekisa ukuthotyelwa kweemithetho nge-100% ngothungelelwano lomyalelo: Umsebenzi ukuya ku-Supervisor, iNkokheli, kunye ne-CEO.",
        high_discomfort_disclaimer: "ISILUMKISO: Kufunyenwe ukungonwabi kakhulu. Oku kuphawuliwe. Ukusilela ekusombululeni oku kungakhokelela ekungathotyelweni koMthetho we-OHS.",
        legal_shock: "KUBALULEKILE: Ukungathobeli okuqhubekayo kunokukhokelela kuxanduva lwequmrhu, kubandakanywa isohlwayo esinzulu okanye ukuvalelwa phantsi kwemithetho ye-OHS yoMzantsi Afrika.",
        exercise_tip: "Ixesha lokuzivula kancinci! Oku kuthintela ukudinwa kwezihlunu kwixesha elide.",
        compliance_check: "Kufuneka uskanno lokhuseleko lwemihla ngemihla. Nceda ugqibe uluhlu lwakho lokutshekisha ngo-12:00 PM ngoLwesihlanu.",
        admin_zero: "Uvavanyo lugqityiwe. Ndilufayilishe ngokuzenzekelayo kwi-dossier yakho ye-OHS yedijithali.",
        first_aid: "Mise ukopha, coca inxeba, uligqume.",
        right_to_disconnect: "Ilungelo lakho lokuNqamuka likhuselelwe. Ukuqhagamshelana emva kwamaxesha avunyiweyo kunokwenza ingozi ye-ISO 45003:2021 kwaye i-CCMA ivumela ukuqhubeka kwamacala.",
        popi_title: "IDATHA YAKHO LIKHAKHA LAKHO",
        popi_subtitle: "Uyilo lwe-OHS Olubeka Iimfihlo Phambili",
        popi_desc: "I-ErgoSafe Reborn isebenza njengoMhlobo weDijithali. Esi sisixhobo sokusebenza, hayi isixhobo sokuhlola. Idatha yakho yovavanyo lwengqondo ne-ergonomic ifakwe ikhathuni ngasese kwaye ayaziwa kwaphela.",
        popi_guarantee_title: "Isiqinisekiso Sokubandakanyeka koMntu",
        popi_guarantee_desc: "Ukhuseleko yinto yethu yokuqala. Asikulandeli ukuze sikohlwaye. Sikuqeqeshela ukukugcina ukwizinginga eliphezulu. Yonke ingxelo yokuthobela nemihloli yokuziphatha igcinwa ngokukhuselekileyo kwii-dossier ezingafikelelekiyo.",
        popi_accept: "AMKELA ISIVUMELWANO SESIMFIHLO",
        cognitive_title: "ISIVUMELWANO SENGQONDO ESINYATHELISIWEYO",
        cognitive_subtitle: "Cofa iithagethi ngokukhawuleza ukuseka isisekelo sakho. Ukulibiseka okungaphezu kwama-20% kuzoqala iinkqubo zoMhlobo weDijithali.",
        cognitive_fail: "ISEXWAYISO SE-PROTOCOL: Kufunyenwe i-{reason}. Isivumelwano sehlulekile ngomehluko we-{variance}%. Isexwayiso Se-Liability iCandelo 37 sisebenzisiwe.",
        cognitive_pass_optimal: "IBHONASI YE-KAIZEN: Kufunyenwe ixesha elifanelekileyo (<700ms) nomehluko omncinci. Isivumelwano sigqityiwe. Uthotho lwemveliso luphindaphindiwe.",
        cognitive_warn: "KUTHOLWE I-MUDA: Umehluko ngu-{variance}% kwisisekelo. Ukuzinza kwengqondo yakho kuyehla. Cinga ngokuphumula kwengqondo.",
        cognitive_pass: "Isivumelwano Sengqondo siphasisiwe! Usebenza ngokukhuselekileyo kwiqondo elisemgangathweni.",
        liability_title: "Isexwayiso Setyala leCandelo 37",
        liability_subtitle: "KUTHOLWE UKULIBISEKA KWENGQONDO OKUNGAZINZANANGA. Inkqubo yoMngcipheko weQumrhu: iCandelo 8(1) OHS Act 85 yowe-1993",
        liability_desc: "Amaxesha akho okusabela ahlukile kakhulu kwisisekelo sokusebenza ngokukhuselekileyo. Ukhuseleko lombutho kunye nolwakho siqu, i-DOA Lockout iqalisiwe. Nceda uqhagamshelane nomphathi wakho ukwenzela uvavanyo lwempilo olusisinyanzelo.",
        liability_action: "AMKELA & WEHLISE ISEXWAYISO",
        kaizen_master: "I-Kaizen Master",
        training: {
            start_session: "Ukuqala iseshini:",
            follow_guide: "Landela isikhokelo esinopopayi. Inyathelo 1:",
            exercises: {
                "monitor-mastery": { title: "Ulawulo Lwesikrini", desc: "Lungiselela ukuphakama kwesikrini kunye nomgama ukunqanda uxinzelelo lwentamo. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Hlala kumgama wengalo" },
                "lumbar-lock": { title: "Ukuvalwa Komqolo Ongezantsi", desc: "Khusela umqolo wakho ongezantsi ukwenzela inkxaso yemini yonke. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Hlala nzulu esitulweni" },
                "20-20-20": { title: "Umthetho Wamehlo ka-20-20-20", desc: "Inkqubo yothintelo loxinzelelo lwamehlo kwizikrini zedijithali. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Ngemizuzu engama-20" },
                "shoulder-rolls": { title: "Ukujikeleza Amagxa", desc: "Khulula uxinzelelo lomzimba ongasentla ngeentshukumo ezilula eziyisangqa. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Hlala uthe tye" },
                "wrist-flexor": { title: "Ukolulwa kwesihlahla", desc: "Thintela uxinzelelo oluphindaphindiweyo kwizihlahla nakwiingalo. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Nweba ingalo ukuya phambili" },
                "lateral-neck": { title: "Ukutshekisa Intamo", desc: "Khulula ukuqina kwentamo ngenxa yokujonga isikrini ixesha elide. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Jonga phambili" },
                "mobile-command": { title: "Iziko loLawulo eliHambayo", desc: "I-Ergonomics yee-laptops kunye neendawo zokusebenza zexeshana. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Phakamisa ilaptop" },
                "stress-dump": { title: "Ukunyenyisa Uxinzelelo Olukhulu", desc: "Ikhefu elincinci ukuseta kwakhona emva kweefowuni ezinzima. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Phefumulele ngaphakathi nzulu" },
                "risk-audit": { title: "Iinkqubo zokuZiphicotha", desc: "Indlela yokubona izilumkiso zakho ze-ergonomic. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Skena okungqongileyo" },
                "corrective-flow": { title: "Ukuhamba Kolungiso", desc: "Ukolulwa okuhambele phambili kweendawo ezinengxaki engapheliyo. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Ukukhulula intamo okujoliswe kuko" }
            }
        }
    },
    sw: {
        nelly_intro: "Hujambo, mimi ni Nelly. Mwongozo wako wa Usalama wa AI. Wacha tuhakikishe umelindwa leo.",
        stewardship_model: "Mfumo wa Usimamizi unahakikisha kufuata sheria kupitia Mfanyakazi, Msimamizi, na Mkurugenzi Mtendaji.",
        high_discomfort_disclaimer: "ONYO: Uchovu mkubwa umegunduliwa. Kushindwa kutatua kunaweza kusababisha uvunjaji wa sheria za OHS.",
        legal_shock: "MUHIMU: Kutofuata sheria kunaweza kusababisha faini au kifungo kulingana na Sheria za OHS (OSHA 2007).",
        exercise_tip: "Wakati wa kunyoosha mwili! Hii inazuia maumivu ya misuli.",
        compliance_check: "Ukaguzi wa usalama wa kila siku unahitajika kufikia Ijumaa saa sita mchana.",
        admin_zero: "Tathmini imekamilika. Nimehifadhi kiotomatiki katika faili lako la usalama digitali.",
        first_aid: "Zuia kuvuja damu, safisha kidonda, funika.",
        right_to_disconnect: "Haki yako ya Kutengana inalindwa. Mawasiliano baada ya saa za kazi nje ya saa zilizokubaliwa yanaweza kuwa hatari ya kisaikolojia chini ya ISO 45003:2021 na mfano wa CCMA.",
        popi_title: "DATA YAKHO NDIO NGAO YAKO",
        popi_subtitle: "Usanifu wa OHS Unaozingatia Faragha Kwanza",
        popi_desc: "ErgoSafe Reborn inafanya kazi kama Msaidizi wa Kidijitali. Hii ni zana ya utendaji, si chombo cha ujasusi. Data yako ya tathmini ya utambuzi na ergonomic imefungwa kwa njia salama na haitambuliki kabisa.",
        popi_guarantee_title: "Dhamana ya Ushiriki wa Kibinadamu",
        popi_guarantee_desc: "Usalama ndio kipaumbele chetu cha kwanza. Hatukufuatilii ili kukuadhibu. Tunakufundisha ili uendelee kufanya kazi kwa kiwango cha juu. Ripoti zote za kufuata sheria na ukaguzi wa tabia huwekwa salama katika faili zisizoweza kufikiwa.",
        popi_accept: "KUBALI MKATABA WA FARAGHA",
        cognitive_title: "MKATABA WA UTAMBUZI WA LAZIMA",
        cognitive_subtitle: "Bofya shabaha haraka iwezekanavyo ili kuweka msingi wako. Kuchelewa kwa zaidi ya 20% kutasababisha itifaki za Msaidizi vya Kidijitali.",
        cognitive_fail: "TAHADHARI YA ITIFAKI: {reason} imegunduliwa. Ushirikiano umeshindikana kwa tofauti ya {variance}%. Onyo la Dhima la Kifungu cha 37 limeamilishwa.",
        cognitive_pass_optimal: "BONASI YA KAIZEN: Muda mzuri wa kusubiri (<700ms) na tofauti ndogo zimegunduliwa. Mkataba umefutwa. Mfululizo wa tija umeongezeka.",
        cognitive_warn: "MUDA IMEGUNDULIWA: Tofauti ni {variance}% kutoka kwenye msingi. Uthabiti wako wa utambuzi unashuka. Fikiria kuweka upya kitaaluma.",
        cognitive_pass: "Mkataba wa Utambuzi umefaulu! Unafanya kazi kwa usalama katika viwango vya kawaida vya kazi.",
        liability_title: "Onyo la Dhima la Kifungu cha 37",
        liability_subtitle: "MUDA USIOKUBALIKA WA UTAMBUZI UMEGUNDULIWA. Itifaki ya Hatari ya Shirika: Kifungu cha 8(1) cha Sheria ya OHS 85 ya 1993",
        liability_desc: "Muda wako wa majibu umeachana sana na misingi salama ya kufanya kazi. Ili kulinda shirika na usalama wako binafsi, Kufungwa kwa DOA kumeanzishwa. Tafadhali wasiliana na msimamizi wako kwa ukaguzi wa lazima wa afya.",
        liability_action: "KUBALI NA KUSHUSHA TAHADHARI",
        kaizen_master: "Mwalimu wa Kaizen",
        training: {
            start_session: "Kuanza:",
            follow_guide: "Fuata maelekezo. Hatua 1:",
            exercises: {
                "monitor-mastery": { title: "Utaalamu wa Monita", desc: "Boresha urefu wa skrini na umbali ili kuzuia maumivu ya shingo. Kuzingatia Kifungu cha 8 cha Sheria ya OHS: Kuhakikisha mfumo salama wa kazi.", step1: "Keti kwa umbali wa mkono mmoja" },
                "lumbar-lock": { title: "Kufungia Kiuno", desc: "Linda mgongo wako wa chini kwa usaidizi wa mgongo siku nzima. Kuzingatia Kifungu cha 8 cha Sheria ya OHS: Kuhakikisha mfumo salama wa kazi.", step1: "Keti ndani kabisa ya kiti" },
                "20-20-20": { title: "Sheria ya Macho ya 20-20-20", desc: "Itifaki ya kuzuia uchovu wa macho ya kidijitali. Kuzingatia Kifungu cha 8 cha Sheria ya OHS: Kuhakikisha mfumo salama wa kazi.", step1: "Kila baada ya dakika 20" },
                "shoulder-rolls": { title: "Kuzungusha Mabega", desc: "Punguza mvutano wa mwili wa juu kwa harakati rahisi za duara. Kuzingatia Kifungu cha 8 cha Sheria ya OHS: Kuhakikisha mfumo salama wa kazi.", step1: "Keti wima" },
                "wrist-flexor": { title: "Kunyoosha Misuli ya Kiganja", desc: "Zuia maumivu ya kurudia kwenye viungo vya mikono na mikono. Kuzingatia Kifungu cha 8 cha Sheria ya OHS: Kuhakikisha mfumo salama wa kazi.", step1: "Nyoosha mkono mbele" },
                "lateral-neck": { title: "Kuinamisha Shingo Pembeni", desc: "Punguza ugumu wa shingo kutokana na kuangalia skrini kwa muda mrefu. Kuzingatia Kifungu cha 8 cha Sheria ya OHS: Kuhakikisha mfumo salama wa kazi.", step1: "Angalia moja kwa moja mbele" },
                "mobile-command": { title: "Kituo cha Amri cha Simu", desc: "Ergonomics kwa kompyuta mpakato na vituo vya kazi vya muda. Kuzingatia Kifungu cha 8 cha Sheria ya OHS: Kuhakikisha mfumo salama wa kazi.", step1: "Inua kompyuta mpakato" },
                "stress-dump": { title: "Kupunguza Shinikizo la Juu", desc: "Mapumziko madogo ya kuweka upya baada ya simu ngumu. Kuzingatia Kifungu cha 8 cha Sheria ya OHS: Kuhakikisha mfumo salama wa kazi.", step1: "Vuta pumzi ndefu ndani" },
                "risk-audit": { title: "Taratibu za Kujikagua", desc: "Jinsi ya kugundua ishara zako mbaya za ergonomic. Kuzingatia Kifungu cha 8 cha Sheria ya OHS: Kuhakikisha mfumo salama wa kazi.", step1: "Kagua mazingira" },
                "corrective-flow": { title: "Mtiririko wa Kurekebisha", desc: "Kunyoosha kwa hali ya juu kwa maeneo yenye shida sugu. Kuzingatia Kifungu cha 8 cha Sheria ya OHS: Kuhakikisha mfumo salama wa kazi.", step1: "Utoaji wa shingo uliolengwa" }
            }
        }
    },
    zh: {
        nelly_intro: "你好，我是 Nelly。你的 AI 职业安全顾问。今天让我们确保您的安全。",
        stewardship_model: "管理结构确保从员工到首席执行官的 100% 职业安全合规。",
        high_discomfort_disclaimer: "警告：检测到严重不适。不及时处理将违反职业健康与安全规定。",
        legal_shock: "重要提醒：持续违规可能导致企业触犯法律，面临严重罚款或诉讼（符合 ISO 45001）。",
        exercise_tip: "是时候进行简短的伸展了！这可以预防长期的肌肉疲劳。",
        compliance_check: "需要每日安全扫描。请在周五中午前完成列表验证。",
        admin_zero: "评估完成。已自动提交到您的数字 OHS 数据库。",
        first_aid: "止血，清洁伤口，包扎。",
        right_to_disconnect: "您的离线权受到保护。在约定时间之外的下班后联系可能会根据 ISO 45003:2021 和 CCMA 先例构成心理社会危害。",
        popi_title: "您的数据是您的盾牌",
        popi_subtitle: "隐私第一的职业安全健康架构",
        popi_desc: "ErgoSafe Reborn 仅作为数字伴侣运行。这是性能工具，而非监视工具。您的认知和人体工程学评估数据均经过端到端加密，并完全匿名。",
        popi_guarantee_title: "人工干优保障",
        popi_guarantee_desc: "安全是我们的第一要务。我们不会为了惩罚您而追踪您。我们为您提供辅导以保持巅峰状态。所有合规报告和行为审计都安全地存入零知识档案中。",
        popi_accept: "接受隐私协议",
        cognitive_title: "强制性认知握手",
        cognitive_subtitle: "尽快点击目标以建立您的基准。延迟超过 20% 将触发数字伴侣协议。",
        cognitive_fail: "协议警报：检测到 {reason}。握手失败，偏差为 {variance}%。已激活第 37 条责任警告。",
        cognitive_pass_optimal: "改善奖赏：检测到最佳延迟（<700ms）和低偏差。握手清除。生产力周期成倍增加。",
        cognitive_warn: "检测到无用作业：偏差较基准达 {variance}%。您的认知一致性正在下降。请考虑进行专业调整。",
        cognitive_pass: "认知握手通过！您在标准工作率下安全运行。",
        liability_title: "第 37 条责任警告",
        liability_subtitle: "检测到不可接受的认知延迟。企业风险协议：1993年第85号 OHS 法案第 8(1) 条",
        liability_desc: "您的反应时间已显著偏离安全操作基准。为保护组织及您的个人安全，已触发 DOA 锁定。请联系您的主管进行强制性健康检查。",
        liability_action: "确认并降级警报",
        kaizen_master: "改善大师",
        training: {
            start_session: "开始会话:",
            follow_guide: "请按照指南操作, 步骤 1:",
            exercises: {
                "monitor-mastery": { title: "显示器控制", desc: "优化屏幕高度和距离以防止脖子疲劳。符合 OHS 法案第 8 条：确保安全的工作系统。", step1: "坐在一条手臂的距离" },
                "lumbar-lock": { title: "腰部锁定", desc: "保护您的下背部以获得全天的脊柱支持。符合 OHS 法案第 8 条：确保安全的工作系统。", step1: "坐在椅子深处" },
                "20-20-20": { title: "20-20-20 护眼规则", desc: "预防数字眼睛疲劳的规程。符合 OHS 法案第 8 条：确保安全的工作系统。", step1: "每 20 分钟一次" },
                "shoulder-rolls": { title: "转肩运动", desc: "通过简单的圆形运动缓解上身紧张。符合 OHS 法案第 8 条：确保安全的工作系统。", step1: "坐直" },
                "wrist-flexor": { title: "手腕拉伸", desc: "预防手腕和前臂的重复性劳损。符合 OHS 法案第 8 条：确保安全的工作系统。", step1: "手臂向前伸直" },
                "lateral-neck": { title: "颈部侧倾", desc: "缓解因长时间注视屏幕而引起的颈部僵硬。符合 OHS 法案第 8 条：确保安全的工作系统。", step1: "直视前方" },
                "mobile-command": { title: "移动控制中心", desc: "笔记本电脑和临时工作站的人体工程学。符合 OHS 法案第 8 条：确保安全的工作系统。", step1: "抬高笔记本电脑" },
                "stress-dump": { title: "高容量减压", desc: "困难通话后的微休息重置。符合 OHS 法案第 8 条：确保安全的工作系统。", step1: "深呼吸" },
                "risk-audit": { title: "自我审计程序", desc: "如何发现自己的人体工程学警示信号。符合 OHS 法案第 8 条：确保安全的工作系统。", step1: "扫描环境" },
                "corrective-flow": { title: "纠正流程", desc: "针对慢性问题区域的先进拉伸。符合 OHS 法案第 8 条：确保安全的工作系统。", step1: "有针对性的颈部放松" }
            }
        }
    },
    de: {
        nelly_intro: "Hallo, ich bin Nelly. Dein KI-Sicherheitsbegleiter. Lass uns sicherstellen, dass du heute geschützt bist.",
        stewardship_model: "Das Stewardship-Modell gewährleistet 100%ige Compliance über eine kaskadierende Befehlskette: Mitarbeiter zu Vorgesetztem, Führungskraft und CEO.",
        high_discomfort_disclaimer: "WARNUNG: Hohes Unbehagen erkannt. Dies wurde markiert. Ein Nichtbeheben kann zu Verstößen gegen das OHS-Gesetz führen.",
        legal_shock: "WICHTIG: Fortgesetzte Nichteinhaltung kann zur Haftung des Unternehmens führen, einschließlich hoher Geldstrafen oder Freiheitsstrafen nach südafrikanischen OHS-Gesetzen.",
        exercise_tip: "Zeit für ein kurzes Dehnen! Dies verhindert langfristige Muskel-Skelett-Belastungen.",
        compliance_check: "Tägliche Sicherheitsüberprüfung erforderlich. Bitte fülle deine Checkliste bis Freitag 12:00 Uhr aus.",
        admin_zero: "Bewertung abgeschlossen. Ich habe diese automatisch in deiner digitalen OHS-Akte abgelegt.",
        first_aid: "Blutung stoppen, Wunde reinigen, abdecken.",
        right_to_disconnect: "Dein Recht auf Nichterreichbarkeit ist geschützt. Kontaktaufnahme außerhalb der vereinbarten Arbeitszeiten kann eine psychosoziale Gefährdung gemäß ISO 45003:2021 und CCMA-Präzedenzfall darstellen.",
        popi_title: "DEINE DATEN SIND DEIN SCHILD",
        popi_subtitle: "Privacy-First OHS-Architektur",
        popi_desc: "ErgoSafe Reborn arbeitet ausschließlich als digitaler Begleiter. Dies ist ein Produktivitätswerkzeug, kein Spionagewerkzeug. Deine kognitiven und ergonomischen Bewertungsdaten sind durchgehend verschlüsselt und vollständig anonymisiert.",
        popi_guarantee_title: "Human-in-the-Loop-Garantie",
        popi_guarantee_desc: "Sicherheit ist unsere oberste Priorität. Wir verfolgen dich nicht, um dich zu bestrafen. Wir coachen dich, um dich auf Höchstleistung zu halten. Alle Compliance-Berichte und Verhaltens-Audits werden sicher in Zero-Knowledge-Akten abgelegt.",
        popi_accept: "DATENSCHUTZ-HANDSCHLAG AKZEPTIEREN",
        cognitive_title: "OBLIGATORISCHER KOGNITIVER HANDSCHLAG",
        cognitive_subtitle: "Klicke die Ziele so schnell wie möglich an, um deine Baseline zu bestimmen. Eine Verzögerung von > 20% aktiviert die Protokolle des digitalen Begleiters.",
        cognitive_fail: "PROTOKOLL-ALARM: {reason} erkannt. Handschlag fehlgeschlagen mit {variance}% Abweichung. Haftungswarnung nach Abschnitt 37 aktiviert.",
        cognitive_pass_optimal: "KAIZEN-BONUS: Optimale Latenz (<700ms) und geringe Abweichung erkannt. Handschlag erfolgreich. Produktivitätsserie vervielfacht.",
        cognitive_warn: "MUDA ERKANNT: Abweichung beträgt {variance}% von der Baseline. Deine kognitive Konsistenz lässt nach. Ziehe eine professionelle Pause in Betracht.",
        cognitive_pass: "Kognitiver Handschlag erfolgreich! Du arbeitest sicher im Standardarbeitstempo.",
        liability_title: "Haftungswarnung nach Abschnitt 37",
        liability_subtitle: "UNAKZEPTABLE KOGNITIVE LATENZ ERKANNT. Unternehmensrisikoprotokoll: Abschnitt 8(1) OHS-Gesetz 85 von 1993",
        liability_desc: "Deine Reaktionszeiten weichen erheblich von den sicheren Betriebsgrundlagen ab. Um das Unternehmen und deine persönliche Sicherheit zu schützen, wurde die DOA-Sperre aktiviert. Bitte wende dich für eine obligatorische Wellness-Überprüfung an deinen Vorgesetzten.",
        liability_action: "BESTÄTIGEN & DEESKALIEREN",
        kaizen_master: "Kaizen-Meister",
        training: {
            start_session: "Sitzung starten:",
            follow_guide: "Folge der animierten Anleitung. Schritt 1:",
            exercises: {
                "monitor-mastery": { title: "Bildschirm-Beherrschung", desc: "Optimiere Bildschirmhöhe und -abstand, um Nackenbelastungen vorzubeugen. Einhaltung von OHS-Gesetz Abschnitt 8: Gewährleistung eines sicheren Arbeitssystems.", step1: "Eine Armlänge entfernt sitzen" },
                "lumbar-lock": { title: "Lendenwirbel-Unterstützung", desc: "Sichere deinen unteren Rücken für ganztägige Wirbelsäulenunterstützung. Einhaltung von OHS-Gesetz Abschnitt 8: Gewährleistung eines sicheren Arbeitssystems.", step1: "Tief in den Stuhl setzen" },
                "20-20-20": { title: "Die 20-20-20-Augenregel", desc: "Protokoll zur Vorbeugung von digitaler Augenbelastung. Einhaltung von OHS-Gesetz Abschnitt 8: Gewährleistung eines sicheren Arbeitssystems.", step1: "Alle 20 Minuten" },
                "shoulder-rolls": { title: "Schulterkreisen", desc: "Löse Verspannungen im Oberkörper mit einfachen kreisenden Bewegungen. Einhaltung von OHS-Gesetz Abschnitt 8: Gewährleistung eines sicheren Arbeitssystems.", step1: "Aufrecht sitzen" },
                "wrist-flexor": { title: "Handgelenk-Dehnung", desc: "Beuge wiederholten Belastungen in Handgelenken und Unterarmen vor. Einhaltung von OHS-Gesetz Abschnitt 8: Gewährleistung eines sicheren Arbeitssystems.", step1: "Arm nach vorne strecken" },
                "lateral-neck": { title: "Seitliche Nackenneigung", desc: "Löse Nackensteifigkeit durch langes Blicken auf den Bildschirm. Einhaltung von OHS-Gesetz Abschnitt 8: Gewährleistung eines sicheren Arbeitssystems.", step1: "Geradeaus blicken" },
                "mobile-command": { title: "Mobiles Kontrollzentrum", desc: "Ergonomie für Laptops und temporäre Arbeitsplätze. Einhaltung von OHS-Gesetz Abschnitt 8: Gewährleistung eines sicheren Arbeitssystems.", step1: "Laptop anheben" },
                "stress-dump": { title: "Hochvolumige Dekompression", desc: "Mikropausen zum Zurücksetzen nach schwierigen Anrufen. Einhaltung von OHS-Gesetz Abschnitt 8: Gewährleistung eines sicheren Arbeitssystems.", step1: "Tief einatmen" },
                "risk-audit": { title: "Selbstprüfung", desc: "So erkennst du deine eigenen ergonomischen Warnsignale. Einhaltung von OHS-Gesetz Abschnitt 8: Gewährleistung eines sicheren Arbeitssystems.", step1: "Umgebung scannen" },
                "corrective-flow": { title: "Korrekturfluss", desc: "Fortgeschrittene Dehnungen für chronische Problemzonen. Einhaltung von OHS-Gesetz Abschnitt 8: Gewährleistung eines sicheren Arbeitssystems.", step1: "Gezielte Nackenentlastung" }
            }
        }
    },
    st: {
        nelly_intro: "Lumela, ke Nelly. Molekane oa hao oa AI oa Tšireletseho. A re netefatseng hore u sirelelitsoe kajeno.",
        stewardship_model: "Mohlala oa Stewardship o netefatsa boingoliso ba 100% ka letoto la litaelo: ho tloha ho mosebeletsi ho ea ho mookameli, moeta-pele, le CEO.",
        high_discomfort_disclaimer: "TEMOSO: Ho lemohilwe bohloko bo boholo. Sena se behiloe letshwao. Ho hloleha ho se rarolla ho ka baka ho se ikobele Molao oa OHS.",
        legal_shock: "KOTLO: Ho se mamele ho tsoelang pele ho ka baka boikarabelo ba mekhatlo, ho kenyelletsa le likotlo tse boima kapa teronko tlas'a melao ea OHS ea Afrika Boroa.",
        exercise_tip: "Nako ea ho otlolla litho kapele! Sena se thibela khatello ea nako e telele ea mesifa.",
        compliance_check: "Ho hlokahala tlhahlobo ea letsatsi le letsatsi ea tšireletseho. Ka kopo tlatsa lenane la hao la tlhahlobo ka Labohlano ka 12:00 PM.",
        admin_zero: "Tlhahlobo e phethiloe. Ke e ngolisitse ka bo eona ho dossier ea hao oa OHS ea dijithale.",
        first_aid: "Thiba madi, hloekisa leqeba, o le koahele.",
        right_to_disconnect: "Tokelo ea hau ea ho Arola e sireletsehile. Puisano ka ntle ho linako tse lumellanoeng e ka ba kotsi ea ISO 45003:2021 mme CCMA e lumella likopo tse qhubeloang.",
        popi_title: "DINTLHA TSA HAO KE THEBE YA HAO",
        popi_subtitle: "Meralo ea OHS e Behang Boinotshi Pele",
        popi_desc: "ErgoSafe Reborn e sebetsa feela joaloka Motlatsi oa Dijithale. Sena ke sesebelisoa sa tšebetso, eseng sesebelisoa sa bohloela. Dintlha tsa hao tsa tlhahlobo ea kelello le ergonomic li patiloe ka botlalo 'me ha li tsebahale.",
        popi_guarantee_title: "Tiisetso ea Karolo ea Batho",
        popi_guarantee_desc: "Tšireletseho ke eona ntho ea pele e tlang pele. Ha re u sale morao ho u fa kotlo. Re u koetlisetsa ho u boloka u le boemong bo phahameng. Litlaleho tsohle tsa tumellano le tlhahlobo ea boitšoaro li bolokiloe ka tšireletseho ho lifaele tse sa bonoeng.",
        popi_accept: "AMOHELA KANO EA BOINOTSHI",
        cognitive_title: "KANO EA KELELLO EA TLAMEHO",
        cognitive_subtitle: "Tobetsa lipheo kapele kamoo ho ka khonehang ho theha motheo oa hao. Ho lieha ho feta 20% ho tla qala litsamaiso tsa Motlatsi oa Dijithale.",
        cognitive_fail: "TEMOSO EA PROTOCOL: Ho lemohilwe {reason}. Tshebedisano e hlolehile ka phapang ya {variance}%. Temoso ea Boikarabelo ea Karolo ea 37 e kentsoe tšebetsong.",
        cognitive_pass_optimal: "KAIZEN BONUS: Ho lieha ho loketseng (<700ms) le phapang e nyane ho lemohilwe. Kano e hlakotsoe. Katleho ea tšebetso e atisitsoe.",
        cognitive_warn: "MUDA E LEMOHILWE: Phapang ke {variance}% ho tloha motheong. Tsepamo ea kelello ea hao ea thella. Nahana ka ho phomola ha setsebi.",
        cognitive_pass: "Kano ea Kelello e fetile! U sebetsa ka tšireletseho maemong a tloaelehilwe a tšebetso.",
        liability_title: "Temoso ea Boikarabelo ea Karolo ea 37",
        liability_subtitle: "HO LIEHA HO SA AMOHELEHENG HOA KELELLO HO LEMOHILWE. Protocol ea Kotsi ea Khoebo: Karolo ea 8(1) ea Molao oa OHS 85 oa 1993",
        liability_desc: "Linako tsa hao tsa karabelo li khelohile haholo ho tloha metheong e sireletsehileng ea tšebetso. Ho sireletsa mokhatlo le tšireletseho ea hao, DOA Lockout e qaliloe. Ka kopo ikopanye le mookameli oa hao bakeng sa tlhahlobo e tlamang ea bophelo bo botle.",
        liability_action: "AMOHELA 'ME U THEOLE TEMOSO",
        kaizen_master: "Master oa Kaizen",
        training: {
            start_session: "Ho qala:",
            follow_guide: "Latela tataiso. Mohato oa 1:",
            exercises: {
                "monitor-mastery": { title: "Tsamaiso ea Monita", desc: "Ntlafatsa bophahamo ba skrine le sebaka ho thibela khatello ea molala. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Lula hole le bolelele ba letsoho" },
                "lumbar-lock": { title: "Kano ea Lebanta la Mokotla", desc: "Sireletsa mokotla oa hao o ka tlaase bakeng sa tšehetso ea mokotla letsatsi lohle. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Lula botebong ba setulo" },
                "20-20-20": { title: "Molao oa Mahlo oa 20-20-20", desc: "Protocol ea ho thibela khatello oa mahlo ea dijithale. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Metsotso e meng le e meng e 20" },
                "shoulder-rolls": { title: "Ho Pikitla Mahetla", desc: "Imolla khatello ea 'mele o ka holimo ka metsoako e bonolo ea selikalikoe. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Lula u otlolohile" },
                "wrist-flexor": { title: "Ho Otlolla Letsoho le Letsoho", desc: "Thibela khatello e pheta-phetang matsohong le matsohong a ka pele. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Otlolla letsoho pele" },
                "lateral-neck": { title: "Ho Sekamisa Molala ho ea Thoko", desc: "Imolla ho satalla ha molala ho tloha ho shebela skrine nako e telele. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Sheba ka ho otlolohileng pele" },
                "mobile-command": { title: "Setsi sa Taelo se Tsamaeang", desc: "Ergonomics bakeng sa lilaptop le litsi tsa mosebetsi tsa nakoana. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Phahamisa laptop" },
                "stress-dump": { title: "Decompression e Phahameng ea Bophahamo", desc: "Ho phomola ho honyenyane ho tsosolosa ka mor'a mehala e boima. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Hemela hare haholo" },
                "risk-audit": { title: "Mekhoa ea ho Ithlahloba", desc: "Mokhoa oa ho lemoha matšoao a hao a kotsi a ergonomic. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Hlahloba tikoloho" },
                "corrective-flow": { title: "Tsela ea ho Lopolla", desc: "Ho otlolla ho tsoetseng pele bakeng sa libaka tse nang le mathata a sa feleng. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Tokollo e lebisitsoeng ea molala" }
            }
        }
    },
    af: {
        nelly_intro: "Hallo, ek is Nelly. Jou KI Veiligheidsmetgesel. Kom ons maak seker jy is vandag beskerm.",
        stewardship_model: "Die Rentmeesterskapmodel verseker 100% nakoming deur 'n bevelketting: Werknemer na Toesighouer, Leier, en uitvoerende hoof.",
        high_discomfort_disclaimer: "WAARSKUWING: Hoë ongemak bespeur. Dit is gemerk. Versuim om dit op te los kan lei tot nie-nakoming van die OHS-wet.",
        legal_shock: "BELANGRIK: Voortgesette nie-nakoming kan lei tot korporatiewe aanspreeklikheid, insluitend swaar boetes of tronkstraf onder Suid-Afrikaanse OHS-wette.",
        exercise_tip: "Tyd vir 'n vinnige strek! Dit voorkom langtermyn spierspanning.",
        compliance_check: "Daaglikse veiligheidskandering word vereis. Voltooi asseblief jou kontrolelys teen Vrydag om 12:00 nm.",
        admin_zero: "Assessering voltooi. Ek het dit outomaties in jou digitale OHS-dossier geliasseer.",
        first_aid: "Stop bloeding, maak die wond skoon, bedek dit.",
        right_to_disconnect: "Jou reg om te ontkoppel is beskerm. Na-ure kontak buite ooreengekome ure kan 'n psigososiale gevaar inhou onder ISO 45003:2021.",
        popi_title: "JOU DATA IS JOU SKILD",
        popi_subtitle: "Privaatheid-Eerste OHS Argitektuur",
        popi_desc: "ErgoSafe Reborn funksioneer slegs as 'n Digitale Metgesel. Dit is 'n prestasie-instrument, nie 'n spioenasie-instrument nie. Jou data word geënkripteer en geanonimiseer.",
        popi_guarantee_title: "Mens in die Lus Waarborg",
        popi_guarantee_desc: "Veiligheid is ons #1 prioriteit. Alle verslae word veilig geberg.",
        popi_accept: "AANVAAR PRIVAATHEIDSOOREENKOMS",
        cognitive_title: "VERPLIGTE KOGNITIEWE OOREENKOMS",
        cognitive_subtitle: "Klik so vinnig as moontlik op die teikens. Vertraging > 20% sal protokolle aktiveer.",
        cognitive_fail: "PROTOKOL WAARSKUWING: {reason} bespeur. Ooreenkoms het misluk.",
        cognitive_pass_optimal: "KAIZEN BONUS: Optimale latency (<700ms). Produktiwiteit vermenigvuldig.",
        cognitive_warn: "MUDA BESPEUR: Afwyking is {variance}% van basislyn. Jou kognitiewe konsekwentheid neem af.",
        cognitive_pass: "Kognitiewe Ooreenkoms geslaag! Jy werk veilig.",
        liability_title: "Artikel 37 Aanspreeklikheidswaarskuwing",
        liability_subtitle: "ONVERWAARBARE KOGNITIEWE VERTRAGING BESPEUR.",
        liability_desc: "Jou reaksietye het aansienlik afgewyk. Kontak asseblief jou toesighouer.",
        liability_action: "ERKEN EN DEËSKALEER",
        kaizen_master: "Kaizen Meester",
        training: {
            start_session: "Begin sessie:",
            follow_guide: "Volg gids. Stap 1:",
            exercises: {
                "monitor-mastery": { title: "Skermbeheer", desc: "Optimaliseer skermhoogte. OHS-wet Artikel 8 Nakoming.", step1: "Sit armlengte weg" },
                "lumbar-lock": { title: "Onderrugsteun", desc: "Beveilig jou laerug. OHS-wet Artikel 8 Nakoming.", step1: "Sit diep in stoel" },
                "20-20-20": { title: "20-20-20 Oogreël", desc: "Digitale oogstremming voorkoming. OHS-wet Artikel 8 Nakoming.", step1: "Elke 20 minute" },
                "shoulder-rolls": { title: "Skouerrolle", desc: "Verlig bolyfspanning. OHS-wet Artikel 8 Nakoming.", step1: "Sit regop" },
                "wrist-flexor": { title: "Polsstrek", desc: "Voorkom herhalende spanning in die polse. OHS-wet Artikel 8 Nakoming.", step1: "Strek arm vorentoe" },
                "lateral-neck": { title: "Nekstrek", desc: "Verlig nekstyfheid. OHS-wet Artikel 8 Nakoming.", step1: "Kyk reguit vorentoe" },
                "mobile-command": { title: "Mobiele Stasie", desc: "Ergonomie vir skootrekenaars. OHS-wet Artikel 8 Nakoming.", step1: "Verhoog skootrekenaar" },
                "stress-dump": { title: "Stresverligting", desc: "Mikro-pouses. OHS-wet Artikel 8 Nakoming.", step1: "Asem diep in" },
                "risk-audit": { title: "Self-Oudit", desc: "Hoe om jou eie gevare te identifiseer. OHS-wet Artikel 8 Nakoming.", step1: "Skandeer omgewing" },
                "corrective-flow": { title: "Korrektiewe Vloei", desc: "Gevorderde strekke. OHS-wet Artikel 8 Nakoming.", step1: "Teiken nekstrek" }
            }
        }
    }
};
