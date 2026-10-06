'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import DrawLine from '@/components/fx/DrawLine';
import GlassCard from '@/components/fx/GlassCard';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { PROCESS_STEPS } from './data';

const LIT_THRESHOLD = 0.4;

/**
 * Four-step process. Horizontal on desktop with a sideways DrawLine, vertical
 * with a downward DrawLine below `lg`. Steps light up in sequence as they scroll
 * into view (one IntersectionObserver); desktop adds a stagger since the whole
 * row enters at once. Before hydration (and with reduced motion) all steps are lit.
 */
export default function ProcessStepper() {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();
  const [armed, setArmed] = useState(false);
  const [lit, setLit] = useState<readonly number[]>([]);

  useEffect(() => {
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setArmed(false);
      return undefined;
    }
    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.index);
          setLit((current) => (current.includes(index) ? current : [...current, index]));
          observer.unobserve(entry.target);
        });
      },
      { threshold: LIT_THRESHOLD, rootMargin: '0px 0px -8% 0px' },
    );
    itemRefs.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div ref={rootRef} className="svc-steps relative" data-armed={armed}>
      <div aria-hidden="true" className="absolute left-0 right-0 top-[11px] hidden lg:block">
        <DrawLine axis="x" targetRef={rootRef} />
      </div>
      <div aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-0.5 lg:hidden">
        <DrawLine axis="y" targetRef={rootRef} />
      </div>

      <ol className="grid gap-5 pl-10 lg:grid-cols-4 lg:gap-5 lg:pl-0 lg:pt-12">
        {PROCESS_STEPS.map((step, index) => (
          <li
            key={step.step}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            data-index={index}
            data-lit={!armed || lit.includes(index)}
            style={{ '--i': index } as CSSProperties}
            className="svc-step relative"
          >
            <span
              aria-hidden="true"
              className="svc-step__node absolute -left-[35px] top-8 h-3.5 w-3.5 rounded-full border-2 border-primary-300/70 bg-primary-950 lg:-top-[43px] lg:left-6"
            />
            <GlassCard tilt className="h-full p-6">
              <span className="svc-step__badge inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream-500/20 font-display text-lg font-semibold text-cream-500/80">
                {step.step}
              </span>
              <h4 className="mt-4 font-display text-lg font-semibold leading-snug text-cream-500">
                {step.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-cream-500/70 text-pretty">
                {step.description}
              </p>
            </GlassCard>
          </li>
        ))}
      </ol>
    </div>
  );
}
