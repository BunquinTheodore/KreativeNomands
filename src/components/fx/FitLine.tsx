'use client';

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { fitShrink } from '@/lib/fit';
import { cn } from '@/lib/utils';

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
}

/**
 * Text that is always exactly one line. CSS gives a fluid clamp() size up
 * front (nowrap, so it never wraps even before JS); a ResizeObserver then
 * shrinks the font-size just enough to fit the container, down to `minPx`.
 */
export default function FitLine({
  children,
  maxPx = 64,
  minPx = 14,
  fluid = '5vw',
  as: Tag = 'span',
  className,
  onFit,
}: FitLineProps) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLElement>(null);
  const onFitRef = useRef(onFit);
  onFitRef.current = onFit;
  const scheduleRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return undefined;
    let frame = 0;

    const fit = () => {
      frame = 0;
      const width = fitShrink(text, box.clientWidth, { minPx });
      onFitRef.current?.(width);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(fit);
    };

    scheduleRef.current = schedule;
    schedule();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    observer?.observe(box);
    void document.fonts?.ready.then(schedule);

    return () => {
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [minPx, maxPx, fluid]);

  // Content may change between renders; re-fit after every commit (cheap, rAF-coalesced).
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
