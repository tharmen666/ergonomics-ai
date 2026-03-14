export type Language = 'en' | 'zu' | 'xh' | 'af';

export const translations = {
    en: {
        melly_intro: "Hi, I'm Melly. Your AI Safety companion. Let's make sure you're protected today.",
        stewardship_model: "The Stewardship Model ensures 100% compliance through a cascading chain of command: Employee to Supervisor, Leader, and CEO.",
        high_discomfort_disclaimer: "WARNING: High discomfort detected. This has been flagged. Failure to resolve may lead to OHS Act non-compliance.",
        legal_shock: "IMPORTANT: Continued non-compliance can result in corporate liability, including heavy fines or imprisonment under South African OHS laws.",
        exercise_tip: "Time for a quick stretch! This prevents long-term musculoskeletal strain.",
        compliance_check: "Daily safety scan required. Please complete your checklist by 12:00 PM Friday.",
        admin_zero: "Assessment complete. I've automatically filed this in your digital OHS dossier.",
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
        melly_intro: "Sawubona, ngingu-Melly. Umngane wakho we-AI Wezokuphepha. Masikuqinisekise ukuthi uvikelekile namuhla.",
        stewardship_model: "Imodeli ye-Stewardship iqinisekisa ukuthotshelwa kwezinhlelo okungu-100% ngochungechunge lomyalelo: Umsebenzi uye ku-Supervisor, Umholi, kanye ne-CEO.",
        high_discomfort_disclaimer: "ISEXWAYISO: Kutholwe ukungaphatheki kahle kakhulu. Lokhu kufakwe uphawu. Ukwehluleka ukuxazulula kungaholela ekungathandini uMthetho we-OHS.",
        legal_shock: "KUBALULEKILE: Ukungathobeli okuqhubekayo kungaholela ekubophelelekeni kwenkampani, kufaka phakathi inhlawulo enkulu noma ukuboshwa ngaphansi kwemithetho ye-OHS yaseNingizimu Afrika.",
        exercise_tip: "Isikhathi sokuzelula kancane! Lokhu kuvimbela ukukhathala kwemisipha yesikhathi eside.",
        compliance_check: "Kudingeka ukuskenwa kokuphepha kwansuku zonke. Sicela uqedele uhlu lwakho lokuhlola ngo-12:00 PM ngoLwesihlanu.",
        admin_zero: "Ukuhlola kuqediwe. Ngiyifayile ngokuzenzakalelayo lokhu kudossier yakho ye-OHS yedijithali.",
        training: {
            start_session: "Ukuqala iseshini:",
            follow_guide: "Landela umhlahlandlela opopayi. Isinyathelo 1:",
            exercises: {
                "monitor-mastery": { title: "Ukuphatha Isikrini", desc: "Lungiselela ukuphakama kwebanga lesikrini ukuze ugweme ubuhlungu bentamo. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Hlala kude nebanga lengalo" },
                "lumbar-lock": { title: "Ukuvikela Umhlane Oningezansi", desc: "Vikela umhlane wakho ongezansi ukuze uthole ukusekela kosuku lonke. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Hlala ujule esihlalweni" },
                "20-20-20": { title: "Umthetho Wamehlo Ka-20-20-20", desc: "Umgomo wokuvikela ukukhathala kwamehlo ngenxa yezikrini. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Njalo ngemizuzu engama-20" },
                "shoulder-rolls": { title: "Ukuzungezisa Amahlombe", desc: "Khulula ukungezwani komzimba ongenhla ngokunyakaza okulula okuyindilinga. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Hlala uqonde" },
                "wrist-flexor": { title: "Ukunweba isihlakala", desc: "Vimbela ubuhlungu obuphindaphindiwe ezihlakaleni nasezingalweni. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Nweba ingalo phambili" },
                "lateral-neck": { title: "Ukutshekisa Intamo", desc: "Khulula ukuqina kwentamo ngenxa yokubuka isikrini isikhathi eside. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Bheka phambili" },
                "mobile-command": { title: "Isikhungo Sokulawula Esiqabulekayo", desc: "I-Ergonomics yama-laptops nezindawo zokusebenza zesikhashana. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Phakamisa i-laptop" },
                "stress-dump": { title: "Ukuphumula Okukhulu", desc: "Amaphefumulo amancane okusetha kabusha ngemuva kwezingcingo ezinzima. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Phefumulela ngaphakathi kakhulu" },
                "risk-audit": { title: "Izinqubo Zokuzicwaninga", desc: "Indlela yokubona izimpawu zakho eziyingozi ze-ergonomic. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Skena indawo" },
                "corrective-flow": { title: "Ukugeleza Kokulungisa", desc: "Ukunweba okuthuthukile kwalezo zindawo eziyinkinga kakhulu. Ukuthobela Umthetho we-OHS Isigaba 8: Ukuqinisekisa uhlelo lokusebenza oluphephile.", step1: "Ukukhulula intamo okuhlosiwe" }
            }
        }
    },
    xh: {
        melly_intro: "Molo, ndinguMelly. Iqabane lakho le-AI lokhuseleko. Masiqinisekise ukuba ukhuselekile namhlanje.",
        stewardship_model: "Imodeli yo-Stewardship iqinisekisa ukuthotyelwa kweemithetho nge-100% ngothungelelwano lomyalelo: Umsebenzi ukuya ku-Supervisor, iNkokheli, kunye ne-CEO.",
        high_discomfort_disclaimer: "ISILUMKISO: Kufunyenwe ukungonwabi kakhulu. Oku kuphawuliwe. Ukusilela ekusombululeni oku kungakhokelela ekungathotyelweni koMthetho we-OHS.",
        legal_shock: "KUBALULEKILE: Ukungathobeli okuqhubekayo kunokukhokelela kuxanduva lwequmrhu, kubandakanywa isohlwayo esinzulu okanye ukuvalelwa phantsi kwemithetho ye-OHS yoMzantsi Afrika.",
        exercise_tip: "Ixesha lokuzivula kancinci! Oku kuthintela ukudinwa kwezihlunu kwixesha elide.",
        compliance_check: "Kufuneka uskanno lokhuseleko lwemihla ngemihla. Nceda ugqibe uluhlu lwakho lokutshekisha ngo-12:00 PM ngoLwesihlanu.",
        admin_zero: "Uvavanyo lugqityiwe. Ndilufayilishe ngokuzenzekelayo kwi-dossier yakho ye-OHS yedijithali.",
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
                "stress-dump": { title: "Ukunyenyisa Uxinzelelo Olukhulu", desc: "Ikhefu elincinci ukuseta kwakhona emva kweefowuni ezinzima. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Phefumlela ngaphakathi nzulu" },
                "risk-audit": { title: "Iinkqubo zokuZiphicotha", desc: "Indlela yokubona izilumkiso zakho ze-ergonomic. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Skena okungqongileyo" },
                "corrective-flow": { title: "Ukuhamba Kolungiso", desc: "Ukolulwa okuhambele phambili kweendawo ezinengxaki engapheliyo. Ukuthotyelwa koMthetho we-OHS iCandelo le-8: Ukuqinisekisa inkqubo yokusebenza ekhuselekileyo.", step1: "Ukukhulula intamo okujoliswe kuko" }
            }
        }
    },
    af: {
        melly_intro: "Hallo, ek is Melly. Jou KI Veiligheidsgesel. Kom ons maak seker jy is vandag beskerm.",
        stewardship_model: "Die Rentmeesterskapmodel verseker 100% voldoening deur 'n kaskade opdragketting: Werknemer na Toesighouer, Leier, en HUB.",
        high_discomfort_disclaimer: "WAARSKUWING: Hoë ongemak bespeur. Dit is gemerk. Versuim om dit op te los kan lei tot nie-nakoming van die OHS Wet.",
        legal_shock: "BELANGRIK: Voortgesette nie-nakoming kan lei tot korporatiewe aanspreeklikheid, insluitend swaar boetes of tronkstraf onder Suid-Afrikaanse OHS wette.",
        exercise_tip: "Tyd vir 'n vinnige strek! Dit voorkom langtermyn muskuloskeletale spanning.",
        compliance_check: "Daaglikse veiligheidskandering word vereis. Voltooi asseblief jou kontrolelys teen Vrydag 12:00.",
        admin_zero: "Assessering voltooi. Ek het dit outomaties in jou digitale OHS dossier geliasseer.",
        training: {
            start_session: "Begin sessie:",
            follow_guide: "Volg die geanimeerde gids. Stap 1:",
            exercises: {
                "monitor-mastery": { title: "Monitor Meesterskap", desc: "Optimaliseer skermhoogte en afstand om nekspanning te voorkom. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Sit op 'n armlengte" },
                "lumbar-lock": { title: "Lumbale Insluiting", desc: "Beveilig jou onderrug vir heeldag ruggraatondersteuning. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Sit diep in die stoel" },
                "20-20-20": { title: "Die 20-20-20 Oog Reël", desc: "Digitale oogstremmingsvoorkomingsprotokol (vir digitale spanning). OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Elke 20 minute" },
                "shoulder-rolls": { title: "Skouerrolle", desc: "Verlig bolyf spanning met eenvoudige sirkelbewegings. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Sit regop" },
                "wrist-flexor": { title: "Polsbuig Strekoefeninge", desc: "Voorkom herhalende spanning in die polse en voorarms. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Steek arm vorentoe uit" },
                "lateral-neck": { title: "Laterale Nek Kantelings", desc: "Verlig nekstyfheid van langdurige skermmonitering. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Kyk reguit vorentoe" },
                "mobile-command": { title: "Mobiele Beheersentrum", desc: "Ergonomie vir skootrekenaars en tydelike werkstasies. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Lig skootrekenaar op" },
                "stress-dump": { title: "Hoë-Volume Dekompressie", desc: "Mikro-pouses om te herstel na moeilike oproepe. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Asem diep in" },
                "risk-audit": { title: "Self-Oudit Prosedures", desc: "Hoe om jou eie ergonomiese rooi vlae raak te sien. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Skandeer die omgewing" },
                "corrective-flow": { title: "Korrektiewe Vloei", desc: "Gevorderde strekke vir chroniese probleemareas. OHS Wet Artikel 8 Voldoening: Versekering van 'n veilige werkstelsel.", step1: "Gefokusde nekvrystelling" }
            }
        }
    }
};
