import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import FitLine from '@/components/fx/FitLine';
import Reveal from '@/components/fx/Reveal';
import SplitText from '@/components/fx/SplitText';
import Typewriter from '@/components/fx/Typewriter';
import Button from '@/components/ui/Button';
import { SERVICE_PHRASES } from './heroData';

/**
 * Hero copy block. The h1 is a single fitted line (container-relative size
 * before JS, shrink-to-fit after); "We Are" masks in, "Kreativ Nomads" rises
 * with a travelling gradient sweep, the services typewrite, the paragraph fades up.
 */
export default function HeroCopy() {
  return (
    <div className="hero-copy min-w-0">
      <Reveal y={16}>
        <span className="glass inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-300 sm:text-[0.8rem]">
          <Compass className="h-4 w-4 flex-none" aria-hidden="true" />
          <SplitText text="Your Creative Virtual Assistant" variant="scramble" by="chars" className="hero-eyebrow" />
        </span>
      </Reveal>

      <h1 id="hero-title" className="mt-6">
        <FitLine
          as="span"
          maxPx={92}
          minPx={22}
          fluid="8.4cqw"
          className="font-display font-bold leading-[1.12] tracking-tight text-cream-500"
        >
          <SplitText text="We Are" variant="mask" by="chars" stagger={0.05} />{' '}
          <SplitText text="Kreativ Nomads" variant="rise" by="chars" stagger={0.045} className="hero-sweep" />
        </FitLine>
      </h1>

      <p
        className="mt-5 flex min-h-[2.2em] items-center gap-2.5 whitespace-nowrap font-display font-medium text-cream-500/90"
        style={{ fontSize: 'clamp(1.02rem, 4.6vw, 1.55rem)' }}
      >
        <Sparkles className="h-[1.1em] w-[1.1em] flex-none text-secondary-400" aria-hidden="true" />
        <span className="hidden text-[var(--ink-dim)] sm:inline">Nomads for</span>
        <Typewriter phrases={SERVICE_PHRASES} className="text-secondary-400" />
      </p>

      <Reveal y={18} delay={0.15}>
        <p className="measure mt-5 text-pretty text-base leading-relaxed text-[var(--ink-dim)] sm:text-lg sm:leading-[1.75]">
          A creative agency of experienced freelancers providing fresh and compelling creative solutions to address
          your marketing and communication challenges.
        </p>
      </Reveal>

      <Reveal y={18} delay={0.28}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button
            href="#contact"
            magnetic
            icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
            className="px-8 py-4 text-base"
          >
            Inquire Today
          </Button>
          <Button
            href="#portfolio"
            variant="glass"
            magnetic
            icon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
            iconPosition="right"
            className="px-8 py-4 text-base"
          >
            View Our Work
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
