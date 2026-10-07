'use client';

import { useEffect, useState } from 'react';

export type DeviceTier = 'high' | 'mid' | 'low';

interface NavigatorHints {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

/**
 * Coarse capability estimate from cores / memory / Save-Data / reduced motion.
 * Safe to call from effects and event handlers (returns 'mid' on the server).
 */
export function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'mid';
  const nav = navigator as Navigator & NavigatorHints;
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = nav.connection?.saveData === true;
  if (reduced || saveData) return 'low';

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  if (cores <= 2 || memory <= 2) return 'low';
  if (cores <= 4 || memory <= 4) return 'mid';
  return 'high';
}

/**
 * Returns 'mid' during SSR/first render (hydration-safe) and the measured tier
 * after mount.
 */
export default function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('mid');
  useEffect(() => {
    setTier(getDeviceTier());
  }, []);
  return tier;
}

export { useDeviceTier };
