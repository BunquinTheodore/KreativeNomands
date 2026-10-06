'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { observeShared } from '@/lib/observe';
import { whenSplashExit } from '@/lib/splash-state';

/**
 * idle  - server markup / pre-hydration: content is fully visible (no-JS and LCP safe)
 * armed - hidden, waiting for the element to scroll into view
 * in    - revealed (transition plays)
 */
export type RevealState = 'idle' | 'armed' | 'in';

interface Options {
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Drives scroll-reveal entrances. Content is visible in the server HTML and
 * only hidden (armed) after hydration, so crawlers and LCP are never blocked.
 * Reduced motion never arms. Elements already on screen while the splash is
 * still covering the page wait for the splash to leave.
 */
export default function useReveal<T extends HTMLElement>(
  options: Options = {},
): { ref: RefObject<T>; state: RevealState } {
  const { once = true, rootMargin = '0px 0px -8% 0px', threshold = 0.12 } = options;
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    setState('armed');
    let cancelSplash: () => void = () => undefined;
    let visible = false;
    let stop: () => void = () => undefined;

    stop = observeShared(el, { rootMargin, threshold }, (entry) => {
      visible = entry.isIntersecting;
      cancelSplash();
      if (visible) {
        cancelSplash = whenSplashExit(() => {
          if (visible) setState('in');
        });
        if (once) stop();
      } else if (!once) {
        setState('armed');
      }
    });

    return () => {
      stop();
      cancelSplash();
    };
  }, [once, rootMargin, threshold]);

  return { ref, state };
}

export { useReveal };
