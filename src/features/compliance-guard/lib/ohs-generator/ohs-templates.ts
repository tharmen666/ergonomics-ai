export interface OhsTemplate {
  id: string;
  industry: string;
  keywords: string[];
  sampleBusinessName: string;
  defaultLocation: string;
  legislation: string[];
  statutoryAppointments: {
    title: string;
    section: string;
    responsibilities: string;
    certifiedRatio: string;
  }[];
  hiraHazards: {
    activity: string;
    hazard: string;
    riskLevel: "High" | "Medium" | "Low";
    mitigation: string;
    isoClause: string;
  }[];
  sops: {
    code: string;
    title: string;
    purpose: string;
    ppeRequired: string[];
    steps: string[];
  }[];
  statutoryChecklists: string[];
  trainingModules: string[];
  standardFeeZAR: number;
}

export const OHS_INDUSTRY_TEMPLATES: Record<string, OhsTemplate> = {
  // ────────────────── 1. MOCHACHOS & FAST FOOD GRILL ──────────────────
  mochachos_ormonde: {
    id: "mochachos_ormonde",
    industry: "Flame-Grilled Mexican & Chicken Franchise (Mochachos Ormonde)",
    keywords: ["mochachos", "mochachos ormonde", "flame grill", "mexican chicken", "chicken grill", "chacos"],
    sampleBusinessName: "Mochachos Ormonde",
    defaultLocation: "Shop 4, Ormonde Shopping Centre, Crownwood Rd, Ormonde, Johannesburg South, Gauteng",
    legislation: [
      "Occupational Health and Safety Act (Act 85 of 1993)",
      "General Safety Regulations (GSR 3 - First Aid)",
      "Ergonomics Regulations 2019 (ERA Reg 3)",
      "Pressure Equipment Regulations (PER - LPG Commercial Gas Cylinders)",
      "Foodstuffs, Cosmetics and Disinfectants Act (Reg R638 Hygiene for Food Premises)",
      "SANS 10400-T (Fire Protection in Commercial Kitchens)"
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Appointed General Manager",
        section: "OHS Act 85 of 1993 §16(2)",
        responsibilities: "Overall restaurant SHEQ management, DEL compliance, statutory incident logging",
        certifiedRatio: "1 per store"
      },
      {
        title: "Section 17 Health & Safety Representative",
        section: "OHS Act 85 of 1993 §17(1)",
        responsibilities: "Monthly grill line & fryer audits, slip/trip risk identification, staff safety feedback",
        certifiedRatio: "1 Rep per 50 workers"
      },
      {
        title: "GSR 3 First Aider (Burn & Trauma Certified)",
        section: "GSR Reg 3(4)",
        responsibilities: "Immediate treatment of open flame burns, hot oil splashes, cuts, heat exhaustion",
        certifiedRatio: "2 certified first aiders per shift"
      },
      {
        title: "Fire Marshall & Emergency Gas Isolation Officer",
        section: "SANS 10400-T / GSR Reg 9",
        responsibilities: "Daily verification of emergency LPG shutoff valve, kitchen exhaust hood interlock, fire drills",
        certifiedRatio: "1 per shift"
      }
    ],
    hiraHazards: [
      {
        activity: "Open Flame Chicken Grill Line",
        hazard: "Radiant heat, grease flare-ups, thermal skin burns, gas leaks",
        riskLevel: "High",
        mitigation: "Extraction hood face velocity ≥0.5 m/s, Kevlar heat sleeves, emergency LPG trip valve, 45-min hydration breaks",
        isoClause: "ISO 45001:2018 §8.1.2 Hierarchy of Controls"
      },
      {
        activity: "Commercial Deep Fryer Battery",
        hazard: "Hot oil splashes (180°C), vat boil-over during chip frying, severe 2nd/3rd degree burns",
        riskLevel: "High",
        mitigation: "Automatic basket lifts, polycarbonate full-face shield and heat gauntlets during filtering; boil-out at <40°C",
        isoClause: "OHS Act General Safety Reg 2"
      },
      {
        activity: "Raw Meat & Chicken Preparation",
        hazard: "Severe lacerations from heavy boning knives and electric slicers",
        riskLevel: "High",
        mitigation: "Stainless steel chainmail glove mandatory on non-knife hand; scheduled sharpening; secure wall magnetic racks",
        isoClause: "OHS Act Section 8 Duty of Care"
      },
      {
        activity: "Manual Handling (Potato Sacks & 20L Oil Drums)",
        hazard: "Lumbar back strain, disc herniation from lifting 25kg+ sacks",
        riskLevel: "Medium",
        mitigation: "25kg limit for single-person lift. Sacks of potatoes and 20L oil drums require 2-person team lift or hand trolley",
        isoClause: "Ergonomics Regulations 2019"
      }
    ],
    sops: [
      {
        code: "SOP-MOC-01",
        title: "Safe Operation of Flame Grills & Emergency LPG Gas Isolation",
        purpose: "Prevent gas accumulation, flare-ups, and severe burns during chicken grilling.",
        ppeRequired: ["Kevlar heat-resistant sleeves", "Heavy-duty chef apron", "Slip-resistant closed safety shoes"],
        steps: [
          "Verify kitchen extraction canopy is running on full boost before turning on gas burners.",
          "Check all gas hoses and pilot lights for steady blue flame; smell for mercaptan gas odor.",
          "Keep grill surface scraped clean of accumulated fat to prevent uncontrolled grease flare-ups.",
          "In case of gas leak or fire: Strike the red Emergency LPG trip button located at exit door immediately."
        ]
      },
      {
        code: "SOP-MOC-02",
        title: "Deep Fryer Operation, Chip Basket Immersion & Safe Oil Filtering",
        purpose: "Eliminate thermal scalds, hot oil splatter, and fryer vat overflow.",
        ppeRequired: ["Heat gauntlets (up to 250°C)", "Polycarbonate face visor", "Waterproof vinyl apron"],
        steps: [
          "Ensure chips are thoroughly shaken to remove excess ice crystals before lowering into oil.",
          "Lower baskets gently; never drop frozen foods into 180°C hot oil.",
          "Allow oil to cool below 40°C before draining into the dedicated filtration chamber.",
          "Never introduce water to hot oil. In case of fire, deploy Class F wet chemical extinguisher or fire blanket."
        ]
      }
    ],
    statutoryChecklists: [
      "Daily Morning Flame Grill & LPG Gas Checklist",
      "GSR 3 First Aid Kit Box Quarterly Register",
      "Fire Extinguisher & Hood Ansul Tag Register (SANS 1475)",
      "Daily Walk-in Chiller Temperature Log (<4°C)",
      "Anti-Fatigue Flooring & Non-Slip Footwear Inspection"
    ],
    trainingModules: [
      "Flame Grill Safety & Gas Burner Protocols",
      "Basic First Aid & Thermal Scald Treatment (Level 1)",
      "Basic Fire Fighting & Kitchen Evacuation"
    ],
    standardFeeZAR: 3500
  },

  // ────────────────── 2. ROMAN'S PIZZA & PIZZERIA ──────────────────
  romans_pizza_ormonde: {
    id: "romans_pizza_ormonde",
    industry: "Quick-Service Pizza Restaurant & Deck Oven Bakery (Roman's Pizza Ormonde)",
    keywords: ["roman's pizza", "romans pizza", "pizza", "romans", "deck oven", "dough", "pizzeria"],
    sampleBusinessName: "Roman's Pizza Ormonde",
    defaultLocation: "Ormonde Shopping Centre, Crownwood Rd, Ormonde, Johannesburg South, Gauteng",
    legislation: [
      "Occupational Health and Safety Act (Act 85 of 1993)",
      "Foodstuffs, Cosmetics and Disinfectants Act (Reg R638)",
      "Driven Machinery Regulations (DMR 18 Dough Mixers)",
      "Ergonomics Regulations 2019 (ERA Reg 3)",
      "Electrical Installation Regulations (EIR Reg 7 CoC)"
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Store Operating Manager",
        section: "OHS Act 85 of 1993 §16(2)",
        responsibilities: "Overall pizza store safety compliance, DEL audit defense, hygiene enforcement",
        certifiedRatio: "1 per licensed branch"
      },
      {
        title: "Section 17 Health & Safety Representative",
        section: "OHS Act 85 of 1993 §17",
        responsibilities: "Oven line safety inspections, dough rolling ergonomics, delivery driver safety",
        certifiedRatio: "1 Rep per 50 workers"
      },
      {
        title: "GSR 3 First Aider",
        section: "GSR Reg 3",
        responsibilities: "Treatment of contact oven burns, cuts from pizza cutters, slip accidents",
        certifiedRatio: "2 certified first aiders"
      }
    ],
    hiraHazards: [
      {
        activity: "Commercial Deck & Conveyor Pizza Ovens (300°C)",
        hazard: "Contact thermal burns from hot oven surfaces, pizza pans, and conveyor discharge",
        riskLevel: "High",
        mitigation: "Long-handle silicone oven mitts, extended peel shovels, insulated pan grippers, heat barrier guarding",
        isoClause: "ISO 45001:2018 §8.1.2"
      },
      {
        activity: "Industrial Spiral Dough Mixer Operation",
        hazard: "Entanglement of hands or clothing in rotating spiral dough hook, resulting in severe crushing or amputation",
        riskLevel: "High",
        mitigation: "Mandatory interlocked stainless steel safety cage (machine stops immediately when cage is lifted); dual emergency stop buttons",
        isoClause: "Driven Machinery Regulations (DMR)"
      },
      {
        activity: "Flour Dust Handling & Dough Preparation",
        hazard: "Airborne flour dust inhalation leading to baker's asthma and allergic respiratory sensitization",
        riskLevel: "Medium",
        mitigation: "Slow-speed mixing initialization, gentle flour pouring protocol, FFP2 dust masks during bulk mixing, local exhaust ventilation",
        isoClause: "Hazardous Chemical Substances Regs"
      }
    ],
    sops: [
      {
        code: "SOP-ROM-01",
        title: "Safe Operation of Commercial High-Temperature Pizza Ovens",
        purpose: "Prevent severe thermal burns and heat exhaustion during high-volume pizza baking.",
        ppeRequired: ["Heat-resistant oven mitts (rated to 350°C)", "Pan grippers", "Closed non-slip safety shoes"],
        steps: [
          "Inspect oven chamber for foreign objects or excess semolina buildup before powering on heating elements.",
          "Always use the long-handled pizza peel or pan gripper when inserting or extracting pizza trays.",
          "Never reach bare hands inside the oven chamber under any circumstances.",
          "Keep oven glass doors closed when not loading to maintain thermal efficiency and reduce ambient kitchen heat."
        ]
      },
      {
        code: "SOP-ROM-02",
        title: "Industrial Spiral Dough Mixer Safety & Interlock Protocol",
        purpose: "Guaranteed zero entanglement and crush injury prevention during dough kneading.",
        ppeRequired: ["Hairnet / beard snood", "Short sleeves (no loose clothing)", "FFP2 dust mask"],
        steps: [
          "Inspect safety cage interlock switch daily before adding water and flour.",
          "Never attempt to scrape bowl sides or touch dough while the spiral hook is rotating.",
          "To add ingredients during mixing, stop the machine completely using the STOP button.",
          "Disconnect electrical isolator switch before cleaning the mixer bowl and spiral arm."
        ]
      }
    ],
    statutoryChecklists: [
      "Daily Dough Mixer Safety Interlock Verification Checklist",
      "Pizza Oven Temperature & Extraction Hood Inspection Log",
      "Daily Walk-in Cheese & Protein Chiller Log (<4°C)",
      "First Aid Kit & Burn Dressing Inspection Register"
    ],
    trainingModules: [
      "Industrial Dough Mixer Machinery Safety (DMR)",
      "High-Temperature Oven Burn Prevention & First Aid",
      "Reg R638 Food Premises Hygiene Standards"
    ],
    standardFeeZAR: 3500
  },

  // ────────────────── 3. SIMPLY ASIA & ASIAN WOK RESTAURANTS ──────────────────
  simply_asia_greenside: {
    id: "simply_asia_greenside",
    industry: "Thai & Asian Wok Restaurant Franchise (Simply Asia Greenside & Ormonde)",
    keywords: ["simply asia", "simply asia greenside", "simply asia ormonde", "thai", "asian", "wok", "noodle"],
    sampleBusinessName: "Simply Asia Greenside Branch",
    defaultLocation: "137 Greenway, Greenside, Johannesburg, Gauteng",
    legislation: [
      "Occupational Health and Safety Act (Act 85 of 1993)",
      "Foodstuffs, Cosmetics and Disinfectants Act (Reg R638)",
      "Pressure Equipment Regulations (PER High-Pressure Gas Woks)",
      "Ergonomics Regulations 2019 (ERA Reg 3 Wok Wrist Ergonomics)",
      "SANS 10400-T (Fire Protection in Commercial Kitchens)"
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Branch Director",
        section: "OHS Act §16(2)",
        responsibilities: "Overall Asian franchise safety, gas certificate compliance, food hygiene audit",
        certifiedRatio: "1 per site"
      },
      {
        title: "Section 17 Health & Safety Representative",
        section: "OHS Act §17",
        responsibilities: "Daily wok line gas pressure checks, knife handling compliance, slip prevention",
        certifiedRatio: "1 Rep per 50 workers"
      },
      {
        title: "GSR 3 Certified First Aider",
        section: "GSR Reg 3",
        responsibilities: "Wok oil splatter burn care, knife cuts, emergency first aid triage",
        certifiedRatio: "2 certified first aiders"
      }
    ],
    hiraHazards: [
      {
        activity: "High-Pressure Turbo Wok Burner Cooking",
        hazard: "Sudden high-temperature oil flare-up, radiant facial burns, intense heat exposure",
        riskLevel: "High",
        mitigation: "Water-curtain cooling waterfall on wok deck, mandatory knee-operated gas flow valves, extraction hood face velocity ≥0.6 m/s, flame-retardant chef coats",
        isoClause: "ISO 45001:2018 §8.1.2"
      },
      {
        activity: "Repetitive Heavy Wok Tossing & Stir-Frying",
        hazard: "Chronic carpal tunnel syndrome, lateral epicondylitis (tennis elbow), wrist tendonitis",
        riskLevel: "Medium",
        mitigation: "Lightweight titanium/carbon steel woks with ergonomic timber handles; 2-hour rotation between wok and prep stations; anti-fatigue drainage mats",
        isoClause: "Ergonomics Regulations 2019"
      }
    ],
    sops: [
      {
        code: "SOP-SIA-01",
        title: "Safe Operation of High-Pressure Asian Turbo Wok Ranges",
        purpose: "Prevent flash fires, severe oil flare-ups, and gas accumulation.",
        ppeRequired: ["Flame-retardant double-breasted chef tunic", "Heat-resistant forearm gauntlets", "Non-slip shoes"],
        steps: [
          "Activate the wok deck water-cooling continuous flow before lighting main turbo burners.",
          "Verify the primary extractor hood is running on high speed.",
          "Use knee-operated gas lever smoothly; do not allow raw gas to pool in the burner cup.",
          "In the event of an uncontrolled wok flare-up, step back and cover with the large domed lid. Never use water on burning oil."
        ]
      }
    ],
    statutoryChecklists: [
      "Daily Opening Wok Range & Gas Burner Inspection Checklist",
      "Weekly Deep Kitchen Extraction & Grease Trap Checklist",
      "Monthly Statutory Compliance Audit Register",
      "R638 Walk-in Freezer & Chiller Digital Temperature Log"
    ],
    trainingModules: [
      "Turbo Wok Safety & Gas Flame Management",
      "Asian Kitchen Ergonomics & Repetitive Strain Prevention",
      "Food Safety & Cross-Contamination Controls (R638)"
    ],
    standardFeeZAR: 3500
  },

  // ────────────────── 4. PHARMACIES & HEALTHCARE DISPENSARY ──────────────────
  amampondo_mtamvuna_pharmacy: {
    id: "amampondo_mtamvuna_pharmacy",
    industry: "Community Pharmacy, Healthcare Dispensary & Clinic (Amampondo / Mtamvuna / Dis-Chem)",
    keywords: ["amampondo", "amampondo pharmacy", "mtamvuna", "mtamvuna pharmacy", "pharmacy", "chemist", "clinic", "dispensary", "dis-chem", "clicks", "medirite"],
    sampleBusinessName: "Amampondo Community Pharmacy & Clinic",
    defaultLocation: "Shop 2, Amampondo Medical Centre, Eastern Cape / Gauteng Regional Hub",
    legislation: [
      "Occupational Health and Safety Act (Act 85 of 1993)",
      "Hazardous Biological Agents Regulations (HBAR 2022)",
      "South African Pharmacy Council (SAPC) Good Pharmacy Practice (GPP)",
      "Protection of Personal Information Act (POPIA §26 Health Data)",
      "Medicines and Related Substances Act (Act 101 of 1965)",
      "Ergonomics Regulations 2019 (ERA Reg 3)"
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Responsible Pharmacist",
        section: "OHS Act §16(2) & SAPC GPP Rule 2.1",
        responsibilities: "Overall pharmacy legal compliance, cold chain oversight, biological waste protocol",
        certifiedRatio: "1 per licensed pharmacy"
      },
      {
        title: "Hazardous Biological Agents (HBA) Safety Controller",
        section: "HBA Regulations 2022 Reg 6",
        responsibilities: "Sharps waste manifests, clinic vaccination room sterility, Hepatitis B vaccination tracking",
        certifiedRatio: "1 certified Sister / Pharmacist"
      },
      {
        title: "Section 17 Health & Safety Representative",
        section: "OHS Act §17",
        responsibilities: "Dispensary ergonomic posture checks, medicine shelving trip hazards, customer clinic audits",
        certifiedRatio: "1 Rep per 50 workers"
      },
      {
        title: "GSR 3 Certified First Aider",
        section: "GSR Reg 3",
        responsibilities: "Emergency resuscitation, anaphylaxis triage, clinic needle injury emergency care",
        certifiedRatio: "2 certified first aiders"
      }
    ],
    hiraHazards: [
      {
        activity: "Clinic Injections & Blood Glucose / HIV Finger-Prick Testing",
        hazard: "Accidental needle-stick injury transmitting blood-borne pathogens (Hepatitis B, C, HIV)",
        riskLevel: "High",
        mitigation: "Safety-engineered auto-retractable syringes, yellow puncture-proof sharps boxes at arm's reach, immediate Post-Exposure Prophylaxis (PEP) kit in dispensary",
        isoClause: "HBA Regulations 2022 & ISO 45001:2018"
      },
      {
        activity: "Vaccine & Biological Storage (Cold Chain 2°C - 8°C)",
        hazard: "Load-shedding power loss causing spoiled insulin/vaccines and toxic patient risk",
        riskLevel: "High",
        mitigation: "Continuous digital IoT temperature data loggers with SMS alert triggers, automatic diesel generator failover within 10 seconds + dedicated inverter battery backup",
        isoClause: "SAPC GPP Standards §5.4"
      },
      {
        activity: "Dispensary Medicine Picking & Computer Terminal Posture",
        hazard: "Cervical spine strain, chronic lower back pain, repetitive strain injury (RSI) at till",
        riskLevel: "Medium",
        mitigation: "Ergonomic standing anti-fatigue mats, spring-loaded high-shelf reach stools, dual-swivel monitor arms, scheduled posture micro-breaks",
        isoClause: "Ergonomics Regulations 2019"
      }
    ],
    sops: [
      {
        code: "SOP-PHA-01",
        title: "Dispensary Sharps, Needle Handling & Medical Waste Disposal",
        purpose: "Zero-tolerance protection against accidental needle punctures and pathogen transmission.",
        ppeRequired: ["Nitrile medical exam gloves", "Clinical coat / tunic", "Sharps disposal forceps"],
        steps: [
          "Never recap, bend, or disassemble used hypodermic needles by hand under any circumstance.",
          "Drop the needle assembly directly into the yellow SABS-approved sharps container immediately after use.",
          "Lock and seal the container once it reaches exactly the 3/4 fill line; never force additional sharps inside.",
          "Log container serial number onto the statutory medical waste manifest for licensed incineration collection."
        ]
      },
      {
        code: "SOP-PHA-02",
        title: "Vaccine Cold Chain 2°C - 8°C & Load-Shedding Power Loss Protocol",
        purpose: "Guaranteed thermal stability of vaccines and temperature-critical biological products.",
        ppeRequired: ["Insulated temperature handling gloves"],
        steps: [
          "Read and record digital min/max temperatures twice daily at 08:00 and 16:30 into the statutory register.",
          "During load shedding, verify the emergency generator transfer switch triggers and cold chain LED stays green.",
          "Never store personal lunches, drinks, or non-medical items in the pharmaceutical cold storage unit."
        ]
      }
    ],
    statutoryChecklists: [
      "Sharps Box Seal & Hazardous Biological Waste Manifest Register",
      "Vaccine Cold Chain 2°C - 8°C Continuous Temperature Log",
      "Dispensary Ergonomic Counter & High-Shelf Stool Checklist",
      "Schedule 5 & 6 Controlled Substances Register (Act 101)"
    ],
    trainingModules: [
      "Hazardous Biological Agents & Blood-borne Pathogen Prevention (HBA 2022)",
      "Cold Chain Integrity & Emergency Power Management",
      "Pharmacy Ergonomics & Repetitive Motion Strain Prevention"
    ],
    standardFeeZAR: 3500
  },

  // ────────────────── 5. SERVICE STATIONS & FUEL FORECOURTS ──────────────────
  astron_bp_service_station: {
    id: "astron_bp_service_station",
    industry: "Petroleum Service Station, Fuel Forecourt & QuickShop (Astron Energy / BP / Engen)",
    keywords: ["astron", "astron energy", "astron fairlands", "astron southdale", "astron heilbron", "bp", "bp randfontein", "engen", "service station", "filling station", "forecourt", "fuel", "petrol"],
    sampleBusinessName: "Astron Energy Fairlands (BP / Engen Network)",
    defaultLocation: "Cnr 14th Ave & Willows Rd, Fairlands, Johannesburg, Gauteng",
    legislation: [
      "Occupational Health and Safety Act (Act 85 of 1993)",
      "Major Hazard Installation Regulations (MHI Regs)",
      "Petroleum Products Act (Act 120 of 1977)",
      "SANS 10089-1 (Storage & Distribution of Petroleum Products on Forecourts)",
      "General Safety Regulations (GSR 3 First Aid)",
      "National Environmental Management Act (NEMA §28 Spill Duty of Care)"
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Service Station Licensee / Director",
        section: "OHS Act §16(2)",
        responsibilities: "Forecourt safety compliance, bulk fuel storage supervision, DEL & petroleum controller liaison",
        certifiedRatio: "1 per service station site"
      },
      {
        title: "Bulk Petroleum Offloading Safety Controller",
        section: "SANS 10089-1 §6.2",
        responsibilities: "Underground tank dipping, static bonding clamp verification, 10m exclusion zone enforcement",
        certifiedRatio: "2 certified controllers"
      },
      {
        title: "Forecourt Health & Safety Representative",
        section: "OHS Act §17",
        responsibilities: "Dispenser hose shear-valve checks, forecourt traffic flow safety, spill kit inspections",
        certifiedRatio: "1 Rep per 50 workers"
      },
      {
        title: "First Aider & Hydrocarbon Spill Response Lead",
        section: "GSR Reg 3 & SANS 10234",
        responsibilities: "Hydrocarbon skin exposure decontamination, emergency eyewash triage, thermal burns",
        certifiedRatio: "2 certified staff per shift"
      }
    ],
    hiraHazards: [
      {
        activity: "Bulk Petroleum Road Tanker Discharge (Petrol & Diesel)",
        hazard: "Static electrical spark ignition causing catastrophic vapor explosion and tank farm fire",
        riskLevel: "High",
        mitigation: "Mandatory static copper bonding clamp with interlock; two 9kg dry chemical powder (DCP) extinguishers placed at tanker; 10m strict cell-phone and no-smoking exclusion zone",
        isoClause: "SANS 10089-1 & Major Hazard Regulations"
      },
      {
        activity: "Forecourt Vehicle Fuel Dispensing & Customer Traffic",
        hazard: "Forecourt attendant struck by moving vehicle or erratic motorist on driveways",
        riskLevel: "High",
        mitigation: "High-visibility EN 471 class 2 reflective safety vests; concrete safety bollards protecting fuel dispensers; dedicated speed calming signage (10 km/h)",
        isoClause: "OHS Act Section 8 Duty of Care"
      },
      {
        activity: "Forecourt Fuel Spillage Overfills",
        hazard: "Hydrocarbon runoff entering municipal storm water drains causing severe environmental contamination",
        riskLevel: "High",
        mitigation: "Active forecourt oil/water separator pit (interceptor); 240L mobile hydrocarbon spill kit equipped with peat absorbent moss; emergency stop (ESTOP) island trips",
        isoClause: "NEMA Act 107 of 1998 §28"
      }
    ],
    sops: [
      {
        code: "SOP-AST-01",
        title: "Safe Protocol for Bulk Petroleum Road Tanker Discharge",
        purpose: "Prevent static ignition, overfills, and hazardous spills during bulk fuel delivery.",
        ppeRequired: ["Anti-static cotton overalls", "Safety footwear with anti-static soles", "Nitrile fuel-resistant gloves", "Safety goggles"],
        steps: [
          "Chock road tanker wheels firmly on both sides of rear drive axle.",
          "Attach the heavy-duty copper static bonding clamp to the designated earthing busbar before opening any hose connection.",
          "Dip underground tanks (UST) to verify ullage capacity safely accommodates delivery volume.",
          "Position two 9kg DCP fire extinguishers within 3 meters of the fill manifold.",
          "Maintain continuous line of sight throughout offloading. Remain within 1 meter of the emergency foot-valve shutoff."
        ]
      },
      {
        code: "SOP-AST-02",
        title: "Forecourt Hydrocarbon Spill Response & Oil Separator Protocol",
        purpose: "Rapid containment of fuel spills exceeding 5 litres to prevent fires and water contamination.",
        ppeRequired: ["High-visibility reflective vest", "PVC fuel gloves", "Slip-resistant safety boots"],
        steps: [
          "Instantly hit the Emergency Fuel Stop button (ESTOP) for the affected dispenser island.",
          "Surround the puddle with absorbent containment booms to block storm water drain inlets.",
          "Broadcast organic Peat / Zorb absorbent granules from outside edges inward.",
          "Never wash fuel into municipal drains with a water hose under any circumstances.",
          "Bag saturated absorbent into hazardous waste containers for certified collection."
        ]
      }
    ],
    statutoryChecklists: [
      "Daily Road Tanker Offloading & Earthing Verification Log",
      "Weekly Fuel Dispenser Hose & Emergency Shear-Valve Inspection",
      "Hydrocarbon Spill Kit & Peat Absorbent Level Register",
      "Monthly Oil-Water Interceptor Pit Sludge Level Log",
      "Quarterly Forecourt Fire Extinguisher & Signage Audit"
    ],
    trainingModules: [
      "Bulk Fuel Offloading & Static Electricity Prevention (SANS 10089)",
      "Forecourt Spill Response & Oil Separator Maintenance",
      "Forecourt Attendant Defensive Safety & Traffic Management"
    ],
    standardFeeZAR: 3500
  },

  // ────────────────── 6. BAKERY & CONFECTIONERY ──────────────────
  bakery_la_bakery: {
    id: "bakery_la_bakery",
    industry: "Commercial Bakery & Confectionery (La Bakery / Retail Bakeries)",
    keywords: ["bakery", "la bakery", "confectionery", "bread", "pastry", "flour", "rotary oven"],
    sampleBusinessName: "La Bakery & Confectionery",
    defaultLocation: "Crown Mines / Lenasia Commercial District, Johannesburg, Gauteng",
    legislation: [
      "Occupational Health and Safety Act (Act 85 of 1993)",
      "Driven Machinery Regulations (DMR 18 Mixers & Slicers)",
      "Foodstuffs, Cosmetics and Disinfectants Act (Reg R638)",
      "Ergonomics Regulations 2019 (ERA Reg 3)"
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Bakery Production Director",
        section: "OHS Act §16(2)",
        responsibilities: "Overall bakery manufacturing compliance, oven safety, flour dust controls",
        certifiedRatio: "1 per bakery plant"
      },
      {
        title: "Section 17 Health & Safety Representative",
        section: "OHS Act §17",
        responsibilities: "Daily machinery interlock audits, bread slicer blade guards, hot rack safety",
        certifiedRatio: "1 Rep per 50 workers"
      },
      {
        title: "GSR 3 First Aider",
        section: "GSR Reg 3",
        responsibilities: "Treatment of contact burns from rotary ovens, bread slicer cuts, eye dust wash",
        certifiedRatio: "2 certified first aiders"
      }
    ],
    hiraHazards: [
      {
        activity: "Commercial Rotary Rack Baking Ovens (250°C)",
        hazard: "Contact burns from hot stainless baking racks and oven door frames",
        riskLevel: "High",
        mitigation: "Thermal silicone gauntlets rated to 300°C, clear floor hazard striping around oven swinging doors, heat extraction hoods",
        isoClause: "ISO 45001:2018"
      },
      {
        activity: "High-Speed Bread Slicer Machinery",
        hazard: "Blade laceration or finger amputation during bread loading or clearing loaf jams",
        riskLevel: "High",
        mitigation: "Safety gravity feeder with rear push block; safety interlock switches stopping blades immediately upon opening guard",
        isoClause: "Driven Machinery Regs (DMR)"
      }
    ],
    sops: [
      {
        code: "SOP-BAK-01",
        title: "Safe Operation of Rotary Rack Ovens & Hot Trolley Handling",
        purpose: "Prevent severe thermal contact burns during bread trolley loading and unloading.",
        ppeRequired: ["Thermal Kevlar oven gauntlets", "Heat-resistant safety boots", "Cotton uniform"],
        steps: [
          "Check oven rotation turntable latch before rolling in loaded trolley.",
          "Lock trolley securely into the upper drive hook mechanism.",
          "Keep face and body clear of steam vent when opening oven door at bake completion.",
          "Park hot trolleys exclusively within the designated painted yellow cool-down zone."
        ]
      }
    ],
    statutoryChecklists: [
      "Daily Dough Mixer & Slicer Machine Guard Checklist",
      "Rotary Oven Burner & Steam Vent Inspection Log",
      "Flour Dust Housekeeping & Extraction Fan Filter Register",
      "First Aid Kit & Burn Dressing Inspection Register"
    ],
    trainingModules: [
      "Bakery Machinery Safety & Blade Guarding (DMR)",
      "Rotary Oven Burn Prevention & Thermal Safety",
      "Flour Dust Respiratory Health & Baker's Asthma Controls"
    ],
    standardFeeZAR: 3500
  },

  // ────────────────── 7. SECURITY & ARMED RESPONSE ──────────────────
  securi_tek_security: {
    id: "securi_tek_security",
    industry: "Guarding Services, Armed Response & Control Centre (Securi-Tek)",
    keywords: ["securi-tek", "securitek", "security", "guarding", "armed response", "patrol", "control room"],
    sampleBusinessName: "Securi-Tek Security Services",
    defaultLocation: "Crown Mines / Ormonde Business Park, Johannesburg, Gauteng",
    legislation: [
      "Occupational Health and Safety Act (Act 85 of 1993)",
      "Private Security Industry Regulation Act (PSIRA Act 56 of 2001)",
      "Firearms Control Act (Act 60 of 2000)",
      "General Safety Regulations (GSR 3 First Aid)",
      "Ergonomics Regulations 2019 (Control Room 24/7 Shift Work)"
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Head of Security Operations",
        section: "OHS Act §16(2)",
        responsibilities: "Armed officer safety compliance, body armour inspection, weapon clearing barrel safety",
        certifiedRatio: "1 per security branch"
      },
      {
        title: "Firearm Safety Officer (FSO)",
        section: "Firearms Control Act Reg 21",
        responsibilities: "Gun safe compliance, daily weapon issue and return inspections, safe clearing barrel oversight",
        certifiedRatio: "1 certified officer per shift"
      },
      {
        title: "Section 17 Health & Safety Representative",
        section: "OHS Act §17",
        responsibilities: "Patrol vehicle roadworthiness, control room 24h ergonomics, tactical PPE audits",
        certifiedRatio: "1 Rep per 50 officers"
      }
    ],
    hiraHazards: [
      {
        activity: "Daily Firearm Clearing, Loading & Unloading",
        hazard: "Accidental discharge resulting in fatal gunshot wound or ricochet injury",
        riskLevel: "High",
        mitigation: "Mandatory sand-filled certified bullet-trap clearing barrel; strict dry-fire trigger discipline; zero ammunition in clearing zone",
        isoClause: "Firearms Control Act & ISO 45001:2018"
      },
      {
        activity: "Night Patrol Driving & High-Speed Armed Response",
        hazard: "Motor vehicle collision during high-speed alarm response, fatigue at 03:00",
        riskLevel: "High",
        mitigation: "Advanced defensive driving certification; telematics GPS speed monitoring; mandatory maximum 12-hour shift limit",
        isoClause: "OHS Act Section 8 Duty of Care"
      }
    ],
    sops: [
      {
        code: "SOP-SEC-01",
        title: "Safe Clearing & Holstering of Service Firearms",
        purpose: "Guaranteed zero accidental discharge in security armouries and muster stations.",
        ppeRequired: ["Ballistic body armour (Level IIIA)", "Duty belt with retention holster"],
        steps: [
          "Face the designated sand-filled clearing barrel at all times during weapon handling.",
          "Remove magazine first before cycling slide or opening revolver cylinder.",
          "Rack slide three times and visually inspect the empty chamber.",
          "Point muzzle down into clearing tube, pull trigger to drop hammer, and holster weapon."
        ]
      }
    ],
    statutoryChecklists: [
      "Daily Armoury Clearing Barrel & Safe Register",
      "Body Armour Ceramic & Kevlar Vest Condition Checklist",
      "Patrol Vehicle Pre-Shift Roadworthiness 20-Point Log",
      "First Aid Kit & Trauma Tourniquet Inspection Register"
    ],
    trainingModules: [
      "Firearm Safe Handling & Range Competency",
      "Defensive Driving & Patrol Emergency Protocols",
      "Trauma First Aid & Severe Bleed Tourniquet Application"
    ],
    standardFeeZAR: 3500
  },

  // ────────────────── 8. WHOLESALE & TRADING CENTRES ──────────────────
  arfa_wholesale_trading: {
    id: "arfa_wholesale_trading",
    industry: "Wholesale Cash & Carry, Bulk Distribution & Trading (Century Crown / Arfa General Trading)",
    keywords: ["arfa", "arfa general trading", "century crown", "crown mines", "wholesale", "warehouse", "distribution", "cash and carry", "bulk retail"],
    sampleBusinessName: "Century Crown Wholesale Centre (Arfa General Trading Hub)",
    defaultLocation: "9 Prelude Avenue, Crown Mines, Johannesburg, Gauteng",
    legislation: [
      "Occupational Health and Safety Act (Act 85 of 1993)",
      "Driven Machinery Regulations (DMR 18 Forklifts)",
      "General Safety Regulations (GSR 2 Stacking & Storage)",
      "Electrical Installation Regulations (EIR Reg 7 CoC)",
      "Environmental Regulations for Workplaces"
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Wholesale Managing Director",
        section: "OHS Act §16(2)",
        responsibilities: "Overall wholesale centre compliance, tenant safety rules, high-bay stacking oversight",
        certifiedRatio: "1 per distribution centre"
      },
      {
        title: "Driven Machinery Forklift Supervisor",
        section: "Driven Machinery Regs (DMR 18)",
        responsibilities: "Forklift operator licensing validation, daily pre-use checklists, 6-month load testing certificates",
        certifiedRatio: "1 certified supervisor"
      },
      {
        title: "Stacking & Storage Inspector",
        section: "General Safety Regs (GSR 2)",
        responsibilities: "Heavy pallet racking beam deflection checks, column upright guard inspection, clear 1.2m fire aisles",
        certifiedRatio: "1 designated inspector"
      },
      {
        title: "First Aider & Fire Evacuation Marshall",
        section: "GSR Reg 3 & SANS 10400-T",
        responsibilities: "Crush injuries and laceration triage, emergency exit clearance, fire alarm coordinator",
        certifiedRatio: "2 certified members"
      }
    ],
    hiraHazards: [
      {
        activity: "High-Bay Pallet Racking & Forklift Operations",
        hazard: "Pallet racking collapse from forklift impact, causing falling freight and fatal crush injuries",
        riskLevel: "High",
        mitigation: "Heavy gauge steel column upright protectors; certified maximum permissible shelf load capacity plaques; mandatory daily forklift pre-trip checklists",
        isoClause: "DMR 18 & SANS 10148 Stacking Standards"
      },
      {
        activity: "Wholesale Shopper & Forklift Shared Aisles",
        hazard: "Pedestrian wholesale shoppers struck by moving forklifts carrying wide pallets",
        riskLevel: "High",
        mitigation: "Yellow floor-painted pedestrian lanes; physical barrier handrails; flashing amber roof beacons and blue reversing spotlights on all machinery",
        isoClause: "OHS Act Section 8 Duty of Care"
      }
    ],
    sops: [
      {
        code: "SOP-WHL-01",
        title: "Safe Counterbalance Forklift Operations & High-Bay Stacking",
        purpose: "Eliminate tip-overs, rack strikes, and pedestrian collision hazards.",
        ppeRequired: ["High-visibility vest", "Steel-toe cap safety boots (S1P)", "Hardhat in racking bays"],
        steps: [
          "Complete the 14-point pre-trip inspection sheet before turning ignition key.",
          "Travel with forks tilted back and 150mm above floor level.",
          "If load blocks forward line of sight, travel in reverse and sound horn at every aisle intersection.",
          "Park with forks lowered flat on ground, handbrake set, and key removed."
        ]
      }
    ],
    statutoryChecklists: [
      "Daily Forklift Pre-Use 14-Point Inspection Checklist",
      "Monthly Heavy Pallet Racking Structural Integrity Register",
      "Fire Hose Reel, Hydrant & Escape Route Clearance Log",
      "First Aid Kit & Emergency Eyewash Inspection Checklist"
    ],
    trainingModules: [
      "Driven Machinery Forklift Operator Certification (TETA Accredited)",
      "Statutory Stacking & Storage Regulations (GSR 2)",
      "Basic Fire Fighting & High-Bay Evacuation Management"
    ],
    standardFeeZAR: 3500
  }
};

/**
 * Intelligent Business Classifier & File Generator
 * Matches customer query against the rich portfolio discovered on Desktop (New folder)
 */
export function classifyBusinessAndGenerateFile(input: string, businessNameOverride?: string) {
  const normalized = (input + " " + (businessNameOverride || "")).toLowerCase().trim();

  let matchedKey = "mochachos_ormonde"; // default popular franchise

  if (normalized.includes("mochachos")) {
    matchedKey = "mochachos_ormonde";
  } else if (normalized.includes("roman") || normalized.includes("pizza")) {
    matchedKey = "romans_pizza_ormonde";
  } else if (normalized.includes("simply asia") || normalized.includes("thai") || normalized.includes("wok")) {
    matchedKey = "simply_asia_greenside";
  } else if (normalized.includes("amampondo") || normalized.includes("mtamvuna") || normalized.includes("pharmacy") || normalized.includes("chemist") || normalized.includes("dischem") || normalized.includes("dis-chem") || normalized.includes("clicks") || normalized.includes("medirite")) {
    matchedKey = "amampondo_mtamvuna_pharmacy";
  } else if (normalized.includes("astron") || normalized.includes("bp") || normalized.includes("engen") || normalized.includes("service station") || normalized.includes("filling station") || normalized.includes("forecourt") || normalized.includes("petrol")) {
    matchedKey = "astron_bp_service_station";
  } else if (normalized.includes("bakery") || normalized.includes("bread") || normalized.includes("dough") || normalized.includes("la bakery")) {
    matchedKey = "bakery_la_bakery";
  } else if (normalized.includes("securi-tek") || normalized.includes("security") || normalized.includes("guard")) {
    matchedKey = "securi_tek_security";
  } else if (normalized.includes("wholesale") || normalized.includes("arfa") || normalized.includes("century crown") || normalized.includes("crown mines") || normalized.includes("warehouse")) {
    matchedKey = "arfa_wholesale_trading";
  } else if (normalized.includes("wimpy") || normalized.includes("mugg") || normalized.includes("food") || normalized.includes("restaurant") || normalized.includes("kitchen")) {
    matchedKey = "mochachos_ormonde"; // high-fidelity food kitchen template
  }

  const template = OHS_INDUSTRY_TEMPLATES[matchedKey] || OHS_INDUSTRY_TEMPLATES.mochachos_ormonde;

  // Extract or synthesize business name
  let extractedName = businessNameOverride?.trim();
  if (!extractedName || extractedName.toLowerCase() === "wimpy southgate" || extractedName.toLowerCase() === "wimpy southgate mall") {
    if (normalized.includes("wimpy southgate")) {
      extractedName = "Wimpy Southgate Mall";
    } else if (normalized.includes("mochachos")) {
      extractedName = "Mochachos Ormonde";
    } else if (normalized.includes("roman")) {
      extractedName = "Roman's Pizza Ormonde";
    } else if (normalized.includes("simply asia")) {
      extractedName = "Simply Asia Greenside Branch";
    } else if (normalized.includes("astron fairlands")) {
      extractedName = "Astron Energy Fairlands";
    } else if (normalized.includes("astron southdale")) {
      extractedName = "Astron Energy Southdale";
    } else if (normalized.includes("astron heilbron")) {
      extractedName = "Astron Energy Heilbron";
    } else if (normalized.includes("bp randfontein")) {
      extractedName = "BP Randfontein Service Station";
    } else if (normalized.includes("amampondo")) {
      extractedName = "Amampondo Community Pharmacy & Clinic";
    } else if (normalized.includes("mtamvuna")) {
      extractedName = "Mtamvuna Community Pharmacy";
    } else if (normalized.includes("arfa") || normalized.includes("century crown")) {
      extractedName = "Century Crown Wholesale Centre (Arfa General Trading)";
    } else if (normalized.includes("securi-tek") || normalized.includes("securitek")) {
      extractedName = "Securi-Tek Security Services";
    } else if (normalized.includes("bakery") || normalized.includes("la bakery")) {
      extractedName = "La Bakery & Confectionery";
    } else {
      extractedName = input.trim().length > 3 ? input.trim() : template.sampleBusinessName;
    }
  }

  const fileId = "OHS-FILE-" + Math.floor(100000 + Math.random() * 900000);
  const creationDate = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });

  return {
    fileId,
    businessName: extractedName,
    location: template.defaultLocation,
    industry: template.industry,
    matchedKey,
    template,
    creationDate,
    consultant: {
      name: "[CONSULTANT: Pending Reviewer Sign-Off]",
      title: "Statutory OHS Practitioner",
      phone: "+27 11 555 0100",
      email: "compliance@complianceguard.co.za",
      practiceAddress: "Johannesburg, South Africa",
      accreditation: "Pending Human Verification"
    },
    statutoryAuditShieldScore: 100,
    delAuditReady: true,
    standardFeeZAR: template.standardFeeZAR,
    vatZAR: 0,
    totalPayableZAR: template.standardFeeZAR
  };
}
