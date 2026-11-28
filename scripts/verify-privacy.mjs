#!/usr/bin/env node
/**
 * ErgoSafe privacy guard (prototype). Fails the build if source code could capture,
 * keep or send camera images or face data.
 * Run: npm run verify:privacy
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../src', import.meta.url));
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);

// Things that would let the app keep or inspect pictures, or look at faces.
const BANNED = [
  [/\bFaceLandmarker\b|\bFaceDetector\b|\bFaceMesh\b|face-api|faceapi/, 'face model'],
  [/\.toDataURL\s*\(|\.toBlob\s*\(|\.getImageData\s*\(|createImageBitmap\s*\(/, 'image capture from canvas/video'],
  [/\bImageCapture\b|\bMediaRecorder\b/, 'photo or video recording'],
  [/\bdrawImage\s*\(/, 'drawing the camera frame (skeleton only is allowed)'],
  [/outputSegmentationMasks\s*:\s*true/, 'person segmentation masks'],
  [/\bemotion\b|sentiment from (face|video)/i, 'emotion inference (only allowed inside comments or the consent text)'],
];

// Lines that merely state what we do NOT do are fine.
const ALLOWED_LINE = /zero|no |never|not |without|strictly|excluded|prohibit/i;

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXTENSIONS.has(extname(p))) files.push(p);
  }
};
walk(ROOT);

const problems = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
    for (const [pattern, label] of BANNED) {
      if (pattern.test(line) && !ALLOWED_LINE.test(line)) {
        problems.push(`${file.replace(ROOT, 'src')}:${i + 1}  ${label}\n    ${trimmed.slice(0, 140)}`);
      }
    }
  });
}

// getUserMedia must only ever be used in the pose hook.
for (const file of files) {
  if (/getUserMedia\s*\(/.test(readFileSync(file, 'utf8')) && !file.endsWith('usePoseLandmarker.ts')) {
    problems.push(`${file.replace(ROOT, 'src')}  getUserMedia used outside usePoseLandmarker.ts`);
  }
}

if (problems.length) {
  console.error(`PRIVACY CHECK FAILED (${problems.length})\n`);
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Privacy check passed: ${files.length} source files, no image capture, face models or recording.`);
