#!/usr/bin/env node
/**
 * Media optimisation pipeline (sharp + ffmpeg).
 *
 *   node scripts/optimize-media.mjs --src <publicDirWithOriginals> [--out public/media]
 *                                   [--only <categoryId|hero>] [--force] [--force-videos]
 *                                   [--data src/data/portfolio.json]
 *
 * Input spec : scripts/portfolio.source.json  (original portfolio data, original /portfolio/... paths)
 * Originals  : <src>/portfolio/**  and  <src>/videos/landing-page-background.mp4
 * Output     : <out>/<categoryId>/<projectId>/<slug>.{webp,mp4}, <slug>-thumb.webp, <slug>-poster.webp
 *              Portfolio videos are full length with AAC stereo audio, sized by a per-clip budget
 *              (scripts/lib/media-budget.mjs); their 640px thumb is cut from the poster.
 *              <out>/hero/reel.mp4 + reel-poster.webp (silent, 10s)
 *              and a rewritten src/data/portfolio.json pointing at the new /media/... URLs.
 * Pass-through: 'drive' assets (Google Drive videos: { driveId, width, height }) get their preview / thumbnail
 *              URLs filled in; 'case-study' assets (text only: { caseStudy }) are copied as-is with an empty src.
 *
 * Idempotent: existing outputs are kept (use --force to rebuild the selected category). A portfolio mp4
 *             whose duration differs from its source, or that lost the source's audio, is stale and is
 *             re-encoded anyway. --force-videos re-encodes every selected portfolio video (never images
 *             or the hero), for when the originals of some images are not at hand.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { videoBudgetBytes } from './lib/media-budget.mjs';
import { encodeImage, encodeThumbFromFile, imageSize } from './lib/media-image.mjs';
import { encodeVideo, extractPoster, probeAudio, probeVideo, targetSize } from './lib/media-video.mjs';
import { ensureDir, fileSize, formatMB, parseArgs, runPool, slugify } from './lib/media-util.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL_BASE = '/media';
const IMAGE_BUDGET = 1_500_000;
const HERO_SECONDS = 10;
const HERO_BUDGET = 3_000_000;
const HERO_BOUNDS = { width: 1280, height: 720 };
const DRIVE_PREVIEW = (id) => `https://drive.google.com/file/d/${id}/preview`;
// The stage facade shows the large still; strip / rail / card thumbs take a small one.
const DRIVE_POSTER = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
const DRIVE_THUMB = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w320`;
const PASS_THROUGH = new Set(['drive', 'case-study']);
const HERO_CRF = 23;
const IMAGE_LANES = 4;
const VIDEO_LANES = 3;
/** Seconds an encoded clip may differ from its source before it counts as a stale (truncated) preview. */
const DURATION_TOLERANCE = 0.5;

sharp.concurrency(IMAGE_LANES);

const args = parseArgs(process.argv.slice(2));
const SRC_DIR = path.resolve(String(args.src ?? path.join(ROOT, 'public')));
const OUT_DIR = path.resolve(String(args.out ?? path.join(ROOT, 'public', 'media')));
const DATA_FILE = path.resolve(String(args.data ?? path.join(ROOT, 'src', 'data', 'portfolio.json')));
const SPEC_FILE = path.join(ROOT, 'scripts', 'portfolio.source.json');
const ONLY = typeof args.only === 'string' ? args.only : null;
const FORCE = args.force === true;
const FORCE_VIDEOS = args['force-videos'] === true;

const stripBom = (text) => text.replace(/^﻿/, '');
const urlFor = (...parts) => [URL_BASE, ...parts].join('/');
const isSelected = (category) => ONLY === null || ONLY === category;

const isMedia = (asset) => !PASS_THROUGH.has(asset.type);

/** Naming-convention fields (title / service / material) carried from the spec onto every entry. */
const naming = ({ title, service, material }) => ({ title, service, material });

/** Drive and case-study entries need no encoding, only their derived URLs. */
function passThrough(asset) {
  if (asset.type === 'drive') {
    return {
      src: DRIVE_PREVIEW(asset.driveId), type: 'drive', ...naming(asset),
      poster: DRIVE_POSTER(asset.driveId), thumb: DRIVE_THUMB(asset.driveId),
      width: asset.width, height: asset.height, driveId: asset.driveId,
    };
  }
  return { src: '', type: 'case-study', ...naming(asset), caseStudy: asset.caseStudy };
}

async function allExist(files) {
  const sizes = await Promise.all(files.map(fileSize));
  return sizes.every((s) => s > 0);
}

function buildJobs(spec) {
  const taken = new Map();
  return spec.projects.flatMap((project) =>
    project.assets.flatMap((asset, assetIndex) => {
      if (!isMedia(asset)) return [];
      const key = `${project.category}/${project.id}`;
      const used = taken.get(key) ?? new Set();
      taken.set(key, used);
      const base = slugify(path.parse(asset.src).name);
      let slug = base;
      for (let n = 2; used.has(slug) || used.has(`${slug}-thumb`) || used.has(`${slug}-poster`); n += 1) {
        slug = `${base}-${n}`;
      }
      used.add(slug).add(`${slug}-thumb`).add(`${slug}-poster`);
      const type = asset.type ?? (asset.src.toLowerCase().endsWith('.mp4') ? 'video' : 'image');
      const dir = path.join(OUT_DIR, project.category, project.id);
      return [{
        project, asset, assetIndex, type, slug, dir,
        category: project.category,
        srcFile: path.join(SRC_DIR, ...asset.src.split('/').filter(Boolean)),
        urlDir: [project.category, project.id],
      }];
    }),
  );
}

async function processImageJob(job) {
  const main = path.join(job.dir, `${job.slug}.webp`);
  const thumb = path.join(job.dir, `${job.slug}-thumb.webp`);
  const exists = !(FORCE && isSelected(job.category)) && (await allExist([main, thumb]));
  if (!exists) {
    if (!isSelected(job.category)) return { missing: true };
    await ensureDir(job.dir);
    await encodeImage(job.srcFile, main, thumb);
  }
  const { width, height } = await imageSize(main);
  const bytes = (await fileSize(main)) + (await fileSize(thumb));
  return {
    entry: {
      src: urlFor(...job.urlDir, `${job.slug}.webp`),
      type: 'image',
      ...naming(job.asset),
      thumb: urlFor(...job.urlDir, `${job.slug}-thumb.webp`),
      width, height,
    },
    bytes, mainBytes: await fileSize(main), budget: IMAGE_BUDGET, files: [main],
  };
}

/** An existing clip is stale when its length differs from the source's, or it dropped the source's audio. */
async function isStaleVideo(srcFile, main) {
  if ((await fileSize(srcFile)) === 0) return false;
  const src = await probeVideo(srcFile);
  let out;
  try {
    out = await probeVideo(main);
  } catch {
    return true; // A truncated or corrupt clip from an interrupted run: re-encode it.
  }
  if (Math.abs(out.duration - src.duration) > DURATION_TOLERANCE) return true;
  const [srcAudio, outAudio] = await Promise.all([probeAudio(srcFile), probeAudio(main).catch(() => false)]);
  return srcAudio && !outAudio;
}

/** Full-length encode with sound, budgeted from the source duration at the output frame size. */
async function encodePortfolioVideo(srcFile, main) {
  const src = await probeVideo(srcFile);
  const size = targetSize(src.width, src.height);
  const budgetBytes = videoBudgetBytes(src.duration, size.width, size.height);
  const result = await encodeVideo({ src: srcFile, out: main, maxSeconds: null, budgetBytes, audio: true });
  return result.attempts;
}

async function processVideoJob(job) {
  const main = path.join(job.dir, `${job.slug}.mp4`);
  const poster = path.join(job.dir, `${job.slug}-poster.webp`);
  const thumb = path.join(job.dir, `${job.slug}-thumb.webp`);
  const selected = isSelected(job.category);
  const hasMain = await allExist([main]);
  if (!hasMain && !selected) return { missing: true };
  const reencode = selected && (FORCE || FORCE_VIDEOS || !hasMain || (await isStaleVideo(job.srcFile, main)));
  let attemptsUsed = 0;
  if (reencode) {
    await ensureDir(job.dir);
    attemptsUsed = await encodePortfolioVideo(job.srcFile, main);
  }
  for (const [file, make] of [[poster, () => extractPoster(main, poster)], [thumb, () => encodeThumbFromFile(poster, thumb)]]) {
    if (!reencode && (await allExist([file]))) continue;
    if (!selected) return { missing: true };
    await make();
  }
  const { width, height, duration } = await probeVideo(main);
  const hasAudio = await probeAudio(main);
  const mainBytes = await fileSize(main);
  return {
    entry: {
      src: urlFor(...job.urlDir, `${job.slug}.mp4`),
      type: 'video',
      ...naming(job.asset),
      poster: urlFor(...job.urlDir, `${job.slug}-poster.webp`),
      thumb: urlFor(...job.urlDir, `${job.slug}-thumb.webp`),
      width, height,
      duration: Math.round(duration * 10) / 10,
      hasAudio,
    },
    bytes: mainBytes + (await fileSize(poster)) + (await fileSize(thumb)),
    mainBytes, budget: videoBudgetBytes(duration, width, height), files: [main], attemptsUsed,
    silent: !hasAudio,
  };
}

async function guarded(job, fn, failures) {
  try {
    return await fn(job);
  } catch (error) {
    failures.push({ file: job.srcFile, reason: error instanceof Error ? error.message.split('\n')[0] : String(error) });
    return null;
  }
}

async function processHero(failures) {
  if (!isSelected('hero')) return null;
  const srcFile = path.join(SRC_DIR, 'videos', 'landing-page-background.mp4');
  const dir = path.join(OUT_DIR, 'hero');
  const main = path.join(dir, 'reel.mp4');
  const poster = path.join(dir, 'reel-poster.webp');
  const job = { srcFile };
  return guarded(job, async () => {
    if (FORCE || !(await allExist([main, poster]))) {
      await ensureDir(dir);
      await encodeVideo({
        src: srcFile, out: main, maxSeconds: HERO_SECONDS, budgetBytes: HERO_BUDGET, bounds: HERO_BOUNDS, crf: HERO_CRF,
      });
      await extractPoster(main, poster);
    }
    const { width, height } = await probeVideo(main);
    return {
      inBytes: await fileSize(srcFile), bytes: (await fileSize(main)) + (await fileSize(poster)),
      mainBytes: await fileSize(main), budget: HERO_BUDGET, files: [main], width, height,
    };
  }, failures);
}

function assemble(spec, jobs, results) {
  const encoded = new Map();
  jobs.forEach((job, i) => {
    const res = results[i];
    if (res && !res.missing) encoded.set(`${job.project.id}#${job.assetIndex}`, res.entry);
  });
  const projects = spec.projects.map((project) => {
    const assets = project.assets.flatMap((asset, i) => {
      if (!isMedia(asset)) return [passThrough(asset)];
      const entry = encoded.get(`${project.id}#${i}`);
      return entry ? [entry] : [];
    });
    // Text-only tabs (case studies) have no still: an empty thumbnail.
    const thumbnail = assets.find((asset) => asset.thumb)?.thumb ?? '';
    return { ...project, thumbnail, assets };
  });
  return { ...spec, projects };
}

function printReport(stats, offenders, failures, hero, silent) {
  const rows = Object.entries(stats);
  const pad = (s, n) => String(s).padEnd(n);
  const lines = [pad('category', 16) + pad('files', 8) + pad('input MB', 12) + pad('output MB', 12)];
  let totalIn = 0;
  let totalOut = 0;
  for (const [category, s] of rows) {
    lines.push(pad(category, 16) + pad(s.files, 8) + pad(formatMB(s.inBytes), 12) + pad(formatMB(s.outBytes), 12));
    totalIn += s.inBytes;
    totalOut += s.outBytes;
  }
  if (hero) lines.push(pad('hero', 16) + pad(1, 8) + pad(formatMB(hero.inBytes), 12) + pad(formatMB(hero.bytes), 12));
  const heroIn = hero?.inBytes ?? 0;
  const heroOut = hero?.bytes ?? 0;
  lines.push(pad('TOTAL', 16) + pad('', 8) + pad(formatMB(totalIn + heroIn), 12) + pad(formatMB(totalOut + heroOut), 12));
  process.stdout.write(`${lines.join('\n')}\n`);
  process.stdout.write(`\nOver budget: ${offenders.length === 0 ? 'none' : ''}\n`);
  for (const o of offenders) process.stdout.write(`  ${formatMB(o.bytes)} > ${formatMB(o.budget)}  ${o.file}\n`);
  process.stdout.write(`Videos without audio: ${silent.length === 0 ? 'none' : ''}\n`);
  for (const file of silent) process.stdout.write(`  ${file}\n`);
  process.stdout.write(`Failures: ${failures.length === 0 ? 'none' : ''}\n`);
  for (const f of failures) process.stdout.write(`  ${f.file}: ${f.reason}\n`);
}

async function main() {
  const spec = JSON.parse(stripBom(await fs.readFile(SPEC_FILE, 'utf8')));
  const jobs = buildJobs(spec);
  const failures = [];
  const started = Date.now();

  const imageIdx = jobs.flatMap((j, i) => (j.type === 'image' ? [i] : []));
  const videoIdx = jobs.flatMap((j, i) => (j.type === 'video' ? [i] : []));
  const results = new Array(jobs.length).fill(null);
  const tick = (label) => (job, n) => isSelected(job.category) && process.stdout.write(`[${label} ${n + 1}] ${job.category}/${job.project.id}/${job.slug}\n`);

  const imgLog = tick('img');
  const imgResults = await runPool(imageIdx, IMAGE_LANES, async (i, n) => {
    imgLog(jobs[i], n);
    return guarded(jobs[i], processImageJob, failures);
  });
  imageIdx.forEach((i, n) => { results[i] = imgResults[n]; });

  const vidLog = tick('vid');
  const vidResults = await runPool(videoIdx, VIDEO_LANES, async (i, n) => {
    vidLog(jobs[i], n);
    return guarded(jobs[i], processVideoJob, failures);
  });
  videoIdx.forEach((i, n) => { results[i] = vidResults[n]; });

  const hero = await processHero(failures);

  const stats = {};
  const offenders = [];
  const inputSizes = await Promise.all(jobs.map((j) => fileSize(j.srcFile)));
  jobs.forEach((job, i) => {
    const res = results[i];
    const s = stats[job.category] ?? { files: 0, inBytes: 0, outBytes: 0 };
    stats[job.category] = {
      files: s.files + 1,
      inBytes: s.inBytes + inputSizes[i],
      outBytes: s.outBytes + (res && !res.missing ? res.bytes : 0),
    };
    if (res && !res.missing && res.mainBytes > res.budget) {
      offenders.push({ file: res.files[0], bytes: res.mainBytes, budget: res.budget });
    }
  });
  if (hero && hero.mainBytes > hero.budget) offenders.push({ file: hero.files[0], bytes: hero.mainBytes, budget: hero.budget });

  const missing = results.filter((r) => r && r.missing).length;
  const complete = missing === 0 && failures.length === 0 && ONLY === null;
  if (complete) {
    const data = assemble(spec, jobs, results);
    await fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    process.stdout.write(`\nWrote ${path.relative(ROOT, DATA_FILE)}\n`);
  } else {
    process.stdout.write('\nportfolio.json NOT rewritten (partial run, --only, or failures).\n');
  }

  const silent = results.flatMap((r) => (r && !r.missing && r.silent ? [path.relative(ROOT, r.files[0])] : []));
  printReport(stats, offenders, failures, hero, silent);
  process.stdout.write(`\nDone in ${((Date.now() - started) / 1000).toFixed(0)}s\n`);
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`optimize-media failed: ${error instanceof Error ? error.stack : String(error)}\n`);
  process.exit(1);
});
