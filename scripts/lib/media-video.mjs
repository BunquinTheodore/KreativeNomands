// Video pipeline: ffprobe + H.264 re-encode with an automatic size-budget retry loop.
import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import { encodePoster, meanLuma } from './media-image.mjs';
import { fileSize, resolveBin } from './media-util.mjs';

const execFileAsync = promisify(execFile);
const MAX_BUFFER = 256 * 1024 * 1024;

const FFMPEG = resolveBin('ffmpeg');
const FFPROBE = resolveBin('ffprobe');

export const BOUNDS = {
  landscape: { width: 1280, height: 720 },
  portrait: { width: 540, height: 960 },
  square: { width: 720, height: 720 },
};
export const POSTER_CANDIDATES = [1.0, 2.5, 4.0, 6.0];
const DARK_FRAME_LUMA = 12;
export const DEFAULT_CRF = 29;

export async function probeVideo(file) {
  const { stdout } = await execFileAsync(
    FFPROBE,
    ['-v', 'error', '-select_streams', 'v:0', '-show_streams', '-show_format', '-of', 'json', file],
    { maxBuffer: MAX_BUFFER },
  );
  const json = JSON.parse(stdout);
  const stream = json.streams?.[0];
  if (!stream) throw new Error('no video stream');
  const rotation = Math.abs(
    Number(stream.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? stream.tags?.rotate ?? 0),
  );
  const swap = rotation === 90 || rotation === 270;
  const [num, den] = String(stream.avg_frame_rate || stream.r_frame_rate || '30/1').split('/').map(Number);
  const fps = den ? num / den : 30;
  return {
    width: swap ? stream.height : stream.width,
    height: swap ? stream.width : stream.height,
    fps: Number.isFinite(fps) && fps > 0 ? fps : 30,
    duration: Number(stream.duration ?? json.format?.duration ?? 0),
  };
}

const even = (n) => Math.max(2, Math.round(n / 2) * 2);

/** Target frame size: fit inside orientation bounds, never upscale, even dimensions. */
export function targetSize(width, height, bounds = null) {
  const box =
    bounds ?? (width > height ? BOUNDS.landscape : height > width ? BOUNDS.portrait : BOUNDS.square);
  const scale = Math.min(1, box.width / width, box.height / height);
  return { width: even(width * scale), height: even(height * scale) };
}

/** Encode attempts, from best quality to a hard bitrate cap. */
function attempts(budgetBytes, clipSeconds, baseCrf) {
  const capKbps = Math.floor((budgetBytes * 8 * 0.85) / Math.max(clipSeconds, 1) / 1000);
  return [
    { crf: baseCrf, fpsCap: 30 },
    { crf: baseCrf + 4, fpsCap: 30 },
    { crf: baseCrf + 7, fpsCap: 24, kbps: capKbps },
  ];
}

function buildArgs({ src, out, seconds, size, srcFps, attempt }) {
  const filters = [];
  if (srcFps > attempt.fpsCap + 0.5) filters.push(`fps=${attempt.fpsCap}`);
  filters.push(`scale=${size.width}:${size.height}:flags=lanczos`, 'setsar=1');
  const rate = attempt.kbps
    ? ['-b:v', `${attempt.kbps}k`, '-maxrate', `${Math.round(attempt.kbps * 1.2)}k`, '-bufsize', `${attempt.kbps * 2}k`]
    : ['-crf', String(attempt.crf)];
  return [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-t', String(seconds), '-i', src,
    '-map', '0:v:0', '-an', '-sn', '-dn',
    '-vf', filters.join(','),
    '-c:v', 'libx264', '-preset', 'slow', ...rate,
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-f', 'mp4', out,
  ];
}

/**
 * Encode `src` -> `out`, retrying with stronger compression until it fits `budgetBytes`.
 * Returns { bytes, attempts, overBudget }.
 */
export async function encodeVideo({ src, out, maxSeconds, budgetBytes, bounds = null, crf = DEFAULT_CRF }) {
  const info = await probeVideo(src);
  const seconds = info.duration > 0 ? Math.min(info.duration, maxSeconds) : maxSeconds;
  const size = targetSize(info.width, info.height, bounds);
  const tmp = `${out}.tmp`;
  let bytes = 0;
  let used = 0;
  for (const attempt of attempts(budgetBytes, seconds, crf)) {
    used += 1;
    await execFileAsync(
      FFMPEG,
      buildArgs({ src, out: tmp, seconds: maxSeconds, size, srcFps: info.fps, attempt }),
      { maxBuffer: MAX_BUFFER },
    );
    bytes = await fileSize(tmp);
    if (bytes > 0 && bytes <= budgetBytes) break;
  }
  if (bytes === 0) throw new Error('ffmpeg produced no output');
  await fs.rename(tmp, out);
  return { bytes, attempts: used, overBudget: bytes > budgetBytes };
}

async function grabFrame(file, seconds, size) {
  const { stdout } = await execFileAsync(
    FFMPEG,
    [
      '-hide_banner', '-loglevel', 'error', '-ss', String(seconds), '-i', file,
      '-frames:v', '1', '-vf', `scale=${size.width}:${size.height}`,
      '-f', 'image2pipe', '-vcodec', 'png', '-',
    ],
    { encoding: 'buffer', maxBuffer: MAX_BUFFER },
  );
  return stdout;
}

/** Poster WebP from the encoded clip: ~1s frame, skipping near-black frames. */
export async function extractPoster(videoFile, posterOut) {
  const info = await probeVideo(videoFile);
  const size = { width: info.width, height: info.height };
  let best = null;
  for (const t of POSTER_CANDIDATES) {
    if (info.duration > 0 && t >= info.duration - 0.1 && best) break;
    const at = info.duration > 0 ? Math.min(t, Math.max(info.duration - 0.2, 0)) : t;
    const frame = await grabFrame(videoFile, at, size);
    if (frame.length === 0) continue;
    const luma = await meanLuma(frame);
    if (!best || luma > best.luma) best = { frame, luma };
    if (luma >= DARK_FRAME_LUMA) break;
  }
  if (!best) throw new Error('could not extract a poster frame');
  await encodePoster(best.frame, posterOut);
  return size;
}
