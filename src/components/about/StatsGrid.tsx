import CountUp from '@/components/fx/CountUp';
import GlassCard from '@/components/fx/GlassCard';
import SplitText from '@/components/fx/SplitText';
import { STATS } from './data';

/**
 * Four glass stat tiles (continuous shine, hover tilt). Numbers count up;
 * the year scrambles in instead, since a count-up would add a thousands separator.
 */
export default function StatsGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4" aria-label="Kreativ Nomads at a glance">
      {STATS.map((stat) => (
        <li key={stat.label} className="min-w-0">
          <GlassCard tilt className="flex h-full flex-col justify-between gap-2 p-4 sm:p-5">
            <p className="about-sweep font-display text-3xl font-semibold leading-none sm:text-4xl">
              {stat.text ? (
                <SplitText text={stat.text} variant="scramble" by="chars" stagger={0.06} />
              ) : (
                <CountUp to={stat.to ?? 0} suffix={stat.suffix} duration={1.8} />
              )}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-cream-500/70 sm:text-[0.8rem]">
              {stat.label}
            </p>
          </GlassCard>
        </li>
      ))}
    </ul>
  );
}
