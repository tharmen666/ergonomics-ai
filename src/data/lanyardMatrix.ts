/**
 * ERGOSAFE REBORN: FORECOURT COMPLIANCE MATRIX
 * 
 * Target: Service Stations (ErgoSafe Forecourt / General Forecourt)
 * Persona: Iris (Safety Agent)
 * Format: Physical SOP Lanyard Tracks & 5-Card FAQ Deck
 * Localization: English (en) & isiZulu (zu)
 */

export interface BilingualText {
    en: string;
    zu: string;
}

export interface LanyardStep {
    stepNumber: number;
    instruction: BilingualText;
}

export interface SOPTrack {
    id: string;
    trackTitle: BilingualText;
    irisVoiceIntro: BilingualText;
    steps: LanyardStep[];
    irisClosingDirective: BilingualText;
}

export interface FAQCard {
    cardNumber: number;
    question: BilingualText;
    answer: BilingualText;
    irisProtocolTip: BilingualText;
}

export interface ServiceStationMatrix {
    version: string;
    brandFocus: string;
    sideA_EmergencySOPs: SOPTrack[];
    sideB_ServiceRoutines: SOPTrack[];
    forecourtFaqDeck: FAQCard[];
}

export const FORECOURT_LANYARD_MATRIX: ServiceStationMatrix = {
    version: "2026.5.1",
    brandFocus: "ErgoSafe Forecourt / General Service Stations",

    // ==========================================
    // SIDE A: EMERGENCY & HAZMAT CONTAINMENT
    // ==========================================
    sideA_EmergencySOPs: [
        {
            id: "SOP-EVAC-01",
            trackTitle: {
                en: "Instant Forecourt Evacuation Protocol",
                zu: "Umgomo Wokuphuma Ngokushesha Esiteshini"
            },
            irisVoiceIntro: {
                en: "Attention Team. I am Iris. In a severe emergency, every second counts. Do not panic. Follow my exact steps to lock down the forecourt and get everyone to the assembly point alive.",
                zu: "Lalelani Thimba. Ngingu-Iris. Esimeni esibucayi kakhulu, yonke imizuzwana ibalulekile. Ningatatazeli. Landelani izinyathelo zami ukuze sivikele isiteshi futhi sisebenzise indawo yokuhlangana iphephile."
            },
            steps: [
                {
                    stepNumber: 1,
                    instruction: {
                        en: "Hit the Emergency Stop (E-Stop) button immediately to cut all fuel flow.",
                        zu: "Cindezela inkinobho yokumisa isimo esiphuthumayo (E-Stop) ngokushesha ukuze unqamule konke ukuhamba kukaphethiloli."
                    }
                },
                {
                    stepNumber: 2,
                    instruction: {
                        en: "Direct all customers to leave their vehicles and move to the designated Assembly Point.",
                        zu: "Tshela onke amakhasimende ukuthi ashiye izimoto zawo futhi adlulele Endaweni Yokuhlangana ebekiwe."
                    }
                },
                {
                    stepNumber: 3,
                    instruction: {
                        en: "Do not attempt to fight large fires. Evacuate and await emergency services.",
                        zu: "Ungazami ukucisha imililo emikhulu. Phumani nilinde abezimo eziphuthumayo."
                    }
                }
            ],
            irisClosingDirective: {
                en: "Your life is the primary asset. Never risk it to save property. Clear the zone, take a headcount, and report to the Site Manager.",
                zu: "Impilo yakho yiyona ebaluleke kakhulu. Ungalokothi uyibeke engozini ukuze usindise impahla. Susa wonke umuntu endaweni, bala abantu, bese ubika kuMphathi Wesiteshi."
            }
        },
        {
            id: "SOP-SPILL-02",
            trackTitle: {
                en: "HazMat Spill Containment (Under 50 Litres)",
                zu: "Ukunqanda Ukuchitheka Kwezinto Eziyingozi (Ngaphansi kwamaLitha angama-50)"
            },
            irisVoiceIntro: {
                en: "Iris here. A spill is a massive environmental and fire hazard. We contain it immediately. Grab your spill kit and secure the perimeter.",
                zu: "Ngingu-Iris lapha. Ukuchitheka kuyingozi enkulu emvelweni nasemlilweni. Siyakunqanda ngokushesha. Thatha ikhithi yakho yokuchitheka uvikele indawo."
            },
            steps: [
                {
                    stepNumber: 1,
                    instruction: {
                        en: "Block public access. Place safety cones around the spill radius.",
                        zu: "Vimba ukufinyelela komphakathi. Beka amakhoni okuphepha endaweni echithekile."
                    }
                },
                {
                    stepNumber: 2,
                    instruction: {
                        en: "Deploy absorbent sand or peat from the spill bin directly over the fuel.",
                        zu: "Faka isihlabathi esimunca uketshezi noma i-peat evela emgqonyeni wokuchitheka ngqo phezu kukaphethiloli."
                    }
                },
                {
                    stepNumber: 3,
                    instruction: {
                        en: "Sweep the absorbed material into HazMat bags. Do not wash fuel into the storm drain.",
                        zu: "Shanela izinto ezimunce uketshezi uzifake ezikhwameni ze-HazMat. Ungagezeli uphethiloli emseleni wamanzi."
                    }
                }
            ],
            irisClosingDirective: {
                en: "Excellent containment. Now, report this incident in the ledger for environmental compliance. A clean forecourt is a safe forecourt.",
                zu: "Ukunqanda okuhle kakhulu. Manje, bika lesi sigameko kwirejista yokuthobela imvelo. Isiteshi esihlanzekile yisiteshi esiphephile."
            }
        }
    ],

    // ==========================================
    // SIDE B: CUSTOMER SERVICE ROUTINES
    // ==========================================
    sideB_ServiceRoutines: [
        {
            id: "SOP-CUST-01",
            trackTitle: {
                en: "The 6-Point Pump Service Routine",
                zu: "Inqubo Yamaphuzu ayi-6 Yokusebenzela Epompeni"
            },
            irisVoiceIntro: {
                en: "Iris speaking. Service is your superpower. Execute this 6-point check on every vehicle to drive sales and ensure absolute customer safety.",
                zu: "Kukhuluma u-Iris. Ukusebenza kahle kungamandla akho. Yenza lokhu kuhlola kwamaphuzu ayi-6 kuyo yonke imoto ukuze ukhulise ukuthengisa futhi uqinisekise ukuphepha kwamakhasimende."
            },
            steps: [
                {
                    stepNumber: 1,
                    instruction: { en: "Greet with a smile and confirm fuel type clearly.", zu: "Bingelela ngokumamatheka bese uqinisekisa uhlobo lukaphethiloli ngokucacile." }
                },
                {
                    stepNumber: 2,
                    instruction: { en: "Check the oil and water levels.", zu: "Hlola izinga lamafutha namanzi." }
                },
                {
                    stepNumber: 3,
                    instruction: { en: "Wash the windscreen.", zu: "Geza ifasitela langaphambili lemoto." }
                },
                {
                    stepNumber: 4,
                    instruction: { en: "Check the tyre pressure if requested.", zu: "Hlola umoya emathayeleni uma ucelwa." }
                },
                {
                    stepNumber: 5,
                    instruction: { en: "Process payment securely at the window.", zu: "Yenza inkokhelo ngokuphephile efasiteleni." }
                },
                {
                    stepNumber: 6,
                    instruction: { en: "Thank the customer and wish them a safe journey.", zu: "Bonga ikhasimende ulifisele uhambo oluphephile." }
                }
            ],
            irisClosingDirective: {
                en: "Consistency is key. A safe vehicle and a happy customer ensures they return. Stay sharp.",
                zu: "Ukwenza njalo kubalulekile. Imoto ephephile nekhasimende elijabulile kuqinisekisa ukuthi bayabuya. Hlala uqaphile."
            }
        }
    ],

    // ==========================================
    // ERGOSAFE FORECOURT 5-CARD FAQ DECK
    // ==========================================
    forecourtFaqDeck: [
        {
            cardNumber: 1,
            question: {
                en: "Why must I switch off my engine and avoid using my phone near fuel pumps?",
                zu: "Kungani kufanele ngicime injini futhi ngigweme ukusebenzisa umakhalekhukhwini eduze kwamapompe kaphethiloli?"
            },
            answer: {
                en: "Fuel vapours are invisible and highly flammable. Switching off your engine, avoiding open flames, and keeping mobile devices inside the cabin eliminates static and spark ignition risks on the ErgoSafe Forecourt.",
                zu: "Umhwamuko kaphethiloli awubonakali futhi uvutha kalula kakhulu. Ukucima injini yakho, ukugwema amalangabi, nokugcina umakhalekhukhwini emotweni kuqeda ingozi yezinhlansi endaweni yokufaka uphethiloli ye-ErgoSafe Forecourt."
            },
            irisProtocolTip: {
                en: "Remain calm and polite. Explain that ErgoSafe Forecourt safety rules protect every driver, passenger, and attendant.",
                zu: "Hlala uzolile futhi uhloniphekile. Chaza ukuthi imithetho yokuphepha ye-ErgoSafe Forecourt ivikela bonke abashayeli, abagibeli, nabasebenzi."
            }
        },
        {
            cardNumber: 2,
            question: {
                en: "How do forecourt attendants prevent back and wrist strain during busy shifts?",
                zu: "Abasebenzi basemapompeni bakuvikela kanjani ukulimala komhlane nesihlakala phakathi namashifu amatasa?"
            },
            answer: {
                en: "Our team follows ErgoSafe Forecourt ergonomic posture protocols: keeping the fuel nozzle close to the body, maintaining neutral wrists, bending knees when checking tyres or lifting oil containers, and rotating pump islands regularly.",
                zu: "Ithimba lethu lilandela imigomo ye-ergonomics ye-ErgoSafe Forecourt: ukugcina umbhobho kaphethiloli useduze nomzimba, ukugcina izihlakala ziqondile, ukugoba amadolo uma kuhlolwa amathayi noma kuphakanyiswa amafutha, nokushintshana emapompeni njalo."
            },
            irisProtocolTip: {
                en: "Demonstrate safe stance at the pump. Good posture reduces fatigue and keeps service fast and accurate.",
                zu: "Khombisa ukuma okuphephile epompeni. Ukuma kahle kunciphisa ukukhathala futhi kugcina ukusebenza kushesha futhi kunembile."
            }
        },
        {
            cardNumber: 3,
            question: {
                en: "Can I use my contactless bank card or forecourt loyalty rewards at the pump?",
                zu: "Ngingasebenzisa ikhadi lami lasebhange elingathinti noma imiklomelo yokwethembeka epompeni?"
            },
            answer: {
                en: "Yes! ErgoSafe Forecourt sites support cash, tap-and-go bank cards, and active partner loyalty programs right at the pump window without you needing to leave your vehicle.",
                zu: "Yebo! Iziteshi ze-ErgoSafe Forecourt zamukela ukheshi, amakhadi asebhange a-tap-and-go, nezinhlelo zemiklomelo ezisebenzayo khona lapho efasiteleni ngaphandle kokuba uphume emotweni."
            },
            irisProtocolTip: {
                en: "Always confirm the payment method and loyalty card before authorizing the pump—it speeds up checkout and builds customer trust.",
                zu: "Njalo qinisekisa indlela yokukhokha nekhadi lemiklomelo ngaphambi kokuvula ipompe—lokhu kusheshisa inkokhelo futhi kwakha ukwethenjwa."
            }
        },
        {
            cardNumber: 4,
            question: {
                en: "What happens to my corporate fleet card and fuel slip verification?",
                zu: "Kwenzekani ngekhadini lami lezimoto zenhlangano kanye nokuqinisekiswa kwamarisidi kaphethiloli?"
            },
            answer: {
                en: "All major corporate fleet cards are 100% accepted with instant pump authorization, odometer capture, and itemized tax-compliant receipts for your fleet audit trail.",
                zu: "Wonke amakhadi amakhulu ezimoto zenhlangano amukelwa ngo-100% ngokuvunywa kwepompe ngokushesha, ukubhalwa kwe-odometer, namarisidi ahambisana nemithetho yentela."
            },
            irisProtocolTip: {
                en: "Fleet drivers are on a tight schedule. Assure them their fleet card stays in sight and the authorization will be completed rapidly.",
                zu: "Abashayeli bezimoto zenhlangano banesikhathi esincane. Baqinisekise ukuthi ikhadi labo lizohlala libonakala futhi inkokhelo izophela ngokushesha."
            }
        },
        {
            cardNumber: 5,
            question: {
                en: "Is the forecourt convenience shop safe and accessible for a quick driver rest stop?",
                zu: "Ngabe isitolo sasesiteshini siphephile futhi sifinyeleleka kalula ukuze umshayeli aphumule kancane?"
            },
            answer: {
                en: "Yes! Our ErgoSafe Forecourt convenience store features high-visibility walkways, slip-resistant floors, clean restrooms, and fresh refreshments to help drivers combat road fatigue.",
                zu: "Yebo! Isitolo sethu sase-ErgoSafe Forecourt sinemigwaqo yokuhamba ebonakala kahle, phansi okungasheleli, izindlu zangasese ezihlanzekile, neziphuzo ezintsha ukusiza abashayeli bagweme ukukhathala emgwaqweni."
            },
            irisProtocolTip: {
                en: "Use this moment to promote road safety and upsell: 'Would you like to stretch your legs and grab a fresh coffee inside our forecourt shop?'",
                zu: "Sebenzisa leli thuba ukukhuthaza ukuphepha emgwaqweni nokuthengisa: 'Ungathanda yini ukuyolula imilenze uthenge ikhofi elisha esitolo sethu?'"
            }
        }
    ]
};
