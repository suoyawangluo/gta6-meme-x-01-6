// gta6-meme-x-01-6 entry (Node 22, standard library only).
// Copies POST.json from the repository root to /output/POST.json, where the
// gate reads it. The entry is the post itself: a GTA 6 meme posted on X from
// a public account. POST.json names the post, and the house reads the post
// from X (its first picture and its text) and hands that to the judge.
// Nothing this program writes about the post is judged.
//
// POST.json currently holds a placeholder address; the real post address goes
// in after the meme is posted on X, before submission.
//
// Run locally as:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// The gate reads /output/POST.json as a JSON object naming an X post address,
// so refuse to finish silently on a malformed file.
const copied = JSON.parse(readFileSync(join(OUTPUT_DIR, 'POST.json'), 'utf8')) as unknown;
if (typeof copied !== 'object' || copied === null || typeof (copied as { url?: unknown }).url !== 'string') {
  console.error('POST.json is not a JSON object with a string url field');
  process.exit(1);
}

// Confirm the copy landed where the gate will read it, and echo the address
// (empty while the placeholder is still in place, the real post URL after).
console.log(`POST.json copied to ${join(OUTPUT_DIR, 'POST.json')}: url=${(copied as { url: string }).url || '(placeholder — fill in after posting)'}`);
