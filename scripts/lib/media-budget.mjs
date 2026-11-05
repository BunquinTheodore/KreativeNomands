// Size budgets for full-length portfolio videos (shared by optimize-media and verify-portfolio).
// Budgets are computed from the OUTPUT frame size (targetSize()), so both scripts agree.

/** AAC stereo audio bitrate carried by every portfolio video. */
export const AUDIO_KBPS = 128;

/** Video bitrate ceilings (kbps) per output orientation. */
export const VIDEO_CAP_KBPS = { portrait: 1200, landscape: 1600, square: 1300 };

/** Container overhead and rate-control slack applied on top of the nominal bitrate. */
const OVERHEAD = 1.08;
/** Fixed allowance for the moov atom and very short clips. */
const BASE_BYTES = 100_000;
/** Bytes per kilobit (1000 bits / 8). */
const BYTES_PER_KBIT = 125;

/** Per-file ceiling the encoder squeezes long clips under (keeps repo and deploy size sane). */
export const VIDEO_FILE_MAX = 20_000_000;
/** Absolute ceiling verify-portfolio enforces on any portfolio video. */
export const VIDEO_HARD_MAX = 25_000_000;

export function orientation(width, height) {
  if (width > height) return 'landscape';
  if (height > width) return 'portrait';
  return 'square';
}

export const videoCapKbps = (width, height) => VIDEO_CAP_KBPS[orientation(width, height)];

/** Byte budget for a clip of `duration` seconds at the given output size. */
export function videoBudgetBytes(duration, width, height) {
  const seconds = Math.max(Number(duration) || 0, 0);
  const raw = Math.ceil(seconds * (videoCapKbps(width, height) + AUDIO_KBPS) * BYTES_PER_KBIT * OVERHEAD) + BASE_BYTES;
  return Math.min(raw, VIDEO_FILE_MAX);
}
