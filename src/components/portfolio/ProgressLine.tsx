'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

interface ProgressLineProps {
  /** 0..1 */
  value: number;
  className?: string;
}

/**
 * Sideways line that is drawn up to `value` (re-uses the fx DrawLine visuals).
 * The fill is a scaleX transform with a CSS transition, so a change costs
 * nothing but a composited animation.
 */
export default function ProgressLine({ value, className }: ProgressLineProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const measure = () => root.style.setProperty('--len', `${root.clientWidth}px`);
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(root);
    return () => observer?.disconnect();
  }, []);

  const clamped = Math.min(1, Math.max(0, value));
  const style = { '--p': clamped.toFixed(4) } as CSSProperties;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={style}
      className={`kn-drawline kn-drawline--x kp-progress ${className ?? ''}`}
    >
      <span className="kn-drawline__fill" />
      <span className="kn-drawline__head" />
    </div>
  );
}
