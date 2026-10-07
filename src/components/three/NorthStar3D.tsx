'use client'

import { useCallback, useRef, type KeyboardEvent } from 'react'
import type { NorthStarHandle } from './northStarScene'
import { useThreeStage, type SceneLoader } from './ThreeCanvas'

export interface NorthStar3DProps {
  className?: string
  /** Pixel number or any CSS length. Defaults to 420. */
  height?: number | string
}

/**
 * Centered 598x626 window of the 1016x1064 logo PNG (same aspect ratio), resized to 512x536 and
 * palettised (~8 KB). It is exactly what the old full PNG looked like at scale(1.7), so no CSS
 * scale hack is needed and the mark still fills the stage like the 3D star does.
 */
const FALLBACK_SRC = '/logos/north-star-yellow-trim.png'
const FALLBACK_WIDTH = 512
const FALLBACK_HEIGHT = 536

const STAGE_OPTIONS = {
  start: 'visible',
  maxFps: { high: 60, mid: 45 },
  camera: { fov: 32, near: 0.1, far: 50, position: [0, 0, 4.2] },
} as const

const ARIA_LABEL = 'Interactive 3D Kreativ Nomads North Star. Drag to spin it, click for a burst of light.'

/**
 * Draggable, hoverable 3D North Star. Shows the static logo until WebGL has actually
 * rendered a frame (and permanently on low-end / reduced-motion / Save-Data / no WebGL).
 */
export default function NorthStar3D({ className, height = 420 }: NorthStar3DProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<NorthStarHandle | null>(null)
  // The scene code is its own chunk: fetched together with three, and only when WebGL will really start.
  const loadScene = useCallback<SceneLoader>(
    () => import('./northStarScene').then((scene) => scene.createNorthStarFactory(handleRef)),
    [],
  )
  const status = useThreeStage(stageRef, loadScene, STAGE_OPTIONS)
  const ready = status === 'ready'

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handleRef.current?.burst()
  }

  return (
    <div
      role="img"
      aria-label={ARIA_LABEL}
      tabIndex={ready ? 0 : undefined}
      onKeyDown={ready ? onKeyDown : undefined}
      className={`relative mx-auto w-full select-none overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950 ${className ?? ''}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        touchAction: 'pan-y',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FALLBACK_SRC}
        width={FALLBACK_WIDTH}
        height={FALLBACK_HEIGHT}
        alt=""
        decoding="async"
        loading="eager"
        fetchPriority="high"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-700"
        style={{ opacity: ready ? 0 : 1 }}
      />
      <div ref={stageRef} className="absolute inset-0" />
    </div>
  )
}
