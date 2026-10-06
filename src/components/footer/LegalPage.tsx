import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AnimatedLogo from '@/components/fx/AnimatedLogo';
import DrawLine from '@/components/fx/DrawLine';
import FitLine from '@/components/fx/FitLine';
import Reveal from '@/components/fx/Reveal';
import SectionHeader from '@/components/fx/SectionHeader';
import Button from '@/components/ui/Button';

/*
 * LEGAL REVIEW REQUIRED
 * The Privacy Policy and Terms of Service rendered through this component are
 * generic placeholders written for a creative agency in the Philippines. They
 * have NOT been reviewed by counsel and must be reviewed (and adapted to the
 * actual data flows, vendors and engagement terms) by a qualified Philippine
 * lawyer before launch. The UI deliberately does not claim legal validity.
 */

export interface LegalSection {
  readonly id: string;
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly items?: readonly string[];
  readonly closing?: string;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
}

/** Slim top bar: logo + "Back home". */
function LegalTopBar() {
  return (
    <header className="glass sticky top-0 z-30 rounded-none border-x-0 border-t-0">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 rounded-full" aria-label="Kreativ Nomads home">
          <AnimatedLogo size={36} loop={false} />
          <span className="font-display text-base font-semibold tracking-tight text-cream-500">
            Kreativ Nomads
          </span>
        </Link>
        <Button variant="glass" href="/" icon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}>
          Back home
        </Button>
      </div>
    </header>
  );
}

/** Shared layout for /privacy and /terms: top bar, one-line header, contents chips, glass article. */
export default function LegalPage({ eyebrow, title, subtitle, updated, intro, sections }: LegalPageProps) {
  return (
    <>
      <LegalTopBar />
      <main className="container-x section-y" aria-labelledby="legal-heading">
        <SectionHeader align="center" id="legal-heading" eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <Reveal delay={0.15}>
          <p className="measure mx-auto mt-8 text-center text-[0.95rem] leading-relaxed text-[color:var(--ink-dim)]">
            {intro}
          </p>
          <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-secondary-400">{updated}</p>
        </Reveal>

        <nav aria-label="On this page" className="mx-auto mt-10 max-w-3xl">
          <ul className="flex flex-wrap justify-center gap-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  data-sfx-hover=""
                  className="glass inline-flex rounded-full px-4 py-2 text-sm text-[color:var(--ink-dim)] transition-colors hover:text-secondary-300"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="glass shine relative mx-auto mt-10 max-w-3xl rounded-3xl p-6 sm:p-10 lg:p-12">
          <div className="absolute inset-y-6 left-3 hidden w-0.5 sm:block">
            <DrawLine axis="y" />
          </div>
          <div className="space-y-10 sm:pl-6">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-24"
              >
                <h2
                  id={`${section.id}-title`}
                  className="font-display font-semibold leading-snug text-cream-500"
                >
                  <FitLine maxPx={24} minPx={14} fluid="5.6vw">
                    {section.heading}
                  </FitLine>
                </h2>
                {section.paragraphs?.map((text) => (
                  <p key={text} className="measure mt-3 text-[0.98rem] leading-[1.8] text-[color:var(--ink-dim)]">
                    {text}
                  </p>
                ))}
                {section.items ? (
                  <ul className="measure mt-3 list-disc space-y-2 pl-5 text-[0.98rem] leading-[1.75] text-[color:var(--ink-dim)] marker:text-secondary-500">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.closing ? (
                  <p className="measure mt-3 text-[0.98rem] leading-[1.8] text-[color:var(--ink-dim)]">
                    {section.closing}
                  </p>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
