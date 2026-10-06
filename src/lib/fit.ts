/**
 * One-line text fitting helpers. Both operate on an inline-block, nowrap
 * element whose font-size can be overridden inline; clearing the inline value
 * returns to the CSS (clamp) size.
 */

export interface FitBounds {
  minPx: number;
  maxPx?: number;
}

/** Rendered size in px of the element's CSS (un-fitted) font. */
function cssFontSize(el: HTMLElement): number {
  el.style.fontSize = '';
  return parseFloat(getComputedStyle(el).fontSize) || 16;
}

/**
 * Shrinks `el` (never grows past its CSS size) until its text is no wider than
 * `available`. Returns the resulting rendered width.
 */
export function fitShrink(el: HTMLElement, available: number, bounds: FitBounds): number {
  const base = cssFontSize(el);
  const width = el.getBoundingClientRect().width;
  if (available > 0 && width > available) {
    const next = Math.max(bounds.minPx, Math.floor(base * (available / width) * 100) / 100);
    el.style.fontSize = `${next}px`;
  }
  return el.getBoundingClientRect().width;
}

/**
 * Sets `el`'s font-size so its text width equals `targetWidth`, clamped to
 * [minPx, maxPx]. Returns the resulting rendered width.
 */
export function fitToWidth(el: HTMLElement, targetWidth: number, bounds: Required<FitBounds>): number {
  const base = cssFontSize(el);
  const width = el.getBoundingClientRect().width;
  if (targetWidth > 0 && width > 0) {
    const raw = base * (targetWidth / width);
    const next = Math.min(bounds.maxPx, Math.max(bounds.minPx, Math.floor(raw * 100) / 100));
    el.style.fontSize = `${next}px`;
  }
  return el.getBoundingClientRect().width;
}
