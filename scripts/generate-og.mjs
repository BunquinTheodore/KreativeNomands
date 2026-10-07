// Generates public/og-image.jpg (1200x630): a frosted-glass card holding the North Star + wordmark.
// Run: node scripts/generate-og.mjs   (supersedes the og-image step of generate-brand-assets.mjs)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logo = (f) => path.join(ROOT, 'public', 'logos', f);
const W = 1200;
const H = 630;
const CARD = { x: 130, y: 105, w: 940, h: 420, r: 44 };

const trimmed = (file) => sharp(file).trim({ threshold: 8 }).png().toBuffer();

// Backdrop: deep teal-black with amber and teal light blobs, so the glass has something to refract.
const backdrop = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="a" cx="22%" cy="30%" r="45%"><stop offset="0" stop-color="#f59e0b" stop-opacity="0.55"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0"/></radialGradient>
      <radialGradient id="t" cx="82%" cy="78%" r="55%"><stop offset="0" stop-color="#5a8585" stop-opacity="0.65"/><stop offset="1" stop-color="#5a8585" stop-opacity="0"/></radialGradient>
      <radialGradient id="c" cx="60%" cy="12%" r="35%"><stop offset="0" stop-color="#f5f0dc" stop-opacity="0.18"/><stop offset="1" stop-color="#f5f0dc" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="#0a1111"/>
    <rect width="100%" height="100%" fill="url(#a)"/><rect width="100%" height="100%" fill="url(#t)"/><rect width="100%" height="100%" fill="url(#c)"/>
    <circle cx="170" cy="150" r="70" fill="#f59e0b" fill-opacity="0.55"/>
    <circle cx="1040" cy="500" r="90" fill="#8db1b1" fill-opacity="0.45"/>
  </svg>`,
);
const base = await sharp(backdrop).png().toBuffer();

// Frosted panel: blurred copy of the backdrop clipped to the rounded card.
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.w}" height="${CARD.h}"><rect width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" fill="#fff"/></svg>`,
);
const frosted = await sharp(base)
  .extract({ left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h })
  .blur(26)
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const glassOverlay = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.w}" height="${CARD.h}">
    <defs>
      <linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5f0dc" stop-opacity="0.20"/><stop offset="1" stop-color="#f5f0dc" stop-opacity="0.05"/></linearGradient>
      <linearGradient id="r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.75"/><stop offset="0.45" stop-color="#fff" stop-opacity="0.12"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0.45"/></linearGradient>
      <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" fill="url(#f)"/>
    <rect x="2" y="2" width="${CARD.w - 4}" height="${CARD.h / 2}" rx="${CARD.r - 2}" fill="url(#s)"/>
    <rect x="1.5" y="1.5" width="${CARD.w - 3}" height="${CARD.h - 3}" rx="${CARD.r}" fill="none" stroke="url(#r)" stroke-width="3"/>
  </svg>`,
);

const star = await sharp(await trimmed(logo('North-Star-Icon-Yellow_Kreativ-Nomads.png')))
  .resize({ height: 250, fit: 'inside' })
  .toBuffer({ resolveWithObject: true });
const word = await sharp(await trimmed(logo('One-Line-Logo_White.png')))
  .resize({ width: 520, fit: 'inside' })
  .toBuffer({ resolveWithObject: true });

const gap = 56;
const contentW = star.info.width + gap + word.info.width;
const left = Math.round(CARD.x + (CARD.w - contentW) / 2);
const starTop = Math.round(CARD.y + (CARD.h - star.info.height) / 2 - 12);
const wordTop = Math.round(starTop + star.info.height / 2 - word.info.height / 2 - 26);
const textLeft = left + star.info.width + gap;
const tagline = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <text x="${textLeft + 4}" y="${wordTop + word.info.height + 52}" fill="#f5f0dc" fill-opacity="0.9"
      font-family="Inter, Poppins, Segoe UI, Arial, Helvetica, sans-serif" font-size="30" letter-spacing="1.2">Your Creative Virtual Assistant</text>
  </svg>`,
);

const out = await sharp(base)
  .composite([
    { input: frosted, left: CARD.x, top: CARD.y },
    { input: glassOverlay, left: CARD.x, top: CARD.y },
    { input: star.data, left, top: starTop },
    { input: word.data, left: textLeft, top: wordTop },
    { input: tagline, left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toBuffer();
await sharp(out).toFile(path.join(ROOT, 'public', 'og-image.jpg'));
process.stdout.write(`og-image.jpg ${out.length} bytes\n`);
