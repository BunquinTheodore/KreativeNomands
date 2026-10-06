/**
 * One-line text fitting, batched. Every pending fit in a frame shares ONE layout flush:
 *   1. reset   - clear inline font-size (returns to the CSS clamp size)  [writes]
 *   2. measure - read CSS size + natural width + available width        [reads, 1 reflow]
 *   3. apply   - pure math, then set the final inline font-sizes         [writes]
 * Text width scales linearly with font-size, so final widths are computed, never re-read.
 */

export interface FitBounds {
  minPx: number;
  maxPx?: number;
}

export interface FitMeasure {
  /** CSS (un-fitted) font size in px. */
  base: number;
  /** Rendered width at `base`. */
  width: number;
  /** Space the text may occupy. */
  available: number;
}

export interface FitTask {
  reset(): void;
  measure(): void;
  apply(): void;
}

const pending = new Set<FitTask>();
let frame = 0;

function flush(): void {
  frame = 0;
  const tasks = Array.from(pending);
  pending.clear();
  for (const task of tasks) task.reset();
  for (const task of tasks) task.measure();
  for (const task of tasks) task.apply();
}

/** Queues a task for the next frame; many calls collapse into one reset/measure/apply pass. */
export function queueFit(task: FitTask): void {
  pending.add(task);
  if (!frame) frame = window.requestAnimationFrame(flush);
}

export function dequeueFit(task: FitTask): void {
  pending.delete(task);
}

/** Reads the text's CSS font size and natural width. Call only in the measure phase. */
export function readFit(el: HTMLElement, available: number): FitMeasure {
  return {
    base: parseFloat(getComputedStyle(el).fontSize) || 16,
    width: el.getBoundingClientRect().width,
    available,
  };
}

/** Shrink-only size (never above the CSS size). Returns the font size to apply, or null for none. */
export function shrinkSize(m: FitMeasure, bounds: FitBounds): number | null {
  if (m.available > 0 && m.width > m.available) {
    return Math.max(bounds.minPx, Math.floor(m.base * (m.available / m.width) * 100) / 100);
  }
  return null;
}

/** Size that makes the text exactly `target` px wide, clamped to [minPx, maxPx]. */
export function matchSize(m: FitMeasure, target: number, bounds: Required<FitBounds>): number | null {
  if (target > 0 && m.width > 0) {
    const raw = m.base * (target / m.width);
    return Math.min(bounds.maxPx, Math.max(bounds.minPx, Math.floor(raw * 100) / 100));
  }
  return null;
}

export function setFontSize(el: HTMLElement, px: number | null): void {
  if (px !== null) el.style.fontSize = `${px}px`;
}
