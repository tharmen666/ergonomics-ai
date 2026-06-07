/**
 * ERGOSAFE REBORN: FORECOURT COMPLIANCE MATRIX
 * 
 * Target: Service Stations (Astron Energy / General Forecourt)
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
    astronTransitionDeck: FAQCard[];
}

export const FORECOURT_LANYARD_MATRIX: ServiceStationMatrix = {
    version: "2026.5.1",
    brandFocus: "Astron Energy / General Service Stations",

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
    // ASTRON ENERGY 5-CARD FAQ DECK
    // ==========================================
    astronTransitionDeck: [
        {
            cardNumber: 1,
            question: {
                en: "Why did Caltex change its name to Astron Energy?",
                zu: "Kungani i-Caltex ishintshe igama layo yaba yi-Astron Energy?"
            },
            answer: {
                en: "Astron Energy acquired the Caltex network in South Africa. We are upgrading to a new, vibrant, and modern African energy brand.",
                zu: "I-Astron Energy ithenge inethiwekhi ye-Caltex eNingizimu Afrika. Sithuthukela kumkhiqizo wamandla wase-Afrika omusha, onomdlandla, nonesimanje."
            },
            irisProtocolTip: {
                en: "Smile when you explain this. It is an exciting upgrade, not just a paint job.",
                zu: "Mamatheka uma uchaza lokhu. Kungukuthuthukiswa okujabulisayo, hhayi nje ukushintsha umbala."
            }
        },
        {
            cardNumber: 2,
            question: {
                en: "Is the fuel quality still the same?",
                zu: "Ngabe izinga lukaphethiloli lisafana yini?"
            },
            answer: {
                en: "Yes, our fuel quality remains world-class. It is exactly the same premium formulation featuring our advanced Quartex additives.",
                zu: "Yebo, izinga lethu lukaphethiloli lihlala lisezingeni lomhlaba. Kuyifomula efanayo kakhulu enezithako zethu ezithuthukisiwe ze-Quartex."
            },
            irisProtocolTip: {
                en: "Reassure them. Mention 'Quartex' clearly—it signals advanced engine protection.",
                zu: "Baqinisekise. Yisho 'i-Quartex' ngokucacile—ikhomba isivikelo senjini esithuthukisiwe."
            }
        },
        {
            cardNumber: 3,
            question: {
                en: "Can I still use my UCount Rewards card?",
                zu: "Ngingasakwazi ukusebenzisa ikhadi lami le-UCount Rewards?"
            },
            answer: {
                en: "Absolutely! The Standard Bank UCount partnership is still fully active at all Astron Energy sites.",
                zu: "Kakhulu! Ubambiswano lwe-Standard Bank UCount lusasebenza ngokugcwele kuzo zonke izindawo ze-Astron Energy."
            },
            irisProtocolTip: {
                en: "Always ask 'Do you have your UCount card?' before processing payment. It shows we care about their rewards.",
                zu: "Njalo buza 'Unalo ikhadi lakho le-UCount?' ngaphambi kokwenza inkokhelo. Kukhombisa ukuthi siyakhathalela ngemiklomelo yabo."
            }
        },
        {
            cardNumber: 4,
            question: {
                en: "What happens to my corporate fleet card?",
                zu: "Kwenzekani ekhadini lami lezimoto zenhlangano?"
            },
            answer: {
                en: "All Starcard and other major fleet cards are still 100% accepted without any interruptions.",
                zu: "Wonke ama-Starcard namanye amakhadi amakhulu ezimoto asasebenza ngo-100% ngaphandle kokuphazamiseka."
            },
            irisProtocolTip: {
                en: "Fleet drivers are on a tight schedule. Assure them the transaction will be as fast as always.",
                zu: "Abashayeli bezimoto zenhlangano banesikhathi esincane. Baqinisekise ukuthi inkokhelo izoshesha njengokujwayelekile."
            }
        },
        {
            cardNumber: 5,
            question: {
                en: "Are the convenience stores changing too?",
                zu: "Ngabe nezitolo zangaphakathi nazo ziyashintsha?"
            },
            answer: {
                en: "Yes! FreshStop remains, but with an upgraded look and feel to match our new Astron Energy colors.",
                zu: "Yebo! I-FreshStop isekhona, kodwa ngokubukeka okusha nokuthuthukisiwe okufanelana nemibala yethu emisha ye-Astron Energy."
            },
            irisProtocolTip: {
                en: "Use this moment to upsell. 'Would you like to grab a coffee inside our upgraded FreshStop today?'",
                zu: "Sebenzisa leli thuba ukuthengisa kakhulu. 'Ungathanda yini ukuyothenga ikhofi ngaphakathi kwi-FreshStop yethu ethuthukisiwe namuhla?'"
            }
        }
    ]
};
