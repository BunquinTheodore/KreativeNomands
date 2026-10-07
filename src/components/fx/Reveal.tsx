'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';
import useReveal from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

interface RevealProps {
  as?: ElementType;
  /** Seconds. */
  delay?: number;
  /** Start offset in px (positive = from below). */
  y?: number;
  /** Start offset in px (positive = from the right). */
  x?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * Scroll-reveal wrapper (fade + translate). Visible in server HTML; armed
 * after hydration; no-ops under prefers-reduced-motion.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  y = 24,
  x = 0,
  className,
  children,
}: RevealProps) {
  const { ref, state } = useReveal<HTMLElement>();
  const style = {
    '--rx': `${x}px`,
    '--ry': `${y}px`,
    '--rd': `${delay}s`,
  } as CSSProperties;

  return (
    <Tag
      ref={ref}
      style={style}
      className={cn(state !== 'idle' && 'kn-reveal', state === 'in' && 'is-in', className)}
    >
      {children}
    </Tag>
  );
}
