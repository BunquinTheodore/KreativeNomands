'use client';

import { lazy, Suspense, type ComponentType } from 'react';
import { loadIsland } from '@/lib/after-paint';
import type { PortfolioCardData } from './PortfolioSection';

interface PortfolioIslandProps {
  cards: readonly PortfolioCardData[];
}

/**
 * Server: the section renders synchronously into the HTML (content for crawlers, no layout shift).
 * Browser: its JavaScript is a separate chunk fetched after the first paint (lib/after-paint.ts);
 * until it arrives React keeps the server markup untouched and hydrates it once the chunk is in.
 * The `typeof window` branch is resolved at build time, so each build only contains one of them.
 */
const PortfolioSection: ComponentType<PortfolioIslandProps> =
  typeof window === 'undefined'
    ? (require('./PortfolioSection') as typeof import('./PortfolioSection')).default
    : lazy(() => loadIsland(() => import('./PortfolioSection')));

export default function PortfolioIsland({ cards }: PortfolioIslandProps) {
  return (
    <Suspense fallback={null}>
      <PortfolioSection cards={cards} />
    </Suspense>
  );
}
