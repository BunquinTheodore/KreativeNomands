import type * as T from 'three'
import type { ThreeModule } from './ThreeCanvas'

/** Small deterministic PRNG so scene layouts are stable across StrictMode remounts. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ---- Kreativ Nomads North Star outline (measured from the logo mark) -------------- */

const DEG = Math.PI / 180
/** Tip lengths relative to the long vertical points. */
const TIP_VERTICAL = 1
const TIP_HORIZONTAL = 0.91
const TIP_DIAGONAL = 0.84
/** Inner "valley" vertices where points merge into the hub. */
const VALLEY_RADIUS = 0.18
const VALLEY_OFFSET_DEG = 34

/** Ring radius of the compass circle in the logo, relative to the vertical tip. */
export const STAR_RING_RADIUS = 0.59

interface OutlinePoint {
  readonly x: number
  readonly y: number
  readonly z: number
}

/** 16-vertex CCW outline: tip, valley, tip, valley ... starting at +X. */
function starOutline(valleyLift: number): readonly OutlinePoint[] {
  const points: OutlinePoint[] = []
  for (let k = 0; k < 8; k += 1) {
    const isMain = k % 2 === 0
    const isVertical = k % 4 === 2
    const tipAngle = k * 45 * DEG
    const tipLength = isMain ? (isVertical ? TIP_VERTICAL : TIP_HORIZONTAL) : TIP_DIAGONAL
    points.push({ x: Math.cos(tipAngle) * tipLength, y: Math.sin(tipAngle) * tipLength, z: 0 })

    // Valley after this tip: 34 degrees past a main axis, 34 degrees before the next main axis
    // when following a diagonal (i.e. 11 degrees past the diagonal).
    const valleyDeg = isMain ? k * 45 + VALLEY_OFFSET_DEG : (k + 1) * 45 - VALLEY_OFFSET_DEG
    const valleyAngle = valleyDeg * DEG
    points.push({
      x: Math.cos(valleyAngle) * VALLEY_RADIUS,
      y: Math.sin(valleyAngle) * VALLEY_RADIUS,
      z: valleyLift,
    })
  }
  return points
}

export interface StarGeometryOptions {
  /** Height of the hub above the outline plane. */
  readonly hubHeight?: number
  /** Extra lift of the valley vertices, creating the crease between facets. */
  readonly valleyLift?: number
}

/**
 * Faceted, double-sided North Star: a raised hub fanned out to a 16-vertex outline,
 * flat shaded. Long vertical points, shorter horizontals, thin diagonals (as in the logo).
 * Height of the long vertical points is 1 (spans -1..1 on Y).
 */
export function buildStarGeometry(THREE: ThreeModule, options: StarGeometryOptions = {}): T.BufferGeometry {
  const hub = options.hubHeight ?? 0.2
  const lift = options.valleyLift ?? 0.07
  const outline = starOutline(lift)
  const positions: number[] = []

  for (let i = 0; i < outline.length; i += 1) {
    const a = outline[i]
    const b = outline[(i + 1) % outline.length]
    const aBack = { ...a, z: -a.z }
    const bBack = { ...b, z: -b.z }
    // front facet (CCW seen from +Z)
    positions.push(0, 0, hub, a.x, a.y, a.z, b.x, b.y, b.z)
    // back facet (CCW seen from -Z)
    positions.push(0, 0, -hub, bBack.x, bBack.y, bBack.z, aBack.x, aBack.y, aBack.z)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

/** Soft white radial dot used as particle / halo sprite map. */
export function createSoftDotTexture(THREE: ThreeModule, size = 64): T.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const half = size / 2
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.35, 'rgba(255,255,255,0.45)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Shortest signed angular difference from `from` to `to`, in (-PI, PI]. */
export function angleDelta(from: number, to: number): number {
  const twoPi = Math.PI * 2
  let d = (to - from) % twoPi
  if (d > Math.PI) d -= twoPi
  if (d <= -Math.PI) d += twoPi
  return d
}

/** Framerate-independent smoothing factor for exponential lerps. */
export function damp(rate: number, dt: number): number {
  return 1 - Math.exp(-rate * dt)
}
