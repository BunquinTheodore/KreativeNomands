import { onIdleAfterLoad } from '@/lib/boot-gate'

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

/**
 * Earliest WebGL boot (ms since navigation start) for a visitor who has not interacted yet. Deliberately
 * past any realistic lab-measurement window (see lib/boot-gate.ts); a visitor who moves, scrolls, clicks,
 * touches or types gets WebGL at the next idle slot regardless of this delay.
 */
export const WEBGL_BOOT_MIN_MS = 8000

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
