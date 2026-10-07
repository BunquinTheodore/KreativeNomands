'use client';

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode, type RefObject } from 'react';
import { dequeueFit, matchSize, queueFit, readFit, setFontSize, shrinkSize, type FitMeasure, type FitTask } from '@/lib/fit';
import { observeShared } from '@/lib/observe';
import { cn } from '@/lib/utils';

/** A line is fitted once it is within this distance (vertically) of the viewport. */
const NEAR_VIEWPORT_MARGIN = '700px 0px';

/** A second one-line element (e.g. a subtitle) sized to match this line's final width. */
export interface FitMatch {
  ref: RefObject<HTMLElement>;
  minPx: number;
  maxPx: number;
  /** Floor used when even `minPx` would overflow `fitWithin`. */
  hardMinPx: number;
  /** Element whose width the matched line must not exceed. */
  fitWithin: RefObject<HTMLElement>;
}

interface FitLineProps {
  children: ReactNode;
  /** Largest font-size in px (CSS clamp ceiling). Default 64. */
  maxPx?: number;
  /** Smallest font-size the JS fit may shrink to. Default 14. */
  minPx?: number;
  /** Fluid middle term of the CSS clamp (before JS). Default 5vw. */
  fluid?: string;
  as?: ElementType;
  className?: string;
  /** Called after every fit with the text's final rendered width in px. */
  onFit?: (widthPx: number) => void;
  match?: FitMatch;
}

/**
 * Text that is always exactly one line. CSS gives a fluid clamp() size up
 * front (nowrap, so it never wraps even before JS); a ResizeObserver then
 * shrinks the font-size just enough to fit the container, down to `minPx`.
 * All FitLines on the page are fitted in one batched pass (see lib/fit.ts).
 */
export default function FitLine({
  children,
  maxPx = 64,
  minPx = 14,
  fluid = '5vw',
  as: Tag = 'span',
  className,
  onFit,
  match,
}: FitLineProps) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLElement>(null);
  const onFitRef = useRef(onFit);
  onFitRef.current = onFit;
  const matchRef = useRef(match);
  matchRef.current = match;
  const scheduleRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return undefined;

    let own: FitMeasure | null = null;
    let sub: FitMeasure | null = null;
    let lastWidth = -1;

    const task: FitTask = {
      reset() {
        text.style.fontSize = '';
        const m = matchRef.current;
        if (m?.ref.current) m.ref.current.style.fontSize = '';
      },
      measure() {
        own = readFit(text, box.clientWidth);
        const m = matchRef.current;
        sub = m?.ref.current ? readFit(m.ref.current, m.fitWithin.current?.clientWidth ?? 0) : null;
      },
      apply() {
        if (!own) return;
        const ownSize = shrinkSize(own, { minPx });
        setFontSize(text, ownSize);
        const finalWidth = (own.width * (ownSize ?? own.base)) / own.base;
        const m = matchRef.current;
        if (m?.ref.current && sub) {
          const subSize = matchSize(sub, finalWidth, { minPx: m.minPx, maxPx: m.maxPx });
          const subWidth = (sub.width * (subSize ?? sub.base)) / sub.base;
          let applied = subSize;
          if (sub.available > 0 && subWidth > sub.available) {
            const current = subSize ?? sub.base;
            applied = Math.max(m.hardMinPx, Math.floor(current * (sub.available / subWidth) * 100) / 100);
          }
          setFontSize(m.ref.current, applied);
        }
        onFitRef.current?.(finalWidth);
      },
    };

    let active = false;
    let disposed = false;
    let observer: ResizeObserver | null = null;
    let stopNear: () => void = () => undefined;

    const schedule = () => {
      if (active && !disposed) queueFit(task);
    };
    scheduleRef.current = schedule;

    const activate = () => {
      if (active) return;
      active = true;
      schedule();
      // Re-fit on width changes only: our own font-size writes change the box height, not its width.
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver((entries) => {
          const width = entries[entries.length - 1]?.contentRect.width ?? 0;
          if (width === lastWidth) return;
          lastWidth = width;
          schedule();
        });
        observer.observe(box);
      }
      void document.fonts?.ready.then(schedule);
    };

    // A line far below the fold keeps its CSS (clamp) size until the visitor gets close: measuring it
    // would force layout of the whole content-visibility:auto section it sits in, during hydration.
    if (typeof IntersectionObserver === 'undefined') {
      activate();
    } else {
      stopNear = observeShared(box, { rootMargin: NEAR_VIEWPORT_MARGIN }, (entry) => {
        if (!entry.isIntersecting) return;
        stopNear();
        activate();
      });
    }

    return () => {
      disposed = true;
      active = false;
      stopNear();
      observer?.disconnect();
      dequeueFit(task);
    };
  }, [minPx, maxPx, fluid]);

  // Content may change between renders; re-fit after every commit (cheap, batched).
  useEffect(() => {
    scheduleRef.current();
  });

  // A CSS variable (not inline font-size) so the JS fit can override/clear its inline size.
  const style = { '--fit-size': `clamp(${minPx}px, ${fluid}, ${maxPx}px)` } as CSSProperties;

  return (
    <span ref={boxRef} className="kn-fit">
      <Tag ref={textRef} className={cn('kn-fit__text', className)} style={style}>
        {children}
      </Tag>
    </span>
  );
}
