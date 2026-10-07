/**
 * Shared IntersectionObservers: one observer per (rootMargin, threshold) pair instead of one
 * per element. Pages with ~100 reveal/count/draw targets otherwise create ~100 observers,
 * each recomputed after every frame.
 */
type Listener = (entry: IntersectionObserverEntry) => void;

interface Pool {
  readonly observer: IntersectionObserver;
  readonly listeners: Map<Element, Listener>;
}

const pools = new Map<string, Pool>();

function poolFor(rootMargin: string, threshold: number): Pool {
  const key = `${rootMargin}|${threshold}`;
  const existing = pools.get(key);
  if (existing) return existing;
  const listeners = new Map<Element, Listener>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) listeners.get(entry.target)?.(entry);
    },
    { rootMargin, threshold },
  );
  const created = { observer, listeners };
  pools.set(key, created);
  return created;
}

/** Observes `el`; returns an unsubscribe function. Safe to call from effects only. */
export function observeShared(
  el: Element,
  options: { rootMargin?: string; threshold?: number },
  listener: Listener,
): () => void {
  const pool = poolFor(options.rootMargin ?? '0px', options.threshold ?? 0);
  pool.listeners.set(el, listener);
  pool.observer.observe(el);
  return () => {
    pool.listeners.delete(el);
    pool.observer.unobserve(el);
  };
}
