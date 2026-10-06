import type * as T from 'three'
import { damp, mulberry32 } from './geometry'
import { PALETTE } from './palette'
import type { SceneController, SceneFactory, ThreeModule } from './ThreeCanvas'

/* Night sky of North Stars: additive shader points + a faint constellation. */

const STARS_HIGH = 700
const STARS_MID = 250
const HEROES_HIGH = 14
const HEROES_MID = 8
const HAZE_COUNT = 6

const FIELD_X = 70
const FIELD_Y = 45
const FIELD_Z = 50
const GROUP_Z = -30
const FOG_NEAR = 30
const FOG_FAR = 115
const CAMERA_Z_START = 28
const CAMERA_Z_END = 12
const DESIGN_ASPECT = 1.7
const FIELD_SEED = 0x4b4e

const VERTEX = /* glsl */ `
attribute float aSize;
attribute float aSeed;
attribute vec3 aColor;
uniform float uTime;
uniform float uPxPerUnit;
uniform float uDpr;
uniform float uMaxSize;
uniform float uTwinkle;
uniform float uAlpha;
uniform float uFogNear;
uniform float uFogFar;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float dist = max(-mv.z, 0.001);
  float phase = uTime * (0.5 + aSeed * 1.6) + aSeed * 61.0;
  float tw = 1.0 - uTwinkle * 0.5 * (1.0 + sin(phase));
  float fog = smoothstep(uFogNear, uFogFar, dist);
  float nearFade = smoothstep(2.0, 9.0, dist);
  gl_PointSize = clamp(aSize * uPxPerUnit / dist, 1.2 * uDpr, uMaxSize * uDpr);
  vAlpha = tw * (1.0 - fog) * nearFade * uAlpha;
  vColor = aColor;
  gl_Position = projectionMatrix * mv;
}
`

const FRAGMENT = /* glsl */ `
uniform float uCore;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float halo = pow(1.0 - d, 2.2);
  float core = smoothstep(0.35, 0.0, d) * uCore;
  gl_FragColor = vec4(vColor * (1.0 + core), (halo + core) * vAlpha);
  #include <colorspace_fragment>
}
`

interface PointLayerOptions {
  readonly positions: Float32Array
  readonly sizes: Float32Array
  readonly seeds: Float32Array
  readonly colors: Float32Array
  readonly twinkle: number
  readonly alpha: number
  readonly core: number
  readonly maxSize: number
}

function createPointLayer(THREE: ThreeModule, o: PointLayerOptions): T.Points<T.BufferGeometry, T.ShaderMaterial> {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(o.positions, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(o.sizes, 1))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(o.seeds, 1))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(o.colors, 3))
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uPxPerUnit: { value: 600 },
      uDpr: { value: 1 },
      uMaxSize: { value: o.maxSize },
      uTwinkle: { value: o.twinkle },
      uAlpha: { value: o.alpha },
      uCore: { value: o.core },
      uFogNear: { value: FOG_NEAR },
      uFogFar: { value: FOG_FAR },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  return points
}

interface StarBuffers {
  readonly positions: Float32Array
  readonly sizes: Float32Array
  readonly seeds: Float32Array
  readonly colors: Float32Array
  readonly heroCount: number
}

function pickColor(THREE: ThreeModule, roll: number, hero: boolean, out: T.Color): T.Color {
  if (hero) return out.setHex(roll < 0.55 ? PALETTE.amberLight : PALETTE.cream)
  if (roll < 0.4) return out.setHex(PALETTE.cream)
  if (roll < 0.58) return out.setHex(roll < 0.5 ? PALETTE.amber : PALETTE.amberLight)
  return out.setHex(roll < 0.8 ? PALETTE.tealLight : PALETTE.tealMid)
}

/** Heroes occupy the first `heroCount` slots and are laid out inside the default view. */
function buildStarBuffers(THREE: ThreeModule, count: number, heroCount: number): StarBuffers {
  const rand = mulberry32(FIELD_SEED)
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const seeds = new Float32Array(count)
  const colors = new Float32Array(count * 3)
  const tint = new THREE.Color()

  for (let i = 0; i < count; i += 1) {
    const hero = i < heroCount
    if (hero) {
      positions[i * 3] = (rand() * 2 - 1) * FIELD_X * 0.55
      positions[i * 3 + 1] = (rand() * 2 - 1) * FIELD_Y * 0.5
      positions[i * 3 + 2] = -28 + rand() * 34
    } else {
      positions[i * 3] = (rand() * 2 - 1) * FIELD_X
      positions[i * 3 + 1] = (rand() * 2 - 1) * FIELD_Y
      positions[i * 3 + 2] = (rand() * 2 - 1) * FIELD_Z
    }
    const depthBias = rand()
    sizes[i] = hero ? 0.75 + rand() * 0.45 : 0.1 + depthBias * depthBias * 0.34
    seeds[i] = rand()
    pickColor(THREE, rand(), hero, tint)
    colors[i * 3] = tint.r
    colors[i * 3 + 1] = tint.g
    colors[i * 3 + 2] = tint.b
  }
  return { positions, sizes, seeds, colors, heroCount }
}

/** Connect every hero to its two nearest heroes (deduplicated). */
function buildConstellation(THREE: ThreeModule, positions: Float32Array, heroCount: number): T.LineSegments {
  const edges = new Set<string>()
  const segments: number[] = []
  for (let i = 0; i < heroCount; i += 1) {
    const dists: Array<{ j: number; d: number }> = []
    for (let j = 0; j < heroCount; j += 1) {
      if (j === i) continue
      const dx = positions[i * 3] - positions[j * 3]
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
      const dz = (positions[i * 3 + 2] - positions[j * 3 + 2]) * 0.4
      dists.push({ j, d: dx * dx + dy * dy + dz * dz })
    }
    dists.sort((a, b) => a.d - b.d)
    for (const { j } of dists.slice(0, 2)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (edges.has(key)) continue
      edges.add(key)
      segments.push(
        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
      )
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3))
  const material = new THREE.LineBasicMaterial({
    color: PALETTE.tealLight,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: true,
  })
  const lines = new THREE.LineSegments(geometry, material)
  lines.frustumCulled = false
  return lines
}

function buildHaze(THREE: ThreeModule): T.Points<T.BufferGeometry, T.ShaderMaterial> {
  const rand = mulberry32(FIELD_SEED + 7)
  const positions = new Float32Array(HAZE_COUNT * 3)
  const sizes = new Float32Array(HAZE_COUNT)
  const seeds = new Float32Array(HAZE_COUNT)
  const colors = new Float32Array(HAZE_COUNT * 3)
  const tint = new THREE.Color(PALETTE.teal)
  for (let i = 0; i < HAZE_COUNT; i += 1) {
    positions[i * 3] = (rand() * 2 - 1) * FIELD_X * 0.8
    positions[i * 3 + 1] = (rand() * 2 - 1) * FIELD_Y * 0.8
    positions[i * 3 + 2] = -30 - rand() * 20
    sizes[i] = 16 + rand() * 12
    seeds[i] = rand()
    colors.set([tint.r, tint.g, tint.b], i * 3)
  }
  return createPointLayer(THREE, { positions, sizes, seeds, colors, twinkle: 0, alpha: 0.09, core: 0, maxSize: 300 })
}

interface Pointer {
  x: number
  y: number
}

export const createStarfield: SceneFactory = (ctx): SceneController => {
  const { THREE, scene, camera, capability } = ctx
  const high = capability.tier === 'high'
  const starCount = high ? STARS_HIGH : STARS_MID
  const heroCount = high ? HEROES_HIGH : HEROES_MID

  scene.fog = new THREE.Fog(PALETTE.base, FOG_NEAR, FOG_FAR)

  const group = new THREE.Group()
  group.position.z = GROUP_Z
  scene.add(group)

  const buffers = buildStarBuffers(THREE, starCount, heroCount)
  const stars = createPointLayer(THREE, {
    positions: buffers.positions,
    sizes: buffers.sizes,
    seeds: buffers.seeds,
    colors: buffers.colors,
    twinkle: 0.65,
    alpha: 1,
    core: 0.7,
    maxSize: 40,
  })
  const constellation = buildConstellation(THREE, buffers.positions, heroCount)
  const haze = high ? buildHaze(THREE) : null
  if (haze) group.add(haze)
  group.add(constellation, stars)

  const layers = haze ? [stars, haze] : [stars]
  const lineMaterial = constellation.material as T.LineBasicMaterial
  const halfFov = (camera.fov * Math.PI) / 360

  // Input state: targets are written by listeners, smoothed values are used in update().
  const pointerTarget: Pointer = { x: 0, y: 0 }
  const pointerSmooth: Pointer = { x: 0, y: 0 }
  let scrollTarget = 0
  let scrollSmooth = 0
  let maxScroll = 1

  const refreshScrollExtent = (): void => {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    scrollTarget = Math.min(1, Math.max(0, window.scrollY / maxScroll))
  }
  const onScroll = (): void => {
    scrollTarget = Math.min(1, Math.max(0, window.scrollY / maxScroll))
  }
  const onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return
    pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2
    pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 2
  }

  refreshScrollExtent()
  scrollSmooth = scrollTarget
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  const extentObserver = new ResizeObserver(refreshScrollExtent)
  extentObserver.observe(document.documentElement)

  const lookTarget = new THREE.Vector3()

  return {
    resize(width, height, pixelRatio) {
      const pxPerUnit = (height * pixelRatio) / (2 * Math.tan(halfFov))
      for (const layer of layers) {
        layer.material.uniforms.uPxPerUnit.value = pxPerUnit
        layer.material.uniforms.uDpr.value = pixelRatio
      }
      // Squash the field horizontally on narrow screens so the constellation stays in view.
      const aspect = width / height
      group.scale.x = Math.min(1.25, Math.max(0.3, aspect / DESIGN_ASPECT))
    },

    update(dt, elapsed) {
      for (const layer of layers) layer.material.uniforms.uTime.value = elapsed

      const kPointer = damp(2.4, dt)
      pointerSmooth.x += (pointerTarget.x - pointerSmooth.x) * kPointer
      pointerSmooth.y += (pointerTarget.y - pointerSmooth.y) * kPointer
      scrollSmooth += (scrollTarget - scrollSmooth) * damp(3, dt)

      // Slow, bounded drift (never reveals the edges of the volume).
      group.rotation.y = Math.sin(elapsed * 0.035) * 0.16
      group.rotation.x = Math.sin(elapsed * 0.021) * 0.05
      group.position.y = Math.sin(elapsed * 0.05) * 1.2
      lineMaterial.opacity = 0.17 + Math.sin(elapsed * 0.5) * 0.05

      // Scroll = dolly + descent + roll; pointer = parallax.
      const sp = scrollSmooth
      camera.position.set(
        pointerSmooth.x * 3.5,
        -pointerSmooth.y * 2.2 - sp * 9,
        CAMERA_Z_START + (CAMERA_Z_END - CAMERA_Z_START) * sp,
      )
      lookTarget.set(pointerSmooth.x * 1.4, -sp * 7 - pointerSmooth.y * 0.8, GROUP_Z)
      camera.lookAt(lookTarget)
      camera.rotateZ(sp * 0.3 + pointerSmooth.x * 0.02)
    },

    dispose() {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      extentObserver.disconnect()
    },
  }
}
