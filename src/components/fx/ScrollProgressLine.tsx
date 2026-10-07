'use client';

import { useEffect, useRef } from 'react';

/**
 * Global scroll progress: a thin line on the left edge (md+) or the top edge
 * (mobile). Progress is exposed as CSS variables on one element, updated in a
 * rAF-throttled passive scroll handler; the visual is transform-only.
 *
 * Layout is only ever read inside a ResizeObserver callback (layout is already clean
 * there) and scrollY inside the scroll event, so mounting this never forces a reflow.
 */
export default function ScrollProgressLine() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let frame = 0;
    let range = 1;
    let scrollY = 0;

    const paint = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, scrollY / range));
      root.style.setProperty('--p', p.toFixed(4));
      root.style.setProperty('--hx', `${(p * window.innerWidth).toFixed(1)}px`);
      root.style.setProperty('--hy', `${(p * window.innerHeight).toFixed(1)}px`);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const onScroll = () => {
      scrollY = window.scrollY;
      schedule();
    };
    const onResizeObserved = () => {
      range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollY = window.scrollY;
      schedule();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResizeObserved, { passive: true });
    // Fires once right after the first layout, then on every document height change (viewport-only
    // height changes are covered by the resize listener, which re-reads the scroll range).
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResizeObserved) : null;
    observer?.observe(document.body);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResizeObserved);
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
