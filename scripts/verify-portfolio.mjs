#!/usr/bin/env node
/**
 * Verifies src/data/portfolio.json against public/: every referenced path exists,
 * asset types match file extensions, thumbnails are images, sizes stay within budget.
 * Google Drive assets must point at drive.google.com (preview + small thumb + large poster); text-only
 * case studies must carry a complete caseStudy object and no file. Category ids in categories.ts and the
 * hard-coded ?p= deep links (hero chips, legacy redirects, services) must match the data.
 *
 *   node scripts/verify-portfolio.mjs     (suggested npm script: "media:verify")
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_FILE = path.join(ROOT, 'src', 'data', 'portfolio.json');
const IMAGE_EXT = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);
const VIDEO_EXT = new Set(['.mp4']);
const MAX_FILE_BYTES = 1_500_000;
const HERO_MAX_BYTES = 3_000_000;
const HERO_FILES = ['media/hero/reel.mp4', 'media/hero/reel-poster.webp'];
const DRIVE_ID = /^[\w-]{10,}$/;
// Code that names categories / tabs by id: they must stay in step with portfolio.json.
const CATEGORIES_FILE = path.join(ROOT, 'src', 'components', 'portfolio', 'categories.ts');
const LINK_FILES = ['src/components/hero/heroData.ts', 'next.config.js', 'src/components/services/data.ts'];
const PORTFOLIO_LINK = /\/portfolio\/([a-z0-9-]+)(?:\?p=([a-z0-9-]+))?/g;
const DRIVE_PREVIEW = (id) => `https://drive.google.com/file/d/${id}/preview`;
const DRIVE_POSTER = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
const DRIVE_THUMB = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w320`;

const errors = [];
const fail = (message) => errors.push(message);

async function sizeOf(url) {
  try {
    return (await fs.stat(path.join(PUBLIC_DIR, ...url.split('/').filter(Boolean)))).size;
  } catch {
    return -1;
  }
}

async function requireFile(url, context) {
  if (typeof url !== 'string' || !url.startsWith('/media/')) {
    fail(`${context}: path must start with /media/ (got ${JSON.stringify(url)})`);
    return;
  }
  if ((await sizeOf(url)) <= 0) fail(`${context}: file missing or empty: ${url}`);
}

const extOf = (url) => path.extname(String(url)).toLowerCase();

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;

function checkDrive(asset, ctx) {
  if (!DRIVE_ID.test(String(asset.driveId))) fail(`${ctx}: drive asset needs a driveId`);
  if (asset.src !== DRIVE_PREVIEW(asset.driveId)) fail(`${ctx}: drive src must be the /preview URL`);
  if (asset.thumb !== DRIVE_THUMB(asset.driveId)) fail(`${ctx}: drive thumb must be the small (w320) thumbnail URL`);
  if (asset.poster !== DRIVE_POSTER(asset.driveId)) fail(`${ctx}: drive poster must be the large (w1000) thumbnail URL`);
}

function checkCaseStudy(asset, ctx) {
  const study = asset.caseStudy;
  if (asset.src !== '') fail(`${ctx}: case-study src must be empty`);
  if (asset.thumb || asset.poster) fail(`${ctx}: case-study must not have a thumb or poster`);
  if (!study || typeof study !== 'object') {
    fail(`${ctx}: case-study is missing caseStudy`);
    return;
  }
  for (const key of ['title', 'overview', 'note']) if (!nonEmpty(study[key])) fail(`${ctx}: caseStudy.${key} is empty`);
  const rows = [
    ['meta', (m) => nonEmpty(m?.label) && nonEmpty(m?.value)],
    ['contributions', (c) => nonEmpty(c?.title) && nonEmpty(c?.body)],
    ['expertise', nonEmpty],
  ];
  for (const [key, valid] of rows) {
    if (!Array.isArray(study[key]) || study[key].length === 0) fail(`${ctx}: caseStudy.${key} must be a non-empty list`);
    else if (!study[key].every(valid)) fail(`${ctx}: caseStudy.${key} has an incomplete entry`);
  }
}

async function checkAsset(project, asset, index) {
  const ctx = `${project.id}[${index}]`;
  if (!asset.title) fail(`${ctx}: missing title`);
  if (asset.type === 'case-study') {
    checkCaseStudy(asset, ctx);
    return;
  }
  // Caption line 2 ("Service · Type of Material") disappears silently without both halves.
  if (!nonEmpty(asset.service) || !nonEmpty(asset.material)) fail(`${ctx}: missing service or material`);
  if (asset.type === 'drive') checkDrive(asset, ctx);
  else await requireFile(asset.src, `${ctx}.src`);
  if (asset.type === 'image') {
    if (!IMAGE_EXT.has(extOf(asset.src))) fail(`${ctx}: type image but src is ${extOf(asset.src)}`);
    if (!asset.thumb) fail(`${ctx}: image is missing thumb`);
    if (asset.poster) fail(`${ctx}: image must not have a poster`);
  } else if (asset.type === 'video' || asset.type === 'drive') {
    if (asset.type === 'video' && !VIDEO_EXT.has(extOf(asset.src))) fail(`${ctx}: type video but src is ${extOf(asset.src)}`);
    if (!asset.poster) fail(`${ctx}: video is missing poster`);
    if (!asset.thumb) fail(`${ctx}: video is missing thumb`);
    if (asset.poster && asset.type === 'video') await requireFile(asset.poster, `${ctx}.poster`);
  } else {
    fail(`${ctx}: unknown type ${JSON.stringify(asset.type)}`);
  }
  if (asset.thumb && asset.type !== 'drive') {
    await requireFile(asset.thumb, `${ctx}.thumb`);
    if (!IMAGE_EXT.has(extOf(asset.thumb))) fail(`${ctx}: thumb must be an image (${asset.thumb})`);
  }
  for (const key of ['width', 'height']) {
    if (!Number.isInteger(asset[key]) || asset[key] <= 0) fail(`${ctx}: ${key} must be a positive integer`);
  }
}

/** Tabs are "<Industry> - <Client>"; the cover is the first asset still ('' for text-only tabs). */
async function checkProject(project, categoryIds) {
  if (!categoryIds.has(project.category)) fail(`${project.id}: unknown category ${project.category}`);
  if (!nonEmpty(project.industry) || !nonEmpty(project.client)) fail(`${project.id}: missing industry or client`);
  else if (project.title !== `${project.industry} - ${project.client}`) fail(`${project.id}: title must be "Industry - Client"`);
  if (!Array.isArray(project.assets) || project.assets.length === 0) fail(`${project.id}: no assets`);
  const cover = (project.assets ?? []).find((asset) => asset.thumb)?.thumb ?? '';
  if (project.thumbnail !== cover) fail(`${project.id}: thumbnail should equal the first asset thumb`);
  if (project.thumbnail.startsWith('/')) {
    if (!IMAGE_EXT.has(extOf(project.thumbnail))) fail(`${project.id}: thumbnail must be an image path`);
    await requireFile(project.thumbnail, `${project.id}.thumbnail`);
  }
  await Promise.all((project.assets ?? []).map((asset, i) => checkAsset(project, asset, i)));
}

/** CATEGORY_IDS in categories.ts must list exactly the categories of portfolio.json, in order. */
async function checkCategoryIds(data) {
  const source = await fs.readFile(CATEGORIES_FILE, 'utf8');
  const list = /CATEGORY_IDS\s*=\s*\[([^\]]*)\]/.exec(source)?.[1];
  if (!list) {
    fail('categories.ts: CATEGORY_IDS not found');
    return;
  }
  const declared = [...list.matchAll(/'([^']+)'/g)].map((match) => match[1]);
  const inData = data.categories.map((c) => c.id);
  if (declared.join() !== inData.join()) {
    fail(`categories.ts CATEGORY_IDS ${JSON.stringify(declared)} != portfolio.json categories ${JSON.stringify(inData)}`);
  }
}

/** Hard-coded /portfolio/<category>?p=<tab> links (hero chips, legacy redirects, services) must resolve. */
async function checkDeepLinks(data) {
  const categoryIds = new Set(data.categories.map((c) => c.id));
  const tabs = new Set(data.projects.map((p) => `${p.category}/${p.id}`));
  for (const file of LINK_FILES) {
    const source = await fs.readFile(path.join(ROOT, file), 'utf8');
    for (const [link, category, tab] of source.matchAll(PORTFOLIO_LINK)) {
      if (!categoryIds.has(category)) fail(`${file}: ${link} names unknown category ${category}`);
      else if (tab !== undefined && !tabs.has(`${category}/${tab}`)) fail(`${file}: ${link} names no tab of ${category}`);
    }
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return nested.flat();
}

async function checkBudgets() {
  const files = await walk(path.join(PUBLIC_DIR, 'media'));
  for (const file of files) {
    const rel = path.relative(PUBLIC_DIR, file).split(path.sep).join('/');
    const limit = rel === 'media/hero/reel.mp4' ? HERO_MAX_BYTES : MAX_FILE_BYTES;
    const { size } = await fs.stat(file);
    if (size > limit) fail(`${rel}: ${size} bytes exceeds ${limit}`);
  }
  return files;
}

/** Every file under public/media (outside hero/) must be referenced, so dropped work never ships. */
function checkOrphans(data, files) {
  const referenced = new Set(
    data.projects.flatMap((p) => p.assets.flatMap((a) => [a.src, a.thumb, a.poster])).filter((u) => u?.startsWith('/media/')),
  );
  for (const file of files) {
    const url = `/${path.relative(PUBLIC_DIR, file).split(path.sep).join('/')}`;
    if (!url.startsWith('/media/hero/') && !referenced.has(url)) fail(`${url}: not referenced by portfolio.json`);
  }
}

async function main() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  if (raw.charCodeAt(0) === 0xfeff) fail('portfolio.json still has a UTF-8 BOM');
  const data = JSON.parse(raw.replace(/^﻿/, ''));
  const categoryIds = new Set(data.categories.map((c) => c.id));
  const ids = new Set();
  for (const project of data.projects) {
    if (ids.has(project.id)) fail(`duplicate project id ${project.id}`);
    ids.add(project.id);
  }
  await Promise.all(data.projects.map((p) => checkProject(p, categoryIds)));
  await checkCategoryIds(data);
  await checkDeepLinks(data);
  for (const hero of HERO_FILES) await requireFile(`/${hero}`, 'hero');
  const files = await checkBudgets();
  checkOrphans(data, files);

  const perCategory = data.projects.reduce(
    (acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + p.assets.length }),
    {},
  );
  process.stdout.write(`Projects: ${data.projects.length}\nAssets per category: ${JSON.stringify(perCategory)}\n`);
  process.stdout.write(`Files under public/media: ${files.length}\n`);
  if (errors.length > 0) {
    process.stderr.write(`\nFAILED (${errors.length}):\n${errors.map((e) => `  - ${e}`).join('\n')}\n`);
    process.exit(1);
  }
  process.stdout.write('OK: all referenced paths exist and types are consistent.\n');
}

main().catch((error) => {
  process.stderr.write(`verify-portfolio failed: ${error instanceof Error ? error.stack : String(error)}\n`);
  process.exit(1);
});
