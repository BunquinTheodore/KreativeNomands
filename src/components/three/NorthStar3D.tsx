'use client'

import { useMemo, useRef, type KeyboardEvent } from 'react'
import { createNorthStarFactory, type NorthStarHandle } from './northStarScene'
import { useThreeStage } from './ThreeCanvas'

export interface NorthStar3DProps {
  className?: string
  /** Pixel number or any CSS length. Defaults to 420. */
  height?: number | string
}

const FALLBACK_SRC = '/logos/North-Star-Icon-Yellow_Kreativ-Nomads.png'
/** Intrinsic size of the logo PNG (also reserves the aspect ratio for the <img>). */
const FALLBACK_WIDTH = 1016
const FALLBACK_HEIGHT = 1064
/** The mark only fills about half of the PNG, so scale it up to match the 3D star's size. */
const FALLBACK_SCALE = 1.7

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
  const factory = useMemo(() => createNorthStarFactory(handleRef), [])
  const status = useThreeStage(stageRef, factory, STAGE_OPTIONS)
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
      className={`relative mx-auto w-full select-none overflow-visible rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950 ${className ?? ''}`}
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
        loading="lazy"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-700"
        style={{ opacity: ready ? 0 : 1, transform: `scale(${FALLBACK_SCALE})` }}
      />
      <div ref={stageRef} className="absolute inset-0" />
    </div>
  )
}
