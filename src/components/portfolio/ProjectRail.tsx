'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import type { ShowcaseProject } from './data';
import ProgressLine from './ProgressLine';
import { useCenterActive } from './useStageHooks';

interface ProjectRailProps {
  projects: readonly ShowcaseProject[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const EDGE_EPSILON_PX = 2;
const SCROLL_FRACTION = 0.8;

/**
 * Horizontally scrolling / draggable project chips (scroll-snap, arrow
 * buttons, active highlight, sideways progress line). Selecting a chip loads
 * that project's assets into the stage.
 */
export default function ProjectRail({ projects, activeIndex, onSelect }: ProjectRailProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: true });
  useCenterActive(rowRef, activeIndex);

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const start = row.scrollLeft <= EDGE_EPSILON_PX;
    const end = row.scrollLeft + row.clientWidth >= row.scrollWidth - EDGE_EPSILON_PX;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;
    measure();
    row.addEventListener('scroll', measure, { passive: true });
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(row);
    return () => {
      row.removeEventListener('scroll', measure);
      observer?.disconnect();
    };
  }, [measure, projects.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({
      left: direction * row.clientWidth * SCROLL_FRACTION,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  // Mouse drag-to-scroll (touch already scrolls natively).
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !rowRef.current) return;
    drag.current = { x: event.clientX, left: rowRef.current.scrollLeft, moved: false };
  };
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const row = rowRef.current;
    if (!state || !row) return;
    const dx = event.clientX - state.x;
    if (Math.abs(dx) > 5) state.moved = true;
    if (state.moved) row.scrollLeft = state.left - dx;
  };
  const endDrag = () => {
    suppressClick.current = Boolean(drag.current?.moved);
    drag.current = null;
    if (suppressClick.current) window.setTimeout(() => (suppressClick.current = false), 0);
  };

  if (projects.length === 0) return null;

  return (
    <div className="relative" role="region" aria-label="Projects">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          disabled={edges.start}
          aria-label="Scroll projects left"
          className="kp-ctl glass shine !h-9 !w-9 max-sm:hidden"
        >
          <ChevronLeft className="relative z-10 h-4 w-4" aria-hidden="true" />
        </button>

        <div
          ref={rowRef}
          className="kp-row relative min-w-0 flex-1 py-1.5 [mask-image:linear-gradient(90deg,transparent,#000_20px,#000_calc(100%-20px),transparent)]"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={(event) => {
            if (suppressClick.current) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        >
          {projects.map((project, index) => {
            const active = index === activeIndex;
            const disabled = project.assets.length === 0;
            return (
              <button
                key={project.id}
                type="button"
                data-sfx="none"
                data-sfx-hover=""
                disabled={disabled}
                aria-current={active ? 'true' : undefined}
                aria-label={`${project.title}, ${project.assets.length} ${
                  project.assets.length === 1 ? 'asset' : 'assets'
                }`}
                title={project.title}
                onClick={() => onSelect(index)}
                className="kp-chip glass shine"
              >
                <Image
                  src={project.thumbnail}
                  alt=""
                  width={64}
                  height={64}
                  sizes="32px"
                  draggable={false}
                  className="relative z-10 h-8 w-8 flex-none rounded-full object-cover"
                />
                <span className="relative z-10 min-w-0 truncate">{project.title}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollByPage(1)}
          disabled={edges.end}
          aria-label="Scroll projects right"
          className="kp-ctl glass shine !h-9 !w-9 max-sm:hidden"
        >
          <ChevronRight className="relative z-10 h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <ProgressLine
        value={projects.length > 0 ? (activeIndex + 1) / projects.length : 0}
        className="mt-1.5"
      />
    </div>
  );
}
