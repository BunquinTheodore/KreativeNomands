'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type MouseEventHandler,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  as?: ElementType;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  /** Pointer-driven 3D tilt (mouse only, off for reduced motion). */
  tilt?: boolean;
  /** Continuously sweeping highlight. Default true. */
  shine?: boolean;
  /** Pointer-following radial glow. */
  glow?: boolean;
  className?: string;
  children?: ReactNode;
}

const MAX_TILT_DEG = 6;

/** Deterministic 0-7s offset so neighbouring cards do not shine in sync. */
function shineDelay(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 7000;
  return `-${(hash / 1000).toFixed(2)}s`;
}

function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

function activateOnKey(event: KeyboardEvent<HTMLElement>): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

/**
 * Frosted glass surface. Tilt / glow write CSS variables straight to the
 * element inside a rAF (no React re-render). With `href` it renders a link
 * (next/link for internal routes); with `onClick` on a div it becomes a
 * keyboard-operable button-role element.
 */
export default function GlassCard({
  as,
  href,
  onClick,
  tilt = false,
  shine = true,
  glow = false,
  className,
  children,
}: GlassCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef(0);
  const seed = useId();
  const interactive = tilt || glow;

  useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el || event.pointerType !== 'mouse') return;
      const { clientX, clientY } = event;
      window.cancelAnimationFrame(frame.current);
      frame.current = window.requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width;
        const py = (clientY - rect.top) / rect.height;
        el.style.setProperty('--mx', `${(clientX - rect.left).toFixed(1)}px`);
        el.style.setProperty('--my', `${(clientY - rect.top).toFixed(1)}px`);
        if (tilt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.style.setProperty('--tilt-x', `${((0.5 - py) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
          el.style.setProperty('--tilt-y', `${((px - 0.5) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
        }
      });
    },
    [tilt],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    window.cancelAnimationFrame(frame.current);
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  }, []);

  const classes = cn(
    'kn-card glass',
    shine && 'shine',
    tilt && 'kn-card--tilt',
    glow && 'kn-card--glow',
    (href || onClick) && 'kn-card--action',
    className,
  );
  const style = { '--shine-delay': shineDelay(seed) } as CSSProperties;
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };
  const shared = {
    ref: setRef,
    className: classes,
    style,
    'data-sfx-hover': '',
    ...(interactive ? { onPointerMove, onPointerLeave } : {}),
  };

  if (href) {
    if (isExternal(href) || href.startsWith('#')) {
      const external = isExternal(href);
      return (
        <a
          href={href}
          onClick={onClick}
          target={external && href.startsWith('http') ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          {...shared}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} onClick={onClick} {...shared}>
        {children}
      </Link>
    );
  }

  const Tag: ElementType = as ?? 'div';
  const actionable = Boolean(onClick) && Tag === 'div';
  return (
    <Tag
      onClick={onClick}
      {...(actionable ? { role: 'button', tabIndex: 0, onKeyDown: activateOnKey } : {})}
      {...shared}
    >
      {children}
    </Tag>
  );
}
