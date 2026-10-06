/**
 * Tiny, dependency-free capability helpers for the Three.js layer.
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
