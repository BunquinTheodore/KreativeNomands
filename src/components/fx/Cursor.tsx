'use client';

import { useEffect, useRef } from 'react';
import { runWhenIdle } from '@/lib/idle';

/** Elements over which the ring grows and the pointer shrinks. */
const INTERACTIVE =
  'a,button,[role="button"],[role="link"],[role="tab"],summary,label[for],select,[data-cursor="hover"],[data-sfx-hover]';
/** Elements where the system I-beam must stay usable. */
const TEXT_FIELD =
  'textarea,[contenteditable="true"],input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="range"]):not([type="file"])';

/** Rendered pointer glyph size (px); the SVG viewBox is 48 wide. */
const GLYPH_PX = 26;
/** Arrow tip inside the 48x48 SVG, as a fraction of its size. */
const HOTSPOT_X = 12 / 48;
const HOTSPOT_Y = 3 / 48;
const RING_PX = 38;
const RING_LERP = 0.17;

/**
 * Custom cursor for fine pointers: the amber arrow glyph tracks the mouse
 * exactly; a soft ring trails it (lerped in rAF). The native cursor is hidden
 * (html.has-custom-cursor) only after the first real mouse move, so there is
 * never a moment without a cursor. Skipped on touch/coarse devices.
 */
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return undefined;
    const root = rootRef.current;
    const glyph = glyphRef.current;
    const ring = ringRef.current;
    if (!root || !glyph || !ring) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const html = document.documentElement;
    let target = { x: -100, y: -100 };
    let ringPos = { x: -100, y: -100 };
    let frame = 0;
    let shown = false;

    const draw = () => {
      frame = 0;
      glyph.style.transform = `translate3d(${target.x - GLYPH_PX * HOTSPOT_X}px, ${
        target.y - GLYPH_PX * HOTSPOT_Y
      }px, 0)`;
      const k = reduced.matches ? 1 : RING_LERP;
      ringPos = {
        x: ringPos.x + (target.x - ringPos.x) * k,
        y: ringPos.y + (target.y - ringPos.y) * k,
      };
      const settled =
        Math.abs(target.x - ringPos.x) < 0.1 && Math.abs(target.y - ringPos.y) < 0.1;
      if (settled) ringPos = target;
      ring.style.transform = `translate3d(${ringPos.x - RING_PX / 2}px, ${
        ringPos.y - RING_PX / 2
      }px, 0)`;
      if (!settled) frame = window.requestAnimationFrame(draw);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const reveal = () => {
      if (shown) return;
      shown = true;
      ringPos = target;
      html.classList.add('has-custom-cursor');
      root.dataset.visible = 'true';
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      target = { x: event.clientX, y: event.clientY };
      reveal();
      root.dataset.visible = 'true';
      schedule();
    };
    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) return;
      root.dataset.state = event.target.closest(TEXT_FIELD)
        ? 'text'
        : event.target.closest(INTERACTIVE)
          ? 'hover'
          : 'idle';
    };
    const onDown = () => {
      root.dataset.pressed = 'true';
    };
    const onUp = () => {
      delete root.dataset.pressed;
    };
    const onLeave = () => {
      root.dataset.visible = 'false';
    };
    const onEnter = () => {
      if (shown) root.dataset.visible = 'true';
    };

    let cleanup = () => {
      if (frame) window.cancelAnimationFrame(frame);
    };
    const cancelIdle = runWhenIdle(() => {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeave);
      document.documentElement.addEventListener('mouseenter', onEnter);
      cleanup = () => {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        document.documentElement.removeEventListener('mouseleave', onLeave);
        document.documentElement.removeEventListener('mouseenter', onEnter);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }, 1200);

    return () => {
      cancelIdle();
      cleanup();
      html.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div ref={rootRef} className="kn-cursor" data-state="idle" data-visible="false" aria-hidden="true">
      <div ref={ringRef} className="kn-cursor__ring-pos">
        <div className="kn-cursor__ring" />
      </div>
      <div ref={glyphRef} className="kn-cursor__glyph-pos">
        <div className="kn-cursor__glyph" />
      </div>
    </div>
  );
}
