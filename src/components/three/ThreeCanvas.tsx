'use client'

/**
 * Shared Three.js plumbing (internal). Only the small, always-needed part lives here:
 *  - the stage / scene types every scene module imports,
 *  - useThreeStage(): React hook that gates the whole WebGL stack behind a capability probe,
 *    idle-after-load or near-viewport, and is safe under StrictMode double mount.
 * Everything heavy (the renderer + frame loop in ./stage, the scene factories, three itself) is
 * fetched on demand by the hook, so none of it is part of the first-load JavaScript. Software-GL
 * browsers (PageSpeed / headless) never download any of it.
 */

import { useEffect, useRef, useState, type RefObject } from 'react'
import type * as T from 'three'
import {
  canUseWebGL,
  detectCapability,
  onInteractionOrDelay,
  whenNearViewport,
  type Capability,
  type DeviceTier,
} from './capability'

export type ThreeModule = typeof import('./threeLite')

export interface CameraSpec {
  readonly fov: number
  readonly near: number
  readonly far: number
  readonly position: readonly [number, number, number]
}

export interface StageContext {
  readonly THREE: ThreeModule
  readonly renderer: T.WebGLRenderer
  readonly scene: T.Scene
  readonly camera: T.PerspectiveCamera
  readonly canvas: HTMLCanvasElement
  /** Element the canvas lives in (pointer listeners usually go here). */
  readonly host: HTMLElement
  readonly capability: Capability
  readonly width: number
  readonly height: number
  readonly pixelRatio: number
}

export interface SceneController {
  /** Called once per rendered frame. `dt` is clamped seconds, `elapsed` accumulated seconds. */
  update(dt: number, elapsed: number): void
  /** Called on every size change (and once at start). */
  resize?(width: number, height: number, pixelRatio: number): void
  /** Release listeners / timers owned by the controller. Scene graph is disposed by the stage. */
  dispose?(): void
}

export type SceneFactory = (ctx: StageContext) => SceneController

/** Resolves the scene factory; called only once the stage is actually going to start. */
export type SceneLoader = () => Promise<SceneFactory>

export interface StageOptions {
  readonly host: HTMLElement
  readonly capability: Capability
  readonly factory: SceneFactory
  readonly antialias?: boolean
  /** Frame-rate ceiling (frames are skipped, not slowed). */
  readonly maxFps?: number
  readonly camera?: CameraSpec
  readonly onReady?: () => void
  readonly onUnavailable?: () => void
}

export interface StageHandle {
  dispose(): void
}

/** Three boots no earlier than this after navigation start (all pointer types). */
const DEFAULT_MIN_START_MS = 3500

export type StageStatus = 'pending' | 'ready' | 'unavailable'

export interface UseThreeStageOptions {
  /** 'idle' = after window load + idle callback; 'visible' = once near the viewport. */
  readonly start: 'idle' | 'visible'
  readonly antialias?: boolean
  readonly maxFps?: Partial<Record<DeviceTier, number>>
  readonly camera?: CameraSpec
  /**
   * Earliest boot time, in ms since navigation start (and never before the splash exits),
   * unless the visitor interacts first. Defaults to DEFAULT_MIN_START_MS.
   */
  readonly minStartMs?: number
}

/**
 * Mounts a lazily-loaded scene into `hostRef`. Returns 'pending' until the first frame
 * has rendered, 'ready' afterwards, or 'unavailable' (low tier / reduced motion /
 * Save-Data / no WebGL) so the caller can show its static fallback.
 */
export function useThreeStage(
  hostRef: RefObject<HTMLElement>,
  loadScene: SceneLoader,
  options: UseThreeStageOptions,
): StageStatus {
  const [status, setStatus] = useState<StageStatus>('pending')
  const loadSceneRef = useRef(loadScene)
  const optionsRef = useRef(options)

  useEffect(() => {
    loadSceneRef.current = loadScene
    optionsRef.current = options
  })

  const startMode = options.start

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const capability = detectCapability()
    if (capability.tier === 'low') {
      setStatus('unavailable')
      return undefined
    }
    setStatus('pending')

    let cancelled = false
    let stage: StageHandle | null = null
    const opts = optionsRef.current

    const begin = (): void => {
      if (cancelled) return
      // Software GL (PageSpeed workers, headless) is rejected later anyway: skip every chunk download.
      if (!canUseWebGL()) {
        setStatus('unavailable')
        return
      }
      Promise.all([import('./stage'), loadSceneRef.current()])
        .then(([{ createStage }, factory]) => {
          if (cancelled) return
          stage = createStage({
            host,
            capability,
            factory,
            antialias: opts.antialias,
            maxFps: opts.maxFps?.[capability.tier],
            camera: opts.camera,
            onReady: () => {
              if (!cancelled) setStatus('ready')
            },
            onUnavailable: () => {
              if (!cancelled) setStatus('unavailable')
            },
          })
        })
        .catch(() => {
          if (!cancelled) setStatus('unavailable')
        })
    }

    const minStartMs = opts.minStartMs ?? DEFAULT_MIN_START_MS
    let cancelDelay: (() => void) | null = null
    const cancelNear = startMode === 'idle' ? null : whenNearViewport(host, () => {
      cancelDelay = onInteractionOrDelay(begin, minStartMs)
    })
    if (startMode === 'idle') cancelDelay = onInteractionOrDelay(begin, minStartMs)
    const cancelGate = (): void => {
      cancelNear?.()
      cancelDelay?.()
    }

    return () => {
      cancelled = true
      cancelGate()
      stage?.dispose()
      stage = null
    }
  }, [hostRef, startMode])

  return status
}
