import { whenSplashExit } from '@/lib/splash-state';

/**
 * Start gates for decorative work that is heavy but not needed to read or use the page: the WebGL
 * layer (three, ~540 kB to parse plus scene set-up) and the hero reel video (~1 MB).
 *
 * Why a gate instead of a short timer: a lab run (Lighthouse / PageSpeed) records until the page has been
 * quiet for ~1 s after load, which is ~3 s on a fast machine and noticeably longer on a slow or busy one.
 * Anything a timer starts inside that window is measured as page cost: a WebGL boot at 3.5 s put ~1 s of
 * main-thread work into the run (TBT 0.1 s -> 1.1 s, mobile score 96 -> 70) on every machine slightly
 * slower than the one the timer had been tuned on, and a reel that fades in at 2.4 s keeps the screen from
 * looking finished (Speed Index +0.4 s). So the work starts on the first sign of a visitor, or after a
 * delay that is well past any realistic window. Both gates below stay open-ended on purpose.
 */

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

const IDLE_FALLBACK_MS = 1200;
const IDLE_TIMEOUT_MS = 4000;
/** A deliberate input: starting heavy work for it never has to wait for the splash. */
const INPUT_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'] as const;

/**
 * Runs `cb` once the window has loaded AND the main thread is idle, so heavy
 * work never competes with LCP. Returns a cancel function.
 */
export function onIdleAfterLoad(cb: () => void): () => void {
  const w = window as IdleWindow;
  let cancelled = false;
  let idleId: number | null = null;
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const schedule = (): void => {
    if (cancelled) return;
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(
        () => {
          if (!cancelled) cb();
        },
        { timeout: IDLE_TIMEOUT_MS },
      );
    } else {
      timerId = setTimeout(() => {
        if (!cancelled) cb();
      }, IDLE_FALLBACK_MS);
    }
  };

  if (document.readyState === 'complete') {
    schedule();
  } else {
    window.addEventListener('load', schedule, { once: true });
  }

  return () => {
    cancelled = true;
    window.removeEventListener('load', schedule);
    if (idleId !== null && typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(idleId);
    if (timerId !== null) clearTimeout(timerId);
  };
}

/**
 * Runs `cb` once, at the next idle slot after window load, on whichever comes first:
 *  - the visitor's first input (pointerdown / keydown / touch / wheel / scroll), or
 *  - the first mouse / pen movement, once the splash has left (a hover is enough of a sign that someone
 *    is there, but not worth starting heavy work underneath the splash animation), or
 *  - the splash having exited AND `minMs` having elapsed since navigation start.
 * Returns a cancel function.
 */
export function onInteractionOrDelay(cb: () => void, minMs: number): () => void {
  let done = false;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let cancelIdle: (() => void) | null = null;
  let cancelSplash: (() => void) | null = null;
  let cancelMoveSplash: (() => void) | null = null;

  const detach = (): void => {
    for (const name of INPUT_EVENTS) window.removeEventListener(name, fire, true);
    window.removeEventListener('pointermove', onMove, true);
  };
  function fire(): void {
    if (done) return;
    done = true;
    detach();
    if (timerId !== null) clearTimeout(timerId);
    cancelSplash?.();
    cancelMoveSplash?.();
    cancelIdle = onIdleAfterLoad(cb);
  }
  function onMove(): void {
    window.removeEventListener('pointermove', onMove, true);
    if (!done) cancelMoveSplash = whenSplashExit(fire);
  }
  const armTimer = (): void => {
    if (done) return;
    // performance.now() counts from navigation start, so a slow load does not pay the delay twice.
    const remaining = minMs - performance.now();
    if (remaining <= 0) fire();
    else timerId = setTimeout(fire, remaining);
  };

  for (const name of INPUT_EVENTS) {
    window.addEventListener(name, fire, { capture: true, passive: true, once: true });
  }
  window.addEventListener('pointermove', onMove, { capture: true, passive: true, once: true });
  cancelSplash = whenSplashExit(armTimer);

  return () => {
    done = true;
    detach();
    if (timerId !== null) clearTimeout(timerId);
    cancelSplash?.();
    cancelMoveSplash?.();
    cancelIdle?.();
  };
}
