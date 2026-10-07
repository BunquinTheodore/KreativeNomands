import { runWhenIdle } from '@/lib/idle';

/**
 * Gate for JavaScript that is not needed to paint or to read the page: the below-the-fold sections
 * ("islands", see components/fx/island.tsx) fetch and hydrate behind it.
 *
 * It opens, once and for every caller, at the first of:
 *  - the first contentful paint, plus a short settle delay and an idle slot (the normal case), so
 *    none of the island code competes with the render-critical resources or the first frames;
 *  - at once, when the URL has a hash (a deep link already shows a section: see createGate);
 *  - the visitor's first input (pointer, key, touch, wheel, scroll), so interacting never waits;
 *  - 2.5 s after window load, in case no paint is ever reported (hidden tab, old browser).
 * On the server it is already open: the islands render inline into the HTML.
 */
const SETTLE_MS = 100;
const IDLE_TIMEOUT_MS = 1500;
const LOAD_FALLBACK_MS = 2500;
const INPUT_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'] as const;
const RETRY_DELAYS_MS = [700, 2000, 5000] as const;

let gate: Promise<void> | null = null;

function createGate(): Promise<void> {
  return new Promise<void>((resolve) => {
    let settled = false;
    let cancelIdle: () => void = () => undefined;
    const timers: number[] = [];

    const open = (): void => {
      if (settled) return;
      settled = true;
      cancelIdle();
      timers.forEach((id) => window.clearTimeout(id));
      INPUT_EVENTS.forEach((name) => window.removeEventListener(name, open, true));
      resolve();
    };
    // A deep link (/#contact) lands on a section that is already on screen. Hydrating it after the first
    // paint would visibly re-fit its headings (a layout shift), so such loads do not wait for the paint.
    if (window.location.hash.length > 1) {
      open();
      return;
    }
    const afterPaint = (): void => {
      timers.push(
        window.setTimeout(() => {
          cancelIdle = runWhenIdle(open, IDLE_TIMEOUT_MS);
        }, SETTLE_MS),
      );
    };

    INPUT_EVENTS.forEach((name) =>
      window.addEventListener(name, open, { capture: true, passive: true, once: true }),
    );
    try {
      const observer = new PerformanceObserver((list) => {
        if (list.getEntriesByName('first-contentful-paint').length === 0) return;
        observer.disconnect();
        afterPaint();
      });
      observer.observe({ type: 'paint', buffered: true });
    } catch {
      afterPaint();
    }
    const armFallback = (): void => {
      timers.push(window.setTimeout(open, LOAD_FALLBACK_MS));
    };
    if (document.readyState === 'complete') armFallback();
    else window.addEventListener('load', armFallback, { once: true });
  });
}

/** Resolves when below-the-fold JavaScript may start loading. Shared: every caller gets the same promise. */
export function afterPaintAndIdle(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  gate ??= createGate();
  return gate;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function retrying<T>(load: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await load();
    } catch (error) {
      const delay = RETRY_DELAYS_MS[attempt];
      if (delay === undefined) throw error;
      await wait(delay);
    }
  }
}

/**
 * Loader for an island chunk: waits for the gate, retries a failed download a few times and, if it
 * still cannot load, never settles. A never-settling lazy component leaves the server-rendered
 * section exactly as it is (static but fully visible), whereas a rejection would reach the root
 * error boundary and take the whole page down.
 */
export function loadIsland<T>(load: () => Promise<T>): Promise<T> {
  return afterPaintAndIdle()
    .then(() => retrying(load))
    .catch(() => new Promise<T>(() => undefined));
}
