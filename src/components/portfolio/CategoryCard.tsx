import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import CountUp from '@/components/fx/CountUp';
import GlassCard from '@/components/fx/GlassCard';
import Marquee from '@/components/fx/Marquee';
import SplitText from '@/components/fx/SplitText';
import type { CategoryMeta } from './categories';
import type { CategoryStats } from './data';

interface CategoryCardProps {
  category: CategoryMeta;
  stats: CategoryStats;
  thumbs: string[];
  /** Position in the grid: drives the strip direction and speed. */
  index: number;
}

const TILE_PX = 136;
const TILE_HEIGHT_PX = 96;
const STRIP_GAP_PX = 10;

function unitSuffix(count: number, singular: string): string {
  return ` ${count === 1 ? singular : `${singular}s`}`;
}

/** Server-rendered card shell; GlassCard / Marquee / CountUp / SplitText are the client leaves. */
export default function CategoryCard({ category, stats, thumbs, index }: CategoryCardProps) {
  const Icon = category.icon;
  const style = {
    '--acc-from': category.accent.from,
    '--acc-to': category.accent.to,
  } as CSSProperties;
  const direction = index % 2 === 0 ? 'left' : 'right';
  const speed = 24 + (index % 3) * 7;

  return (
    <GlassCard href={`/portfolio/${category.id}`} tilt glow className="kp-card group">
      <span className="kp-card__hairline" aria-hidden="true" style={style} />
      <div className="kp-strip" style={style} aria-hidden="true">
        <Marquee speed={speed} direction={direction} gap={STRIP_GAP_PX}>
          {thumbs.map((src) => (
            <span key={src} className="kp-tile">
              <Image
                src={src}
                alt=""
                width={TILE_PX * 2}
                height={TILE_HEIGHT_PX * 2}
                sizes={`${TILE_PX}px`}
                draggable={false}
              />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6" style={style}>
        <div className="flex items-center gap-3.5">
          <span className="kp-icon-chip" aria-hidden="true">
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <h3 className="min-w-0 font-display text-xl font-semibold leading-tight text-cream-500 sm:text-[1.35rem]">
            <SplitText text={category.label} variant="mask" by="words" stagger={0.12} />
          </h3>
        </div>

        <p className="text-[0.9375rem] leading-relaxed text-cream-500/70 text-pretty">
          {category.blurb}
        </p>

        <p className="mt-auto flex flex-wrap items-center gap-x-2 text-sm tabular-nums text-cream-500/60">
          <span className="font-semibold text-secondary-400">
            <CountUp to={stats.projects} suffix={unitSuffix(stats.projects, 'Project')} duration={1.2} />
          </span>
          <span aria-hidden="true">&bull;</span>
          <span>
            <CountUp to={stats.assets} suffix={unitSuffix(stats.assets, 'Asset')} duration={1.6} />
          </span>
        </p>

        <span className="flex items-center gap-2 text-sm font-semibold text-secondary-400">
          View Portfolio
          <ArrowRight className="kp-card__arrow h-4 w-4" aria-hidden="true" />
          <span className="sr-only">: {category.label}</span>
        </span>
      </div>
    </GlassCard>
  );
}
