'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { runWhenIdle } from '@/lib/idle';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: ReactNode;
  /** Pixels per second. */
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
  /** Gap between items in px (also applied between repeats). */
  gap?: number;
  /**
   * Render the children only after hydration, fading the rail in. For rails of decorative images: they
   * stay out of the server HTML (smaller document, nothing fetched during load) and are requested
   * right after the page is interactive instead. Needs `reserveHeight` so nothing moves when they mount.
   */
  deferChildren?: boolean;
  /** Any CSS length: the height the empty rail keeps while `deferChildren` holds the children back. */
  reserveHeight?: string;
}

const FALLBACK_DURATION_S = 40;
const MAX_COPIES = 8;
/** Deferred children mount at the next idle slot, or after this long at the latest. */
const FILL_IDLE_TIMEOUT_MS = 800;

/**
 * Side-to-side drifting rail. Content is duplicated so a CSS transform loop
 * (no JS per frame) can wrap seamlessly; copies and duration are measured once
 * and on resize. Pauses on hover/focus and while off-screen. Reduced motion
 * turns it into a normal horizontally scrollable strip.
 */
export default function Marquee({
  children,
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  className,
  gap = 16,
  deferChildren = false,
  reserveHeight,
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const [duration, setDuration] = useState(FALLBACK_DURATION_S);
  const [visible, setVisible] = useState(true);
  // false on the server and during hydration when deferred, so the markup always matches.
  const [filled, setFilled] = useState(!deferChildren);

  // Mounted in an idle slot, not inside the hydration burst: dozens of frames = dozens of layouts.
  useEffect(() => {
    if (!deferChildren) return undefined;
    return runWhenIdle(() => setFilled(true), FILL_IDLE_TIMEOUT_MS);
  }, [deferChildren]);

  useEffect(() => {
    const root = rootRef.current;
    const group = groupRef.current;
    // An empty rail has nothing to measure: wait for the children.
    if (!root || !group || !filled) return undefined;
    const sizes = { root: 0, group: 0 };

    // Widths come from ResizeObserver entries: they arrive after layout, so no reflow is forced.
    const measure = () => {
      if (sizes.group < 1) return;
      const needed = Math.ceil(sizes.root / sizes.group) + 1;
      // An even number of copies keeps the loop distance equal to one group.
      const even = Math.min(MAX_COPIES, Math.max(2, needed + (needed % 2)));
      setCopies(even);
      setDuration(Math.max(4, sizes.group / Math.max(1, speed)));
    };

    const resize =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver((entries) => {
            for (const entry of entries) {
              const width = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
              if (entry.target === root) sizes.root = width;
              else sizes.group = width;
            }
            measure();
          })
        : null;
    resize?.observe(root);
    resize?.observe(group);
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((entries) => {
            const last = entries[entries.length - 1];
            if (last) setVisible(last.isIntersecting);
          })
        : null;
    io?.observe(root);

    return () => {
      resize?.disconnect();
      io?.disconnect();
    };
  }, [speed, filled]);

  const style = {
    '--kn-gap': `${gap}px`,
    '--kn-dur': `${duration.toFixed(2)}s`,
    '--kn-copies': copies,
  } as CSSProperties;
  const groupStyle: CSSProperties | undefined = reserveHeight ? { minHeight: reserveHeight } : undefined;

  return (
    <div
      ref={rootRef}
      className={cn('kn-marquee', className)}
      style={style}
      data-dir={direction}
      data-pause={pauseOnHover ? 'true' : 'false'}
      data-offscreen={visible ? undefined : 'true'}
      data-deferred={deferChildren ? 'true' : undefined}
      data-filled={deferChildren ? String(filled) : undefined}
    >
      <div className="kn-marquee__track">
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? groupRef : undefined}
            className="kn-marquee__group"
            style={groupStyle}
            aria-hidden={i === 0 ? undefined : true}
            // Duplicates are decoration: keep them out of the tab order too.
            {...(i === 0 ? {} : ({ inert: '' } as Record<string, string>))}
          >
            {filled ? children : null}
          </div>
        ))}
      </div>
    </div>
  );
}
