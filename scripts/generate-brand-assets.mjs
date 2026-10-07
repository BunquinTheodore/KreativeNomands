#!/usr/bin/env node
/**
 * Brand asset generator (sharp): re-compresses heavy logo PNGs in place and renders
 * apple-touch-icon.png, icon-192.png, icon-512.png and og-image.jpg from public/logos.
 *
 *   node scripts/generate-brand-assets.mjs [--public <dir>]
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { formatMB, parseArgs, writeFileAtomic } from './lib/media-util.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs(process.argv.slice(2));
const PUBLIC_DIR = path.resolve(String(args.public ?? path.join(ROOT, 'public')));
const LOGO_DIR = path.join(PUBLIC_DIR, 'logos');

const BG = '#0a1111';
const TEAL = '#3d5a5a';
const CREAM = '#f5f0dc';
const RECOMPRESS_THRESHOLD = 60 * 1024;
const ICON_CONTENT_RATIO = 0.58; // maskable-safe: mark stays inside the central safe zone
const OG = { width: 1200, height: 630 };

const logo = (name) => path.join(LOGO_DIR, name);

async function recompressLogos() {
  const names = (await fs.readdir(LOGO_DIR)).filter((n) => n.toLowerCase().endsWith('.png'));
  const report = [];
  for (const name of names) {
    const file = logo(name);
    const before = (await fs.stat(file)).size;
    if (before <= RECOMPRESS_THRESHOLD) continue;
    const next = await sharp(file)
      .png({ palette: true, quality: 92, effort: 10, compressionLevel: 9 })
      .toBuffer();
    if (next.length < before) await writeFileAtomic(file, next);
    report.push(`${name}: ${formatMB(before)} -> ${formatMB(Math.min(before, next.length))}`);
  }
  return report;
}

async function trimmed(file) {
  return sharp(file).trim({ threshold: 8 }).png().toBuffer();
}

async function renderIcon(size, outFile) {
  const box = Math.round(size * ICON_CONTENT_RATIO);
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" fill="${BG}"/></svg>`,
  );
  const mark = await sharp(await trimmed(logo('North-Star-Icon-Yellow_Kreativ-Nomads.png')))
    .resize({ width: box, height: box, fit: 'inside' })
    .toBuffer();
  const out = await sharp(bg)
    .composite([{ input: mark, gravity: 'centre' }])
    .flatten({ background: BG })
    .png({ compressionLevel: 9, palette: true, quality: 95 })
    .toBuffer();
  await writeFileAtomic(path.join(PUBLIC_DIR, outFile), out);
}

async function renderOg() {
  const glow = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">` +
      `<defs><radialGradient id="g" cx="24%" cy="50%" r="62%">` +
      `<stop offset="0" stop-color="${TEAL}" stop-opacity="0.62"/>` +
      `<stop offset="0.55" stop-color="${TEAL}" stop-opacity="0.16"/>` +
      `<stop offset="1" stop-color="${TEAL}" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
  const star = await sharp(await trimmed(logo('North-Star-Icon-Yellow_Kreativ-Nomads.png')))
    .resize({ height: 300, fit: 'inside' })
    .toBuffer({ resolveWithObject: true });
  const word = await sharp(await trimmed(logo('One-Line-Logo_White.png')))
    .resize({ width: 640, fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  const starLeft = 110;
  const textLeft = starLeft + star.info.width + 70;
  const blockHeight = word.info.height + 34 + 40;
  const wordTop = Math.round((OG.height - blockHeight) / 2);
  const taglineY = wordTop + word.info.height + 34 + 30;
  const tagline = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">` +
      `<text x="${textLeft}" y="${taglineY}" fill="${CREAM}" fill-opacity="0.86" ` +
      `font-family="Inter, Poppins, Segoe UI, Arial, Helvetica, sans-serif" font-size="34" ` +
      `letter-spacing="1.5">Your Creative Virtual Assistant</text></svg>`,
  );

  const out = await sharp(glow)
    .composite([
      { input: star.data, left: starLeft, top: Math.round((OG.height - star.info.height) / 2) },
      { input: word.data, left: textLeft, top: wordTop },
      { input: tagline, left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  await writeFileAtomic(path.join(PUBLIC_DIR, 'og-image.jpg'), out);
}

async function updateManifest() {
  const file = path.join(PUBLIC_DIR, 'site.webmanifest');
  const manifest = JSON.parse(await fs.readFile(file, 'utf8'));
  const icons = (manifest.icons ?? []).map((icon) => ({ ...icon, purpose: 'any maskable' }));
  const next = { ...manifest, icons, theme_color: BG, background_color: BG };
  await fs.writeFile(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

async function main() {
  const compressed = await recompressLogos();
  await Promise.all([
    renderIcon(180, 'apple-touch-icon.png'),
    renderIcon(192, 'icon-192.png'),
    renderIcon(512, 'icon-512.png'),
    renderOg(),
    updateManifest(),
  ]);
  process.stdout.write(`Logos recompressed:\n  ${compressed.join('\n  ') || 'none'}\n`);
  process.stdout.write('Wrote apple-touch-icon.png, icon-192.png, icon-512.png, og-image.jpg, site.webmanifest\n');
}

main().catch((error) => {
  process.stderr.write(`generate-brand-assets failed: ${error instanceof Error ? error.stack : String(error)}\n`);
  process.exit(1);
});
