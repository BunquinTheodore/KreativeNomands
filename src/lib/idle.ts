/**
 * Run `fn` when the main thread is idle (falls back to a short timeout).
 * Returns a cancel function. Client-only; a no-op on the server.
 */
export function runWhenIdle(fn: () => void, timeoutMs = 1500): () => void {
  if (typeof window === 'undefined') return () => undefined;
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(fn, { timeout: timeoutMs });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}
