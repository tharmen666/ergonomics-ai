import { GlobalComplianceEngine } from '../../logic/security/semanticFirewall';
import type { Language } from '../../utils/translations';

/**
 * Nelly's scripted replies in English and multilingual subtitle variants
 * (af, sw, zu, xh, st, fr). Unmapped locales fall back cleanly to English.
 */
export const NELLY_REPLIES = {
    emergency: {
        en: "EMERGENCY: Follow your site emergency procedure now. Alert the nearest manager or trained first-aider, and call the emergency services. Nelly does not contact anyone or stop any equipment. You must carry out these steps yourself.",
        af: "NOOD: Volg nou jou terrein se noodprosedure. Waarsku die naaste bestuurder of opgeleide eerstehulpverlener en bel die nooddienste. Nelly kontak nie iemand nie en stop geen toerusting nie. Jy moet hierdie stappe self uitvoer.",
        sw: "DHARURA: Fuata utaratibu wa dharura wa eneo lako sasa. Mjulishe meneja wa karibu au mhudumu wa huduma ya kwanza, na upige simu kwa huduma za dharura. Nelly hawasiliani na mtu yeyote wala hazimi kifaa chochote. Lazima utekeleze hatua hizi mwenyewe.",
        zu: "ISIMO ESIPHUTHUMAYO: Landela inqubo yezimo eziphuthumayo yasendaweni yakho manje. Yazisa umphathi oseduze noma umsizi wosizo lokuqala oqeqeshiwe, bese ushayela izinsizakalo zezimo eziphuthumayo.",
        xh: "UNGXAMISEKO: Landela inkqubo yongxamiseko yesiza sakho ngoku. Lumkisa umphathi okufuphi okanye umncedisi woncedo lokuqala oqeqeshiweyo, kwaye utsalele iinkonzo zongxamiseko.",
        st: "TSOHANYETSO: Latela tsamaiso ea tšohanyetso ea sebaka sa hau hona joale. Tsebisa mookameli ea haufi kapa mothusi oa pele ea koetlisitsoeng, 'me u letsetse litšebeletso tsa tšohanyetso.",
        fr: "URGENCE : Suivez immédiatement la procédure d'urgence de votre site. Avertissez le responsable le plus proche ou un secouriste formé et appelez les secours. Nelly ne contacte personne et n'arrête aucun équipement.",
    },
    neck: {
        en: "Neck pain reported. If it is comfortable, slowly tilt your head to each side and hold for 5 seconds. If the pain persists or spreads, stop and see a doctor.",
        af: "Nekpyn gerapporteer. As dit gemaklik is, draai jou kop stadig na elke kant en hou dit 5 sekondes. As die pyn aanhou of versprei, hou op en gaan sien 'n dokter.",
        sw: "Maumivu ya shingo yameripotiwa. Kama inafaa, inamisha kichwa chako polepole kila upande kwa sekunde 5. Kama maumivu yanaendelea au kusambaa, acha na umwone daktari.",
        zu: "Ubuhlungu bentamo bubikiwe. Uma kunethezekile, tshekisa ikhanda lakho kancane nhlangothi zombili imizuzwana emi-5. Uma ubuhlungu buqhubeka noma busabalala, yima ubonane nodokotela.",
        xh: "Iintlungu zentamo zixeliwe. Ukuba kukhululekile, thobela intloko yakho kancinci kwicala ngalinye imizuzwana emi-5. Ukuba intlungu iyaqhubeka, yima ubonane nogqirha.",
        st: "Bohloko ba molala bo tlalehiloe. Haeba ho le bonolo, sekamisetsa hlooho ea hau ka bonolo lehlakoreng ka leng metsotsoana e 5. Haeba bohloko bo tsoela pele, ema 'me u bone ngaka.",
        fr: "Douleur cervicale signalée. Si cela est confortable, inclinez lentement la tête de chaque côté pendant 5 secondes. Si la douleur persiste ou s'étend, arrêtez et consultez un médecin.",
    },
    back: {
        en: "Lower back discomfort reported. If you can, slide your hips back against the seat backrest, use a lumbar cushion if you have one, and keep both feet flat on the floor. If the pain persists, see a doctor.",
        af: "Onderrugongemak gerapporteer. Indien moontlik, skuif jou heupe terug teen die stoel se rugleuning, gebruik 'n lendekussing as jy een het, en hou albei voete plat op die vloer. As die pyn aanhou, gaan sien 'n dokter.",
        sw: "Usumbufu wa mgongo wa chini umeripotiwa. Kama unaweza, sogeza nyonga zako nyuma kwenye egemeo la kiti, tumia mto wa kiuno ikiwa upo, na weka miguu yote miwili sakafuni.",
        zu: "Ukungakhululeki kweqolo elingezansi kubikiwe. Uma ukwazi, shelelisa izinqe emuva esihlalweni, usebenzise umqamelo weqolo uma unawo, futhi ugcine izinyawo zombili phansi.",
        xh: "Ukungonwabi komqolo ongezantsi kuxeliwe. Ukuba uyakwazi, tyibilikisa iimpundu zakho ngasemva esitulweni kwaye ugcine iinyawo zombili zicaba phantsi.",
        st: "Ho se phutholohe ha mokokotlo o ka tlaase ho tlalehiloe. Haeba u ka khona, khutlisetsa matheka morao setulong 'me u behe maoto ka bobeli fatše.",
        fr: "Gêne lombaire signalée. Si possible, calez vos hanches au fond du dossier, utilisez un coussin lombaire et gardez les deux pieds à plat sur le sol. Si la douleur persiste, consultez un médecin.",
    },
    wrist: {
        en: "Wrist or forearm discomfort reported. Try to keep your forearms level with the desk, avoid resting your wrists on hard edges while typing, and take a short break. If the discomfort persists, see a doctor.",
        af: "Polsof onderarm-ongemak gerapporteer. Probeer om jou onderarms gelyk met die lessenaar te hou, moenie jou pols op harde rande rus terwyl jy tik nie, en neem 'n kort breek. As die ongemak aanhou, gaan sien 'n dokter.",
        sw: "Usumbufu wa kifundo cha mkono umeripotiwa. Weka mikono yako sawa na meza, epuka kuegemea kingo ngumu unapoandika, na pumzika kwa muda mfupi.",
        zu: "Ukungakhululeki kwesihlakala kubikiwe. Gcina imikhono yakho ilingana netafula, ugweme ukuphumuza izihlakala emaphethelweni aqinile ngenkathi ubhala, bese uthatha ikhefu elifushane.",
        xh: "Ukungonwabi kwesihlahla kuxeliwe. Gcina iingalo zakho zilingana netafile, kuphephe ukubeka izihlahla kwimiphetho eqinileyo xa uchwetheza, kwaye uthathe ikhefu elifutshane.",
        st: "Ho se phutholohe ha letsoho ho tlalehiloe. Boloka matsoho a hau a lekana le tafole, qoba ho beha matsoho mathokong a thata ha u tlanya, 'me u nke khefu e khuts'oane.",
        fr: "Gêne au poignet ou à l'avant-bras signalée. Gardez les avant-bras alignés avec le bureau, évitez d'appuyer les poignets sur des bords durs et faites une courte pause.",
    },
    eye: {
        en: "ERGONOMIC TRIAGE: Visual fatigue / digital eye strain reported. ACTION: Apply the 20-20-20 rule. Look at an object 20 feet away for 20 seconds. Ensure monitor distance is arm's length (50-70cm) with zero glare.",
        af: "ERGONOMIESE TRIAGE: Visuele vermoeidheid / digitale oogspanning gerapporteer. AKSIE: Pas die 20-20-20-reël toe. Kyk 20 sekondes na 'n voorwerp 6 meter weg. Hou die monitor op armlengte afstand (50–70 cm) en sonder weerkaatsing.",
        sw: "UCHAMBUZI WA KIERGONOMIKI: Uchovu wa macho ya kidijitali umeripotiwa. HATUA: Tumia sheria ya 20-20-20. Tazama kitu kilicho umbali wa futi 20 kwa sekunde 20 na weka skrini umbali wa mkono (50-70cm).",
        zu: "UKUHLAZIYA KWE-ERGONOMIC: Ukukhathala kwamehlo kubikiwe. ISENZO: Sebenzisa umthetho we-20-20-20. Bheka into eqhele ngamafidi angu-20 imizuzwana engu-20 bese ugcina ibanga lesikrini elilingana nengalo (50-70cm).",
        xh: "UVAVANYO LWE-ERGONOMIC: Ukudinwa kwamehlo kuxeliwe. INYATHELO: Sebenzisa umgaqo we-20-20-20. Jonga into ekumgama weenyawo ezingama-20 imizuzwana engama-20.",
        st: "TLHAHLOBO EA ERGONOMIC: Mokhathala oa mahlo o tlalehiloe. KETSO: Sebelisa molao oa 20-20-20. Sheba ntho e bohole ba maoto a 20 metsotsoana e 20.",
        fr: "TRIAGE ERGONOMIQUE : Fatigue visuelle signalée. ACTION : Appliquez la règle 20-20-20 : regardez à 6 mètres pendant 20 secondes et placez l'écran à bout de bras (50-70 cm) sans reflet.",
    },
    symptom: {
        en: "Tingling or numbness reported. This can have several causes, including nerve compression in the wrist or neck. Please stand up, move your shoulders, and rest your hands for a few minutes. If it continues or keeps coming back, see a doctor. I am logging this as a risk alert.",
        af: "Tinteling of gevoelloosheid gerapporteer. Dit kan verskeie oorsake hê, insluitend senuweedrukking in die pols of nek. Staan asseblief op, beweeg jou skouers, en rus jou hande vir 'n paar minute. As dit aanhou of terugkom, gaan sien 'n dokter. Ek teken dit aan as 'n risikowaarskuwing.",
        sw: "Ganzi au kuwashwa kumeripotiwa. Tafadhali simama, sogeza mabega yako, na pumzisha mikono yako kwa dakika chache. Kama inaendelea, mwone daktari. Ninaandika hili kama tahadhari ya hatari.",
        zu: "Ukuba ndikindiki noma ukuluma kubikiwe. Sicela usukume, unyakazise amahlombe, futhi uphumuze izandla imizuzu embalwa. Uma kuqhubeka, bonana nodokotela. Ngikubhala njengesexwayiso sengozi.",
        xh: "Ukuba ndindisholo okanye ukuhlaba kuxeliwe. Nceda uphakame, ushukumise amagxa akho, kwaye uphumze izandla imizuzu embalwa. Ukuba kuyaqhubeka, bonana nogqirha.",
        st: "Ho tsikinyeha kapa ho shoa litho ho tlalehiloe. Ka kopo ema, sisinya mahetla a hau, 'me u phomotse matsoho metsotso e 'maloa. Haeba ho tsoela pele, bona ngaka.",
        fr: "Fourmillements ou engourdissements signalés. Veuillez vous lever, bouger les épaules et reposer vos mains quelques minutes. Si cela persiste, consultez un médecin. Je l'enregistre comme alerte de risque.",
    },
    ohs: {
        en: "OHS COMPLIANCE ADVISORY: ErgoSafe Reborn assists with South African OHS Act Section 8(1) general duties of employers and Section 37 provisions. This is general guidance, not legal advice or statutory certification. Your competent person must review any formal assessment.",
        af: "OHS-NAKOMINGSADVIES: ErgoSafe Reborn help met die algemene pligte van werkgewers in artikel 8(1) van die Suid-Afrikaanse OHS-wet en met die bepalings van artikel 37. Dit is algemene leiding, nie regsadvies of statutêre sertifisering nie. Jou bevoegde persoon moet enige formele assessering nagaan.",
        sw: "USHAURI WA KUFUATA SHERIA ZA OHS: ErgoSafe Reborn husaidia na wajibu wa Kifungu cha 8(1) na masharti ya Kifungu cha 37 ya Sheria ya OHS ya Afrika Kusini. Huu ni mwongozo wa jumla, si ushauri wa kisheria.",
        zu: "ISELULEKO SOKUTHOBELA I-OHS: I-ErgoSafe Reborn isiza ngemisebenzi yeSigaba 8(1) kanye nemibandela yeSigaba 37 ye-OHS Act yaseNingizimu Afrika. Lokhu kuyisiqondiso esijwayelekile, hhayi iseluleko somthetho.",
        xh: "INGCEBISO YOKUTHOBELA I-OHS: I-ErgoSafe Reborn incedisa ngemisebenzi yeCandelo 8(1) kunye neCandelo 37 loMthetho we-OHS waseMzantsi Afrika. Esi sisikhokelo jikelele, hayi ingcebiso yezomthetho.",
        st: "KELETSO EA HO LATELA MOLAO OA OHS: ErgoSafe Reborn e thusa ka mesebetsi ea Karolo ea 8(1) le lipehelo tsa Karolo ea 37 tsa Molao oa OHS oa Afrika Boroa. Sena ke tataiso e akaretsang, eseng keletso ea molao.",
        fr: "AVIS DE CONFORMITÉ OHS : ErgoSafe Reborn aide à respecter les obligations générales de l'article 8(1) et l'article 37 de la loi OHS sud-africaine. Ceci est une orientation générale et non un avis juridique.",
    },
    unknown: {
        en: "I did not recognise that. Try describing neck pain, lower back, wrist, eye strain, tingling or numbness, or ask about first aid or an emergency.",
        af: "Ek het dit nie verstaan nie. Probeer om nekpyn, onderrug, pols, oogspanning, tinteling of gevoelloosheid te beskryf, of vra oor eerste hulp of 'n noodgeval.",
        sw: "Sikuelewa hilo. Jaribu kuelezea maumivu ya shingo, mgongo wa chini, kifundo cha mkono, uchovu wa macho, ganzi, au uliza kuhusu huduma ya kwanza au dharura.",
        zu: "Angikubonanga lokho. Zama ukuchaza ubuhlungu bentamo, iqolo elingezansi, isihlakala, ukukhathala kwamehlo, ukuba ndikindiki, noma ubuze ngosizo lokuqala noma isimo esiphuthumayo.",
        xh: "Andikuqondanga oko. Zama ukuchaza iintlungu zentamo, umqolo ongezantsi, isihlahla, ukudinwa kwamehlo, okanye ubuze ngoncedo lokuqala okanye ungxamiseko.",
        st: "Ha kea ka ka utloisisa seo. Leka ho hlalosa bohloko ba molala, mokokotlo o ka tlaase, letsoho, mokhathala oa mahlo, kapa u botse ka thuso ea pele kapa tšohanyetso.",
        fr: "Je n'ai pas compris. Décrivez une douleur au cou, au bas du dos, au poignet, une fatigue visuelle, des fourmillements ou posez une question sur les premiers secours.",
    },
} as const;

export type NellyReplyKey = keyof typeof NELLY_REPLIES;

/** Standards Nelly consults for each reply, looked up in the compliance library. */
const STANDARDS_FOR: Record<NellyReplyKey, Array<['OHS' | 'ISO', string]>> = {
    emergency: [['OHS', 'sec24']],
    neck: [['OHS', 'sec8']],
    back: [['OHS', 'sec8']],
    wrist: [['OHS', 'sec8']],
    eye: [['OHS', 'sec8']],
    symptom: [['OHS', 'sec8']],
    ohs: [['OHS', 'sec37']],
    unknown: [],
};

/**
 * Returns Nelly's reply in the given language, followed by the clause text from the
 * compliance library that the reply relates to. Falls back to English where needed.
 */
export const nellyReply = (key: NellyReplyKey, language: Language): string => {
    const entry = NELLY_REPLIES[key] as Record<string, string>;
    const text = entry[language] || entry.en;
    const references = STANDARDS_FOR[key].map(([protocol, clause]) =>
        GlobalComplianceEngine.getComplianceVector(protocol, clause, language)
    );
    return [text, ...references.map((ref) => `Reference: ${ref}`)].join('\n\n');
};

/**
 * Returns both the South African English spoken text and the localized subtitle text
 * so Nelly always speaks in en-ZA while showing synced multilingual subtitles.
 */
export const nellyReplyPair = (
    key: NellyReplyKey,
    language: Language
): { spokenEnglish: string; subtitleText: string; subtitleLang: Language } => {
    const spokenEnglish = nellyReply(key, 'en');
    const subtitleText = language === 'en' ? spokenEnglish : nellyReply(key, language);
    return { spokenEnglish, subtitleText, subtitleLang: language };
};
