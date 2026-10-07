import { getImageProps } from 'next/image';
import type { ShowcaseAsset } from './data';

/** `sizes` for the main stage image (must match the rendered <Image>). */
export const STAGE_SIZES = '(max-width: 1024px) 100vw, 1100px';
/** `sizes` for screenshots inside the browser frame. */
export const BROWSER_SIZES = '(max-width: 1024px) 92vw, 920px';

const warmed = new Map<string, HTMLImageElement>();

/**
 * Warms the browser cache with exactly the optimised candidate that the stage
 * <Image> will request (same srcset + sizes), so the next slide paints at once.
 * Images only; never videos.
 */
export function preloadStageImage(asset: ShowcaseAsset | undefined, sizes: string): void {
  if (!asset || asset.kind !== 'image' || typeof window === 'undefined') return;
  const key = `${asset.src}|${sizes}`;
  if (warmed.has(key)) return;
  const { props } = getImageProps({
    src: asset.src,
    alt: '',
    width: asset.width,
    height: asset.height,
    sizes,
  });
  const image = new Image();
  image.sizes = sizes;
  if (props.srcSet) image.srcset = props.srcSet;
  image.src = props.src;
  warmed.set(key, image);
}
