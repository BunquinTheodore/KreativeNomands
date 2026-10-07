'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface NetworkInformationLike {
  saveData?: boolean;
}

/** true while the tab is visible. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== 'hidden');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return visible;
}

/** Data Saver / Save-Data request (false on the server and on first render). */
export function useSaveData(): boolean {
  const [saveData, setSaveData] = useState(false);
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike })
      .connection;
    setSaveData(Boolean(connection?.saveData));
  }, []);
  return saveData;
}

/** Scrolls a horizontal row so the active child sits in the middle (row only, never the page). */
export function useCenterActive(rowRef: RefObject<HTMLElement>, activeIndex: number, key = ''): void {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const row = rowRef.current;
    const child = row?.children[activeIndex] as HTMLElement | undefined;
    if (!row || !child) return;
    const left = child.offsetLeft - (row.clientWidth - child.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' });
  }, [rowRef, activeIndex, reduced, key]);
}

/**
 * Calls `onDone` once `ms` of *running* time has passed on the current slide.
 * Pausing keeps the elapsed time; changing `slideKey` restarts the clock.
 */
export function useSlideTimer(
  running: boolean,
  slideKey: string,
  ms: number,
  onDone: () => void,
): void {
  const remaining = useRef(ms);
  const lastKey = useRef(slideKey);
  const callback = useRef(onDone);
  callback.current = onDone;

  useEffect(() => {
    if (lastKey.current !== slideKey) {
      lastKey.current = slideKey;
      remaining.current = ms;
    }
    if (!running) return undefined;
    const startedAt = performance.now();
    const timer = window.setTimeout(() => {
      remaining.current = ms;
      callback.current();
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - startedAt));
    };
  }, [running, slideKey, ms]);
}
