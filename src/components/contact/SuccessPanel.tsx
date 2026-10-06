'use client';

import { forwardRef, type CSSProperties } from 'react';
import Button from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';

const PARTICLE_COUNT = 16;
const COLORS = ['#fbbf24', '#f5f0dc', '#8db1b1', '#f59e0b'] as const;

interface Particle {
  key: number;
  style: CSSProperties;
}

/** Deterministic spread so server and client markup always agree. */
const PARTICLES: readonly Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (i % 2 ? 0.18 : 0);
  const distance = 74 + ((i * 37) % 46);
  return {
    key: i,
    style: {
      '--dx': `${(Math.cos(angle) * distance).toFixed(1)}px`,
      '--dy': `${(Math.sin(angle) * distance).toFixed(1)}px`,
      '--rot': `${(i % 2 ? 1 : -1) * (120 + ((i * 53) % 200))}deg`,
      '--c': COLORS[i % COLORS.length],
      '--d': `${(0.5 + (i % 4) * 0.04).toFixed(2)}s`,
    } as CSSProperties,
  };
});

interface SuccessPanelProps {
  onReset: () => void;
}

/**
 * Shown in place of the form after a successful send: a drawn checkmark and a
 * ring of CSS confetti. Focus is moved here by the parent (tabIndex -1) so
 * keyboard and screen-reader users land on the confirmation.
 */
const SuccessPanel = forwardRef<HTMLDivElement, SuccessPanelProps>(function SuccessPanel(
  { onReset },
  ref,
) {
  return (
    <div ref={ref} className="kn-success" role="status" tabIndex={-1} aria-labelledby="contact-success-title">
      <div className="kn-success__mark" aria-hidden="true">
        <svg className="kn-success__svg" viewBox="0 0 100 100">
          <circle className="kn-success__ring" cx="50" cy="50" r="44" pathLength={1} />
          <path className="kn-success__check" d="M30 52l14 14 27-30" pathLength={1} />
        </svg>
        <div className="kn-burst">
          {PARTICLES.map((particle) => (
            <span key={particle.key} className="kn-burst__p" style={particle.style} />
          ))}
        </div>
      </div>
      <h3 id="contact-success-title" className="font-display text-2xl font-semibold text-cream-500">
        Message sent
      </h3>
      <p className="measure text-[0.98rem] leading-relaxed text-[color:var(--ink-dim)]">
        Thank you! We&apos;ll get back to you soon.
      </p>
      <Button variant="glass" onClick={onReset} icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}>
        Send another message
      </Button>
    </div>
  );
});

export default SuccessPanel;
