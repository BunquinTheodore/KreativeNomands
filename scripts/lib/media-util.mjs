// Shared helpers for the media optimisation scripts.
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

/** Parse `--key value` / `--flag` CLI arguments into a plain object. */
export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

/** Lowercase ascii slug: no spaces, ampersands or plus signs. */
export function slugify(input) {
  const slug = input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug.length > 0 ? slug : 'asset';
}

/** Run `worker` over `items` with at most `limit` in flight. Preserves order. */
export async function runPool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function lane() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }
  const lanes = Array.from({ length: Math.min(limit, items.length) }, lane);
  await Promise.all(lanes);
  return results;
}

/** Find a working binary (ffmpeg / ffprobe), falling back to the WinGet links folder. */
export function resolveBin(name) {
  const candidates = [
    process.env[name.toUpperCase()],
    name,
    path.join(homedir(), 'AppData', 'Local', 'Microsoft', 'WinGet', 'Links', `${name}.exe`),
  ].filter(Boolean);
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ['-version'], { stdio: 'ignore' });
    if (probe.status === 0) return candidate;
  }
  throw new Error(`Could not find "${name}" on PATH (set ${name.toUpperCase()} to its full path).`);
}

export async function fileSize(file) {
  try {
    const stat = await fs.stat(file);
    return stat.isFile() ? stat.size : 0;
  } catch {
    return 0;
  }
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

/** Atomic-ish write: temp file in the same folder, then rename over the target. */
export async function writeFileAtomic(target, data) {
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, data);
  await fs.rename(tmp, target);
}

export const toMB = (bytes) => bytes / 1_000_000;
export const formatMB = (bytes) => `${toMB(bytes).toFixed(2)} MB`;
