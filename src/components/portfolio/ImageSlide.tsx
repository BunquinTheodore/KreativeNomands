import Image from 'next/image';
import type { ShowcaseAsset } from './data';
import { STAGE_SIZES } from './preload';

interface ImageSlideProps {
  asset: ShowcaseAsset;
  alt: string;
  priority?: boolean;
}

/**
 * One image on a blurred backdrop copy of itself (the 640px thumb, already
 * cached), so tall or wide pictures letterbox gracefully.
 */
export default function ImageSlide({ asset, alt, priority = false }: ImageSlideProps) {
  return (
    <>
      <Image
        src={asset.thumb ?? asset.src}
        alt=""
        aria-hidden="true"
        fill
        sizes="240px"
        draggable={false}
        className="scale-125 object-cover opacity-50 blur-2xl"
      />
      <Image
        src={asset.src}
        alt={alt}
        fill
        sizes={STAGE_SIZES}
        priority={priority}
        draggable={false}
        className="object-contain p-2 sm:p-5"
      />
    </>
  );
}
