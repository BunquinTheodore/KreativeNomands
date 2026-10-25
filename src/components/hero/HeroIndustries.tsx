import type { CSSProperties } from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  Building2,
  Cpu,
  Gem,
  HeartPulse,
  PartyPopper,
  ShieldCheck,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import Reveal from '@/components/fx/Reveal';
import { INDUSTRIES } from './heroData';

const ICONS: Record<string, LucideIcon> = {
  realestate: Building2,
  fnb: UtensilsCrossed,
  insurance: ShieldCheck,
  health: HeartPulse,
  events: PartyPopper,
  it: Cpu,
  ai: BrainCircuit,
  wedding: Gem,
};

/** "Trusted by brands across industries" strip: glass chips deep-linking to the work for each industry. */
export default function HeroIndustries() {
  return (
    <Reveal y={16} className="container-x">
      <div className="flex flex-col items-center gap-5 border-t border-[var(--glass-border)] pt-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-dim)] sm:text-sm">
          Trusted by brands across industries
        </p>
        <ul className="flex max-w-6xl flex-wrap items-center justify-center gap-2 sm:gap-3">
          {INDUSTRIES.map((industry, i) => {
            const Icon = ICONS[industry.id] ?? Building2;
            return (
              <li key={industry.id}>
                <Link
                  href={industry.href}
                  data-sfx-hover
                  style={{ '--shine-delay': `${i * 0.7}s` } as CSSProperties}
                  className="hero-chip glass shine inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[0.8rem] font-medium text-cream-500/80 sm:px-4 sm:text-sm"
                >
                  <Icon className="h-4 w-4 flex-none text-secondary-400" aria-hidden="true" />
                  <span className="relative z-10">{industry.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}
