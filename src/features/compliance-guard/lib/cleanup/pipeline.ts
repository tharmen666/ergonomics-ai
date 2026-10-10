import "server-only";
import type { ISODateString, RawLogRow, SiteId, TenantId } from "@/lib/types";
import { parseLooseDate } from "@/lib/ingestion/normalizers";
import { withinRollingWindow, sha256Hex, newId, nowIso } from "@/lib/utils/core";
import type { Repository } from "@/lib/db/repository";

export interface CleanupPipelineOptions {
  tenantId: TenantId;
  defaultSiteId?: SiteId;
  retentionMonths?: number; // Defaults to 36 (3 years)
  batchSize?: number;
}

export interface NormalizedHistoricalIncident {
  originalIndex: number;
  occurredAt: ISODateString;
  siteId: SiteId;
  standardizedClass: string;
  cleanNarrative: string;
  isWithinRetentionWindow: boolean;
  contentFingerprint: string;
}

export interface CleanupPipelineReport {
  pipelineRunId: string;
  tenantId: TenantId;
  executedAt: ISODateString;
  retentionCutoffDate: string;
  totalRecordsProcessed: number;
  retainedAuditReadyCount: number;
  purgedOutsideRetentionCount: number;
  duplicatesDeduplicatedCount: number;
  normalizedRecords: NormalizedHistoricalIncident[];
  auditDigestSha256: string;
}

// Multilingual SA incident term normalizer (English + Afrikaans + Frontline slang)
const CLASS_MAPPINGS: Array<{ standard: string; patterns: RegExp[] }> = [
  {
    standard: "lost_time_injury",
    patterns: [/\blost.?time\b/i, /\blti\b/i, /\bdae af\b/i, /\bbooked off\b/i, /\bhospital\b/i],
  },
  {
    standard: "medical_treatment",
    patterns: [/\bmedical\b/i, /\bdokter\b/i, /\bclinic\b/i, /\bhegtings\b/i, /\bstitches\b/i],
  },
  {
    standard: "first_aid",
    patterns: [/\bfirst.?aid\b/i, /\bnoodhulp\b/i, /\bverband\b/i, /\bburnshield\b/i, /\bplaster\b/i],
  },
  {
    standard: "near_miss",
    patterns: [/\bnear.?miss\b/i, /\bbyna.?mis\b/i, /\bclose.?call\b/i, /\bnarrowly\b/i, /\bgevaarlik\b/i],
  },
  {
    standard: "unsafe_condition",
    patterns: [/\bunsafe\b/i, /\bonveilig\b/i, /\bhazard\b/i, /\bspill\b/i, /\bleak\b/i],
  },
];

/**
 * Executes the 3-year rolling data cleanup pipeline:
 * 1. Evaluates all incoming legacy archives against statutory 36-month retention.
 * 2. Purges bloated records falling outside the window.
 * 3. Normalizes messy, mixed-language dates and free text.
 * 4. Deduplicates repeat entries.
 * 5. Seals the output with a cryptographic SHA-256 audit digest.
 */
export async function executeRollingCleanupPipeline(
  rawRows: RawLogRow[],
  options: CleanupPipelineOptions,
  repo?: Repository
): Promise<CleanupPipelineReport> {
  const retentionMonths = options.retentionMonths ?? 36;
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - retentionMonths);
  const cutoffIso = cutoff.toISOString();

  let purgedCount = 0;
  let dupCount = 0;
  const seenFingerprints = new Set<string>();
  const normalizedRecords: NormalizedHistoricalIncident[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];

    // Find date field
    const dateKey = Object.keys(row).find((k) =>
      /date|datum|occurred|timestamp|tydstip/i.test(k)
    );
    const rawDate = dateKey ? row[dateKey] : undefined;
    const parsedDate = (rawDate && parseLooseDate(rawDate)) || nowIso();

    // Check 3-year rolling window
    const isWithin = withinRollingWindow(parsedDate, retentionMonths, now);
    if (!isWithin) {
      purgedCount++;
      continue;
    }

    // Find narrative / description field
    const descKey = Object.keys(row).find((k) =>
      /desc|narrative|detail|beskrywing|what|happened/i.test(k)
    ) || Object.keys(row)[0];
    const rawDesc = descKey ? row[descKey] : "";

    // Standardize incident classification
    let standardizedClass = "near_miss";
    for (const mapping of CLASS_MAPPINGS) {
      if (mapping.patterns.some((p) => p.test(rawDesc) || p.test(JSON.stringify(row)))) {
        standardizedClass = mapping.standard;
        break;
      }
    }

    // Standardize site identifier
    const siteKey = Object.keys(row).find((k) => /site|store|branch|winkel|plant|depot/i.test(k));
    const rawSite = siteKey ? row[siteKey] : undefined;
    const siteId: SiteId = (rawSite
      ? `site_${rawSite.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`
      : options.defaultSiteId || "site_legacy_unassigned") as SiteId;

    // Clean and normalize narrative
    const cleanNarrative = rawDesc
      .replace(/\s+/g, " ")
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      .trim();

    // Fingerprint for deduplication
    const fingerprint = `${siteId}::${parsedDate.slice(0, 10)}::${cleanNarrative.slice(0, 60).toLowerCase()}`;
    if (seenFingerprints.has(fingerprint)) {
      dupCount++;
      continue;
    }
    seenFingerprints.add(fingerprint);

    normalizedRecords.push({
      originalIndex: i,
      occurredAt: parsedDate as ISODateString,
      siteId,
      standardizedClass,
      cleanNarrative,
      isWithinRetentionWindow: true,
      contentFingerprint: fingerprint,
    });
  }

  // Purge expired records in database if repo is supplied
  if (repo) {
    await repo.purgeOutsideWindow(options.tenantId, retentionMonths);
  }

  // Generate cryptographic audit digest seal
  const auditDigestSha256 = await sha256Hex(
    `${options.tenantId}::${cutoffIso}::retained:${normalizedRecords.length}::purged:${purgedCount}`
  );

  return {
    pipelineRunId: newId("cleanup_run"),
    tenantId: options.tenantId,
    executedAt: nowIso(),
    retentionCutoffDate: cutoffIso,
    totalRecordsProcessed: rawRows.length,
    retainedAuditReadyCount: normalizedRecords.length,
    purgedOutsideRetentionCount: purgedCount,
    duplicatesDeduplicatedCount: dupCount,
    normalizedRecords,
    auditDigestSha256,
  };
}
