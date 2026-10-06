'use client';

import { lazy, Suspense, type ComponentType } from 'react';
import { loadIsland } from '@/lib/after-paint';

/**
 * Server: the section renders synchronously into the HTML (content for crawlers, no layout shift).
 * Browser: its JavaScript is a separate chunk fetched after the first paint (lib/after-paint.ts);
 * until it arrives React keeps the server markup untouched and hydrates it once the chunk is in.
 * The `typeof window` branch is resolved at build time, so each build only contains one of them.
 */
const ServicesSection: ComponentType =
  typeof window === 'undefined'
    ? (require('./ServicesSection') as typeof import('./ServicesSection')).default
    : lazy(() => loadIsland(() => import('./ServicesSection')));

export default function ServicesIsland() {
  return (
    <Suspense fallback={null}>
      <ServicesSection />
    </Suspense>
  );
}
