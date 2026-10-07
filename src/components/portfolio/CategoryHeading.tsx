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
 * One-line category title (scramble-in) with a one-line sub-heading. Both are
 * FitLines: they shrink to the available width instead of wrapping.
 */
export default function CategoryHeading({ category, projectCount, assetCount }: CategoryHeadingProps) {
  const Icon = category.icon;
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="font-display font-semibold leading-[1.08] tracking-tight text-cream-500">
          <FitLine maxPx={48} minPx={22} fluid="8vw">
            <SplitText text={category.label} variant="scramble" />
          </FitLine>
        </h1>
        <FitLine as="p" maxPx={16} minPx={10} fluid="3.4vw" className="mt-1 text-cream-500/70">
          {category.blurb}
        </FitLine>
      </div>
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
