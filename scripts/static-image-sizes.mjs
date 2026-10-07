#!/usr/bin/env node
/**
 * Pre-sized static images for the few images that are requested while the page is still loading.
 *
 *  - public/media/hero/reel-poster-640.webp, reel-poster-828.webp  (the hero backdrop poster, source
 *    reel-poster.webp is 1280 px and is the third srcset entry)
 *  - public/logos/Social-Media-DP-Green-BG-880.webp                (the About brand plate)
 *
 * They are plain static files (no next/image) because the image optimizer has to encode on a cold cache:
 * the poster alone is AVIF at 0.3 s+ per width (more on a busy machine) and the first paint waits for it,
 * which delayed the first paint by ~1 s on the first visit after every deploy. Static files have no cold path.
 *
 * Re-run after optimize-media.mjs regenerates reel-poster.webp or the logo changes:
 *   node scripts/static-image-sizes.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const EFFORT = 6;

const JOBS = [
  { src: 'media/hero/reel-poster.webp', out: 'media/hero/reel-poster-640.webp', width: 640, quality: 60 },
  { src: 'media/hero/reel-poster.webp', out: 'media/hero/reel-poster-828.webp', width: 828, quality: 60 },
  { src: 'logos/Social-Media-DP-Green-BG.png', out: 'logos/Social-Media-DP-Green-BG-880.webp', width: 880, quality: 70 },
];

for (const job of JOBS) {
  const out = path.join(PUBLIC_DIR, job.out);
  const info = await sharp(path.join(PUBLIC_DIR, job.src))
    .resize({ width: job.width })
    .webp({ quality: job.quality, effort: EFFORT })
    .toFile(out);
  console.log(`${job.out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}
