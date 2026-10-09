#!/usr/bin/env python3
"""
================================================================================
ErgoSafe Reborn V3 - Claude Audit & Optimization Bundle Generator
================================================================================
Generates a context-optimized XML payload containing the entire ErgoSafe
codebase paired with a Master Claude Enterprise Audit & Optimization Prompt.

Usage:
    python scripts/pack_for_claude.py
    python scripts/pack_for_claude.py --output custom_payload.xml
    python scripts/pack_for_claude.py --run-api (optional: runs via Anthropic API if ANTHROPIC_API_KEY is set)
================================================================================
"""

import os
import sys
import argparse
from pathlib import Path

# Directories and files to ignore during packing
IGNORE_DIRS = {
    '.git', 'node_modules', 'dist', 'build', '.vercel', '.snapshots',
    '.vscode', '.agents', '__pycache__', '.pytest_cache', 'test-results',
    'coverage', '.tools'
}

IGNORE_EXTENSIONS = {
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
    '.mp4', '.webm', '.mov', '.mp3', '.wav',
    '.pdf', '.zip', '.tar', '.gz', '.woff', '.woff2', '.ttf', '.eot',
    '.lock', '.bin', '.exe', '.dll', '.so', '.dylib', '.map'
}

IGNORE_FILES = {
    'package-lock.json', 'BEAUTY_SALON_OHS_MASTER_FILE.pdf',
    '.env.local', '.env', 'Indexed'
}

# The Master System Prompt engineered specifically for Claude (Claude 3.5 / 3.7 Sonnet)
CLAUDE_MASTER_AUDIT_PROMPT = """You are a Principal Software Architect, Senior React/TypeScript Performance Engineer, and Certified South African Occupational Health and Safety (OHS / Ergonomics) Regulatory Specialist.

You are performing an exhaustive, enterprise-grade Codebase Audit and Performance/Architecture Optimization on **ErgoSafe Reborn V3**.

Below is the complete codebase of the project, structured into individual `<file>` tags.

### YOUR AUDIT SCOPE & DIRECTIVES:

1. **ARCHITECTURAL & REACT INTEGRITY AUDIT**
   - Inspect all Zustand stores (`complianceStore.ts`, `nellyStore.ts`, `tenantStore.ts`, `agentLogStore.ts`). Check for race conditions, non-atomic state updates, memory retention, and improper selector usage causing unnecessary re-renders.
   - Inspect React component lifecycles in `src/App.tsx`, `Sidebar.tsx`, and all core feature views (`HRDashboard.tsx`, `TrainingPage.tsx`, `SelfAssessmentPage.tsx`, `RiskyBehaviorsPage.tsx`, `GEARDashboardPage.tsx`, `ReportsPage.tsx`, `ExecutiveBriefing.tsx`).
   - Identify missing `useMemo`, `useCallback`, or memoized selectors where high-frequency telemetry (posture angles, fatigue timers) updates the UI.

2. **3D BIOMECHANICS & THREE.JS PERFORMANCE OPTIMIZATION**
   - Inspect `src/components/agent/SpineViewer.tsx` and all Three.js / `@react-three/fiber` / `@react-three/drei` implementations.
   - Check WebGL memory management: are geometries, materials, and textures cleanly disposed of on unmount?
   - Identify frame-rate throttling opportunities: ensure the render loop does not max out the GPU when the user is idle or the 3D model is off-screen.

3. **STATUTORY SOUTH AFRICAN OHS & ISO 45001 COMPLIANCE VERIFICATION**
   - Verify strict statutory grounding against:
     * South African OHS Act 85 of 1993 (Sections 8, 16.2, 37 mandatory agreements/escalations, 38).
     * Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) (strictly cite GN R1589, never draft GNR 1009). Verify Regulation 6 assessments, Regulation 8(1) medical surveillance, and Regulation 10 (40-year retention for Reg 6 & 8; 3-year retention for equipment logs under Regs 7 & 9).
     * Physical Agents Regulations, 2024 (GN 5952, GG 52226) for thermal stress (cold/heat) and illumination (replacing repealed Environmental Regulations 1987).
     * Deterministic HIGH risk triggers: manual handling > 25 kg, carcass handling, knife deboning force, and cold room stress, recommending Regulation 8(1) OMP referral where indicated by the Regulation 6 assessment.
     * COIDA Act 130 of 1993 (injury reporting thresholds & Schedule 3 diseases).
     * Strict separation between statutory requirements (OHS Act/Regs) vs voluntary standards (ISO 45001:2018 / ISO 45003). Ensure ISO 45001 is NEVER claimed to be a statutory legal requirement in South Africa.
   - Review `src/api/compliance.ts` and ensure prompts and fallbacks strictly enforce this taxonomy.

4. **NELLY MULTILINGUAL VOICE & SPEECH SYNTHESIS ENGINE**
   - Audit `src/utils/speech.ts` and `src/components/nelly/NellyAvatar.tsx`.
   - Verify robust browser fallback handling for South African regional accents (`en-ZA`, `zu-ZA`, `xh-ZA`, `st-ZA`, `sw-KE`, `zh-CN`, `de-DE`).
   - Eliminate audio overlapping, speech cancellation bugs, unmounted synthesis callbacks, and infinite speech loops.

5. **SHANDRAY'S PRIZM FATIGUE API & TELEMETRY CONTRACTS**
   - Inspect `api/v1/fatigue-score.js` and `GEARDashboardPage.tsx`.
   - Verify payload validation, edge-case calculations (zero driving hours, erratic reaction times, negative numbers), and CORS/header security.

6. **SECURITY, ZERO-KNOWLEDGE PRIVACY & POPIA COMPLIANCE**
   - Verify compliance with South Africa's Protection of Personal Information Act (POPIA).
   - Ensure employee biometric/posture telemetry is strictly client-side or zero-knowledge anonymized before saving to compliance stores.
   - Ensure no API keys or sensitive credentials are leakable via client-side bundles.

7. **BUNDLE OPTIMIZATION & CODE-SPLITTING PLAN**
   - Check `vite.config.ts`, `package.json`, and dynamic imports.
   - Provide concrete recommendations for code splitting heavy libraries (`three`, `@react-three/fiber`, `lucide-react`, `framer-motion`) using `React.lazy()` and `React.Suspense` to reduce initial load time below 1.2s.

---

### REQUIRED OUTPUT FORMAT:

Provide your evaluation in a clear, executive-ready technical report containing:
1. **Executive Scorecard**: Ratings (1-10) for Architecture, Performance, OHS Legal Rigor, POPIA Security, and Maintainability.
2. **Critical Vulnerabilities & Bugs Found**: High / Medium / Low priority findings with exact file references and lines.
3. **Optimized Code Drop-In Replacements**: Provide complete, production-ready replacement code or diffs for the highest-impact files (e.g. `SpineViewer.tsx`, `speech.ts`, `complianceStore.ts`, `vite.config.ts`).
4. **Step-by-Step Optimization Roadmap**: Immediate fixes vs Medium-term improvements.
"""


def should_include_file(path: Path, root_dir: Path) -> bool:
    rel_path = path.relative_to(root_dir)
    
    # Check ignored directories
    for part in rel_path.parts[:-1]:
        if part in IGNORE_DIRS:
            return False
            
    # Check ignored filename
    if path.name in IGNORE_FILES:
        return False
        
    # Check extension
    if path.suffix.lower() in IGNORE_EXTENSIONS:
        return False
        
    # Check hidden files
    if path.name.startswith('.') and path.name not in {'.env.example', '.gitignore'}:
        return False
        
    # Size limit: skip files > 300KB (e.g. huge artifacts)
    try:
        if path.stat().st_size > 300 * 1024:
            return False
    except OSError:
        return False
        
    return True


def collect_files(root_dir: Path):
    included_files = []
    
    # Priority folders to include first
    priority_dirs = ['src', 'api', 'e2e', 'scratch']
    for p_dir in priority_dirs:
        d_path = root_dir / p_dir
        if d_path.exists():
            for root, _, files in os.walk(d_path):
                for f in sorted(files):
                    fp = Path(root) / f
                    if should_include_file(fp, root_dir):
                        included_files.append(fp)
                        
    # Root configuration files
    root_configs = [
        'package.json', 'vite.config.ts', 'tsconfig.json',
        'tailwind.config.js', 'playwright.config.ts', 'index.html',
        'README.md', 'walkthrough.md'
    ]
    for rf in root_configs:
        fp = root_dir / rf
        if fp.exists() and should_include_file(fp, root_dir) and fp not in included_files:
            included_files.append(fp)
            
    return included_files


def generate_payload(root_dir: Path, output_file: Path):
    files = collect_files(root_dir)
    print(f"[*] Found {len(files)} source files to bundle for Claude.")
    
    total_bytes = 0
    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("<claude_audit_request>\n")
        out.write("<instructions>\n")
        out.write(CLAUDE_MASTER_AUDIT_PROMPT.strip())
        out.write("\n</instructions>\n\n")
        out.write("<codebase>\n")
        
        for fp in files:
            rel_path = fp.relative_to(root_dir).as_posix()
            try:
                content = fp.read_text(encoding='utf-8', errors='replace')
                out.write(f'<file path="{rel_path}">\n')
                out.write(content)
                if not content.endswith('\n'):
                    out.write('\n')
                out.write('</file>\n\n')
                total_bytes += len(content.encode('utf-8'))
            except Exception as e:
                print(f"[!] Warning: Could not read {rel_path}: {e}")
                
        out.write("</codebase>\n")
        out.write("</claude_audit_request>\n")
        
    size_mb = total_bytes / (1024 * 1024)
    print(f"[+] Successfully generated Claude payload: {output_file}")
    print(f"[+] Total payload size: {size_mb:.2f} MB (~{int(total_bytes / 4):,} estimated tokens)")


def run_via_anthropic_api(payload_file: Path):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("[!] ERROR: ANTHROPIC_API_KEY environment variable is not set.")
        print("[!] Please set your key: $env:ANTHROPIC_API_KEY=\"your-key\" or paste the generated XML file directly into Claude.ai")
        return
        
    try:
        import urllib.request
        import json
        
        print("[*] Reading payload...")
        payload_text = payload_file.read_text(encoding='utf-8')
        
        print("[*] Dispatching request to Anthropic API (Claude 3.5 Sonnet)...")
        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01"
        }
        
        body = {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 8192,
            "messages": [
                {
                    "role": "user",
                    "content": payload_text
                }
            ]
        }
        
        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=json.dumps(body).encode('utf-8'),
            headers=headers,
            method="POST"
        )
        
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            report = data['content'][0]['text']
            report_path = payload_file.parent / "CLAUDE_AUDIT_REPORT.md"
            report_path.write_text(report, encoding='utf-8')
            print(f"[+] Audit completed successfully! Report saved to: {report_path}")
            
    except Exception as e:
        print(f"[!] API call failed: {e}")


def main():
    parser = argparse.ArgumentParser(description="Pack ErgoSafe Reborn V3 repository for Claude audit")
    parser.add_argument("--output", "-o", default="CLAUDE_AUDIT_PAYLOAD.xml", help="Output file path")
    parser.add_argument("--run-api", action="store_true", help="Send payload to Anthropic API directly")
    args = parser.parse_args()
    
    root_dir = Path(__file__).resolve().parent.parent
    output_path = root_dir / args.output
    
    generate_payload(root_dir, output_path)
    
    if args.run_api:
        run_via_anthropic_api(output_path)


if __name__ == "__main__":
    main()
