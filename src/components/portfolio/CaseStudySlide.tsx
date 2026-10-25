'use client';

import { useId } from 'react';
import { m, type Variants } from 'framer-motion';
import { Check, FileText, Lock } from 'lucide-react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import type { ShowcaseAsset } from './data';

interface CaseStudySlideProps {
  asset: ShowcaseAsset;
  /**
   * Stagger the sections in. Off for the server-rendered first slide, so its text (the page's LCP)
   * is visible in the HTML instead of waiting at opacity 0 for hydration.
   */
  animateIn: boolean;
}

const STAGGER_S = 0.07;

const LIST: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER_S, delayChildren: 0.12 } },
};

const ITEM: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

/** "01" numbering, as in the client's write-ups. */
function ordinal(index: number): string {
  return String(index + 1).padStart(2, '0');
}

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h3
      id={id}
      className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-400"
    >
      {children}
      <span className="h-px flex-1 bg-gradient-to-r from-secondary-400/40 to-transparent" aria-hidden="true" />
    </h3>
  );
}

/**
 * Text-only case study (work that cannot be shown): a scrollable glass panel
 * filling the stage with the title, meta chips, overview, numbered key
 * contributions, expertise chips and the confidentiality note.
 */
export default function CaseStudySlide({ asset, animateIn }: CaseStudySlideProps) {
  const baseId = useId();
  const reduced = usePrefersReducedMotion();
  const study = asset.caseStudy;
  const title = study?.title ?? asset.title;
  const ids = {
    title: `${baseId}-title`,
    overview: `${baseId}-overview`,
    contributions: `${baseId}-contributions`,
    expertise: `${baseId}-expertise`,
  };

  return (
    <>
      <span className="kp-case-backdrop absolute inset-0" aria-hidden="true" />
      <article
        aria-labelledby={ids.title}
        // Focusable so keyboard users can scroll the panel with the arrow / page / Home / End keys.
        tabIndex={0}
        data-kp-selectable=""
        className="kp-case z-[1] overflow-y-auto overscroll-contain select-text"
      >
        <m.div
          variants={LIST}
          initial={animateIn && !reduced ? 'hidden' : false}
          animate="show"
          className="mx-auto flex w-full max-w-4xl flex-col gap-7 px-4 pb-6 pt-4 sm:gap-8 sm:px-20 sm:pb-12 sm:pt-20"
        >
          <m.header variants={ITEM} className="flex flex-col gap-4">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cream-500/60">
              <FileText className="h-4 w-4 text-secondary-400" aria-hidden="true" />
              Case Study
            </p>
            <h2
              id={ids.title}
              className="font-display text-2xl font-semibold leading-tight text-cream-500 text-balance sm:text-4xl"
            >
              {title}
            </h2>
            {study && study.meta.length > 0 ? (
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {study.meta.map((row) => (
                  <div key={row.label} className="kp-case-meta glass">
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-secondary-400">
                      {row.label}
                    </dt>
                    <dd className="m-0 text-sm leading-snug text-cream-500 text-pretty">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </m.header>

          {study ? (
            <>
              <m.section variants={ITEM} aria-labelledby={ids.overview} className="flex flex-col gap-3">
                <SectionTitle id={ids.overview}>Overview</SectionTitle>
                <p className="border-l-2 border-secondary-400/60 pl-4 text-[0.9375rem] leading-relaxed text-cream-500/85 text-pretty sm:text-base">
                  {study.overview}
                </p>
              </m.section>

              {study.contributions.length > 0 ? (
                <m.section variants={ITEM} aria-labelledby={ids.contributions} className="flex flex-col gap-3">
                  <SectionTitle id={ids.contributions}>Key Contributions</SectionTitle>
                  <ol className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2">
                    {study.contributions.map((item, index) => (
                      <li key={item.title} className="kp-case-card glass">
                        <p className="font-display text-sm font-semibold tabular-nums text-secondary-400" aria-hidden="true">
                          {ordinal(index)}
                        </p>
                        <h4 className="font-display text-base font-semibold leading-snug text-cream-500 text-balance sm:text-lg">
                          {item.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-cream-500/75 text-pretty">{item.body}</p>
                      </li>
                    ))}
                  </ol>
                </m.section>
              ) : null}

              {study.expertise.length > 0 ? (
                <m.section variants={ITEM} aria-labelledby={ids.expertise} className="flex flex-col gap-3">
                  <SectionTitle id={ids.expertise}>Areas of Expertise</SectionTitle>
                  <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                    {study.expertise.map((skill) => (
                      <li key={skill} className="kp-case-tag">
                        <Check className="h-3.5 w-3.5 flex-none text-secondary-400" aria-hidden="true" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </m.section>
              ) : null}

              {study.note ? (
                <m.p
                  variants={ITEM}
                  className="flex items-start gap-2 border-t border-cream-500/10 pt-4 text-sm italic leading-relaxed text-cream-500/60"
                >
                  <Lock className="mt-0.5 h-4 w-4 flex-none text-secondary-400/80" aria-hidden="true" />
                  {study.note}
                </m.p>
              ) : null}
            </>
          ) : null}
        </m.div>
      </article>
    </>
  );
}
