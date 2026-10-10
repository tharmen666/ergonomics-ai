import { z } from "zod";
import type { IncidentIntake, ISODateString, ParsedIncident } from "@/lib/types";
import { defineAgent } from "../core/agent";

export interface IntakeParserInput {
  intake: IncidentIntake;
  now: ISODateString;
}

const ParsedSchema = z.object({
  summary: z.string().max(240),
  occurredAt: z.string().describe("ISO-8601 UTC timestamp; resolve relative phrases against `now`"),
  location: z.string().optional(),
  peopleInvolved: z.array(z.object({ role: z.string(), injured: z.boolean() })),
  injuries: z.array(z.object({ bodyPart: z.string(), nature: z.string() })),
  equipment: z.array(z.string()),
  immediateActions: z.array(z.string()),
  facts: z.array(z.string()).describe("Atomic verbatim facts from the narrative. No inference."),
  confidence: z.number().min(0).max(1),
});

const SYSTEM = `You are the Intake Parser agent of ComplianceGuard AI, a South African SHEQ platform.
Extract structured facts from frontline incident narratives (often voice transcripts, may mix English, Afrikaans, isiZulu slang).
Rules: never invent facts; keep "facts" verbatim and atomic; resolve relative times ("yesterday", "this morning") using the provided 'now' in Africa/Johannesburg (UTC+2) and output UTC.`;

const BODY_PARTS = ["finger", "thumb", "hand", "wrist", "arm", "elbow", "shoulder", "neck", "back", "head", "eye", "face", "leg", "knee", "ankle", "foot", "toe", "chest"];
const NATURES: Array<[RegExp, string]> = [
  [/\bcut|lacerat|stitches/, "laceration"], [/\bburn|scald/, "burn"], [/\bsprain|twist/, "sprain"],
  [/\bstrain|pulled/, "strain"], [/\bbruis/, "contusion"], [/\bfractur|broke (?:his|her|my) /, "fracture"],
  [/\bshock/, "electric shock"], [/\bpain|sore|hurt/, "pain"],
];
const EQUIPMENT = ["fryer", "slicer", "ladder", "forklift", "pallet jack", "knife", "box cutter", "oven", "grill", "conveyor",
  "till", "trolley", "coffee machine", "freezer", "fridge", "mixer", "extension cord", "scanner", "delivery truck", "dispensing counter"];
const ROLES = ["cashier", "cook", "chef", "packer", "pharmacist", "pharmacy assistant", "driver", "operator", "waitron", "waiter",
  "cleaner", "merchandiser", "supervisor", "manager", "security guard", "customer", "contractor", "employee", "staff member"];
const ACTION_RX = /\b(applied|cleaned|called|first aid|sent (?:him|her|them)|isolated|barricaded|switched off|evacuated|took (?:him|her)|bandaged|reported|mopped)\b/i;

function resolveTime(text: string, now: Date, explicit?: string): { iso: ISODateString; resolved: boolean } {
  if (explicit) return { iso: new Date(explicit).toISOString() as ISODateString, resolved: true };
  const d = new Date(now);
  let resolved = false;
  const t = text.toLowerCase();
  if (/\byesterday\b/.test(t)) { d.setUTCDate(d.getUTCDate() - 1); resolved = true; }
  if (/\blast night\b/.test(t)) { d.setUTCDate(d.getUTCDate() - 1); d.setUTCHours(19, 0, 0, 0); resolved = true; }
  if (/\bthis morning\b/.test(t)) { d.setUTCHours(7, 0, 0, 0); resolved = true; }
  const hm = t.match(/\b(?:at|around|about)\s+(\d{1,2})(?::|h)(\d{2})\b/) ?? t.match(/\b(\d{1,2})\s?(am|pm)\b/);
  if (hm) {
    let h = Number(hm[1]);
    const m = /^\d+$/.test(hm[2]) ? Number(hm[2]) : 0;
    if (hm[2] === "pm" && h < 12) h += 12;
    if (h < 24) { d.setUTCHours(h - 2, m, 0, 0); resolved = true; } // SAST → UTC
  }
  return { iso: d.toISOString() as ISODateString, resolved };
}

export const intakeParserAgent = defineAgent<IntakeParserInput, ParsedIncident>({
  name: "intake_parser",

  async llm({ intake, now }, ctx) {
    const out = await ctx.llm.generateJson({
      system: SYSTEM,
      schema: ParsedSchema,
      prompt: `now: ${now}\nchannel: ${intake.channel}\nlocale: ${intake.locale ?? "en-ZA"}\n${intake.occurredAt ? `reported occurredAt: ${intake.occurredAt}\n` : ""}narrative:\n"""${intake.narrative}"""`,
    });
    const { confidence, ...value } = out;
    return { value: { ...value, occurredAt: new Date(value.occurredAt).toISOString() as ISODateString }, confidence };
  },

  heuristic({ intake, now }) {
    const text = intake.narrative.replace(/\s+/g, " ").trim();
    const lower = text.toLowerCase();
    const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

    const time = resolveTime(lower, new Date(now), intake.occurredAt);
    const nature = NATURES.find(([rx]) => rx.test(lower))?.[1];
    const injuries = BODY_PARTS.filter((p) => new RegExp(`\\b${p}s?\\b`).test(lower))
      .map((bodyPart) => ({ bodyPart, nature: nature ?? "unspecified" }));
    const nearMiss = /\b(almost|nearly|could have|near miss|narrowly)\b/.test(lower);
    const injured = injuries.length > 0 && !nearMiss;

    const roles = ROLES.filter((r) => lower.includes(r));
    const peopleInvolved = (roles.length ? roles : ["employee"]).map((role, i) => ({ role, injured: injured && i === 0 }));
    const location = lower.match(/\b(?:in|at|near|behind) the ([a-z][a-z &-]{2,30}?)(?=[,.]| when| while| and|$)/)?.[1];

    const hits = [Boolean(location), time.resolved, injuries.length > 0, roles.length > 0].filter(Boolean).length;
    return {
      value: {
        summary: (sentences[0] ?? text).slice(0, 200),
        occurredAt: time.iso,
        location,
        peopleInvolved,
        injuries: injured ? injuries : [],
        equipment: EQUIPMENT.filter((e) => lower.includes(e)),
        immediateActions: sentences.filter((s) => ACTION_RX.test(s)),
        facts: sentences,
      },
      confidence: 0.5 + hits * 0.08,
      note: `rule-extracted ${sentences.length} facts`,
    };
  },
});
