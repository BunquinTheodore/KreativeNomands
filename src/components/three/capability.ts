import { whenSplashExit } from '@/lib/splash-state'

/**
 * Tiny capability helpers for the Three.js layer.
 * Everything here is client-only: call from effects, never during render/SSR.
 */

export type DeviceTier = 'high' | 'mid' | 'low'

export interface Capability {
  readonly tier: DeviceTier
  readonly reducedMotion: boolean
  readonly saveData: boolean
  readonly coarsePointer: boolean
  /** Maximum devicePixelRatio the renderer may use. */
  readonly maxDpr: number
}

interface NavigatorExtras extends Navigator {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

const HIGH_TIER_DPR = 1.75
const LOW_TIER_DPR = 1.25

function matches(query: string): boolean {
  try {
    return window.matchMedia(query).matches
  } catch {
    return false
  }
}

export function detectCapability(): Capability {
  const nav = navigator as NavigatorExtras
  const reducedMotion = matches('(prefers-reduced-motion: reduce)')
  const saveData = nav.connection?.saveData === true
  const coarsePointer = matches('(pointer: coarse)')
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory

  let tier: DeviceTier
  if (reducedMotion || saveData) {
    tier = 'low'
  } else if (cores <= 2 || (memory !== undefined && memory <= 2)) {
    tier = 'low'
  } else if (!coarsePointer && cores >= 8 && (memory === undefined || memory >= 4)) {
    tier = 'high'
  } else {
    tier = 'mid'
  }

  return {
    tier,
    reducedMotion,
    saveData,
    coarsePointer,
    maxDpr: tier === 'high' ? HIGH_TIER_DPR : LOW_TIER_DPR,
  }
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

const IDLE_FALLBACK_MS = 1200
const IDLE_TIMEOUT_MS = 4000

/**
 * Runs `cb` once the window has loaded AND the main thread is idle, so heavy
 * work never competes with LCP. Returns a cancel function.
 */
export function onIdleAfterLoad(cb: () => void): () => void {
  const w = window as IdleWindow
  let cancelled = false
  let idleId: number | null = null
  let timerId: ReturnType<typeof setTimeout> | null = null

  const schedule = (): void => {
    if (cancelled) return
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(
        () => {
          if (!cancelled) cb()
        },
        { timeout: IDLE_TIMEOUT_MS },
      )
    } else {
      timerId = setTimeout(() => {
        if (!cancelled) cb()
      }, IDLE_FALLBACK_MS)
    }
  }

  const alreadyLoaded = document.readyState === 'complete'
  if (alreadyLoaded) {
    schedule()
  } else {
    window.addEventListener('load', schedule, { once: true })
  }

  return () => {
    cancelled = true
    window.removeEventListener('load', schedule)
    if (idleId !== null && typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(idleId)
    if (timerId !== null) clearTimeout(timerId)
  }
}

const INPUT_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'] as const

/**
 * Runs `cb` once, at the next idle slot after window load, on whichever comes first:
 *  - the visitor's first input (pointerdown / keydown / touch / wheel / scroll), or
 *  - the splash having exited AND `minMs` having elapsed since navigation start.
 * Keeps WebGL boot work (parse three, compile shaders) out of the load-time critical
 * window on every device class, while starting at once for someone who is interacting.
 */
export function onInteractionOrDelay(cb: () => void, minMs: number): () => void {
  let done = false
  let timerId: ReturnType<typeof setTimeout> | null = null
  let cancelIdle: (() => void) | null = null
  let cancelSplash: (() => void) | null = null

  const detach = (): void => {
    for (const name of INPUT_EVENTS) window.removeEventListener(name, fire, true)
  }
  function fire(): void {
    if (done) return
    done = true
    detach()
    if (timerId !== null) clearTimeout(timerId)
    cancelSplash?.()
    cancelIdle = onIdleAfterLoad(cb)
  }
  const armTimer = (): void => {
    if (done) return
    // performance.now() counts from navigation start, so a slow load does not pay the delay twice.
    const remaining = minMs - performance.now()
    if (remaining <= 0) fire()
    else timerId = setTimeout(fire, remaining)
  }
  for (const name of INPUT_EVENTS) {
    window.addEventListener(name, fire, { capture: true, passive: true, once: true })
  }
  cancelSplash = whenSplashExit(armTimer)
  return () => {
    done = true
    detach()
    if (timerId !== null) clearTimeout(timerId)
    cancelSplash?.()
    cancelIdle?.()
  }
}

let webglProbe: boolean | null = null

/**
 * Cheap WebGL capability probe, cached for the page's lifetime. Requests a context that
 * fails on software rasterisers (headless Chrome / PageSpeed workers use SwiftShader),
 * then releases it at once. Lets callers skip downloading three entirely.
 */
export function canUseWebGL(): boolean {
  if (webglProbe !== null) return webglProbe
  let ok = false
  try {
    const canvas = document.createElement('canvas')
    const attrs = { failIfMajorPerformanceCaveat: true }
    const gl =
      (canvas.getContext('webgl2', attrs) as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl', attrs) as WebGLRenderingContext | null)
    if (gl) {
      ok = true
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    ok = false
  }
  webglProbe = ok
  return ok
}

/** Calls `cb` once when `el` is within `rootMargin` of the viewport. Returns a cancel function. */
export function whenNearViewport(el: Element, cb: () => void, rootMargin = '240px'): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    return onIdleAfterLoad(cb)
  }
  let done = false
  const io = new IntersectionObserver(
    (entries) => {
      if (done) return
      if (entries.some((entry) => entry.isIntersecting)) {
        done = true
        io.disconnect()
        cb()
      }
    },
    { rootMargin },
  )
  io.observe(el)
  return () => {
    done = true
    io.disconnect()
  }
}

export type SfxEventName = 'whoosh' | 'click'

/** Fire-and-forget hook for CORE's SfxProvider (listens for `kn:sfx`). */
export function emitSfx(name: SfxEventName): void {
  try {
    window.dispatchEvent(new CustomEvent('kn:sfx', { detail: name }))
  } catch {
    /* sound is optional; never let it break interaction */
  }
}
