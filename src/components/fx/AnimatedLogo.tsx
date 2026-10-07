'use client';

import { useId, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

/*
 * Kreativ Nomads "North Star" mark, traced from the supplied PNG logo
 * (centre at 0,0; vertical arm 295, horizontal arm 267, diagonals 246,
 * ring radius 174). Four cardinal blades, four diagonal blades and a ring.
 */
const VERTICAL_BLADE =
  'M0-295Q8-130 27-40L27 40Q8 130 0 295Q-8 130-27 40L-27-40Q-8-130 0-295Z';
const HORIZONTAL_BLADE =
  'M-267 0Q-130-18-44-30L44-30Q130-18 267 0Q130 18 44 30L-44 30Q-130 18-267 0Z';
const DIAGONAL_BLADE =
  'M0-246Q6-130 16-34L16 34Q6 130 0 246Q-6 130-16 34L-16-34Q-6-130 0-246Z';
const RING_RADIUS = 174;
const ORBIT_RADIUS = 212;

interface AnimatedLogoProps {
  /** Rendered width/height in px. */
  size?: number;
  /** Keep shimmering and orbiting after the draw-in finishes. */
  loop?: boolean;
  className?: string;
}

interface Piece {
  key: string;
  delay: number;
  draw: string;
  transform?: string;
}

const BLADES: readonly Piece[] = [
  { key: 'v', delay: 0.15, draw: VERTICAL_BLADE },
  { key: 'h', delay: 0.3, draw: HORIZONTAL_BLADE },
  { key: 'd1', delay: 0.45, draw: DIAGONAL_BLADE, transform: 'rotate(45)' },
  { key: 'd2', delay: 0.55, draw: DIAGONAL_BLADE, transform: 'rotate(-45)' },
];

/**
 * Inline-SVG North Star: strokes draw in, then fill; optional orbiting spark
 * on the ring and a soft shimmer sweep. All animation is CSS transform/opacity
 * (see fx.css), so it renders in server HTML and honours reduced motion.
 */
export default function AnimatedLogo({ size = 96, loop = true, className }: AnimatedLogoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipId = `kn-clip-${uid}`;
  const sheenId = `kn-sheen-${uid}`;

  return (
    <svg
      className={cn('kn-logo', loop && 'kn-logo--loop', className)}
      width={size}
      height={size}
      viewBox="-310 -310 620 620"
      role="img"
      aria-label="Kreativ Nomads North Star"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          {BLADES.map((b) => (
            <path key={b.key} d={b.draw} transform={b.transform} />
          ))}
        </clipPath>
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle
        className="kn-logo__ink kn-logo__ring"
        r={RING_RADIUS}
        pathLength={1}
        style={{ '--d': '0s' } as CSSProperties}
      />
      {BLADES.map((b) => (
        <path
          key={b.key}
          className="kn-logo__ink"
          d={b.draw}
          transform={b.transform}
          pathLength={1}
          style={{ '--d': `${b.delay}s` } as CSSProperties}
        />
      ))}

      {loop && (
        <>
          <g clipPath={`url(#${clipId})`} aria-hidden="true">
            <polygon
              className="kn-logo__sheen"
              points="-36,-320 24,-320 -12,320 -72,320"
              fill={`url(#${sheenId})`}
            />
          </g>
          <g className="kn-logo__orbit" aria-hidden="true">
            <circle r={ORBIT_RADIUS} fill="none" stroke="none" />
            <circle className="kn-logo__spark" cx="0" cy={-ORBIT_RADIUS} r="9" />
          </g>
        </>
      )}
    </svg>
  );
}
