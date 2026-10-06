'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { cancelJob, scheduleJob, type FrameJob } from '@/lib/frame-batch';
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
 * target is near the viewport (IntersectionObserver gate). Nothing here reads
 * layout during mount: the length comes from ResizeObserver, the first paint
 * from the IntersectionObserver callback (both run after layout).
 */
export default function DrawLine({ axis = 'y', className, targetRef }: DrawLineProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const target = targetRef?.current ?? root?.parentElement;
    if (!root || !target) return undefined;

    const lengthObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver((entries) => {
            const rect = entries[entries.length - 1]?.contentRect;
            if (rect) root.style.setProperty('--len', `${axis === 'y' ? rect.height : rect.width}px`);
          })
        : null;
    lengthObserver?.observe(root);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.style.setProperty('--p', '1');
      return () => lengthObserver?.disconnect();
    }

    let listening = false;
    let progress = '0';

    // All DrawLines share one frame: every layout read runs before any style write (lib/frame-batch).
    const job: FrameJob = {
      read() {
        const rect = target.getBoundingClientRect();
        const vh = window.innerHeight;
        const travel = rect.height + vh * (START - END);
        const p = Math.min(1, Math.max(0, (vh * START - rect.top) / Math.max(1, travel)));
        progress = p.toFixed(4);
      },
      write() {
        root.style.setProperty('--p', progress);
      },
    };
    const schedule = () => scheduleJob(job);
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

    if (typeof IntersectionObserver === 'undefined') {
      attach();
      return () => {
        detach();
        lengthObserver?.disconnect();
        cancelJob(job);
      };
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1];
        if (last?.isIntersecting) attach();
        else {
          detach();
          schedule();
        }
      },
      { rootMargin: '20% 0px 20% 0px' },
    );
    observer.observe(target);

    return () => {
      observer.disconnect();
      lengthObserver?.disconnect();
      detach();
      cancelJob(job);
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
