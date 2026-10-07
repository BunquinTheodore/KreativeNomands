'use client';

import { useRef, type ReactNode, type RefObject } from 'react';
import FitLine from './FitLine';
import Reveal from './Reveal';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow: string;
  /** Always rendered on a single line (fluid size, shrinks to fit). */
  title: ReactNode;
  /** Single line, scaled so its width matches the title's width. */
  subtitle: string;
  align?: 'left' | 'center';
  /** Applied to the <h2> (use with aria-labelledby on the section). */
  id?: string;
}

const TITLE_MAX_PX = 64;
const TITLE_MIN_PX = 22;
/**
 * Phone sizing: 7.4vw (about 29px at 390) capped at 30px, never below 27px, and never below the
 * 5.4vw used from large phones up, so there is no jump. The longest real title ("We Are Kreativ
 * Nomads", about 11.7em wide) fits from 360px; narrower screens shrink via the JS fit, down to TITLE_MIN_PX.
 */
const TITLE_FLUID = 'max(27px, min(7.4vw, 30px), 5.4vw)';
const SUBTITLE_MIN_PX = 11;
const SUBTITLE_HARD_MIN_PX = 8;
const SUBTITLE_MAX_PX = 24;

/**
 * Eyebrow + one-line heading + one-line subtitle whose width equals the
 * heading's. The subtitle is nowrap with a fluid clamp() before JS runs, then
 * is fitted to the title's final width in the same batched pass as the title.
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  id,
}: SectionHeaderProps) {
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const subtitleWrapRef: RefObject<HTMLElement> = {
    get current() {
      return subtitleRef.current?.parentElement ?? null;
    },
  };
  const centered = align === 'center';

  return (
    <header className={cn('kn-section-header', centered ? 'text-center' : 'text-left')}>
      <Reveal>
        <p className={cn('eyebrow', centered && 'justify-center')}>{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08} className="kn-section-header__title">
        <h2 id={id} className="font-display font-semibold leading-[1.08] tracking-tight text-cream-500">
          <FitLine
            maxPx={TITLE_MAX_PX}
            minPx={TITLE_MIN_PX}
            fluid={TITLE_FLUID}
            match={{
              ref: subtitleRef,
              minPx: SUBTITLE_MIN_PX,
              maxPx: SUBTITLE_MAX_PX,
              hardMinPx: SUBTITLE_HARD_MIN_PX,
              fitWithin: subtitleWrapRef,
            }}
          >
            {title}
          </FitLine>
        </h2>
      </Reveal>
      <Reveal delay={0.16} className="kn-section-header__subwrap">
        <p ref={subtitleRef} className="kn-section-header__sub">
          {subtitle}
        </p>
      </Reveal>
    </header>
  );
}
