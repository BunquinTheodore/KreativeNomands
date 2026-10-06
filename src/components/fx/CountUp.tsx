'use client';

import { useEffect, useRef, useState } from 'react';
import useReveal from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

interface CountUpProps {
  to: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. */
  duration?: number;
  className?: string;
}

function decimalsOf(value: number): number {
  const part = String(value).split('.')[1];
  return part ? Math.min(part.length, 3) : 0;
}

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - 2 ** (-10 * t);
}

/**
 * Counts from 0 to `to` when scrolled into view. The final value is in the
 * server HTML. Frames write straight to a text node (no React re-render per
 * frame).
 */
export default function CountUp({ to, prefix = '', suffix = '', duration = 1.6, className }: CountUpProps) {
  const decimals = decimalsOf(to);
  const format = (n: number) =>
    `${prefix}${n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  const finalText = format(to);

  const { ref, state } = useReveal<HTMLSpanElement>({ threshold: 0.4 });
  const numberRef = useRef<HTMLSpanElement>(null);
  const [armedOnce, setArmedOnce] = useState(false);

  // Show the starting value as soon as the element is armed (before it enters view).
  useEffect(() => {
    if (state === 'armed') {
      const node = numberRef.current?.firstChild;
      if (node) node.nodeValue = format(0);
      setArmedOnce(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (state !== 'in' || !armedOnce) return undefined;
    const node = numberRef.current?.firstChild;
    if (!node) return undefined;
    const startedAt = performance.now();
    const totalMs = duration * 1000;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / totalMs);
      node.nodeValue = format(to * easeOutExpo(t));
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      node.nodeValue = finalText;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, armedOnce, to, duration, finalText]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      <span className="sr-only">{finalText}</span>
      <span ref={numberRef} aria-hidden="true">
        {finalText}
      </span>
    </span>
  );
}
