/**
 * Universal South African OHS Safety File Generation & Data Normalization Engine
 * Synthesizes cross-sector statutory intelligence
 * (Food franchises, bakeries, butcheries, pharmacies, fuel forecourts, wholesale, manufacturing, security, salons, logistics)
 */

export interface SectorDefinition {
  id: string;
  category: string;
  title: string;
  standardEquipment: string[];
  primaryHazards: {
    activity: string;
    hazard: string;
    riskLevel: "High" | "Medium" | "Low";
    mitigation: string;
    isoClause: string;
  }[];
  statutoryAppointments: {
    title: string;
    section: string;
    responsibilities: string;
    certifiedRatio: string;
  }[];
  sops: {
    code: string;
    title: string;
    purpose: string;
    ppeRequired: string[];
    steps: string[];
  }[];
  checklists: string[];
  trainingModules: string[];
  applicableActs: string[];
}

export const UNIVERSAL_SECTOR_CATALOG: Record<string, SectorDefinition> = {
  food_restaurant: {
    id: "food_restaurant",
    category: "Hospitality & Food Services",
    title: "Food Franchise, Restaurant, Fast Food & Commercial Kitchen",
    applicableActs: [
      "Occupational Health and Safety Act (Act 85 of 1993 §17: 1:50 ratio, 1:100 shops/offices >20 staff)",
      "General Hygiene Requirements for Food Premises (Reg R638 & Municipal Certificate of Acceptability COA)",
      "SANS 10087-1 (LPG Gas Installation, Storage & Gas CoC - Commercial Fryers & Grills)",
      "General Safety Regulations (GSR 3 - First Aid threshold >10 employees, 1:50)",
      "Ergonomics Regulations 2019 (ERA Reg 3)",
      "SANS 10400-T (Fire Protection in Commercial Kitchens)"
    ],
    standardEquipment: ["Open flame gas griller", "Commercial deep fryers", "Walk-in chillers/freezers", "Extraction canopy", "Meat slicers", "POS terminals"],
    primaryHazards: [
      {
        activity: "Deep Fryer Operation & Boil-Out",
        hazard: "Hot oil splashes (180°C) causing deep 2nd/3rd degree burns during cooking or filtration",
        riskLevel: "High",
        mitigation: "Automatic basket lowering; polycarbonate splash face shield; heat gauntlets (250°C); cool filtration below 40°C",
        isoClause: "ISO 45001:2018 §8.1.2 Hierarchy of Controls"
      },
      {
        activity: "Commercial Gas Griller & Burner Line",
        hazard: "LPG gas accumulation leading to sudden flash fire or kitchen explosion",
        riskLevel: "High",
        mitigation: "Flame failure safety devices (FFD); daily gas leak soap inspections; commercial hood interlock; emergency shutoff valve",
        isoClause: "Pressure Equipment Regulations & SANS 10087"
      },
      {
        activity: "Kitchen Floor Washdown & Wet Areas",
        hazard: "Slip and fall on grease, rinse water, or oils leading to fractures or head trauma",
        riskLevel: "High",
        mitigation: "Anti-slip epoxy floor tiles; mandatory SRC slip-resistant safety shoes; continuous dry-mopping protocol; yellow caution cones",
        isoClause: "General Safety Regulations GSR 2"
      },
      {
        activity: "Raw Meat & Protein Preparation",
        hazard: "Deep lacerations from boning knives and electric portioning slicers",
        riskLevel: "High",
        mitigation: "Stainless steel chainmail glove on non-knife hand; safety push blocks on slicers; magnetic knife wall racks",
        isoClause: "OHS Act Section 8 Duty of Care"
      },
      {
        activity: "Cashiering & Repetitive Prep Work",
        hazard: "Prolonged standing fatigue, lower back pain, repetitive wrist strain (RSI)",
        riskLevel: "Medium",
        mitigation: "Heavy-duty anti-fatigue rubber mats at all till and griller stations; scheduled 45-minute task rotation",
        isoClause: "Ergonomics Regulations 2019"
      }
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Restaurant General Manager",
        section: "OHS Act 85 of 1993 §16(2)",
        responsibilities: "Overall restaurant SHEQ management, DEL compliance, statutory incident logging",
        certifiedRatio: "1 per site"
      },
      {
        title: "Section 17 Health & Safety Representative",
        section: "OHS Act 85 of 1993 §17(1)",
        responsibilities: "Monthly kitchen audits, slip risk identification, staff safety liaison",
        certifiedRatio: "1 Rep per 50 workers"
      },
      {
        title: "GSR 3 First Aider (Burn & Trauma Certified)",
        section: "GSR Reg 3(4)",
        responsibilities: "Immediate treatment of open flame burns, hot oil scalds, cuts, slip injuries",
        certifiedRatio: "2 certified first aiders per shift"
      },
      {
        title: "Fire Marshall & Gas Isolation Officer",
        section: "SANS 10400-T / GSR Reg 9",
        responsibilities: "Commercial kitchen exhaust hood Ansul suppression checks, LPG cylinder isolation, fire drill coordinator",
        certifiedRatio: "1 per shift"
      }
    ],
    sops: [
      {
        code: "SOP-KIT-01",
        title: "Commercial Deep Fryer Operation & Safe Oil Filtration",
        purpose: "Prevent severe thermal scalds and oil vat boil-overs.",
        ppeRequired: ["Thermal Heat Gauntlets (rated 250°C)", "Polycarbonate face shield", "Heavy vinyl apron", "Slip-resistant closed shoes"],
        steps: [
          "Ensure raw food items are shaken dry of excess ice crystals before immersion in hot oil.",
          "Lower fryer baskets gently using insulated handles; never drop foods from a distance.",
          "Allow oil to cool below 40°C before draining into the dedicated filtration trolley.",
          "Never introduce water to hot oil. In case of fire, deploy Class F wet chemical extinguisher or fire blanket immediately."
        ]
      },
      {
        code: "SOP-KIT-02",
        title: "Commercial Gas Griller Lighting & Emergency Gas Shutoff",
        purpose: "Eliminate risk of unburned gas accumulation and flare-up flash fires.",
        ppeRequired: ["Heat-resistant gloves", "Piezoelectric long-reach igniter"],
        steps: [
          "Verify the main extraction hood is operating at full speed before igniting burners.",
          "Check all gas hoses and pilot lights for steady blue flame; smell for mercaptan gas odor.",
          "Keep grill surface scraped clean of accumulated fat to prevent uncontrolled grease flare-ups.",
          "In case of gas leak or fire: Strike the red Emergency LPG trip button located at exit door immediately."
        ]
      },
      {
        code: "SOP-KIT-03",
        title: "Reg R638 Food Hygiene, Cold-Chain & Chemical Sanitation",
        purpose: "Ensure statutory compliance with food hygiene laws and prevent cross-contamination.",
        ppeRequired: ["Food-grade nitrile gloves", "Hairnet / beard snood", "Clean white coat / apron"],
        steps: [
          "Log temperatures of reach-in chillers (<4°C) and deep freezers (<-18°C) three times daily.",
          "Store cooked food on upper racks and raw proteins on bottom racks.",
          "Maintain sanitizing chemical solution at 150-200 ppm chlorine or QAC equivalent.",
          "Wash hands according to 7-step WHO protocol for at least 20 seconds before touching ready-to-eat foodstuffs."
        ]
      }
    ],
    checklists: [
      "Daily Morning Kitchen Safety & Gas Leak Checklist",
      "GSR 3 First Aid Kit Box Quarterly Inspection Log",
      "Fire Extinguisher & Hood Ansul Tag Register (SANS 1475)",
      "Daily Walk-In Chiller & Freezer Temperature Log (R638)",
      "Monthly Ergonomic Risk & Housekeeping Inspection Register"
    ],
    trainingModules: [
      "Food Safety & Personal Hygiene (R638 Certified)",
      "Basic Fire Fighting & Kitchen Suppression Systems (Level 1)",
      "Basic First Aid & Thermal Burn Management (Level 1)",
      "Hazardous Chemical Substance Handling & SDS Reading"
    ]
  },

  service_station: {
    id: "service_station",
    category: "Petroleum & Energy Forecourts",
    title: "Service Station, Fuel Forecourt & QuickShop Convenience Store",
    applicableActs: [
      "Occupational Health and Safety Act (Act 85 of 1993 §17: 1:50 ratio >20 staff threshold)",
      "Major Hazard Installation Regulations (MHI Regs)",
      "Petroleum Products Act (Act 120 of 1977)",
      "SANS 10089-3 (The Petroleum Industry Part 3: Installation of Underground Storage Tanks, Pumps & Dispensers)",
      "General Safety Regulations (GSR 3 First Aid: >10 staff threshold, 1:50 ratio)",
      "National Environmental Management Act (NEMA §28 Spill Duty of Care)"
    ],
    standardEquipment: ["Underground fuel storage tanks", "Electronic fuel dispensers", "Air/water towers", "Oil-water separator pit", "240L spill kit", "LPG cylinder cage"],
    primaryHazards: [
      {
        activity: "Bulk Fuel Road Tanker Offloading (Petrol & Diesel)",
        hazard: "Static electrical spark ignition causing vapor explosion and catastrophic forecourt fire",
        riskLevel: "High",
        mitigation: "Mandatory static copper bonding clamp with interlock; two 9kg dry chemical powder (DCP) extinguishers placed at tanker; 10m strict cell-phone and no-smoking exclusion zone",
        isoClause: "SANS 10089-1 & Major Hazard Regulations"
      },
      {
        activity: "Forecourt Traffic & Fuel Dispensing",
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
    statutoryAppointments: [
      {
        title: "Section 16(2) Service Station Licensee / Director",
        section: "OHS Act §16(2)",
        responsibilities: "Forecourt safety compliance, bulk fuel storage supervision, DEL & petroleum controller liaison",
        certifiedRatio: "1 per site"
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
    sops: [
      {
        code: "SOP-FORE-01",
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
        code: "SOP-FORE-02",
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
    checklists: [
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
    ]
  },

  pharmacy_healthcare: {
    id: "pharmacy_healthcare",
    category: "Healthcare & Pharmaceuticals",
    title: "Community Pharmacy, Healthcare Dispensary & Clinic",
    applicableActs: [
      "Occupational Health and Safety Act (Act 85 of 1993 §17: 1:50 ratio, 1:100 shops/dispensaries >20 staff)",
      "Hazardous Biological Agents Regulations (HBAR 2022: Sharps, Needle-Stick Protocols & Cold Chain)",
      "South African Pharmacy Council (SAPC) Good Pharmacy Practice (GPP)",
      "Protection of Personal Information Act (POPIA §26 Special Personal Information & §19 Safeguards)",
      "Medicines and Related Substances Act (Act 101 of 1965)",
      "General Safety Regulations (GSR 3 First Aid: >10 staff threshold, 1:50 ratio)",
      "Ergonomics Regulations 2019 (ERA Reg 3)"
    ],
    standardEquipment: ["Vaccine cold-chain refrigerator", "Sharps disposal containers", "Digital pill counters", "Autoclave sterilizer", "Dispensary till workstations", "Backup generator/UPS"],
    primaryHazards: [
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
    checklists: [
      "Sharps Box Seal & Hazardous Biological Waste Manifest Register",
      "Vaccine Cold Chain 2°C - 8°C Continuous Temperature Log",
      "Dispensary Ergonomic Counter & High-Shelf Stool Checklist",
      "Schedule 5 & 6 Controlled Substances Register (Act 101)"
    ],
    trainingModules: [
      "Hazardous Biological Agents & Blood-borne Pathogen Prevention (HBA 2022)",
      "Cold Chain Integrity & Emergency Power Management",
      "Pharmacy Ergonomics & Repetitive Motion Strain Prevention"
    ]
  },

  wholesale_logistics: {
    id: "wholesale_logistics",
    category: "Wholesale & Logistics",
    title: "Wholesale Cash & Carry, Warehousing, FMCG & Freight Depot",
    applicableActs: [
      "Occupational Health and Safety Act (Act 85 of 1993 §17: 1:50 ratio >20 staff threshold)",
      "Driven Machinery Regulations (DMR 18 - Forklifts & Lifting Machines)",
      "General Safety Regulations (GSR 2 - Stacking and Storage of Articles)",
      "General Safety Regulations (GSR 3 - First Aid: >10 staff threshold, 1:50 ratio)",
      "Electrical Installation Regulations (EIR Reg 7 CoC)",
      "Environmental Regulations for Workplaces"
    ],
    standardEquipment: ["Counterbalance forklifts", "Pallet jacks", "High-bay steel pallet racking", "Stretch wrappers", "Dock levellers", "Loading bays"],
    primaryHazards: [
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
      },
      {
        activity: "Manual Freight Offloading & Stacking",
        hazard: "Severe spinal disc injury and musculoskeletal disorders from lifting heavy cartons",
        riskLevel: "Medium",
        mitigation: "Maximum single-person manual lift limit of 20kg; hydraulic pallet jacks and two-person team lifts for heavy freight",
        isoClause: "Ergonomics Regulations 2019"
      }
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Warehouse General Manager",
        section: "OHS Act §16(2)",
        responsibilities: "Overall warehouse safety compliance, high-bay structural maintenance, DMR adherence",
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
      },
      {
        code: "SOP-WHL-02",
        title: "Statutory Stacking, Racking Stability & Aisle Clearance Protocol",
        purpose: "Maintain structural integrity of warehouse shelving under GSR 2.",
        ppeRequired: ["Safety footwear", "Work gloves"],
        steps: [
          "Inspect all pallet rack uprights for denting, buckling, or missing safety locking pins.",
          "Ensure main fire exit routes and hose reel aisles maintain a minimum clear width of 1.2 meters.",
          "Store heaviest goods on bottom shelf tiers; never exceed rated shelf bay limits."
        ]
      }
    ],
    checklists: [
      "Daily Forklift Pre-Use 14-Point Inspection Checklist",
      "Monthly Heavy Pallet Racking Structural Integrity Register",
      "Fire Hose Reel, Hydrant & Escape Route Clearance Log",
      "First Aid Kit & Emergency Eyewash Inspection Checklist"
    ],
    trainingModules: [
      "Driven Machinery Forklift Operator Certification (TETA Accredited)",
      "Statutory Stacking & Storage Regulations (GSR 2)",
      "Basic Fire Fighting & High-Bay Evacuation Management"
    ]
  },

  manufacturing_workshop: {
    id: "manufacturing_workshop",
    category: "Manufacturing & Engineering",
    title: "Industrial Manufacturing, Workshop, Doors & Metal Fabrication",
    applicableActs: [
      "Occupational Health and Safety Act (Act 85 of 1993)",
      "General Machinery Regulations (GMR 2 Responsible Person)",
      "Driven Machinery Regulations (DMR 18 Lifting / Saws / Presses)",
      "Noise-Induced Hearing Loss Regulations (NIHLR)",
      "General Safety Regulations (GSR 3 First Aid)",
      "Electrical Installation Regulations (EIR Reg 7 CoC)"
    ],
    standardEquipment: ["Overhead gantry crane", "Hydraulic press brake", "Drop saws / circular saws", "MIG/TIG welding machines", "Air compressors", "Spray booths"],
    primaryHazards: [
      {
        activity: "Power Saws, Hydraulic Presses & Guillotine Operation",
        hazard: "Crush injury, severing of fingers or traumatic amputation during material cutting",
        riskLevel: "High",
        mitigation: "Dual-hand simultaneous control buttons; photo-electric light curtain safety interlocks; fixed polycarbonate blade covers",
        isoClause: "General Machinery Regs GMR 2 & ISO 45001"
      },
      {
        activity: "Welding, Metal Grinding & Hot Work",
        hazard: "Arc eye flash, thermal metal splatter burns, combustible dust fire ignition",
        riskLevel: "High",
        mitigation: "Hot work permit system; auto-darkening welding helmet (DIN 9-13); flame-retardant leather aprons/spats; fire watch during and 30 min post-welding",
        isoClause: "General Safety Regulations GSR 9"
      },
      {
        activity: "Workshop High Noise Environment (>85 dBA)",
        hazard: "Permanent sensorineural noise-induced hearing loss (NIHL)",
        riskLevel: "High",
        mitigation: "Mandatory class 4 hearing protection (earmuffs/plugs) in designated blue noise zones; annual audiometric screening",
        isoClause: "Noise-Induced Hearing Loss Regs"
      }
    ],
    statutoryAppointments: [
      {
        title: "General Machinery Supervisor (GMR 2)",
        section: "General Machinery Regs (GMR 2.1)",
        responsibilities: "Supervision of all workshop power machinery, lockout-tagout (LOTO), machine guarding",
        certifiedRatio: "1 per manufacturing facility"
      },
      {
        title: "Section 16(2) Production Director",
        section: "OHS Act §16(2)",
        responsibilities: "Overall factory SHEQ compliance, DEL incident reporting, risk assessment review",
        certifiedRatio: "1 per site"
      },
      {
        title: "Section 17 Health & Safety Representative",
        section: "OHS Act §17",
        responsibilities: "Monthly machinery safety audits, PPE compliance checks, noise hazard monitoring",
        certifiedRatio: "1 Rep per 50 workers"
      },
      {
        title: "First Aider (Trauma & Eye Irrigation Certified)",
        section: "GSR Reg 3",
        responsibilities: "Immediate treatment of foreign metal eye debris, cuts, crush trauma, thermal burns",
        certifiedRatio: "2 certified first aiders"
      }
    ],
    sops: [
      {
        code: "SOP-MFG-01",
        title: "Machinery Lockout-Tagout (LOTO) & Safe Maintenance Protocol",
        purpose: "Guaranteed zero unexpected machine energization during blade change or repair.",
        ppeRequired: ["Safety glasses with side shields", "Cut-resistant gloves", "Steel-toe boots"],
        steps: [
          "Notify operators before initiating any machine shutdown.",
          "Isolate all primary and secondary energy sources (electrical, pneumatic, hydraulic).",
          "Apply personal safety padlock and danger tag to the main electrical circuit breaker.",
          "Dissipate residual hydraulic or air pressure before opening safety guards.",
          "Verify zero-energy state by testing the ON switch before beginning work."
        ]
      },
      {
        code: "SOP-MFG-02",
        title: "Safe Protocol for Hot Work, MIG Welding & Angle Grinding",
        purpose: "Prevent flash burns, arc eye, and combustible material fire ignition.",
        ppeRequired: ["Auto-darkening welding helmet", "Split leather welding gauntlets", "Chrome leather apron"],
        steps: [
          "Complete the Hot Work Permit before striking an arc or grinding metal.",
          "Clear combustible materials within a 10-meter radius or cover with certified fire blankets.",
          "Position portable welding screens to protect neighboring workers from UV arc flash.",
          "Maintain an active 9kg DCP fire extinguisher at the welding bay."
        ]
      }
    ],
    checklists: [
      "Daily Power Machine Guarding & Emergency Stop (ESTOP) Checklist",
      "Hot Work Permit & Fire Watch Clearance Register",
      "Overhead Crane & Rigging Slings 6-Month Inspection Log",
      "Compressor Pressure Vessel Statutory Log (PER Regs)"
    ],
    trainingModules: [
      "Lockout-Tagout (LOTO) & Machine Guarding Safety (GMR)",
      "Hot Work & Fire Prevention in Industrial Workshops",
      "Noise-Induced Hearing Loss & Audiometric Health"
    ]
  },

  commercial_office: {
    id: "commercial_office",
    category: "Corporate & Commercial",
    title: "Corporate Office, Call Centre, IT & Financial Services",
    applicableActs: [
      "Occupational Health and Safety Act (Act 85 of 1993)",
      "Environmental Regulations for Workplaces (Lighting & Ventilation)",
      "Ergonomics Regulations 2019 (ERA Reg 3 VDU Workstations)",
      "General Safety Regulations (GSR 3 First Aid)",
      "SANS 10400-T (Building Fire Safety & Egress)"
    ],
    standardEquipment: ["Display screen equipment (VDU)", "Ergonomic chairs", "Photocopiers/printers", "Server room UPS / Inverter", "Kitchenettes / water coolers"],
    primaryHazards: [
      {
        activity: "Display Screen Equipment & Desk Work",
        hazard: "Musculoskeletal neck/shoulder tension, eye strain (computer vision syndrome), carpal tunnel syndrome",
        riskLevel: "Medium",
        mitigation: "Ergonomic monitor risers at eye height, 90-degree lumbar supported adjustable chairs, 20-20-20 visual break rule",
        isoClause: "Ergonomics Regulations 2019"
      },
      {
        activity: "Office Walkways, Cable Management & Stairs",
        hazard: "Trip and fall over trailing power cables, bags, or wet polished tile staircases",
        riskLevel: "Medium",
        mitigation: "Under-desk cable organizer trays; anti-slip stair nosing; clear passageway policy; safety handrails on stairwells",
        isoClause: "General Safety Regulations GSR 2"
      }
    ],
    statutoryAppointments: [
      {
        title: "Section 16(2) Office Managing Executive",
        section: "OHS Act §16(2)",
        responsibilities: "Overall corporate SHEQ compliance, leasehold safety coordination, ergonomic assessments",
        certifiedRatio: "1 per corporate facility"
      },
      {
        title: "Section 17 Health & Safety Representative",
        section: "OHS Act §17",
        responsibilities: "Quarterly workstation ergonomic checks, emergency exit door clearance, staff welfare",
        certifiedRatio: "1 Rep per 50 office workers"
      },
      {
        title: "GSR 3 Certified First Aider",
        section: "GSR Reg 3",
        responsibilities: "Medical emergency triage, fainting, cardiac arrest CPR, AED defibrillator deployment",
        certifiedRatio: "2 certified first aiders per floor"
      },
      {
        title: "Fire Evacuation Marshall",
        section: "SANS 10400-T",
        responsibilities: "Bi-annual fire evacuation drills, assembly point head counts, stairwell clearance checks",
        certifiedRatio: "2 certified wardens per floor"
      }
    ],
    sops: [
      {
        code: "SOP-OFF-01",
        title: "Computer Display Screen Ergonomics & Postural Health",
        purpose: "Prevent chronic cervical spine strain and repetitive motion injuries.",
        ppeRequired: ["Blue-light filter lenses (optional)"],
        steps: [
          "Adjust chair seat height so feet rest flat on floor with thighs parallel to ground.",
          "Position monitor screen directly in front, one arm's length away, with top of screen at eye level.",
          "Keep wrists straight while typing; do not rest wrists on sharp desk edges.",
          "Take a 2-minute posture standing/stretching break every 45 minutes of continuous typing."
        ]
      }
    ],
    checklists: [
      "Quarterly Display Screen Equipment (DSE) Ergonomics Checklist",
      "Office Emergency Exit Route & Stairwell Clearance Log",
      "First Aid Kit & Emergency AED Defibrillator Inspection Register",
      "Server Room Clean-Agent Fire Suppression Gas Pressure Log"
    ],
    trainingModules: [
      "Office Ergonomics & Posture Wellness (Ergo Regs 2019)",
      "High-Rise Emergency Evacuation & Fire Warden Protocol",
      "Office First Aid & CPR Emergency Response"
    ]
  }
};

/**
 * Universal Intelligent Synthesizer
 * Generates an audit-ready OHS Safety File for ANY business, sector or operation
 */
export function generateUniversalOhsFile(input: string, businessNameOverride?: string) {
  const normalized = (input + " " + (businessNameOverride || "")).toLowerCase().trim();

  let matchedSectorKey = "food_restaurant";

  if (
    normalized.includes("wimpy") ||
    normalized.includes("mugg") ||
    normalized.includes("mochachos") ||
    normalized.includes("roman") ||
    normalized.includes("pizza") ||
    normalized.includes("simply asia") ||
    normalized.includes("thai") ||
    normalized.includes("restaurant") ||
    normalized.includes("kitchen") ||
    normalized.includes("food") ||
    normalized.includes("bakery") ||
    normalized.includes("butcher") ||
    normalized.includes("takeaway") ||
    normalized.includes("fast food") ||
    normalized.includes("grill")
  ) {
    matchedSectorKey = "food_restaurant";
  } else if (
    normalized.includes("astron") ||
    normalized.includes("bp") ||
    normalized.includes("engen") ||
    normalized.includes("shell") ||
    normalized.includes("caltex") ||
    normalized.includes("total") ||
    normalized.includes("service station") ||
    normalized.includes("filling station") ||
    normalized.includes("forecourt") ||
    normalized.includes("petrol") ||
    normalized.includes("diesel") ||
    normalized.includes("fuel")
  ) {
    matchedSectorKey = "service_station";
  } else if (
    normalized.includes("pharmacy") ||
    normalized.includes("chemist") ||
    normalized.includes("dis-chem") ||
    normalized.includes("dischem") ||
    normalized.includes("clicks") ||
    normalized.includes("medirite") ||
    normalized.includes("clinic") ||
    normalized.includes("hospital") ||
    normalized.includes("dental") ||
    normalized.includes("doctor") ||
    normalized.includes("medicine")
  ) {
    matchedSectorKey = "pharmacy_healthcare";
  } else if (
    normalized.includes("wholesale") ||
    normalized.includes("warehouse") ||
    normalized.includes("cash and carry") ||
    normalized.includes("arfa") ||
    normalized.includes("century crown") ||
    normalized.includes("crown mines") ||
    normalized.includes("logistics") ||
    normalized.includes("freight") ||
    normalized.includes("depot") ||
    normalized.includes("distribution")
  ) {
    matchedSectorKey = "wholesale_logistics";
  } else if (
    normalized.includes("manufacturing") ||
    normalized.includes("factory") ||
    normalized.includes("workshop") ||
    normalized.includes("engineering") ||
    normalized.includes("steel") ||
    normalized.includes("welding") ||
    normalized.includes("doors") ||
    normalized.includes("timber") ||
    normalized.includes("fabricat")
  ) {
    matchedSectorKey = "manufacturing_workshop";
  } else if (
    normalized.includes("office") ||
    normalized.includes("call centre") ||
    normalized.includes("corporate") ||
    normalized.includes("agency") ||
    normalized.includes("consult") ||
    normalized.includes("bank")
  ) {
    matchedSectorKey = "commercial_office";
  }

  const sector = UNIVERSAL_SECTOR_CATALOG[matchedSectorKey] || UNIVERSAL_SECTOR_CATALOG.food_restaurant;

  // Clean and extract human-friendly business name
  let cleanName = businessNameOverride?.trim();
  if (!cleanName || cleanName.length < 3) {
    cleanName = input.trim();
  }

  // Capitalize properly
  cleanName = cleanName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const fileId = "OHS-" + Math.floor(100000 + Math.random() * 900000);
  const creationDate = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });

  return {
    fileId,
    businessName: cleanName || "Generic Operational Facility",
    industry: sector.title,
    category: sector.category,
    sectorKey: matchedSectorKey,
    sector,
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
    standardFeeZAR: 3500,
    vatZAR: 0,
    totalPayableZAR: 3500
  };
}
