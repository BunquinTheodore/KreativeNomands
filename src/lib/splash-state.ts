/**
 * Tiny coordination point between <Splash/> and entrance animations so hero
 * content animates in as the splash slides away (not underneath it).
 */
export const SPLASH_EXIT_EVENT = 'kn:splash-exit';

function splashFinishedOrAbsent(): boolean {
  if (typeof document === 'undefined') return true;
  const state = document.documentElement.dataset.splash;
  if (state === 'exit' || state === 'done') return true;
  return document.querySelector('.kn-splash') === null;
}

/** True once the splash has started leaving or is not on the page at all. */
export function splashGone(): boolean {
  return splashFinishedOrAbsent();
}

/** Calls `cb` once the splash begins leaving (or immediately when there is none). */
export function whenSplashExit(cb: () => void): () => void {
  if (splashFinishedOrAbsent()) {
    cb();
    return () => undefined;
  }
  const handler = () => cb();
  window.addEventListener(SPLASH_EXIT_EVENT, handler, { once: true });
  return () => window.removeEventListener(SPLASH_EXIT_EVENT, handler);
}

/** Used by <Splash/> only. */
export function markSplashExit(state: 'exit' | 'done'): void {
  if (typeof document === 'undefined') return;
  const current = document.documentElement.dataset.splash;
  if (current === state || current === 'done') return;
  document.documentElement.dataset.splash = state;
  // 'done' without a prior 'exit' (fallback path) must still release waiting reveals.
  if (current !== 'exit') window.dispatchEvent(new Event(SPLASH_EXIT_EVENT));
}
