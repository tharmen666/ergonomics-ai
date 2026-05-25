export type Language = 'en' | 'zu' | 'xh' | 'st';

/**
 * V&V AUDIT [2026-05-25]: Tightened TranslationEntry interface.
 * - Added `right_to_disconnect` key across all 4 language pipelines.
 * - Replaced loose `exercises: Record<string, any>` with a typed structure.
 */
export interface TranslationEntry {
    melly_intro: string;
    stewardship_model: string;
    high_discomfort_disclaimer: string;
    legal_shock: string;
    exercise_tip: string;
    compliance_check: string;
    admin_zero: string;
    first_aid: string;
    right_to_disconnect: string;
    training: {
        start_session: string;
        follow_guide: string;
        exercises: Record<string, string>;
    };
}


export const translations: Record<Language, TranslationEntry> = {
    en: {
        melly_intro: "Hi, I'm Melly. Your AI Safety companion. Let's make sure you're protected today.",
        stewardship_model: "The Stewardship Model ensures 100% compliance through a cascading chain of command: Employee to Supervisor, Leader, and CEO.",
        high_discomfort_disclaimer: "WARNING: High discomfort detected. This has been flagged. Failure to resolve may lead to OHS Act non-compliance.",
        legal_shock: "IMPORTANT: Continued non-compliance can result in corporate liability, including heavy fines or imprisonment under South African OHS laws.",
        exercise_tip: "Time for a quick stretch! This prevents long-term musculoskeletal strain.",
        compliance_check: "Daily safety scan required. Please complete your checklist by 12:00 PM Friday.",
        admin_zero: "Assessment complete. I've automatically filed this in your digital OHS dossier.",
        first_aid: "Stop bleeding, clean the wound, cover it.",
        right_to_disconnect: "Your Right to Disconnect is protected. After-hours contact outside agreed hours may constitute a psychosocial hazard under ISO 45003:2021 and CCMA precedent.",
        training: {
            start_session: "Starting session:",
            follow_guide: "Follow the animated guide. Step 1:",
            exercises: {}
        }
    },
    zu: {
        melly_intro: "Sawubona, ngingu-Melly. Umngane wakho we-AI Wezokuphepha. Masikuqinisekise ukuthi uvikelekile namuhla.",
        stewardship_model: "Imodeli ye-Stewardship iqinisekisa ukuthotshelwa kwezinhlelo okungu-100% ngochungechunge lomyalelo: Umsebenzi uye ku-Supervisor, Umholi, kanye ne-CEO.",
        high_discomfort_disclaimer: "ISEXWAYISO: Kutholwe ukungaphatheki kahle kakhulu. Lokhu kufakwe uphawu. Ukwehluleka ukuxazulula kungoholela ekungathandini uMthetho we-OHS.",
        legal_shock: "KUBALULEKILE: Ukungathobeli okuqhubekayo kungaholela ekubophelelekeni kwenkampani, kufaka phakathi inhlawulo enkulu noma ukuboshwa ngaphansi kwemithetho ye-OHS yaseNingizimu Afrika.",
        exercise_tip: "Isikhathi sokuzelula kancane! Lokhu kuvimbela ukukhathala kwemisipha yesikhathi eside.",
        compliance_check: "Kudingeka ukuskenwa kokuphepha kwansuku zonke. Sicela uqedele uhlu lwakho lokuhlola ngo-12:00 PM ngoLwesihlanu.",
        admin_zero: "Ukuhlola kuqediwe. Ngiyifayile ngokuzenzakalelayo lokhu kudossier yakho ye-OHS yedijithali.",
        first_aid: "Misa ukopha, hlambulula isilonda, usimboze.",
        right_to_disconnect: "Ilungelo lakho lokuNqamuka livikelekile. Ukuxhumana ngemuva kwamahora abekiwe kuveza ubungozi be-ISO 45003:2021 futhi kuvunyelwe i-CCMA ukuqhubela phambili amacala.",
        training: {
            start_session: "Ukuqala iseshini:",
            follow_guide: "Landela umhlahlandlela opopayi. Isinyathelo 1:",
            exercises: {}
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
        first_aid: "Misa ukopha, coca inxeba, uligqume.",
        right_to_disconnect: "Ilungelo lakho lokuNqamuka likhuselelwe. Ukuqhagamshelana emva kwamaxesha avunyiweyo kunokwenza ingozi ye-ISO 45003:2021 kwaye i-CCMA ivumela ukuqhubeka kwamacala.",
        training: {
            start_session: "Ukuqala iseshini:",
            follow_guide: "Landela isikhokelo esinopopayi. Inyathelo 1:",
            exercises: {}
        }
    },
    st: {
        melly_intro: "Dumela, ke Melly. Molekane oa hau oa OHS oa AI. A re netefatseng hore o bolokehile kajeno.",
        stewardship_model: "Mohlala oa Stewardship o netefatsa karolo e 100% ea boikarabello ka ketane ea taelo: ho tloha ho Mosebetsi ho isa ho Mookameli, Moetapele le CEO.",
        high_discomfort_disclaimer: "TEMOSO: Ho utloahala ho se phutholohe ho hoholo. Sena se tšoailoe. Ho sitoa ho lokisa sena ho ka lebisa tlhōlong ea Molao oa OHS.",
        legal_shock: "BOHLOEKI: Ho hloka molao ho tsoelang pele ho ka baka boikarabello ba khoebo, ho kenyeletsa likotlo tse boima kapa chankaneng tlas'a melao oa OHS oa Afrika Boroa.",
        exercise_tip: "Nako ea ho otlolla litho kapele! Sena se thibela ho khathala ha mesifa ea nako e telele.",
        compliance_check: "Ho hlokahala tlhahlobo ea letsatsi le letsatsi ea polokeho. Ka kōpo tlatsa lethathamo la hau la tlhahlobo ka 12:00 PM Labohlano.",
        admin_zero: "Tlhahlobo e phethiloe. Ke e ngolisitse ka boeona lethathamong la hau la polokeho la digital la OHS.",
        first_aid: "Thiba madi, hloekisa leqeba, o le koahele.",
        right_to_disconnect: "Tokelo ea hau ea ho Arola e sireletsehile. Puisano ka ntle ho linako tse lumellanoeng e ka ba kotsi ea ISO 45003:2021 mme CCMA e lumella likopo tse qhubeloang.",
        training: {
            start_session: "Ho qala lenaneo:",
            follow_guide: "Latela tataiso e animated. Mohato oa 1:",
            exercises: {}
        }
    }
};
