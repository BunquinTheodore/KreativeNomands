import Image from 'next/image';
import Marquee from '@/components/fx/Marquee';
import NorthStar3D from '@/components/three/NorthStar3D';
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
 * The interactive 3D North Star presented as a glass-framed plate. Three rows of North-Star
 * marks drift sideways behind it (CSS transform loops, decorative only).
 * The square stage has the same size before and after WebGL, so nothing shifts when it boots. The
 * star is the page's second WebGL instance: it only boots once scrolled near (the hero's stays
 * paused meanwhile), and shows the static mark on low-end / reduced-motion / Save-Data / no WebGL.
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
        <div className="relative aspect-square rounded-[1.25rem] bg-[radial-gradient(closest-side,rgba(245,158,11,0.14),transparent_75%)] ring-1 ring-cream-500/10">
          <div className="absolute inset-0">
            <NorthStar3D height="100%" priority={false} />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-gradient-to-tr from-primary-950/30 via-transparent to-cream-500/10"
          />
        </div>
        <p className="about-star-hint pointer-events-none mt-2 text-center text-[0.65rem] font-semibold uppercase text-[var(--ink-dim)] sm:mt-3">
          Drag to spin &middot; Tap for a burst of light
        </p>
        <figcaption className="sr-only">The Kreativ Nomads North Star</figcaption>
      </div>
    </figure>
  );
}
