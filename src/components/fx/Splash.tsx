'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import AnimatedLogo from './AnimatedLogo';
import { markSplashExit } from '@/lib/splash-state';

const WORDMARK = 'Kreativ Nomads';
/** Safety net if animation events never fire (e.g. background tab, no CSS). */
const FALLBACK_REMOVE_MS = 4200;
const EXIT_ANIMATIONS = new Set(['kn-splash-out', 'kn-splash-fade']);

/**
 * Full-screen intro. It is part of the server HTML so it paints on the first
 * frame, plays ~1.8s of pure CSS/SVG animation, slides away and unmounts.
 * The page underneath renders normally (no LCP blocking) and html scroll is
 * locked by CSS (`html:has(.kn-splash)`) only while the overlay exists.
 */
export default function Splash() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const exitStarted = (): boolean => {
      if (typeof el.getAnimations !== 'function' || typeof CSSAnimation === 'undefined') return false;
      return el.getAnimations().some(
        (a) =>
          a instanceof CSSAnimation &&
          EXIT_ANIMATIONS.has(a.animationName) &&
          // currentTime counts the start delay, so compare against it.
          Number(a.currentTime ?? 0) >= Number(a.effect?.getComputedTiming().delay ?? 0),
      );
    };
    if (exitStarted()) markSplashExit('exit');

    const onStart = (event: AnimationEvent) => {
      if (event.target === el && EXIT_ANIMATIONS.has(event.animationName)) markSplashExit('exit');
    };
    const finish = () => {
      markSplashExit('done');
      setGone(true);
    };
    const onEnd = (event: AnimationEvent) => {
      if (event.target === el && EXIT_ANIMATIONS.has(event.animationName)) finish();
    };
    el.addEventListener('animationstart', onStart);
    el.addEventListener('animationend', onEnd);
    const fallback = window.setTimeout(finish, FALLBACK_REMOVE_MS);

    return () => {
      el.removeEventListener('animationstart', onStart);
      el.removeEventListener('animationend', onEnd);
      window.clearTimeout(fallback);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className="kn-splash"
      role="status"
      aria-live="polite"
      aria-label="Loading Kreativ Nomads"
      data-sfx="none"
    >
      <div className="kn-splash__glow" aria-hidden="true" />
      <div className="kn-splash__inner">
        <AnimatedLogo size={132} loop className="kn-splash__logo" />
        <p className="kn-splash__word" aria-hidden="true">
          {WORDMARK.split('').map((char, i) => (
            <span
              key={`${char}-${i}`}
              className="kn-splash__char"
              style={{ '--i': i } as CSSProperties}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>
        <div className="kn-splash__bar" aria-hidden="true">
          <span className="kn-splash__fill" />
        </div>
      </div>
    </div>
  );
}
