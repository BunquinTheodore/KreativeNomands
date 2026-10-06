'use client'

/**
 * Shared Three.js plumbing (internal). Provides:
 *  - createStage(): lazy `import('three')`, renderer factory (DPR cap, ResizeObserver
 *    sizing), a single rAF loop that pauses when offscreen / tab hidden / context lost,
 *    full GPU disposal, and a silent fallback when WebGL is unavailable.
 *  - useThreeStage(): React hook that gates createStage() behind idle-after-load or
 *    near-viewport and is safe under StrictMode double mount.
 */

import { useEffect, useRef, useState, type RefObject } from 'react'
import type * as T from 'three'
import {
  detectCapability,
  onIdleAfterLoad,
  whenNearViewport,
  type Capability,
  type DeviceTier,
} from './capability'

export type ThreeModule = typeof import('three')

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

const DEFAULT_CAMERA: CameraSpec = { fov: 50, near: 0.1, far: 200, position: [0, 0, 5] }
const MAX_FRAME_DT = 0.05
const FPS_JITTER_TOLERANCE = 0.9
const OFFSCREEN_MARGIN = '120px'

function disposeMaterial(material: T.Material): void {
  for (const value of Object.values(material)) {
    if (value && typeof value === 'object' && (value as T.Texture).isTexture) {
      ;(value as T.Texture).dispose()
    }
  }
  material.dispose()
}

/** Dispose every geometry, material and texture reachable from `root`. */
export function disposeObjectTree(root: T.Object3D): void {
  root.traverse((node) => {
    const renderable = node as Partial<T.Mesh>
    renderable.geometry?.dispose()
    const material = renderable.material
    if (Array.isArray(material)) material.forEach(disposeMaterial)
    else if (material) disposeMaterial(material)
  })
}

function createRenderer(
  THREE: ThreeModule,
  canvas: HTMLCanvasElement,
  antialias: boolean,
): T.WebGLRenderer | null {
  try {
    return new THREE.WebGLRenderer({
      canvas,
      antialias,
      alpha: true,
      stencil: false,
      powerPreference: 'high-performance',
      // Software GL (SwiftShader etc.) would tank frame times: use the static fallback instead.
      failIfMajorPerformanceCaveat: true,
    })
  } catch {
    return null
  }
}

function styleCanvas(canvas: HTMLCanvasElement): void {
  const s = canvas.style
  s.position = 'absolute'
  s.inset = '0'
  s.width = '100%'
  s.height = '100%'
  s.display = 'block'
  s.opacity = '0'
  s.transition = 'opacity 0.9s ease'
  canvas.setAttribute('aria-hidden', 'true')
}

/** Builds everything once three has loaded. Returns a teardown, or null when unavailable. */
function buildStage(THREE: ThreeModule, opts: StageOptions, fail: () => void): (() => void) | null {
  const { host, capability } = opts
  const canvas = document.createElement('canvas')
  styleCanvas(canvas)

  const renderer = createRenderer(THREE, canvas, opts.antialias ?? !capability.coarsePointer)
  if (!renderer) return null

  const spec = opts.camera ?? DEFAULT_CAMERA
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(spec.fov, 1, spec.near, spec.far)
  camera.position.set(spec.position[0], spec.position[1], spec.position[2])
  const pixelRatio = Math.min(window.devicePixelRatio || 1, capability.maxDpr)
  renderer.setPixelRatio(pixelRatio)
  renderer.setClearColor(0x000000, 0)

  const width = Math.max(1, host.clientWidth)
  const height = Math.max(1, host.clientHeight)
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  host.insertBefore(canvas, host.firstChild)

  let controller: SceneController
  try {
    controller = opts.factory({ THREE, renderer, scene, camera, canvas, host, capability, width, height, pixelRatio })
  } catch {
    disposeObjectTree(scene)
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
    return null
  }
  controller.resize?.(width, height, pixelRatio)

  let sized = host.clientWidth > 0 && host.clientHeight > 0
  let inView = true
  let contextLost = false
  let running = false
  let torn = false
  let revealed = false
  let rafId = 0
  let last = 0
  let elapsed = 0
  const minFrameDt = opts.maxFps ? 1 / opts.maxFps : 0

  const frame = (now: number): void => {
    rafId = requestAnimationFrame(frame)
    const rawDt = (now - last) / 1000
    if (minFrameDt > 0 && rawDt < minFrameDt * FPS_JITTER_TOLERANCE) return
    last = now
    const dt = Math.min(rawDt, MAX_FRAME_DT)
    elapsed += dt
    try {
      controller.update(dt, elapsed)
      renderer.render(scene, camera)
    } catch {
      fail()
      return
    }
    if (!revealed) {
      revealed = true
      canvas.style.opacity = '1'
      opts.onReady?.()
    }
  }

  const sync = (): void => {
    const shouldRun = !torn && sized && inView && !contextLost && !document.hidden
    if (shouldRun && !running) {
      running = true
      last = performance.now()
      rafId = requestAnimationFrame(frame)
    } else if (!shouldRun && running) {
      running = false
      cancelAnimationFrame(rafId)
    }
  }

  const onResize = (): void => {
    const w = host.clientWidth
    const h = host.clientHeight
    sized = w > 0 && h > 0
    if (sized) {
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      controller.resize?.(w, h, pixelRatio)
    }
    sync()
  }

  const resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(host)

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      const latest = entries[entries.length - 1]
      if (latest) {
        inView = latest.isIntersecting
        sync()
      }
    },
    { rootMargin: OFFSCREEN_MARGIN },
  )
  visibilityObserver.observe(host)

  const onContextLost = (event: Event): void => {
    event.preventDefault()
    contextLost = true
    sync()
  }
  const onContextRestored = (): void => {
    contextLost = false
    sync()
  }
  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)
  document.addEventListener('visibilitychange', sync)
  sync()

  return () => {
    torn = true
    sync()
    resizeObserver.disconnect()
    visibilityObserver.disconnect()
    document.removeEventListener('visibilitychange', sync)
    canvas.removeEventListener('webglcontextlost', onContextLost)
    canvas.removeEventListener('webglcontextrestored', onContextRestored)
    controller.dispose?.()
    disposeObjectTree(scene)
    scene.clear()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }
}

/** Imports three lazily, builds the stage and returns a handle. Never throws. */
export function createStage(opts: StageOptions): StageHandle {
  let disposed = false
  let teardown: (() => void) | null = null

  const release = (): void => {
    const fn = teardown
    teardown = null
    fn?.()
  }

  const fail = (): void => {
    release()
    if (!disposed) opts.onUnavailable?.()
  }

  const start = async (): Promise<void> => {
    let THREE: ThreeModule
    try {
      THREE = await import('three')
    } catch {
      if (!disposed) opts.onUnavailable?.()
      return
    }
    if (disposed) return
    teardown = buildStage(THREE, opts, fail)
    if (!teardown && !disposed) opts.onUnavailable?.()
  }
  void start()

  return {
    dispose() {
      disposed = true
      release()
    },
  }
}

export type StageStatus = 'pending' | 'ready' | 'unavailable'

export interface UseThreeStageOptions {
  /** 'idle' = after window load + idle callback; 'visible' = once near the viewport. */
  readonly start: 'idle' | 'visible'
  readonly antialias?: boolean
  readonly maxFps?: Partial<Record<DeviceTier, number>>
  readonly camera?: CameraSpec
}

/**
 * Mounts a lazily-loaded scene into `hostRef`. Returns 'pending' until the first frame
 * has rendered, 'ready' afterwards, or 'unavailable' (low tier / reduced motion /
 * Save-Data / no WebGL) so the caller can show its static fallback.
 */
export function useThreeStage(
  hostRef: RefObject<HTMLElement>,
  factory: SceneFactory,
  options: UseThreeStageOptions,
): StageStatus {
  const [status, setStatus] = useState<StageStatus>('pending')
  const factoryRef = useRef(factory)
  const optionsRef = useRef(options)

  useEffect(() => {
    factoryRef.current = factory
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
      stage = createStage({
        host,
        capability,
        factory: (ctx) => factoryRef.current(ctx),
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
    }

    const cancelGate = startMode === 'idle' ? onIdleAfterLoad(begin) : whenNearViewport(host, begin)

    return () => {
      cancelled = true
      cancelGate()
      stage?.dispose()
      stage = null
    }
  }, [hostRef, startMode])

  return status
}
