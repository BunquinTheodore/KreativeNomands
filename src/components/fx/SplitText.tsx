'use client';

import { Fragment, useEffect, useMemo, type CSSProperties, type ElementType } from 'react';
import useReveal from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

export type SplitVariant = 'rise' | 'blur' | 'wave' | 'flip' | 'mask' | 'scramble';

interface SplitTextProps {
  text: string;
  as?: ElementType;
  variant?: SplitVariant;
  /** Seconds between units. Defaults: 0.03 (chars) / 0.09 (words). */
  stagger?: number;
  by?: 'chars' | 'words';
  className?: string;
  /** false re-plays every time the text re-enters the viewport. */
  once?: boolean;
}

interface Word {
  text: string;
  /** Index of the first unit in this word. */
  start: number;
}

const GLYPHS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+';
const SCRAMBLE_BASE_MS = 420;
const SCRAMBLE_PER_UNIT_MS = 38;

function splitWords(text: string, by: 'chars' | 'words'): Word[] {
  let cursor = 0;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const entry = { text: word, start: cursor };
      cursor += by === 'chars' ? Array.from(word).length : 1;
      return entry;
    });
}

function randomGlyph(): string {
  return GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
}

/** Resolves characters left to right, flickering random glyphs until then. */
function runScramble(root: HTMLElement): () => void {
  const units = Array.from(root.querySelectorAll<HTMLElement>('.kn-split__unit'));
  // Read every width first, then write: keeps layout stable while glyphs flicker.
  const widths = units.map((unit) => unit.getBoundingClientRect().width);
  units.forEach((unit, i) => {
    unit.style.width = `${widths[i]}px`;
    unit.style.textAlign = 'center';
  });
  const nodes = units
    .map((unit) => {
      const ch = unit.querySelector('.kn-split__ch');
      return { node: ch?.firstChild ?? null, final: ch?.textContent ?? '' };
    })
    .filter((u): u is { node: ChildNode; final: string } => u.node !== null && u.final.trim() !== '');
  const startedAt = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const elapsed = now - startedAt;
    let pending = false;
    nodes.forEach((unit, i) => {
      const settleAt = SCRAMBLE_BASE_MS + i * SCRAMBLE_PER_UNIT_MS;
      const next = elapsed >= settleAt ? unit.final : randomGlyph();
      if (elapsed < settleAt) pending = true;
      if (unit.node.nodeValue !== next) unit.node.nodeValue = next;
    });
    if (pending) {
      frame = window.requestAnimationFrame(tick);
    } else {
      units.forEach((unit) => {
        unit.style.width = '';
        unit.style.textAlign = '';
      });
    }
  };
  frame = window.requestAnimationFrame(tick);

  return () => {
    window.cancelAnimationFrame(frame);
    nodes.forEach((unit) => {
      unit.node.nodeValue = unit.final;
    });
    units.forEach((unit) => {
      unit.style.width = '';
      unit.style.textAlign = '';
    });
  };
}

/**
 * Per-character / per-word text entrance with six variants. The accessible
 * name is the full text; split spans are aria-hidden. Final text is in the
 * server HTML (visible until hydration arms the animation).
 */
export default function SplitText({
  text,
  as: Tag = 'span',
  variant = 'rise',
  stagger,
  by = 'chars',
  className,
  once = true,
}: SplitTextProps) {
  const { ref, state } = useReveal<HTMLElement>({ once });
  const words = useMemo(() => splitWords(text, by), [text, by]);
  const step = stagger ?? (by === 'chars' ? 0.03 : 0.09);

  useEffect(() => {
    if (variant !== 'scramble' || state !== 'in' || !ref.current) return undefined;
    return runScramble(ref.current);
  }, [variant, state, ref]);

  return (
    <Tag
      ref={ref}
      data-variant={variant}
      style={{ '--stg': `${step}s` } as CSSProperties}
      className={cn(
        'kn-split',
        state === 'armed' && 'is-armed',
        state === 'in' && 'is-in',
        className,
      )}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <Fragment key={`${word.text}-${wi}`}>
          <span className="kn-split__word" aria-hidden="true">
            {by === 'words' ? (
              <span className="kn-split__unit" style={{ '--i': word.start } as CSSProperties}>
                <span className="kn-split__ch">{word.text}</span>
              </span>
            ) : (
              Array.from(word.text).map((char, ci) => (
                <span
                  key={`${char}-${ci}`}
                  className="kn-split__unit"
                  style={{ '--i': word.start + ci } as CSSProperties}
                >
                  <span className="kn-split__ch">{char}</span>
                </span>
              ))
            )}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
