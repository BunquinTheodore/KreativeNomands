'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export interface UseInViewOptions {
  /** Stop observing after the first time the element becomes visible. */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

export interface UseInViewResult<T extends Element> {
  ref: RefObject<T>;
  inView: boolean;
}

/**
 * IntersectionObserver wrapper. `inView` is false on the server and on first
 * client render so markup is hydration-safe.
 */
export default function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {},
): UseInViewResult<T> {
  const { once = false, rootMargin = '0px', threshold = 0 } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1];
        if (!last) return;
        if (last.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}

export { useInView };
