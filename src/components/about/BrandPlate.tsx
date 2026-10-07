import Image from 'next/image';
import Marquee from '@/components/fx/Marquee';
import { MARK_ROWS, type BrandMark } from './data';

const MARK_RATIO = 1064 / 1016;
const ROW_SPEEDS = [16, 22, 18] as const;
const ROW_DIRECTIONS = ['left', 'right', 'left'] as const;

function Mark({ mark }: { mark: BrandMark }) {
  return (
    <Image
      src={mark.src}
      alt=""
      width={mark.size}
      height={Math.round(mark.size * MARK_RATIO)}
      sizes={`${mark.size}px`}
      className="block flex-none select-none"
      style={{ opacity: mark.opacity }}
      draggable={false}
    />
  );
}

/**
 * The brand logo presented as a glass-framed plate. Three rows of North-Star
 * marks drift sideways behind it (CSS transform loops, decorative only).
 */
export default function BrandPlate() {
  return (
    <figure className="relative mx-auto w-full max-w-[24rem] lg:max-w-[25rem]">
      <div
        aria-hidden="true"
        className="about-marks pointer-events-none absolute -inset-x-[22%] -inset-y-12 flex flex-col justify-between"
      >
        {MARK_ROWS.map((row, index) => (
          <Marquee
            key={index}
            speed={ROW_SPEEDS[index]}
            direction={ROW_DIRECTIONS[index]}
            gap={44}
            pauseOnHover={false}
            deferChildren
            reserveHeight={`${Math.round(Math.max(...row.map((mark) => mark.size)) * MARK_RATIO)}px`}
          >
            {row.map((mark, markIndex) => (
              <Mark key={`${mark.src}-${markIndex}`} mark={mark} />
            ))}
          </Marquee>
        ))}
      </div>

      <div className="glass-strong shine relative rounded-[1.75rem] p-3 sm:p-4" data-sfx-hover="" suppressHydrationWarning>
        <div className="relative aspect-square overflow-hidden rounded-[1.25rem] ring-1 ring-cream-500/10">
          {/* Static file (scripts/static-image-sizes.mjs), not next/image: no optimizer work on a cold cache. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/Social-Media-DP-Green-BG-880.webp"
            width={880}
            height={880}
            loading="lazy"
            decoding="async"
            alt="Kreativ Nomads advertising agency brand plate with the North Star compass, established 2023"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-gradient-to-tr from-primary-950/30 via-transparent to-cream-500/10"
          />
        </div>
        <figcaption className="sr-only">Kreativ Nomads brand plate</figcaption>
      </div>
    </figure>
  );
}
