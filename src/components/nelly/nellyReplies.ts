import { GlobalComplianceEngine } from '../../logic/security/semanticFirewall';
import type { Language } from '../../utils/translations';

/**
 * Nelly's scripted replies, in English and Afrikaans. Other languages fall back to English.
 * Afrikaans text is a draft and should be checked by a first-language Afrikaans speaker.
 */
export const NELLY_REPLIES = {
    emergency: {
        en: "EMERGENCY: Follow your site emergency procedure now. Alert the nearest manager or trained first-aider, and call the emergency services. Nelly does not contact anyone or stop any equipment. You must carry out these steps yourself.",
        af: "NOOD: Volg nou jou terrein se noodprosedure. Waarsku die naaste bestuurder of opgeleide eerstehulpverlener en bel die nooddienste. Nelly kontak nie iemand nie en stop geen toerusting nie. Jy moet hierdie stappe self uitvoer.",
    },
    neck: {
        en: "Neck pain reported. If it is comfortable, slowly tilt your head to each side and hold for 5 seconds. If the pain persists or spreads, stop and see a doctor.",
        af: "Nekpyn gerapporteer. As dit gemaklik is, draai jou kop stadig na elke kant en hou dit 5 sekondes. As die pyn aanhou of versprei, hou op en gaan sien 'n dokter.",
    },
    back: {
        en: "Lower back discomfort reported. If you can, slide your hips back against the seat backrest, use a lumbar cushion if you have one, and keep both feet flat on the floor. If the pain persists, see a doctor.",
        af: "Onderrugongemak gerapporteer. Indien moontlik, skuif jou heupe terug teen die stoel se rugleuning, gebruik 'n lendekussing as jy een het, en hou albei voete plat op die vloer. As die pyn aanhou, gaan sien 'n dokter.",
    },
    wrist: {
        en: "Wrist or forearm discomfort reported. Try to keep your forearms level with the desk, avoid resting your wrists on hard edges while typing, and take a short break. If the discomfort persists, see a doctor.",
        af: "Polsof onderarm-ongemak gerapporteer. Probeer om jou onderarms gelyk met die lessenaar te hou, moenie jou pols op harde rande rus terwyl jy tik nie, en neem 'n kort breek. As die ongemak aanhou, gaan sien 'n dokter.",
    },
    eye: {
        en: "ERGONOMIC TRIAGE: Visual fatigue / digital eye strain reported. ACTION: Apply the 20-20-20 rule. Look at an object 20 feet away for 20 seconds. Ensure monitor distance is arm's length (50-70cm) with zero glare.",
        af: "ERGONOMIESE TRIAGE: Visuele vermoeidheid / digitale oogspanning gerapporteer. AKSIE: Pas die 20-20-20-reël toe. Kyk 20 sekondes na 'n voorwerp 6 meter weg. Hou die monitor op armlengte afstand (50–70 cm) en sonder weerkaatsing.",
    },
    symptom: {
        en: "Tingling or numbness reported. This can have several causes, including nerve compression in the wrist or neck. Please stand up, move your shoulders, and rest your hands for a few minutes. If it continues or keeps coming back, see a doctor. I am logging this as a risk alert.",
        af: "Tinteling of gevoelloosheid gerapporteer. Dit kan verskeie oorsake hê, insluitend senuweedrukking in die pols of nek. Staan asseblief op, beweeg jou skouers, en rus jou hande vir 'n paar minute. As dit aanhou of terugkom, gaan sien 'n dokter. Ek teken dit aan as 'n risikowaarskuwing.",
    },
    ohs: {
        en: "OHS COMPLIANCE ADVISORY: ErgoSafe Reborn assists with South African OHS Act Section 8(1) general duties of employers and Section 37 provisions. This is general guidance, not legal advice or statutory certification. Your competent person must review any formal assessment.",
        af: "OHS-NAKOMINGSADVIES: ErgoSafe Reborn help met die algemene pligte van werkgewers in artikel 8(1) van die Suid-Afrikaanse OHS-wet en met die bepalings van artikel 37. Dit is algemene leiding, nie regsadvies of statutêre sertifisering nie. Jou bevoegde persoon moet enige formele assessering nagaan.",
    },
    unknown: {
        en: "I did not recognise that. Try describing neck pain, lower back, wrist, eye strain, tingling or numbness, or ask about first aid or an emergency.",
        af: "Ek het dit nie verstaan nie. Probeer om nekpyn, onderrug, pols, oogspanning, tinteling of gevoelloosheid te beskryf, of vra oor eerste hulp of 'n noodgeval.",
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
    const lang = language === 'af' ? 'af' : 'en';
    const text = NELLY_REPLIES[key][lang];
    const references = STANDARDS_FOR[key].map(([protocol, clause]) =>
        GlobalComplianceEngine.getComplianceVector(protocol, clause, lang)
    );
    return [text, ...references.map((ref) => `Reference: ${ref}`)].join('\n\n');
};
