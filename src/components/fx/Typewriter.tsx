'use client';

import { useEffect, useState } from 'react';
import useInView from '@/hooks/useInView';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  phrases: readonly string[];
  className?: string;
}

const TYPE_MS = 62;
const DELETE_MS = 34;
const HOLD_MS = 1900;
const GAP_MS = 320;
const REDUCED_SWAP_MS = 3400;

/**
 * Cycles through phrases with a type / hold / delete loop. The first phrase is
 * in the server HTML. Only runs while on screen; with reduced motion phrases
 * simply swap. Screen readers get the first phrase once (no live chatter).
 */
export default function Typewriter({ phrases, className }: TypewriterProps) {
  const first = phrases[0] ?? '';
  const [text, setText] = useState(first);
  const { ref, inView } = useInView<HTMLSpanElement>();
  const reduced = usePrefersReducedMotion();
  const key = phrases.join('\u0000');

  useEffect(() => {
    const list = key ? key.split('\u0000') : [];
    if (!inView || list.length < 2) return undefined;
    let timer = 0;
    let index = 0;
    const current = () => list[index] ?? '';

    if (reduced) {
      const swap = () => {
        index = (index + 1) % list.length;
        setText(current());
        timer = window.setTimeout(swap, REDUCED_SWAP_MS);
      };
      timer = window.setTimeout(swap, REDUCED_SWAP_MS);
      return () => window.clearTimeout(timer);
    }

    const type = (length: number) => {
      const full = current();
      setText(full.slice(0, length));
      if (length < full.length) {
        timer = window.setTimeout(() => type(length + 1), TYPE_MS);
      } else {
        timer = window.setTimeout(() => erase(full.length), HOLD_MS);
      }
    };
    const erase = (length: number) => {
      setText(current().slice(0, length));
      if (length > 0) {
        timer = window.setTimeout(() => erase(length - 1), DELETE_MS);
      } else {
        index = (index + 1) % list.length;
        timer = window.setTimeout(() => type(1), GAP_MS);
      }
    };

    timer = window.setTimeout(() => erase(current().length), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [key, inView, reduced]);

  return (
    <span ref={ref} className={cn('kn-typewriter', className)}>
      <span className="sr-only">{first}</span>
      <span aria-hidden="true">{text || '\u200B'}</span>
      <span className="kn-caret" aria-hidden="true" />
    </span>
  );
}
