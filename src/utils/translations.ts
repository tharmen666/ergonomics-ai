export type Language = 'en' | 'zu' | 'xh' | 'af' | 'sw' | 'zh' | 'es' | 'ko' | 'st';

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
                "lumbar-lock": { title: "Ukuvikela Umhlane Oningezansi", desc: "Vikela umhlane wakho ongezansi ukuze uthole ukusekela kosuku lonke. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Hlala ujule esihlalweni" },
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
    af: {
        nelly_intro: "Hallo, ek is Nelly. Jou KI Veiligheidsgesel. Kom ons maak seker jy is vandag beskerm.",
        stewardship_model: "Die Rentmeesterskapmodel verseker 100% voldoening deur 'n kaskade opdragketting: Werknemer na Toesighouer, Leier, en HUB.",
        high_discomfort_disclaimer: "WAARSKUWING: Hoë ongemak bespeur. Dit is gemerk. Versuim om dit op te los kan lei tot nie-nakoming van die OHS Wet.",
        legal_shock: "BELANGRIK: Voortgesette nie-nakoming kan lei tot korporatiewe aanspreeklikheid, insluitend swaar boetes of tronkstraf onder Suid-Afrikaanse OHS wette.",
        exercise_tip: "Tyd vir 'n vinnige strek! Dit voorkom langtermyn muskuloskeletale spanning.",
        compliance_check: "Daaglikse veiligheidskandering word vereis. Voltooi asseblief jou kontrolelys teen Vrydag 12:00.",
        admin_zero: "Assessering voltooi. Ek het dit outomaties in jou digitale OHS dossier geliasseer.",
        first_aid: "Stop bloeding, maak die wond skoon, bedek dit.",
        right_to_disconnect: "Jou reg om te ontkoppel is beskerm. Kontak buite ooreengekome ure kan 'n psigososiale gevaar onder ISO 45003:2021 en CCMA-presedent uitmaak.",
        popi_title: "JOU DATA IS JOU SKILD",
        popi_subtitle: "Privaatheid-Eerste OHS Argitektuur",
        popi_desc: "ErgoSafe Reborn funksioneer streng as 'n Digitale Vleuelman. Dit is 'n prestasie-instrument, nie 'n spioenasie-instrument nie. Jou kognitiewe en ergonomiese assesseringsdata is end-tot-end geïnkripteer en heeltemal geanonimiseer.",
        popi_guarantee_title: "Mens-in-die-Lus Waarborg",
        popi_guarantee_desc: "Veiligheid is ons nommer een prioriteit. Ons spoor jou nie op om jou te straf nie. Ons rig jou af om jou op piekprestasie te hou. Alle nakomingsverslae en gedragsoudits word veilig in nul-kennis-dossiere geliasseer.",
        popi_accept: "AANVAAR PRIVAATHEIDSHANDDRUK",
        cognitive_title: "VERPLIGTE KOGNITIEWE HANDDRUK",
        cognitive_subtitle: "Klik die teikens so vinnig as moontlik om jou basislyn te bepaal. Vertraging > 20% sal Digitale Vleuelman-protokolle aktiveer.",
        cognitive_fail: "PROTOKOL-WAARSKUWING: {reason} bespeur. Handdruk het misluk met {variance}% afwyking. Artikel 37 Aanspreeklikheidswaarskuwing geaktiveer.",
        cognitive_pass_optimal: "KAIZEN-BONUS: Optimale latensie (<700ms) en lae afwyking bespeur. Handdruk skoon. Produktiewe reeks vermenigvuldig.",
        cognitive_warn: "MUDA BESPEUR: Afwyking is {variance}% van basislyn. Jou kognitiewe konsekwentheid gly. Oorweeg 'n professionele herstel.",
        cognitive_pass: "Kognitiewe Handdruk geslaag! Jy presteer veilig teen standaardwerktempo's.",
        liability_title: "Artikel 37 Aanspreeklikheidswaarskuwing",
        liability_subtitle: "ONAANVAARBARE KOGNITIEWE LATENSIE BESPEUR. Korporatiewe Risiko-protokol: Artikel 8(1) OHS-wet 85 van 1993",
        liability_desc: "Jou reaksietye het aansienlik afgewyk van veilige operasionele basislyne. Om die organisasie en jou persoonlike safety te beskerm, is 'n DOA-uitsluiting geaktiveer. Kontak asseblief jou toesighouer vir 'n verpligte welstandskontrole.",
        liability_action: "ERKEN & DE-ESKALEER",
        kaizen_master: "Kaizen-meester",
        training: {
            start_session: "Begin sessie:",
            follow_guide: "Volg die geanimeerde gids. Stap 1:",
            exercises: {
                "monitor-mastery": { title: "Monitor Meesterskap", desc: "Optimaliseer skermhoogte en afstand om nekspanning te voorkom. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Sit op 'n armlengte" },
                "lumbar-lock": { title: "Lumbale Insluiting", desc: "Beveilig jou onderrug vir heeldag ruggraatondersteuning. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Sit diep in die stoel" },
                "20-20-20": { title: "Die 20-20-20 Oog Reël", desc: "Digitale oogstremmingsvoorkomingsprotokol (for digitale spanning). OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Elke 20 minute" },
                "shoulder-rolls": { title: "Skouerrolle", desc: "Verlig bolyf spanning met eenvoudige sirkelbewegings. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Sit regop" },
                "wrist-flexor": { title: "Polsbuig Strekoefeninge", desc: "Voorkom herhalende spanning in die polse en voorarms. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Steek arm vorentoe uit" },
                "lateral-neck": { title: "Laterale Nek Kantelings", desc: "Verlig nekstyfheid van langdurige skermmonitering. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Kyk reguit vorentoe" },
                "mobile-command": { title: "Mobiele Beheersentrum", desc: "Ergonomie vir skootrekenaars en tydelike werkstasies. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Lig skootrekenaar op" },
                "stress-dump": { title: "Hoë-Volume Dekompressie", desc: "Mikro-pouses om te herstel na moeilike oproepe. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Asem diep in" },
                "risk-audit": { title: "Self-Oudit Prosedures", desc: "Hoe om jou eie ergonomiese rooi vlae raak te sien. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Skandeer die omgewing" },
                "corrective-flow": { title: "Korrektiewe Vloei", desc: "Gevorderde strekke vir chroniese probleemareas. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Gefokusde nekvrystelling" }
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
        popi_title: "DATA YAKO NDIO NGAO YAKO",
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
                "20-20-20": { title: "Molao oa Mahlo oa 20-20-20", desc: "Protocol ea ho thibela khatello ea mahlo ea dijithale. Tumellano ea OHS Act Karolo ea 8: Ho netefatsa tsamaiso e bolokehileng ea mosebetsi.", step1: "Metsotso e meng le e meng e 20" },
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
        popi_guarantee_title: "人工干预保障",
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
        training: { start_session: "开始会话:", follow_guide: "请按照指南操作, 步骤 1:", exercises: {} }
    },
    es: {
        nelly_intro: "Hola, soy Nelly. Tu acompañante de Seguridad AI. Asegurémonos de que estés protegido hoy.",
        stewardship_model: "El modelo de gestión asegura el 100% de cumplimiento desde el empleado hasta el CEO.",
        high_discomfort_disclaimer: "ADVERTENCIA: Alto malestar detectado. Ignorar esto puede incurrir en incumplimiento de normas OHS (ISO 45001).",
        legal_shock: "IMPORTANTE: El incumplimiento puede resultar en responsabilidad penal para la empresa.",
        exercise_tip: "¡Hora de un estiramiento rápido! Previene lesiones musculares a largo plazo.",
        compliance_check: "Se requiere un escaneo de seguridad diario. Por favor complétalo para el mediodía.",
        admin_zero: "Evaluación completada. Guardado automáticamente en tu dossier OHS.",
        first_aid: "Detenga el sangrado, limpie la herida, cúbrala.",
        right_to_disconnect: "Su derecho a desconectarse está protegido. El contacto fuera de las horas acordadas puede constituir un riesgo psicosocial según la norma ISO 45003:2021 y el precedente de la CCMA.",
        popi_title: "TUS DATOS SON TU ESCUDO",
        popi_subtitle: "Arquitectura OHS que Prioriza la Privacidad",
        popi_desc: "ErgoSafe Reborn opera estrictamente como un Acompañante Digital. Esta es una herramienta de rendimiento, no de espionaje. Sus datos de evaluación cognitiva y ergonómica están encriptados de extremo a extremo y son completamente anónimos.",
        popi_guarantee_title: "Garantía de Intervención Humana",
        popi_guarantee_desc: "La seguridad es nuestra prioridad número uno. No lo rastreamos para castigarlo. Lo guiamos para mantenerlo en su máximo rendimiento. Todos los informes de cumplimiento y auditorías de comportamiento se archivan de forma segura en expedientes de conocimiento cero.",
        popi_accept: "ACEPTAR ACUERDO DE PRIVACIDAD",
        cognitive_title: "COMPROBACIÓN COGNITIVA OBLIGATORIA",
        cognitive_subtitle: "Haga clic en los objetivos lo más rápido posible para establecer su línea base. Un retraso > 20% activará los protocolos del Acompañante Digital.",
        cognitive_fail: "ALERTA DE PROTOCOLO: Se detectó {reason}. La comprobación falló con un {variance}% de varianza. Advertencia de responsabilidad de la Sección 37 activa.",
        cognitive_pass_optimal: "BONO KAIZEN: Latencia óptima (<700ms) y baja varianza detectadas. Comprobación superada. Racha productiva multiplicada.",
        cognitive_warn: "MUDA DETECTADO: La varianza es del {variance}% respecto a la línea base. Su consistencia cognitiva está disminuyendo. Considere un reinicio profesional.",
        cognitive_pass: "¡Comprobación cognitiva aprobada! Se desempeña de manera segura a tasas de trabajo estándar.",
        liability_title: "Advertencia de Responsabilidad de la Sección 37",
        liability_subtitle: "LATENCIA COGNITIVA INACEPTABLE DETECTADA. Protocolo de riesgo corporativo: Sección 8(1) de la Ley OHS 85 de 1993",
        liability_desc: "Sus tiempos de reacción se han desviado significativamente de las líneas base operativas seguras. Para proteger a la organización y su seguridad personal, se ha activado el bloqueo DOA. Comuníquese con su supervisor para una revisión de bienestar obligatoria.",
        liability_action: "RECONOCER Y DESESCALAR",
        kaizen_master: "Maestro Kaizen",
        training: { start_session: "Empezar:", follow_guide: "Siga la guía animada. Paso 1:", exercises: {} }
    },
    ko: {
        nelly_intro: "안녕하세요, 저는 AI 안전 파트너 Nelly입니다. 오늘 귀하의 안전을 관리하겠습니다.",
        stewardship_model: "책임 모델은 직원부터 최고 경영자까지 100% 규정 준수를 보장합니다.",
        high_discomfort_disclaimer: "경고: 높은 피로도가 감지되었습니다. 이를 방치하면 OHS 규정을 위반할 수 있습니다.",
        legal_shock: "중요: 지속적인 규정 위반은 심각한 기업의 법적 책임(ISO 45001)으로 이어질 수 있습니다.",
        exercise_tip: "잠시 스트레칭할 시간입니다! 이는 근골격계 질환을 예방합니다.",
        compliance_check: "일일 안전 점검이 필요합니다. 금요일 정오까지 체크리스트를 완료하세요.",
        admin_zero: "평가 완료. 디지털 OHS 데이터베이스에 자동으로 저장되었습니다.",
        first_aid: "지혈하고 상처를 깨끗이 한 후 덮으십시오.",
        right_to_disconnect: "연락을 끊을 권리는 보호됩니다. 합의된 시간 외에 근무 시간 이후에 연락하는 것은 ISO 45003:2021 및 CCMA 선례에 따라 사회심리적 위험을 구성할 수 있습니다.",
        popi_title: "귀하의 데이터는 귀하의 방패입니다",
        popi_subtitle: "개인정보 보호 우선 OHS 아키텍처",
        popi_desc: "ErgoSafe Reborn은 철저히 디지털 윙맨으로만 작동합니다. 이는 성과 도구일 뿐, 감시 도구가 아닙니다. 귀하의 인지 및 인간공학 평가 데이터는 종단간 암호화되며 완전히 익명화됩니다.",
        popi_guarantee_title: "사람의 개입 보장",
        popi_guarantee_desc: "안전은 저희의 최우선 과제입니다. 저희는 귀하를 처벌하기 위해 추적하지 않습니다. 최고 성과를 유지할 수 있도록 코칭합니다. 모든 규정 준수 보고서와 행동 감사는 영지식 파일로 안전하게 보관됩니다.",
        popi_accept: "개인정보 보호 동의서 수락",
        cognitive_title: "필수 인지 점검",
        cognitive_subtitle: "기준선을 설정하려면 가능한 한 빨리 타겟을 클릭하십시오. 20% 이상의 지연이 발생하면 디지털 윙맨 프로토콜이 실행됩니다.",
        cognitive_fail: "프로토콜 경고: {reason} 감지됨. {variance}% 편차로 인해 점검이 실패했습니다. 제37조 법적 책임 경고가 활성화되었습니다.",
        cognitive_pass_optimal: "카이젠 보너스: 최적의 지연 시간(<700ms) 및 낮은 편차가 감지되었습니다. 점검이 통과되었습니다. 생산성 스트리크가 배가되었습니다.",
        cognitive_warn: "무다(낭비) 감지: 기준선에서 {variance}% 편차가 발생했습니다. 인지 일관성이 떨어지고 있습니다. 전문적인 휴식을 취하십시오.",
        cognitive_pass: "인지 점검이 통과되었습니다! 표준 작업 속도에서 안전하게 수행하고 있습니다.",
        liability_title: "제37조 법적 책임 경고",
        liability_subtitle: "허용되지 않는 인지 지연 감지. 기업 위험 프로토콜: 1993년 OHS 법 제85호 제8(1)조",
        liability_desc: "귀하의 반응 시간이 안전한 작동 기준선에서 크게 벗어났습니다. 조직과 개인의 안전을 보호하기 위해 DOA 잠금이 발생했습니다. 필수 건강 점검을 위해 감독관에게 문의하십시오.",
        liability_action: "확인 및 경고 해제",
        kaizen_master: "카이젠 마스터",
        training: { start_session: "세션 시작:", follow_guide: "애니메이션 가이드를 따르세요. 1단계:", exercises: {} }
    }
};
