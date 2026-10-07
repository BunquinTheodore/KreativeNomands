'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ShowcaseProject } from './data';
import {
  directionBetween,
  emitSfx,
  firstPopulatedProject,
  parsePosition,
  stepPosition,
  wrapWithinProject,
  writePosition,
  type Direction,
  type Position,
  type ShowcaseState,
} from './navigation';

export interface ShowcaseApi {
  state: ShowcaseState;
  /** Next / previous asset, flowing across projects. */
  go: (delta: Direction) => void;
  /** Jump to the first / last asset of the current project. */
  jumpEdge: (edge: 'first' | 'last') => void;
  selectProject: (p: number) => void;
  selectAsset: (a: number) => void;
  /** Slideshow tick: next asset inside the project, wrapping. */
  tick: () => void;
}

/**
 * Showcase position (project + asset) with deep-link support. The first render
 * always uses the first project so server and client markup match; the URL is
 * read once after mount and written only after the viewer navigates.
 */
export function useShowcaseState(projects: readonly ShowcaseProject[]): ShowcaseApi {
  const [state, setState] = useState<ShowcaseState>(() => ({
    p: firstPopulatedProject(projects),
    a: 0,
    dir: 1,
  }));
  const stateRef = useRef(state);
  const touched = useRef(false);

  const commit = useCallback((next: ShowcaseState, userDriven: boolean) => {
    stateRef.current = next;
    if (userDriven) touched.current = true;
    setState(next);
  }, []);

  useEffect(() => {
    const position = parsePosition(projects, window.location.search);
    if (position) commit({ ...position, dir: 1 }, false);
  }, [projects, commit]);

  useEffect(() => {
    if (touched.current) writePosition(projects, state);
  }, [projects, state]);

  const moveTo = useCallback(
    (target: Position | null, sfx?: 'next' | 'prev') => {
      if (!target) return;
      const current = stateRef.current;
      if (target.p === current.p && target.a === current.a) return;
      commit({ ...target, dir: directionBetween(current, target) }, true);
      if (sfx) emitSfx(sfx);
    },
    [commit],
  );

  const go = useCallback(
    (delta: Direction) => {
      moveTo(stepPosition(projects, stateRef.current, delta), delta > 0 ? 'next' : 'prev');
    },
    [projects, moveTo],
  );

  const jumpEdge = useCallback(
    (edge: 'first' | 'last') => {
      const { p } = stateRef.current;
      const length = projects[p]?.assets.length ?? 0;
      if (length === 0) return;
      moveTo({ p, a: edge === 'first' ? 0 : length - 1 }, edge === 'first' ? 'prev' : 'next');
    },
    [projects, moveTo],
  );

  const selectProject = useCallback(
    (p: number) => {
      if ((projects[p]?.assets.length ?? 0) === 0) return;
      moveTo({ p, a: 0 }, p >= stateRef.current.p ? 'next' : 'prev');
    },
    [projects, moveTo],
  );

  const selectAsset = useCallback(
    (a: number) => {
      const { p, a: current } = stateRef.current;
      if (a < 0 || a >= (projects[p]?.assets.length ?? 0)) return;
      moveTo({ p, a }, a >= current ? 'next' : 'prev');
    },
    [projects, moveTo],
  );

  const tick = useCallback(() => {
    const target = wrapWithinProject(projects, stateRef.current);
    if (target) commit({ ...target, dir: 1 }, false);
  }, [projects, commit]);

  return { state, go, jumpEdge, selectProject, selectAsset, tick };
}
