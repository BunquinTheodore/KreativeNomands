'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { AnimatePresence, m, type Variants } from 'framer-motion';
import SplitText from '@/components/fx/SplitText';
import useInView from '@/hooks/useInView';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { assetLabel } from './assetText';
import BrowserSlide from './BrowserSlide';
import CaseStudySlide from './CaseStudySlide';
import type { ShowcaseAsset, ShowcaseProject } from './data';
import DriveSlide from './DriveSlide';
import ImageSlide from './ImageSlide';
import { emitSfx, type Direction } from './navigation';
import { BROWSER_SIZES, preloadStageImage, STAGE_SIZES } from './preload';
import { NavButton, TopControls } from './StageControls';
import { usePageVisible, useSaveData, useSlideTimer } from './useStageHooks';
import VideoSlide from './VideoSlide';

const SLIDESHOW_MS = 5000;
const SWIPE_PX = 48;
const SWIPE_RATIO = 1.4;

interface StageViewerProps {
  project: ShowcaseProject | undefined;
  assetIndex: number;
  direction: Direction;
  projectIndex: number;
  projectCount: number;
  /** IT category: screenshot in a browser frame instead of the media stage. */
  browserMode: boolean;
  canNavigate: boolean;
  /** Assets just before / after the current one (cross-project), for preloading. */
  neighbours: readonly (ShowcaseAsset | undefined)[];
  onPrev: () => void;
  onNext: () => void;
  onSlideshowTick: () => void;
}

const MOTION: Variants = {
  enter: (dir: Direction) => ({ opacity: 0, x: dir * 56, scale: 0.97, filter: 'blur(8px)' }),
  center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
  exit: (dir: Direction) => ({ opacity: 0, x: dir * -56, scale: 1.02, filter: 'blur(8px)' }),
};

const REDUCED_MOTION: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

function isFullscreenSupported(el: HTMLElement): boolean {
  return typeof el.requestFullscreen === 'function';
}

/** Images and (facade) Drive videos can be slideshown; local videos and case studies cannot. */
function isSlideshowKind(asset: ShowcaseAsset): boolean {
  return asset.kind === 'image' || asset.kind === 'drive';
}

interface SlideContext {
  project: ShowcaseProject;
  asset: ShowcaseAsset;
  browserMode: boolean;
  priority: boolean;
  canPlay: boolean;
  progressRef: RefObject<HTMLSpanElement>;
  driveActive: boolean;
  onActivateDrive: () => void;
}

/** The slide body for each asset kind (exhaustive: a new kind fails to compile here). */
function renderSlide({
  project,
  asset,
  browserMode,
  priority,
  canPlay,
  progressRef,
  driveActive,
  onActivateDrive,
}: SlideContext): ReactNode {
  const label = `${assetLabel(asset)}: ${project.title}`;
  switch (asset.kind) {
    case 'image':
      return browserMode ? (
        <BrowserSlide project={project} asset={asset} priority={priority} />
      ) : (
        <ImageSlide asset={asset} alt={label} priority={priority} />
      );
    case 'video':
      return <VideoSlide asset={asset} label={label} canPlay={canPlay} progressRef={progressRef} />;
    case 'drive':
      return (
        <DriveSlide
          asset={asset}
          label={label}
          priority={priority}
          active={driveActive}
          onActivate={onActivateDrive}
        />
      );
    case 'case-study':
      // The initial (server-rendered) slide shows its text at once; later slides stagger in.
      return <CaseStudySlide asset={asset} animateIn={!priority} />;
    default: {
      const exhaustive: never = asset.kind;
      return exhaustive;
    }
  }
}

export default function StageViewer({
  project,
  assetIndex,
  direction,
  projectIndex,
  projectCount,
  browserMode,
  canNavigate,
  neighbours,
  onPrev,
  onNext,
  onSlideshowTick,
}: StageViewerProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const pageVisible = usePageVisible();
  const saveData = useSaveData();
  const reduced = usePrefersReducedMotion();

  const asset = project?.assets[assetIndex];
  const assetTotal = project?.assets.length ?? 0;
  const slideKey = project && asset ? `${project.id}:${assetIndex}` : 'empty';
  const initialKey = useRef(slideKey).current;

  // A Drive player is mounted only after the viewer asks, and only for that slide: any navigation
  // forgets it (reset during render, so coming back shows the facade again, never a stale player).
  const [driveSlideKey, setDriveSlideKey] = useState<string | null>(null);
  const [lastSlideKey, setLastSlideKey] = useState(slideKey);
  if (lastSlideKey !== slideKey) {
    setLastSlideKey(slideKey);
    setDriveSlideKey(null);
  }
  const driveActive = asset?.kind === 'drive' && driveSlideKey === slideKey;

  // Slideshow: image / Drive-facade projects with more than one asset, on unless reduced motion.
  const slideshowAvailable = Boolean(
    project && assetTotal > 1 && project.assets.every(isSlideshowKind),
  );
  const [slideshowOn, setSlideshowOn] = useState(false);
  useEffect(() => setSlideshowOn(!reduced), [reduced]);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  // Never advance away from a playing Drive video.
  const running =
    slideshowOn &&
    slideshowAvailable &&
    inView &&
    pageVisible &&
    !hovered &&
    !keyboardFocus &&
    !driveActive;
  useSlideTimer(running, slideKey, SLIDESHOW_MS, onSlideshowTick);

  // Fullscreen with a CSS fallback where the API is missing (e.g. iOS Safari on a div).
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [pseudoFullscreen, setPseudoFullscreen] = useState(false);
  const fullscreen = nativeFullscreen || pseudoFullscreen;

  useEffect(() => {
    const sync = () => setNativeFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  useEffect(() => {
    if (!pseudoFullscreen) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setPseudoFullscreen(false);
      emitSfx('close');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pseudoFullscreen]);

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
      emitSfx('close');
      return;
    }
    if (pseudoFullscreen) {
      setPseudoFullscreen(false);
      emitSfx('close');
      return;
    }
    emitSfx('open');
    if (!isFullscreenSupported(el)) {
      setPseudoFullscreen(true);
      return;
    }
    el.requestFullscreen().catch(() => setPseudoFullscreen(true));
  }, [pseudoFullscreen]);

  // Warm the neighbouring images only (never videos), unless the viewer asked to save data.
  useEffect(() => {
    if (saveData) return;
    const sizes = browserMode ? BROWSER_SIZES : STAGE_SIZES;
    neighbours.forEach((neighbour) => preloadStageImage(neighbour, sizes));
  }, [neighbours, browserMode, saveData]);

  // Swipe / drag between assets.
  const drag = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // A touch swipe never produces a click, so clear the flag on every new press.
    swiped.current = false;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('[data-noswipe], a')) return;
    // Mouse drags over selectable text (case studies) select it instead of swiping.
    if (event.pointerType === 'mouse' && target.closest('[data-kp-selectable]')) return;
    drag.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    drag.current = null;
    if (!start || !canNavigate) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return;
    swiped.current = true;
    if (dx < 0) onNext();
    else onPrev();
  };
  const swallowClickAfterSwipe = (event: ReactMouseEvent) => {
    if (!swiped.current) return;
    swiped.current = false;
    event.stopPropagation();
    event.preventDefault();
  };

  const variants = reduced ? REDUCED_MOTION : MOTION;
  const counter = useMemo(() => {
    if (!project) return '0 / 0';
    return assetTotal > 1
      ? `${assetIndex + 1} / ${assetTotal}`
      : `${projectIndex + 1} / ${projectCount}`;
  }, [project, assetTotal, assetIndex, projectIndex, projectCount]);
  const counterLabel =
    assetTotal > 1
      ? `Asset ${assetIndex + 1} of ${assetTotal}`
      : `Project ${projectIndex + 1} of ${projectCount}`;
  // The caption box sits on media only: not in the IT browser frame, not over a case study (it has
  // its own title) and not over a playing Drive player (whose controls run along the bottom).
  const showCaption = Boolean(
    asset &&
      !(browserMode && asset.kind === 'image') &&
      asset.kind !== 'case-study' &&
      !driveActive,
  );
  // Phones: the arrows sit low wherever the slide has its own content to keep clear. A Drive facade
  // keeps them centred (its caption owns the bottom corner); only the mounted player needs them low.
  const arrowsLow = browserMode || asset?.kind === 'case-study' || driveActive;
  const timerStyle = {
    '--kp-ms': `${SLIDESHOW_MS}ms`,
    '--kp-state': running ? 'running' : 'paused',
  } as CSSProperties;

  const setRefs = (node: HTMLDivElement | null) => {
    stageRef.current = node;
    (viewRef as { current: HTMLDivElement | null }).current = node;
  };

  return (
    <div
      ref={setRefs}
      role="group"
      aria-roledescription="carousel"
      aria-label={project ? `${project.title} assets` : 'Portfolio assets'}
      data-kp-pseudo-fs={pseudoFullscreen ? '' : undefined}
      className={`kp-stage shine h-full ${pseudoFullscreen ? 'kp-stage--pseudo-fs' : ''}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onClickCapture={swallowClickAfterSwipe}
      onPointerEnter={(event) => setHovered(event.pointerType === 'mouse')}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => setKeyboardFocus(event.target.matches(':focus-visible'))}
      onBlur={() => setKeyboardFocus(false)}
    >
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        {project && asset ? (
          <m.div
            key={slideKey}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduced ? 0.15 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            role="group"
            aria-roledescription="slide"
            aria-label={counterLabel}
            className="absolute inset-0"
          >
            {renderSlide({
              project,
              asset,
              browserMode,
              priority: slideKey === initialKey,
              canPlay: inView && pageVisible,
              progressRef,
              driveActive,
              onActivateDrive: () => setDriveSlideKey(slideKey),
            })}
            {showCaption ? (
              <>
                <div className="kp-scrim" aria-hidden="true" />
                {/* Naming convention: line 1 Project Name, line 2 "Service · Type of Material". */}
                <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[2] flex max-w-[calc(100%-1.5rem)] flex-col gap-0.5 sm:inset-x-5 sm:bottom-5 sm:max-w-[70%]">
                  <p className="truncate font-display text-base font-semibold text-cream-500 sm:text-xl">
                    <SplitText text={asset.title} variant="blur" by="words" stagger={0.06} />
                  </p>
                  {asset.subtitle ? (
                    <p className="truncate text-xs text-cream-500/70 sm:text-sm">{asset.subtitle}</p>
                  ) : null}
                </div>
              </>
            ) : null}
          </m.div>
        ) : (
          <m.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center px-6 text-center text-cream-500/70"
          >
            No assets to show yet.
          </m.p>
        )}
      </AnimatePresence>

      {project && asset ? (
        <>
          <TopControls
            counter={counter}
            counterLabel={counterLabel}
            slideshowAvailable={slideshowAvailable}
            slideshowOn={slideshowOn}
            onToggleSlideshow={() => setSlideshowOn((value) => !value)}
            fullscreen={fullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
          {canNavigate ? (
            <>
              <NavButton side="prev" onClick={onPrev} lowOnMobile={arrowsLow} />
              <NavButton side="next" onClick={onNext} lowOnMobile={arrowsLow} />
            </>
          ) : null}
          <span className="kp-hair" aria-hidden="true">
            {slideshowOn && slideshowAvailable ? (
              <span
                key={slideKey}
                className="kp-hair__fill kp-hair__fill--timer"
                style={timerStyle}
              />
            ) : (
              <span ref={progressRef} className="kp-hair__fill" />
            )}
          </span>
          <p className="sr-only" aria-live="polite">
            {assetLabel(asset)}, {counterLabel}
          </p>
        </>
      ) : null}
    </div>
  );
}
