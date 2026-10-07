'use client';

import { lazy, Suspense, type ComponentType } from 'react';
import { loadIsland } from '@/lib/after-paint';

interface FooterIslandProps {
  year: number;
}

/**
 * Server: the section renders synchronously into the HTML (content for crawlers, no layout shift).
 * Browser: its JavaScript is a separate chunk fetched after the first paint (lib/after-paint.ts);
 * until it arrives React keeps the server markup untouched and hydrates it once the chunk is in.
 * The `typeof window` branch is resolved at build time, so each build only contains one of them.
 */
const FooterSection: ComponentType<FooterIslandProps> =
  typeof window === 'undefined'
    ? (require('./FooterSection') as typeof import('./FooterSection')).default
    : lazy(() => loadIsland(() => import('./FooterSection')));

export default function FooterIsland({ year }: FooterIslandProps) {
  return (
    <Suspense fallback={null}>
      <FooterSection year={year} />
    </Suspense>
  );
}
