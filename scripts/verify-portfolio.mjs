#!/usr/bin/env node
/**
 * Verifies src/data/portfolio.json against public/: every referenced path exists,
 * asset types match file extensions, thumbnails are images, sizes stay within budget.
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

async function checkAsset(project, asset, index) {
  const ctx = `${project.id}[${index}]`;
  await requireFile(asset.src, `${ctx}.src`);
  if (asset.type === 'image') {
    if (!IMAGE_EXT.has(extOf(asset.src))) fail(`${ctx}: type image but src is ${extOf(asset.src)}`);
    if (!asset.thumb) fail(`${ctx}: image is missing thumb`);
    if (asset.poster) fail(`${ctx}: image must not have a poster`);
  } else if (asset.type === 'video') {
    if (!VIDEO_EXT.has(extOf(asset.src))) fail(`${ctx}: type video but src is ${extOf(asset.src)}`);
    if (!asset.poster) fail(`${ctx}: video is missing poster`);
    if (!asset.thumb) fail(`${ctx}: video is missing thumb`);
    if (asset.poster) await requireFile(asset.poster, `${ctx}.poster`);
  } else {
    fail(`${ctx}: unknown type ${JSON.stringify(asset.type)}`);
  }
  if (asset.thumb) {
    await requireFile(asset.thumb, `${ctx}.thumb`);
    if (!IMAGE_EXT.has(extOf(asset.thumb))) fail(`${ctx}: thumb must be an image (${asset.thumb})`);
  }
  if (!asset.title) fail(`${ctx}: missing title`);
  for (const key of ['width', 'height']) {
    if (!Number.isInteger(asset[key]) || asset[key] <= 0) fail(`${ctx}: ${key} must be a positive integer`);
  }
}

async function checkProject(project, categoryIds) {
  if (!categoryIds.has(project.category)) fail(`${project.id}: unknown category ${project.category}`);
  if (!project.thumbnail || !IMAGE_EXT.has(extOf(project.thumbnail))) {
    fail(`${project.id}: thumbnail must be an image path (got ${project.thumbnail})`);
  }
  await requireFile(project.thumbnail, `${project.id}.thumbnail`);
  if (!Array.isArray(project.assets) || project.assets.length === 0) fail(`${project.id}: no assets`);
  else if (project.assets[0].thumb !== project.thumbnail) fail(`${project.id}: thumbnail should equal first asset thumb`);
  await Promise.all((project.assets ?? []).map((asset, i) => checkAsset(project, asset, i)));
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
  for (const hero of HERO_FILES) await requireFile(`/${hero}`, 'hero');
  const files = await checkBudgets();

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
