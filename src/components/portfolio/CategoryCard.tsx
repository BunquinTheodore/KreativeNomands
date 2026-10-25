import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowRight, FileText } from 'lucide-react';
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
/** Faux text lines on the case-study tiles (width in %), so they read as documents; three leave room for a 2-line label. */
const DOC_LINES = [92, 78, 54] as const;

function unitSuffix(count: number, singular: string): string {
  return ` ${count === 1 ? singular : `${singular}s`}`;
}

/** Strip tiles for a service with nothing to picture (text-only case studies): one "document" per industry. */
function DocTiles({ category }: { category: CategoryMeta }) {
  const labels = category.industries.length > 0 ? category.industries : [category.label];
  return (
    <>
      {labels.map((label) => (
        <span key={label} className="kp-tile kp-tile--doc">
          {/* One row at every width: a wrapped kicker would squeeze the label in the short phone tile. */}
          <span className="flex min-w-0 flex-none items-center gap-1.5 max-sm:gap-1">
            <FileText
              className="h-3.5 w-3.5 flex-none text-secondary-400 max-sm:h-3 max-sm:w-3"
              strokeWidth={2.2}
            />
            <span className="min-w-0 truncate text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cream-500/55 max-sm:text-[0.55rem] max-sm:tracking-[0.08em]">
              Case Study
            </span>
          </span>
          {/* Wraps to 2 lines rather than clipping ("Food & Beverage" is wider than the tile). flex-none keeps
              line-clamp's overflow:hidden from letting the column shrink it; sm:leading-* survives sm:text-sm. */}
          <span className="line-clamp-2 flex-none font-display text-xs font-semibold leading-[1.15] text-cream-500 sm:text-sm sm:leading-[1.15]">
            {label}
          </span>
          {/* Phones: the shorter tile keeps the header and label only. The lines give way first if space runs out. */}
          <span className="flex min-h-0 flex-col gap-1 overflow-hidden max-sm:hidden">
            {DOC_LINES.map((width) => (
              <span key={width} className="kp-tile__line" style={{ width: `${width}%` }} />
            ))}
          </span>
        </span>
      ))}
    </>
  );
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
        <Marquee speed={speed} direction={direction} gap={STRIP_GAP_PX} deferChildren>
          {thumbs.length > 0 ? (
            thumbs.map((src) => (
              <span key={src} className="kp-tile">
                <Image
                  src={src}
                  alt=""
                  width={TILE_PX * 2}
                  height={TILE_HEIGHT_PX * 2}
                  sizes={`${TILE_PX}px`}
                  draggable={false}
                  referrerPolicy="no-referrer"
                />
              </span>
            ))
          ) : (
            <DocTiles category={category} />
          )}
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

        {category.industries.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Industries served">
            {category.industries.map((industry) => (
              <li key={industry} className="kp-tag">
                {industry}
              </li>
            ))}
          </ul>
        ) : null}

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
