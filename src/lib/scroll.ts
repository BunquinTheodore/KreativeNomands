'use client';

import { useEffect, useState } from 'react';

const DEFAULT_OFFSET = 80;

/**
 * Smooth-scrolls to the element with `id`, leaving `offset` px for a fixed
 * header. Updates the URL hash without a jump. Returns false when not found.
 */
export function scrollToId(id: string, offset: number = DEFAULT_OFFSET): boolean {
  if (typeof document === 'undefined') return false;
  const el = document.getElementById(id);
  if (!el) return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
  try {
    window.history.replaceState(null, '', `#${id}`);
  } catch {
    // Some sandboxed contexts forbid history updates; scrolling still worked.
  }
  return true;
}

/**
 * Tracks which of the given section ids currently crosses the viewport's
 * reading line (a thin band around 45-55% of the viewport height).
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? '');
  const key = ids.join('|');

  useEffect(() => {
    const list = key ? key.split('|') : [];
    if (list.length === 0 || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -54% 0px', threshold: 0 },
    );
    for (const id of list) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}
