import type { ShowcaseProject } from './data';

/** Active project / asset (indices into the category's project list). */
export interface Position {
  p: number;
  a: number;
}

export type Direction = 1 | -1;

export interface ShowcaseState extends Position {
  /** Direction of the last navigation; drives the slide transition. */
  dir: Direction;
}

export type ShowcaseSfx = 'next' | 'prev' | 'open' | 'close';

const MAX_PARAM_DIGITS = 4;

/** Fire-and-forget bridge to the SfxProvider (listens for `kn:sfx`). */
export function emitSfx(name: ShowcaseSfx | 'click' | 'whoosh'): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('kn:sfx', { detail: name }));
  } catch {
    // Sound is optional; it must never break navigation.
  }
}

function assetCount(project: ShowcaseProject | undefined): number {
  return project ? project.assets.length : 0;
}

export function totalAssets(projects: readonly ShowcaseProject[]): number {
  return projects.reduce((sum, project) => sum + project.assets.length, 0);
}

/** First project that actually has assets (0 when there is none). */
export function firstPopulatedProject(projects: readonly ShowcaseProject[]): number {
  const index = projects.findIndex((project) => project.assets.length > 0);
  return index < 0 ? 0 : index;
}

/**
 * Next/previous asset, flowing across projects (and wrapping around the
 * category) so the arrow keys always do something. null = nowhere to go.
 */
export function stepPosition(
  projects: readonly ShowcaseProject[],
  from: Position,
  delta: Direction,
): Position | null {
  if (totalAssets(projects) < 2) return null;
  const current = assetCount(projects[from.p]);
  const nextAsset = from.a + delta;
  if (nextAsset >= 0 && nextAsset < current) return { p: from.p, a: nextAsset };

  const count = projects.length;
  for (let step = 1; step <= count; step += 1) {
    const p = (from.p + delta * step + count * step) % count;
    const length = assetCount(projects[p]);
    if (length > 0) return { p, a: delta > 0 ? 0 : length - 1 };
  }
  return null;
}

/** Next asset inside the current project only, wrapping (slideshow). */
export function wrapWithinProject(
  projects: readonly ShowcaseProject[],
  from: Position,
): Position | null {
  const length = assetCount(projects[from.p]);
  if (length < 2) return null;
  return { p: from.p, a: (from.a + 1) % length };
}

export function directionBetween(from: Position, to: Position): Direction {
  if (to.p !== from.p) return to.p > from.p ? 1 : -1;
  return to.a >= from.a ? 1 : -1;
}

/**
 * Reads ?p=<projectId>&a=<index>. Anything that is not a known project id or
 * an in-range integer index is ignored.
 */
export function parsePosition(
  projects: readonly ShowcaseProject[],
  search: string,
): Position | null {
  const params = new URLSearchParams(search);
  const projectId = params.get('p');
  const p = projects.findIndex((project) => project.id === projectId);
  if (p < 0) return null;
  const length = assetCount(projects[p]);
  if (length === 0) return null;
  const raw = params.get('a');
  const valid = raw !== null && new RegExp(`^\\d{1,${MAX_PARAM_DIGITS}}$`).test(raw);
  const a = valid ? Number(raw) : 0;
  return { p, a: a < length ? a : 0 };
}

/** Writes the position into the URL without a navigation. */
export function writePosition(projects: readonly ShowcaseProject[], position: Position): void {
  const project = projects[position.p];
  if (!project || typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('p', project.id);
    url.searchParams.set('a', String(position.a));
    window.history.replaceState(null, '', url);
  } catch {
    // Sandboxed contexts can forbid history updates; the view still works.
  }
}
