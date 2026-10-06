'use client';

import { useCallback, useRef, type ReactNode } from 'react';
import FitLine from './FitLine';
import Reveal from './Reveal';
import { fitToWidth } from '@/lib/fit';
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
const SUBTITLE_MIN_PX = 11;
const SUBTITLE_HARD_MIN_PX = 8;
const SUBTITLE_MAX_PX = 24;

/**
 * Eyebrow + one-line heading + one-line subtitle whose width equals the
 * heading's. The subtitle is nowrap with a fluid clamp() before JS runs, then
 * is fitted to the measured title width after every title fit.
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  id,
}: SectionHeaderProps) {
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const matchSubtitle = useCallback((titleWidth: number) => {
    const el = subtitleRef.current;
    if (!el) return;
    const width = fitToWidth(el, titleWidth, { minPx: SUBTITLE_MIN_PX, maxPx: SUBTITLE_MAX_PX });
    // At the readable floor a long subtitle can outgrow the column; shrink further than
    // SUBTITLE_MIN_PX rather than clip it.
    const available = el.parentElement?.clientWidth ?? 0;
    if (available > 0 && width > available) {
      const current = parseFloat(getComputedStyle(el).fontSize) || SUBTITLE_MIN_PX;
      el.style.fontSize = `${Math.max(SUBTITLE_HARD_MIN_PX, Math.floor(current * (available / width) * 100) / 100)}px`;
    }
  }, []);

  const centered = align === 'center';

  return (
    <header className={cn('kn-section-header', centered ? 'text-center' : 'text-left')}>
      <Reveal>
        <p className={cn('eyebrow', centered && 'justify-center')}>{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08} className="kn-section-header__title">
        <h2 id={id} className="font-display font-semibold leading-[1.08] tracking-tight text-cream-500">
          <FitLine maxPx={TITLE_MAX_PX} minPx={TITLE_MIN_PX} fluid="5.4vw" onFit={matchSubtitle}>
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
