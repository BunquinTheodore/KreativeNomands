import Image from 'next/image';
import Link from 'next/link';
import Marquee from '@/components/fx/Marquee';
import DrawLine from '@/components/fx/DrawLine';
import { getReelRows, type ReelItem } from './heroData';

/** Mirrors `--fh` in hero.css: a frame is clamp(88px, 12svh, 148px) tall and `ratio` x that wide. */
const FRAME_HEIGHT = 'clamp(88px, 12vh, 148px)';
const BASE_PX = 400;

function ReelFrame({ item, index }: { item: ReelItem; index: number }) {
  const sizes = `calc(${FRAME_HEIGHT} * ${item.ratio.toFixed(3)})`;
  return (
    <Link
      href={`/portfolio/${item.categoryId}`}
      aria-label={`${item.title} - view ${item.categoryLabel} work`}
      data-sfx-hover
      className="hero-frame shine"
      style={{ aspectRatio: String(item.ratio), '--shine-delay': `${(index % 5) * 0.9}s` } as React.CSSProperties}
    >
      <span className="hero-frame__media">
        <Image
          src={item.src}
          alt=""
          width={Math.round(BASE_PX * item.ratio)}
          height={BASE_PX}
          sizes={sizes}
          quality={70}
          draggable={false}
          className="h-full w-full"
        />
        <span className="hero-frame__cap">{item.categoryLabel}</span>
      </span>
    </Link>
  );
}

/**
 * Work reel: two glass-framed thumbnail rails drifting in opposite directions.
 * Built from the portfolio data on the server; each frame links to its category page.
 */
export default function HeroReel() {
  const { top, bottom } = getReelRows();
  return (
    <div className="hero-reel relative" role="region" aria-label="Selected work">
      <div className="flex flex-col gap-3 sm:gap-4">
        <Marquee speed={34} direction="left" gap={14} className="py-2">
          {top.map((item, i) => (
            <ReelFrame key={item.id} item={item} index={i} />
          ))}
        </Marquee>
        <Marquee speed={26} direction="right" gap={14} className="py-2">
          {bottom.map((item, i) => (
            <ReelFrame key={item.id} item={item} index={i + 2} />
          ))}
        </Marquee>
      </div>
      <div className="container-x mt-5">
        <DrawLine axis="x" />
      </div>
    </div>
  );
}
