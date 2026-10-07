'use client';

import { useRef, type RefObject } from 'react';
import FitLine from '@/components/fx/FitLine';
import Reveal from '@/components/fx/Reveal';

interface LegalHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Applied to the <h1> (the page's aria-labelledby target). */
  id: string;
}

const TITLE_MAX_PX = 56;
/** Floor sits above the section headings' 24px ceiling so the h1 always outranks them. */
const TITLE_MIN_PX = 28;
const SUBTITLE_MIN_PX = 11;
const SUBTITLE_MAX_PX = 22;
const SUBTITLE_HARD_MIN_PX = 8;

/**
 * Page header for the legal routes: eyebrow, the single page <h1> and a subtitle
 * fitted to the title's width. Mirrors SectionHeader's treatment, one level up.
 */
export default function LegalHeader({ eyebrow, title, subtitle, id }: LegalHeaderProps) {
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const subtitleWrapRef: RefObject<HTMLElement> = {
    get current() {
      return subtitleRef.current?.parentElement ?? null;
    },
  };

  return (
    <header className="kn-section-header text-center">
      <Reveal>
        <p className="eyebrow justify-center">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08} className="kn-section-header__title">
        <h1 id={id} className="font-display font-semibold leading-[1.08] tracking-tight text-cream-500">
          <FitLine
            maxPx={TITLE_MAX_PX}
            minPx={TITLE_MIN_PX}
            fluid="9vw"
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
        </h1>
      </Reveal>
      <Reveal delay={0.16} className="kn-section-header__subwrap">
        <p ref={subtitleRef} className="kn-section-header__sub">
          {subtitle}
        </p>
      </Reveal>
    </header>
  );
}
