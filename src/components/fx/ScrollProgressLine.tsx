'use client';

import { useEffect, useRef } from 'react';

/**
 * Global scroll progress: a thin line on the left edge (md+) or the top edge
 * (mobile). Progress is exposed as CSS variables on one element, updated in a
 * rAF-throttled passive scroll handler; the visual is transform-only.
 */
export default function ScrollProgressLine() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let frame = 0;
    let range = 1;

    const measure = () => {
      range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const paint = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / range));
      root.style.setProperty('--p', p.toFixed(4));
      root.style.setProperty('--hx', `${(p * window.innerWidth).toFixed(1)}px`);
      root.style.setProperty('--hy', `${(p * window.innerHeight).toFixed(1)}px`);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure, { passive: true });
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(remeasure) : null;
    observer?.observe(document.body);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="kn-progress" aria-hidden="true">
      <span className="kn-progress__fill" />
      <span className="kn-progress__head" />
    </div>
  );
}
