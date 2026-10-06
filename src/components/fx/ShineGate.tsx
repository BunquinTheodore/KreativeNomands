'use client';

import { useEffect } from 'react';
import { observeShared } from '@/lib/observe';
import { runWhenIdle } from '@/lib/idle';

/**
 * Elements whose infinite CSS animations should only run near the viewport:
 *  - `.shine`: the glass shine sweep (~80 pseudo-elements, each its own compositor layer);
 *  - `[data-pause-offscreen]`: opt-in for any other looping animation (e.g. background-position
 *    gradient sweeps, which are not compositable and repaint every frame);
 *  - `.kp-sweep`: the portfolio heading's infinite gradient sweep.
 * A shared IntersectionObserver sets `data-off` while an element is far outside the viewport;
 * globals.css pauses the animation then. Fail-safe: elements nobody observed keep animating.
 */
const SELECTOR = '.shine, [data-pause-offscreen], .kp-sweep';
const ROOT_MARGIN = '120px 0px';
const IDLE_TIMEOUT_MS = 800;

function forEachMatch(node: Node, fn: (el: Element) => void): void {
  if (!(node instanceof Element)) return;
  if (node.matches(SELECTOR)) fn(node);
  node.querySelectorAll(SELECTOR).forEach(fn);
}

export default function ShineGate(): null {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const watched = new Map<Element, () => void>();

    const watch = (el: Element): void => {
      if (watched.has(el)) return;
      watched.set(
        el,
        observeShared(el, { rootMargin: ROOT_MARGIN }, (entry) => {
          if (entry.isIntersecting) el.removeAttribute('data-off');
          else el.setAttribute('data-off', '');
        }),
      );
    };
    const unwatch = (el: Element): void => {
      watched.get(el)?.();
      watched.delete(el);
    };

    let mutations: MutationObserver | null = null;
    const cancelIdle = runWhenIdle(() => {
      forEachMatch(document.body, watch);
      // Elements mounted later (route changes, filters, modals) are picked up here.
      mutations = new MutationObserver((records) => {
        for (const record of records) {
          record.removedNodes.forEach((node) => forEachMatch(node, unwatch));
          record.addedNodes.forEach((node) => forEachMatch(node, watch));
        }
      });
      mutations.observe(document.body, { childList: true, subtree: true });
    }, IDLE_TIMEOUT_MS);

    return () => {
      cancelIdle();
      mutations?.disconnect();
      watched.forEach((stop) => stop());
      watched.clear();
    };
  }, []);

  return null;
}
