import { Compass, Home } from 'lucide-react';
import AnimatedLogo from '@/components/fx/AnimatedLogo';
import FitLine from '@/components/fx/FitLine';
import Reveal from '@/components/fx/Reveal';
import SplitText from '@/components/fx/SplitText';
import Button from '@/components/ui/Button';

/** On-brand 404: the North Star keeps shining while the page is lost. */
export default function NotFound() {
  return (
    <main className="container-x flex min-h-[100svh] flex-col items-center justify-center py-16 text-center">
      <Reveal>
        <div className="glass-strong shine relative flex h-40 w-40 items-center justify-center rounded-full sm:h-48 sm:w-48">
          <AnimatedLogo size={112} loop />
        </div>
      </Reveal>

      <p className="eyebrow mt-10 justify-center" aria-hidden="true">
        Error 404
      </p>
      <p
        className="mt-3 font-display text-[clamp(4.5rem,22vw,9rem)] font-semibold leading-none tracking-tight text-secondary-400"
        aria-hidden="true"
      >
        <SplitText text="404" variant="scramble" />
      </p>

      <h1 className="mt-4 w-full max-w-2xl font-display font-semibold tracking-tight text-cream-500">
        <FitLine maxPx={44} minPx={20} fluid="6.4vw">
          Lost your way, nomad?
        </FitLine>
      </h1>

      <Reveal delay={0.12}>
        <p className="measure mx-auto mt-5 text-balance text-base leading-relaxed text-[color:var(--ink-dim)]">
          This page wandered off the map. Follow the North Star back home, or tell us what you were
          looking for and we&apos;ll point the way.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" magnetic icon={<Home className="h-4 w-4" aria-hidden="true" />}>
            Back to home
          </Button>
          <Button
            variant="glass"
            href="/#contact"
            icon={<Compass className="h-4 w-4" aria-hidden="true" />}
          >
            Contact us
          </Button>
        </div>
      </Reveal>
    </main>
  );
}
