import fs from 'fs';
import path from 'path';
import { REGISTRY, isEntryGenuinelyVerified, RegId } from '../src/lib/regulations';

function scanTokensInDir(dir: string, foundTokens: Map<string, string[]>): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        scanTokensInDir(fullPath, foundTokens);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const tokenRegex = /\[REG:([A-Za-z0-9_]+)\]/g;
      let match: RegExpExecArray | null;

      while ((match = tokenRegex.exec(content)) !== null) {
        const tokenId = match[1];
        const list = foundTokens.get(tokenId) ?? [];
        list.push(fullPath);
        foundTokens.set(tokenId, list);
      }
    }
  }
}

export function runCitationCheck(releaseFlag?: boolean): { totalEntries: number; errorsCount: number } {
  const isRelease = releaseFlag ?? (
    process.argv.includes('--release') || process.env.REQUIRE_VERIFIED_CITATIONS === '1'
  );

  console.log(`Checking citations registry & token references (Release mode: ${isRelease})...`);

  let errorsCount = 0;
  const entries = Object.entries(REGISTRY);

  // 1. Verify that any verified entry has genuine human credentials
  for (const [id, entry] of entries) {
    if ((entry.status as string) === 'verified') {
      if (!isEntryGenuinelyVerified(entry)) {
        errorsCount++;
        console.error(`[ERROR] Entry marked verified without genuine human reviewer credentials: ${id}`);
      }
    }
  }

  // 2. Scan src/ for [REG:<ID>] tokens
  const srcDir = path.resolve(__dirname, '../src');
  const foundTokens = new Map<string, string[]>();

  if (fs.existsSync(srcDir)) {
    scanTokensInDir(srcDir, foundTokens);
  }

  // 3. Validate every token found in src/
  for (const [tokenId, locations] of foundTokens.entries()) {
    if (!(tokenId in REGISTRY)) {
      errorsCount++;
      console.error(`[ERROR] Unknown regulation token [REG:${tokenId}] found in:`);
      locations.slice(0, 3).forEach(loc => console.error(`  - ${loc}`));
    } else {
      const entry = (REGISTRY as any)[tokenId];
      if (isRelease && !isEntryGenuinelyVerified(entry)) {
        errorsCount++;
        console.error(`[ERROR] Release Gate: Referenced token [REG:${tokenId}] is unverified: ${entry.scopeNote}`);
      }
    }
  }

  // 4. In release mode, every registry entry must be verified
  if (isRelease) {
    let unverifiedTotal = 0;
    for (const [id, entry] of entries) {
      if (!isEntryGenuinelyVerified(entry)) {
        unverifiedTotal++;
        console.warn(`[RELEASE GATE] Unverified registry entry: ${id} -> ${entry.scopeNote}`);
      }
    }
    if (unverifiedTotal > 0) {
      errorsCount += unverifiedTotal;
      console.error(`[ERROR] Release build failed: ${unverifiedTotal} registry entries are still unverified by a human.`);
    }
  }

  if (errorsCount > 0) {
    console.error(`\n❌ Citation check failed with ${errorsCount} violation(s).`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  } else {
    console.log(`\n✅ Citation check passed: ${entries.length} entries registered, ${foundTokens.size} distinct tokens verified in source.`);
  }

  return { totalEntries: entries.length, errorsCount };
}

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('check-citations.ts') || process.argv[1].endsWith('check-citations.js')
);

if (process.env.NODE_ENV !== 'test' && isDirectRun) {
  runCitationCheck();
}
