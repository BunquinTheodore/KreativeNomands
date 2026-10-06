'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { cn } from '@/lib/utils';

interface DrawLineProps {
  axis?: 'y' | 'x';
  className?: string;
  /** Element whose scroll progress drives the line. Defaults to the parent. */
  targetRef?: RefObject<HTMLElement>;
}

/** Line starts drawing when the target's top passes 80% of the viewport. */
const START = 0.8;
/** Line is complete when the target's bottom reaches 60% of the viewport. */
const END = 0.6;

/**
 * A hairline that draws itself with the scroll progress of its section.
 * `axis="y"` grows downward (give it a height, default fills the parent),
 * `axis="x"` grows sideways. The scroll listener is only attached while the
 * target is near the viewport (IntersectionObserver gate).
 */
export default function DrawLine({ axis = 'y', className, targetRef }: DrawLineProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const target = targetRef?.current ?? root?.parentElement;
    if (!root || !target) return undefined;

    const measureLength = () => {
      const length = axis === 'y' ? root.clientHeight : root.clientWidth;
      root.style.setProperty('--len', `${length}px`);
    };
    measureLength();
    const lengthObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measureLength) : null;
    lengthObserver?.observe(root);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.style.setProperty('--p', '1');
      return () => lengthObserver?.disconnect();
    }

    let frame = 0;
    let listening = false;

    const paint = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height + vh * (START - END);
      const p = Math.min(1, Math.max(0, (vh * START - rect.top) / Math.max(1, travel)));
      root.style.setProperty('--p', p.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const attach = () => {
      if (listening) return;
      listening = true;
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      schedule();
    };
    const detach = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };

    paint();
    if (typeof IntersectionObserver === 'undefined') {
      attach();
      return () => {
        detach();
        lengthObserver?.disconnect();
      };
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1];
        if (last?.isIntersecting) attach();
        else {
          detach();
          paint();
        }
      },
      { rootMargin: '20% 0px 20% 0px' },
    );
    observer.observe(target);

    return () => {
      observer.disconnect();
      lengthObserver?.disconnect();
      detach();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [axis, targetRef]);

  return (
    <div
      ref={rootRef}
      className={cn('kn-drawline', axis === 'y' ? 'kn-drawline--y' : 'kn-drawline--x', className)}
      aria-hidden="true"
    >
      <span className="kn-drawline__fill" />
      <span className="kn-drawline__head" />
    </div>
  );
}
