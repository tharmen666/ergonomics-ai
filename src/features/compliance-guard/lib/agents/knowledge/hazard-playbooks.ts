import type { CauseCategory, ControlLevel, CorrectiveAction, HazardCategory } from "@/lib/types";

/**
 * Domain knowledge distilled from SA retail / QSR / pharmacy / manufacturing incident patterns.
 * Used as (a) the deterministic heuristic engine and (b) few-shot grounding for LLM agents.
 */
export interface HazardPlaybook {
  hazard: HazardCategory;
  keywords: string[];
  whyChain: string[];   // generic systemic 5-Whys ladder (answers for levels 2..5)
  fishbone: Partial<Record<CauseCategory, string[]>>;
  capas: Array<{ description: string; controlLevel: ControlLevel; ownerRole: CorrectiveAction["ownerRole"]; verification: string }>;
}

export const HAZARD_PLAYBOOKS: Record<HazardCategory, HazardPlaybook> = {
  slip_trip_fall: {
    hazard: "slip_trip_fall",
    keywords: ["slip", "slipped", "wet floor", "trip", "tripped", "fell", "fall", "spill", "oil on floor", "ladder", "step"],
    whyChain: [
      "The floor surface was contaminated or obstructed at the time of the event.",
      "Spills were not detected and cleaned up within a defined response time.",
      "No scheduled floor-inspection round or spill-kit station exists for the zone.",
      "Housekeeping SOP does not define inspection frequency, ownership or verification.",
    ],
    fishbone: {
      environment: ["Wet/greasy floor", "Poor lighting", "No anti-slip matting"],
      method: ["No spill-response time standard", "Cleaning during trading hours without barricading"],
      material: ["Worn footwear soles", "Leaking packaging"],
      management: ["No floor-check log", "Housekeeping not in shift handover"],
    },
    capas: [
      { description: "Install anti-slip matting / epoxy grit coating in high-risk wet zones", controlLevel: "engineering", ownerRole: "maintenance", verification: "0 slip incidents in zone for 90 days" },
      { description: "Introduce 30-minute floor-inspection round with digital check-off", controlLevel: "administrative", ownerRole: "site_manager", verification: "≥95% round completion over 4 weeks" },
      { description: "Issue certified slip-resistant safety footwear to floor & kitchen staff", controlLevel: "ppe", ownerRole: "hr", verification: "100% issue register signed" },
    ],
  },
  manual_handling: {
    hazard: "manual_handling",
    keywords: ["lift", "lifting", "carry", "carrying", "back", "pallet", "crate", "box", "heavy", "strain", "pulled a muscle", "twist", "shelf", "stock"],
    whyChain: [
      "The load exceeded safe handling limits for the posture and frequency involved.",
      "No mechanical aid (trolley, pallet jack) was available or used at the point of work.",
      "The task was not covered by an Ergonomics Risk Assessment (Ergonomics Regs 2019, Reg 3).",
      "Ergonomic risk is not systematically assessed when stock profiles or layouts change.",
    ],
    fishbone: {
      people: ["No manual-handling training", "Fatigue at end of shift"],
      method: ["Single-person lift of heavy SKU", "Stock stored above shoulder height"],
      machine: ["Pallet jack unavailable / broken"],
      management: ["No ERA for receiving bay", "Delivery schedule pressure"],
    },
    capas: [
      { description: "Re-slot heavy SKUs to waist-height 'golden zone' shelving", controlLevel: "elimination", ownerRole: "site_manager", verification: "Planogram updated; spot-check 4 weeks" },
      { description: "Provide and maintain pallet jacks/trolleys at receiving and storage points", controlLevel: "engineering", ownerRole: "maintenance", verification: "Equipment inspection log 100% for 8 weeks" },
      { description: "Complete Ergonomics Risk Assessment for receiving & stocking tasks", controlLevel: "administrative", ownerRole: "safety_officer", verification: "ERA signed and filed in DEL Audit Shield" },
    ],
  },
  repetitive_strain: {
    hazard: "repetitive_strain",
    keywords: ["wrist", "repetitive", "scanning", "till", "cashier", "typing", "numb", "tingling", "shoulder pain"],
    whyChain: [
      "The worker performed high-frequency repetitive movements without adequate recovery.",
      "Workstation design forces awkward reach or wrist deviation.",
      "No job rotation or micro-break schedule exists for the role.",
      "Ergonomic workstation standards are not part of store fit-out specifications.",
    ],
    fishbone: { method: ["No job rotation"], machine: ["Fixed-height till counter"], management: ["No ERA on cashier role"] },
    capas: [
      { description: "Adjust workstation (height-adjustable till, scanner position) per ERA", controlLevel: "engineering", ownerRole: "maintenance", verification: "ERA re-score shows ≥1 band reduction" },
      { description: "Implement 2-hourly task rotation & micro-break schedule", controlLevel: "administrative", ownerRole: "site_manager", verification: "Rotation roster audited 4 weeks" },
    ],
  },
  burn_scald: {
    hazard: "burn_scald",
    keywords: ["burn", "burnt", "burned", "scald", "fryer", "hot oil", "grill", "oven", "steam", "boiling", "coffee machine"],
    whyChain: [
      "Skin came into contact with a hot surface or liquid during the task.",
      "The task layout requires reaching over or near the heat source.",
      "Heat-resistant PPE was not available at the station or not enforced.",
      "Kitchen SOP does not specify safe oil-change / hot-work practices.",
    ],
    fishbone: {
      method: ["Manual oil filtering while hot", "Overfilled fryer baskets"],
      machine: ["Fryer without auto-lift", "Faulty thermostat"],
      material: ["Damp product causing splatter"],
      management: ["Peak-hour staffing shortfall"],
    },
    capas: [
      { description: "Retrofit fryers with oil-filtration pump & splash guards", controlLevel: "engineering", ownerRole: "maintenance", verification: "0 burn incidents at station for 60 days" },
      { description: "Update hot-oil SOP: cool-down time, two-person oil change", controlLevel: "administrative", ownerRole: "safety_officer", verification: "SOP v-bump approved; 100% staff sign-off" },
      { description: "Provide elbow-length heat-resistant gloves and aprons at each fryer", controlLevel: "ppe", ownerRole: "site_manager", verification: "Station PPE check daily for 4 weeks" },
    ],
  },
  cut_laceration: {
    hazard: "cut_laceration",
    keywords: ["cut", "knife", "slicer", "blade", "laceration", "box cutter", "glass", "sharp", "finger"],
    whyChain: [
      "An unguarded or exposed sharp edge contacted the worker's hand.",
      "The safe cutting technique / guard was bypassed to work faster.",
      "Cut-resistant gloves were not mandated for the task.",
      "Equipment SOP lacks guarding checks and competency sign-off.",
    ],
    fishbone: {
      machine: ["Slicer guard missing or loose"],
      people: ["Untrained new staff on slicer"],
      method: ["Cleaning blade while powered"],
      management: ["No equipment competency matrix"],
    },
    capas: [
      { description: "Replace box cutters with self-retracting safety knives", controlLevel: "substitution", ownerRole: "site_manager", verification: "Old knives removed; audit 30 days" },
      { description: "Install interlocked blade guards on slicers; daily pre-use check", controlLevel: "engineering", ownerRole: "maintenance", verification: "Pre-use log 100% for 8 weeks" },
      { description: "Mandate level-5 cut-resistant gloves for slicing & cleaning", controlLevel: "ppe", ownerRole: "site_manager", verification: "Spot checks show 100% compliance" },
    ],
  },
  electrical: {
    hazard: "electrical",
    keywords: ["shock", "electrical", "electric", "spark", "wiring", "plug", "socket", "db board", "trip switch", "exposed wire", "extension cord"],
    whyChain: [
      "The worker contacted a live conductor or faulty appliance.",
      "Damaged equipment remained in service without isolation.",
      "No portable-appliance inspection or valid electrical CoC was in place.",
      "Electrical maintenance is reactive with no CoC renewal tracking.",
    ],
    fishbone: { machine: ["Frayed cords", "Overloaded multi-plugs"], environment: ["Water near sockets"], management: ["Expired CoC", "No lock-out/tag-out"] },
    capas: [
      { description: "Isolate and tag-out faulty equipment; licensed electrician repair", controlLevel: "elimination", ownerRole: "maintenance", verification: "Repair CoC uploaded" },
      { description: "Install earth-leakage protection on all kitchen/wet-area circuits", controlLevel: "engineering", ownerRole: "maintenance", verification: "Electrician test certificate filed" },
      { description: "Register CoC in DEL Audit Shield with 60-day expiry alerts", controlLevel: "administrative", ownerRole: "safety_officer", verification: "CoC status = compliant" },
    ],
  },
  chemical: {
    hazard: "chemical",
    keywords: ["chemical", "bleach", "degreaser", "fumes", "splash", "eyes", "sanitiser", "acid", "caustic", "sds", "mixing"],
    whyChain: [
      "The worker was exposed to a hazardous chemical agent.",
      "Chemicals were decanted or mixed without controls.",
      "SDS and correct PPE were not available at point of use.",
      "No HCA risk assessment or chemical register exists for the site.",
    ],
    fishbone: { material: ["Concentrated product", "Unlabelled decant bottles"], method: ["Manual dilution"], management: ["No chemical register"] },
    capas: [
      { description: "Substitute with pre-diluted / closed-loop dosing chemicals", controlLevel: "substitution", ownerRole: "site_manager", verification: "Supplier change confirmed" },
      { description: "Install wall-mounted auto-dilution dispensers & eyewash station", controlLevel: "engineering", ownerRole: "maintenance", verification: "Installation inspected" },
      { description: "Complete HCA risk assessment; SDS at point of use", controlLevel: "administrative", ownerRole: "safety_officer", verification: "Register 100% SKUs" },
    ],
  },
  fire: {
    hazard: "fire",
    keywords: ["fire", "smoke", "flame", "extinguisher", "evacuat", "gas leak", "lpg"],
    whyChain: [
      "An ignition source met combustible material or fuel.",
      "Early detection or suppression did not activate in time.",
      "Fire equipment servicing / emergency drills were not current.",
      "Emergency preparedness (ISO 45001 8.2) is not reviewed on schedule.",
    ],
    fishbone: { machine: ["Extractor hood grease build-up"], management: ["Extinguisher service lapsed", "No drill in 12 months"] },
    capas: [
      { description: "Install automatic wet-chemical suppression over cooking line", controlLevel: "engineering", ownerRole: "maintenance", verification: "SANS 10400 compliance certificate" },
      { description: "Schedule 6-monthly evacuation drills and extinguisher service tracking", controlLevel: "administrative", ownerRole: "safety_officer", verification: "Drill report filed" },
    ],
  },
  vehicle_forklift: {
    hazard: "vehicle_forklift",
    keywords: ["forklift", "reach truck", "vehicle", "truck", "reversing", "loading bay", "collision", "pedestrian"],
    whyChain: [
      "A pedestrian and mobile plant shared the same space.",
      "No physical segregation or exclusion zone existed.",
      "Traffic management plan was absent or not enforced.",
      "Site layout changes are not assessed for vehicle-pedestrian interaction.",
    ],
    fishbone: { environment: ["Blind corners"], people: ["Unlicensed operator"], management: ["No traffic plan"] },
    capas: [
      { description: "Install physical barriers & marked pedestrian walkways", controlLevel: "engineering", ownerRole: "maintenance", verification: "Layout audit" },
      { description: "Verify operator licences (Driven Machinery Regs) & proximity sensors", controlLevel: "administrative", ownerRole: "safety_officer", verification: "100% licence register" },
    ],
  },
  machinery: {
    hazard: "machinery",
    keywords: ["machine", "conveyor", "caught", "entangled", "press", "mixer", "guard", "crush", "pinch"],
    whyChain: [
      "A body part entered a moving-machinery danger zone.",
      "Guarding was absent, bypassed or inadequate.",
      "Lock-out/tag-out was not applied during intervention.",
      "Machinery safety is not part of planned maintenance.",
    ],
    fishbone: { machine: ["Missing interlock"], method: ["Clearing jams while running"], management: ["No LOTO procedure"] },
    capas: [
      { description: "Fit interlocked fixed guards to all accessible danger zones", controlLevel: "engineering", ownerRole: "maintenance", verification: "Guarding audit 100%" },
      { description: "Implement LOTO procedure with personal locks", controlLevel: "administrative", ownerRole: "safety_officer", verification: "LOTO audit monthly" },
    ],
  },
  violence_robbery: {
    hazard: "violence_robbery",
    keywords: ["robbery", "armed", "gun", "hijack", "assault", "threatened", "aggressive customer", "shoplifter", "attack"],
    whyChain: [
      "Staff were exposed to an aggressive or armed person.",
      "Cash or high-value stock was accessible / visible.",
      "Cash-handling and security controls were insufficient.",
      "Security risk assessment is not reviewed with crime-trend data.",
    ],
    fishbone: { method: ["Cash-up in view of public"], environment: ["Poor perimeter lighting"], management: ["No panic buttons"] },
    capas: [
      { description: "Install drop-safes and time-delay safes; reduce till float", controlLevel: "engineering", ownerRole: "general_manager", verification: "Cash-at-till below threshold" },
      { description: "Provide trauma debriefing via EAP within 72 hours", controlLevel: "administrative", ownerRole: "hr", verification: "EAP session logged" },
    ],
  },
  psychosocial: {
    hazard: "psychosocial",
    keywords: ["stress", "anxiety", "burnout", "bullying", "harassment", "overtime", "exhausted", "panic"],
    whyChain: [
      "The worker experienced sustained psychosocial strain.",
      "Workload or interpersonal conflict was not identified early.",
      "No confidential reporting or wellbeing baseline exists.",
      "Psychosocial hazards are excluded from the HIRA.",
    ],
    fishbone: { management: ["Chronic understaffing", "No EAP awareness"], people: ["Shift-pattern fatigue"] },
    capas: [
      { description: "Add psychosocial hazards to HIRA; monthly anonymous pulse", controlLevel: "administrative", ownerRole: "safety_officer", verification: "Pulse participation ≥60%" },
      { description: "Refer to EAP; review rostering to cap consecutive shifts", controlLevel: "administrative", ownerRole: "hr", verification: "Roster audit" },
    ],
  },
  biological: {
    hazard: "biological",
    keywords: ["contaminat", "temperature", "cold chain", "fridge", "freezer", "expired", "pest", "rodent", "allergen", "food poisoning", "needle"],
    whyChain: [
      "A biological hazard reached product or people.",
      "Critical control point limits were exceeded or not monitored.",
      "Monitoring is manual and not escalated in real time.",
      "HACCP plan verification is overdue.",
    ],
    fishbone: { machine: ["Fridge compressor fault"], method: ["Manual temp logging"], management: ["HACCP review overdue"] },
    capas: [
      { description: "Install IoT temperature probes with SLA alerts on cold-chain units", controlLevel: "engineering", ownerRole: "maintenance", verification: "0 unlogged excursions in 30 days" },
      { description: "Re-verify HACCP plan & retrain on CCP monitoring", controlLevel: "administrative", ownerRole: "safety_officer", verification: "HACCP verification signed" },
    ],
  },
  product_quality: {
    hazard: "product_quality",
    keywords: ["defect", "complaint", "wrong product", "mislabel", "recall", "rework", "quality", "out of spec", "dispensing error"],
    whyChain: [
      "A nonconforming output reached the next process or customer.",
      "In-process verification did not detect the deviation.",
      "The check relies on memory rather than an error-proofing (poka-yoke) step.",
      "Process FMEA / work instruction was not updated after prior deviations.",
    ],
    fishbone: { method: ["No second-person check"], material: ["Look-alike/sound-alike items"], management: ["Prior CAPA not verified"] },
    capas: [
      { description: "Introduce barcode verification / poka-yoke at the failure step", controlLevel: "engineering", ownerRole: "general_manager", verification: "Defect rate ↓50% over 8 weeks" },
      { description: "Update work instruction & competency sign-off", controlLevel: "administrative", ownerRole: "safety_officer", verification: "Document control v-bump approved" },
    ],
  },
  other: {
    hazard: "other",
    keywords: [],
    whyChain: [
      "An unplanned event occurred during routine work.",
      "The hazard was not identified in the current risk assessment.",
      "Risk assessments are not refreshed when tasks change.",
      "HIRA review cycle lacks change-management triggers.",
    ],
    fishbone: { management: ["HIRA not reviewed"], method: ["Task not covered by SOP"] },
    capas: [
      { description: "Review and update HIRA for the task", controlLevel: "administrative", ownerRole: "safety_officer", verification: "HIRA signed" },
    ],
  },
};
