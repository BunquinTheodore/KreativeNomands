// Image pipeline: WebP master (<=1600px long edge) + 640px thumb.
import sharp from 'sharp';
import { writeFileAtomic } from './media-util.mjs';

export const IMAGE_MAX_EDGE = 1600;
export const THUMB_MAX_EDGE = 640;
export const IMAGE_QUALITY = 78;
export const THUMB_QUALITY = 74;
export const WEBP_EFFORT = 5;

function pipeline(srcFile, edge) {
  return sharp(srcFile, { failOn: 'none' })
    .rotate()
    .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true });
}

/**
 * Encode `srcFile` to `mainOut` (+ `thumbOut`). Returns the master's pixel size.
 */
export async function encodeImage(srcFile, mainOut, thumbOut) {
  const main = await pipeline(srcFile, IMAGE_MAX_EDGE)
    .webp({ quality: IMAGE_QUALITY, effort: WEBP_EFFORT })
    .toBuffer({ resolveWithObject: true });
  const thumb = await pipeline(srcFile, THUMB_MAX_EDGE)
    .webp({ quality: THUMB_QUALITY, effort: WEBP_EFFORT })
    .toBuffer();
  await writeFileAtomic(mainOut, main.data);
  await writeFileAtomic(thumbOut, thumb);
  return { width: main.info.width, height: main.info.height };
}

export async function imageSize(file) {
  const meta = await sharp(file).metadata();
  return { width: meta.width ?? 0, height: meta.height ?? 0 };
}

/** Mean luma (0-255) of an encoded image buffer. */
export async function meanLuma(buffer) {
  const { channels } = await sharp(buffer).stats();
  const rgb = channels.slice(0, 3);
  return rgb.reduce((sum, c) => sum + c.mean, 0) / rgb.length;
}

export async function encodePoster(pngBuffer, outFile) {
  const data = await sharp(pngBuffer).webp({ quality: 75, effort: WEBP_EFFORT }).toBuffer();
  await writeFileAtomic(outFile, data);
}
