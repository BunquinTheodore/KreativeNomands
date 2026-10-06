'use client'

import { useRef } from 'react'
import { CSS_NIGHT_SKY, CSS_STATIC_STARS } from './palette'
import { createStarfield } from './starfield'
import { useThreeStage } from './ThreeCanvas'

const STAGE_OPTIONS = {
  start: 'idle',
  minStartMs: 3500,
  antialias: false,
  maxFps: { high: 60, mid: 40 },
  camera: { fov: 60, near: 0.5, far: 160, position: [0, 0, 28] },
} as const

/**
 * Fixed, full-viewport "night sky of North Stars". Paints a CSS gradient immediately and
 * lazily mounts the WebGL starfield after load + idle. Reduced-motion, Save-Data and
 * low-end devices keep the CSS-only sky.
 */
export default function ThreeBackground() {
  const stageRef = useRef<HTMLDivElement>(null)
  const status = useThreeStage(stageRef, createStarfield, STAGE_OPTIONS)
  const showStaticStars = status !== 'ready'

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-0 top-0 z-0 w-full overflow-hidden"
      style={{
        // Large viewport height: avoids resizing the GL buffer when mobile browser bars toggle.
        height: '100lvh',
        background: CSS_NIGHT_SKY,
        contain: 'strict',
      }}
    >
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ backgroundImage: CSS_STATIC_STARS, opacity: showStaticStars ? 1 : 0 }}
      />
      <div ref={stageRef} className="absolute inset-0" />
    </div>
  )
}
