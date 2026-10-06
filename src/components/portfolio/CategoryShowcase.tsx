'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { domAnimation, LazyMotion } from 'framer-motion';
import CategoryHeading from './CategoryHeading';
import CategoryNav from './CategoryNav';
import { getCategory, type CategoryId } from './categories';
import type { ShowcaseProject } from './data';
import { emitSfx, stepPosition, totalAssets } from './navigation';
import ProjectRail from './ProjectRail';
import StageViewer from './StageViewer';
import ThumbStrip from './ThumbStrip';
import TopBar from './TopBar';
import { useShowcaseState } from './useShowcaseState';
import './portfolio.css';

interface CategoryShowcaseProps {
  categoryId: CategoryId;
  /** Only this category's projects (never the whole portfolio.json). */
  projects: ShowcaseProject[];
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

/**
 * Single-viewport asset presentation: project rail, one asset at a time on a
 * glass stage, thumbnails and category pills. The page itself never scrolls
 * to view assets.
 */
export default function CategoryShowcase({ categoryId, projects }: CategoryShowcaseProps) {
  const router = useRouter();
  const category = getCategory(categoryId);
  const { state, go, jumpEdge, selectProject, selectAsset, tick } = useShowcaseState(projects);

  const project = projects[state.p];
  const assetTotal = totalAssets(projects);
  const canNavigate = assetTotal > 1;
  const browserMode = categoryId === 'it';

  const neighbours = useMemo(() => {
    const next = stepPosition(projects, state, 1);
    const prev = stepPosition(projects, state, -1);
    return [
      next ? projects[next.p]?.assets[next.a] : undefined,
      prev ? projects[prev.p]?.assets[prev.a] : undefined,
    ];
  }, [projects, state]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          go(1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          go(-1);
          break;
        case 'Home':
          event.preventDefault();
          jumpEdge('first');
          break;
        case 'End':
          event.preventDefault();
          jumpEdge('last');
          break;
        case 'Escape':
          // Fullscreen owns Escape; otherwise it closes the showcase.
          if (document.fullscreenElement || document.querySelector('[data-kp-pseudo-fs]')) return;
          emitSfx('close');
          router.push('/#portfolio');
          break;
        default:
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, jumpEdge, router]);

  if (!category) return null;

  return (
    <LazyMotion features={domAnimation} strict>
      <main
        aria-label={`${category.label} portfolio showcase`}
        className="mx-auto flex h-[100svh] min-h-[600px] w-full max-w-[1500px] flex-col gap-2.5 px-[clamp(0.75rem,3vw,2rem)] pb-3 sm:gap-3"
      >
        <TopBar />
        <CategoryHeading
          category={category}
          projectCount={projects.length}
          assetCount={assetTotal}
        />
        <ProjectRail projects={projects} activeIndex={state.p} onSelect={selectProject} />

        <div className="min-h-[260px] flex-1">
          <StageViewer
            project={project}
            assetIndex={state.a}
            direction={state.dir}
            projectIndex={state.p}
            projectCount={projects.length}
            browserMode={browserMode}
            canNavigate={canNavigate}
            neighbours={neighbours}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            onSlideshowTick={tick}
          />
        </div>

        {project && project.assets.length > 1 ? (
          <ThumbStrip project={project} activeIndex={state.a} onSelect={selectAsset} />
        ) : null}
        <CategoryNav currentId={categoryId} />
      </main>
    </LazyMotion>
  );
}
