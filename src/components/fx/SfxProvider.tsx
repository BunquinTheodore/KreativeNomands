'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sfx, type SfxName } from '@/lib/sfx';
import { runWhenIdle } from '@/lib/idle';

const CLICKABLE = 'a,button,[role="button"],[data-sfx]';
const SECTION_SELECTOR = 'section[id],[data-sfx-section]';
const SCROLL_STEP_PX = 140;
/** Reduced-motion users get roughly a third of the tick density. */
const SCROLL_STEP_REDUCED_PX = 420;
const MIN_TICK_GAP_MS = 55;
const SFX_NAMES: ReadonlySet<string> = new Set([
  'tick', 'click', 'hover', 'whoosh', 'open', 'close', 'success', 'error', 'next', 'prev',
]);

function isDisabled(el: Element): boolean {
  return (
    el.matches(':disabled') ||
    el.getAttribute('aria-disabled') === 'true' ||
    el.closest('[data-sfx="none"]') !== null
  );
}

function clickSoundFor(target: EventTarget | null): SfxName | null {
  if (!(target instanceof Element)) return null;
  const el = target.closest(CLICKABLE);
  if (!el || isDisabled(el)) return null;
  const custom = el.getAttribute('data-sfx');
  if (custom && SFX_NAMES.has(custom)) return custom as SfxName;
  return 'click';
}

/**
 * Mounts delegated, passive listeners that drive all UI sound effects.
 * Opt out per element/subtree with data-sfx="none". Renders nothing.
 */
export default function SfxProvider(): null {
  const pathname = usePathname();

  // Gesture unlock, clicks, hovers, scroll ticks.
  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let accumulated = 0;
    let lastY = window.scrollY;
    let lastTick = 0;

    const onGesture = () => sfx.unlock();
    const onClick = (event: MouseEvent) => {
      const name = clickSoundFor(event.target);
      if (name) sfx.play(name);
    };
    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) return;
      const el = event.target.closest('[data-sfx-hover]');
      if (!el || isDisabled(el)) return;
      if (event.relatedTarget instanceof Node && el.contains(event.relatedTarget)) return;
      sfx.play('hover');
    };
    const onScroll = () => {
      const y = window.scrollY;
      accumulated += Math.abs(y - lastY);
      lastY = y;
      const step = reducedQuery.matches ? SCROLL_STEP_REDUCED_PX : SCROLL_STEP_PX;
      if (accumulated < step) return;
      accumulated = 0;
      const now = performance.now();
      if (now - lastTick < MIN_TICK_GAP_MS || !sfx.isUnlocked()) return;
      lastTick = now;
      sfx.play('tick');
    };

    const onExternalSfx = (event: Event) => {
      const name = (event as CustomEvent<SfxName>).detail;
      if (typeof name === string) sfx.play(name);
    };

    const gestureOpts: AddEventListenerOptions = { passive: true, once: true, capture: true };
    const cancelIdle = runWhenIdle(() => {
      window.addEventListener('pointerdown', onGesture, gestureOpts);
      window.addEventListener('keydown', onGesture, gestureOpts);
      window.addEventListener('touchend', onGesture, gestureOpts);
      document.addEventListener('click', onClick, { passive: true });
      document.addEventListener('pointerover', onPointerOver, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('kn:sfx', onExternalSfx);
    });

    return () => {
      cancelIdle();
      window.removeEventListener('pointerdown', onGesture, true);
      window.removeEventListener('keydown', onGesture, true);
      window.removeEventListener('touchend', onGesture, true);
      document.removeEventListener('click', onClick);
      document.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('kn:sfx', onExternalSfx);
    };
  }, []);

  // Section-enter whoosh. Re-scans when the route changes.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const seen = new WeakSet<Element>();
    let skipInitial = true;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          observer.unobserve(entry.target);
          // The sections already visible at load do not whoosh.
          if (!skipInitial) sfx.play('whoosh');
        }
      },
      { rootMargin: '0px 0px -40% 0px', threshold: 0.2 },
    );
    const frame = window.requestAnimationFrame(() => {
      document.querySelectorAll(SECTION_SELECTOR).forEach((el) => observer.observe(el));
    });
    const settle = window.setTimeout(() => {
      skipInitial = false;
    }, 600);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
