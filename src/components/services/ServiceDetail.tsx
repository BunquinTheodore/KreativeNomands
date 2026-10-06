'use client';

import type { CSSProperties } from 'react';
import { ArrowUpRight, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import FitLine from '@/components/fx/FitLine';
import GlassCard from '@/components/fx/GlassCard';
import SplitText from '@/components/fx/SplitText';
import Button from '@/components/ui/Button';
import type { Service } from './data';

interface ServiceDetailProps {
  service: Service;
  index: number;
  total: number;
  /** 'out' fades the current content away before the next service is shown. */
  phase: 'in' | 'out';
  onPrev: () => void;
  onNext: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

const ARROW_BUTTON =
  'glass inline-flex h-11 w-11 items-center justify-center rounded-full text-cream-500 transition-colors hover:text-secondary-400 focus-visible:outline-2';

/**
 * Glass detail panel for the active service. The inner block is keyed by the
 * service id so each change replays the entrance (title flip, staggered
 * bullets); `phase` drives the fade-out half of the crossfade.
 */
export default function ServiceDetail({ service, index, total, phase, onPrev, onNext }: ServiceDetailProps) {
  const Icon = service.icon;

  return (
    <GlassCard glow className="flex min-h-[27rem] flex-col p-6 sm:p-8 lg:p-10">
      <div className="svc-swap flex flex-1 flex-col" data-phase={phase}>
        <div key={service.id} className="svc-enter flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary-400/30 bg-secondary-500/10 text-secondary-400 shadow-[0_0_30px_-8px_rgba(245,158,11,0.55)]">
              <Icon className="h-7 w-7" aria-hidden="true" />
            </span>
            <p aria-hidden="true" className="font-display text-sm tabular-nums tracking-[0.3em] text-cream-500/55">
              {pad(index + 1)} / {pad(total)}
            </p>
          </div>

          <p className="eyebrow mt-7">Nomads for</p>
          <h3 className="mt-3 font-display font-semibold leading-tight text-cream-500">
            <FitLine maxPx={36} minPx={16} fluid="5vw">
              <SplitText text={service.title} variant="flip" by="words" stagger={0.12} />
            </FitLine>
          </h3>

          <p className="measure mt-5 text-base leading-[1.75] text-cream-500/75 text-pretty">
            {service.description}
          </p>

          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2" aria-label={`${service.title} includes`}>
            {service.features.map((feature, i) => (
              <li
                key={feature}
                data-sfx-hover=""
                style={{ '--i': i } as CSSProperties}
                className="svc-bullet flex items-center gap-3 rounded-xl border border-cream-500/10 bg-cream-500/[0.04] px-4 py-3 text-sm text-cream-500/90 transition-colors hover:border-secondary-400/40 hover:bg-secondary-500/10"
              >
                <Check className="h-4 w-4 flex-none text-secondary-400" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="glass"
          href={service.portfolioHref}
          icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
          iconPosition="right"
        >
          Explore related work
        </Button>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Previous service" data-sfx="prev" onClick={onPrev} className={ARROW_BUTTON}>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Next service" data-sfx="next" onClick={onNext} className={ARROW_BUTTON}>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
