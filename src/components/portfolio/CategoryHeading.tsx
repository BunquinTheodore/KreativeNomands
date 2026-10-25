'use client';

import FitLine from '@/components/fx/FitLine';
import SplitText from '@/components/fx/SplitText';
import { pluralize, type CategoryMeta } from './categories';

interface CategoryHeadingProps {
  category: CategoryMeta;
  projectCount: number;
  assetCount: number;
}

/**
 * One-line service title (scramble-in) with the project / asset counts. The
 * title is a FitLine: it shrinks to the available width instead of wrapping.
 */
export default function CategoryHeading({ category, projectCount, assetCount }: CategoryHeadingProps) {
  const Icon = category.icon;
  return (
    <div className="flex items-end justify-between gap-4">
      <h1 className="min-w-0 flex-1 font-display font-semibold leading-[1.08] tracking-tight text-cream-500">
        <FitLine maxPx={48} minPx={22} fluid="8vw">
          <SplitText text={category.label} variant="scramble" />
        </FitLine>
      </h1>
      <p className="hidden flex-none items-center gap-2 text-sm tabular-nums text-cream-500/60 sm:flex">
        <Icon className="h-4 w-4 text-secondary-400" aria-hidden="true" />
        <span>
          {pluralize(projectCount, 'Project')} <span aria-hidden="true">&bull;</span>{' '}
          {pluralize(assetCount, 'Asset')}
        </span>
      </p>
    </div>
  );
}
