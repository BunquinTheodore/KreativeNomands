import type * as T from 'three'
import { emitSfx } from './capability'
import { buildStarGeometry, createSoftDotTexture, damp, mulberry32, STAR_RING_RADIUS } from './geometry'
import { PALETTE } from './palette'
import type { SceneController, SceneFactory, ThreeModule } from './ThreeCanvas'

export interface NorthStarHandle {
  /** Particle burst + quick spin (same as a click). */
  burst(): void
}

const AUTO_SPIN = 0.35
const MAX_SPIN = 14
const CLICK_KICK = 9
const DRAG_RAD_PER_PX = 0.012
const CLICK_MAX_MOVE_PX = 6
const CLICK_MAX_MS = 450
const RECT_REFRESH_S = 0.25
const ORBIT_PARTICLES = 140
const BURST_PARTICLES = 56
const BURST_LIFE_S = 1.1
const FIT_HALF_WIDTH = 1.65
const FIT_HALF_HEIGHT = 1.25

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v))

function buildOrbitParticles(THREE: ThreeModule, dot: T.Texture): T.Points {
  const rand = mulberry32(0x6b6e)
  const positions = new Float32Array(ORBIT_PARTICLES * 3)
  const colors = new Float32Array(ORBIT_PARTICLES * 3)
  const tint = new THREE.Color()
  for (let i = 0; i < ORBIT_PARTICLES; i += 1) {
    const angle = rand() * Math.PI * 2
    const radius = 1.3 + (rand() - 0.5) * 0.36
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = (rand() - 0.5) * 0.14
    positions[i * 3 + 2] = Math.sin(angle) * radius
    const roll = rand()
    tint.setHex(roll < 0.5 ? PALETTE.cream : roll < 0.8 ? PALETTE.amberLight : PALETTE.tealLight)
    colors.set([tint.r, tint.g, tint.b], i * 3)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({
    size: 0.05,
    map: dot,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return new THREE.Points(geometry, material)
}

interface BurstSystem {
  readonly points: T.Points
  fire(): void
  step(dt: number): void
}

function buildBurst(THREE: ThreeModule, dot: T.Texture): BurstSystem {
  const rand = mulberry32(0x6275)
  const positions = new Float32Array(BURST_PARTICLES * 3)
  const velocities = new Float32Array(BURST_PARTICLES * 3)
  const geometry = new THREE.BufferGeometry()
  const attribute = new THREE.BufferAttribute(positions, 3)
  geometry.setAttribute('position', attribute)
  const material = new THREE.PointsMaterial({
    size: 0.09,
    map: dot,
    color: PALETTE.amberLight,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  points.visible = false
  let life = 0

  return {
    points,
    fire() {
      for (let i = 0; i < BURST_PARTICLES; i += 1) {
        const theta = rand() * Math.PI * 2
        const z = rand() * 1.4 - 0.4
        const flat = Math.sqrt(Math.max(0, 1 - z * z))
        const speed = 1.4 + rand() * 2
        positions[i * 3] = 0
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = 0.1
        velocities[i * 3] = Math.cos(theta) * flat * speed
        velocities[i * 3 + 1] = Math.sin(theta) * flat * speed
        velocities[i * 3 + 2] = z * speed
      }
      attribute.needsUpdate = true
      life = 1
      points.visible = true
    },
    step(dt) {
      if (life <= 0) return
      life = Math.max(0, life - dt / BURST_LIFE_S)
      const drag = Math.exp(-2 * dt)
      for (let i = 0; i < BURST_PARTICLES * 3; i += 1) {
        positions[i] += velocities[i] * dt
        velocities[i] *= drag
      }
      attribute.needsUpdate = true
      material.opacity = life * life
      if (life === 0) points.visible = false
    },
  }
}

function addLights(THREE: ThreeModule, root: T.Object3D): { key: T.PointLight } {
  const ambient = new THREE.AmbientLight(PALETTE.cream, 0.55)
  const key = new THREE.PointLight(PALETTE.amberLight, 38, 0, 2)
  key.position.set(2.5, 2, 3.2)
  const fill = new THREE.PointLight(PALETTE.tealLight, 26, 0, 2)
  fill.position.set(-3, -1.5, 2.8)
  const rim = new THREE.PointLight(PALETTE.cream, 16, 0, 2)
  rim.position.set(0, 2.5, -2.5)
  root.add(ambient, key, fill, rim)
  return { key }
}

/** Factory for the hero 3D North Star scene. `handleRef` receives imperative controls. */
export function createNorthStarFactory(handleRef: { current: NorthStarHandle | null }): SceneFactory {
  return (ctx): SceneController => {
    const { THREE, renderer, scene, camera, host } = ctx
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    camera.position.set(0, 0, 4.2)

    const dot = createSoftDotTexture(THREE)
    const root = new THREE.Group()
    const spinner = new THREE.Group()
    root.add(spinner)
    scene.add(root)
    const { key } = addLights(THREE, scene)

    const starGeometry = buildStarGeometry(THREE)
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: PALETTE.amber,
      metalness: 0.6,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
      emissive: PALETTE.tealMid,
      emissiveIntensity: 0.14,
      side: THREE.DoubleSide,
    })
    spinner.add(new THREE.Mesh(starGeometry, bodyMaterial))

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: PALETTE.tealLight,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const innerGlow = new THREE.Mesh(starGeometry, glowMaterial)
    innerGlow.scale.set(0.58, 0.58, 1.3)
    spinner.add(innerGlow)

    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: PALETTE.amberLight,
      metalness: 0.7,
      roughness: 0.3,
      clearcoat: 0.8,
    })
    spinner.add(new THREE.Mesh(new THREE.TorusGeometry(STAR_RING_RADIUS, 0.014, 8, 96), ringMaterial))

    const haloMaterial = new THREE.SpriteMaterial({
      map: dot,
      color: PALETTE.amber,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const halo = new THREE.Sprite(haloMaterial)
    halo.scale.set(3.4, 3.4, 1)
    halo.position.z = -0.4
    root.add(halo)

    const orbitTilt = new THREE.Group()
    orbitTilt.rotation.set(1.15, 0, 0.25)
    const orbit = buildOrbitParticles(THREE, dot)
    orbitTilt.add(orbit)
    root.add(orbitTilt)

    const burst = buildBurst(THREE, dot)
    root.add(burst.points)

    // ---- interaction state -------------------------------------------------------
    let yaw = 0
    let yawVel = AUTO_SPIN
    let pulse = 0
    let hover = 0
    let inside = false
    let dragging = false
    let pointerId = -1
    let lastX = 0
    let lastT = 0
    let downX = 0
    let downY = 0
    let downT = 0
    let travelled = 0
    let cursorX = 0
    let cursorY = 0
    let hasCursor = false
    let rect = host.getBoundingClientRect()
    let rectAt = 0
    const tilt = { x: 0, y: 0 }

    const triggerBurst = (): void => {
      burst.fire()
      pulse = 1
      yawVel = Math.min(MAX_SPIN, yawVel + CLICK_KICK)
      emitSfx('whoosh')
    }
    handleRef.current = { burst: triggerBurst }

    const onEnter = (event: PointerEvent): void => {
      if (event.pointerType === 'mouse') inside = true
    }
    const onLeave = (): void => {
      inside = false
    }
    const onDown = (event: PointerEvent): void => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      dragging = true
      inside = true
      pointerId = event.pointerId
      lastX = downX = event.clientX
      downY = event.clientY
      lastT = downT = event.timeStamp
      travelled = 0
      try {
        host.setPointerCapture(event.pointerId)
      } catch {
        /* capture is a nicety; dragging still works without it */
      }
      host.style.cursor = 'grabbing'
    }
    const onMove = (event: PointerEvent): void => {
      if (!dragging || event.pointerId !== pointerId) return
      const dx = event.clientX - lastX
      const dtSec = Math.max(0.008, (event.timeStamp - lastT) / 1000)
      yaw += dx * DRAG_RAD_PER_PX
      yawVel = clamp(yawVel * 0.4 + ((dx * DRAG_RAD_PER_PX) / dtSec) * 0.6, -MAX_SPIN, MAX_SPIN)
      travelled = Math.max(travelled, Math.hypot(event.clientX - downX, event.clientY - downY))
      lastX = event.clientX
      lastT = event.timeStamp
    }
    const endDrag = (event: PointerEvent): void => {
      if (!dragging || event.pointerId !== pointerId) return
      dragging = false
      host.style.cursor = 'grab'
      try {
        host.releasePointerCapture(event.pointerId)
      } catch {
        /* already released */
      }
      if (event.pointerType !== 'mouse') inside = false
      const isTap = event.type === 'pointerup' && travelled < CLICK_MAX_MOVE_PX && event.timeStamp - downT < CLICK_MAX_MS
      if (isTap) triggerBurst()
    }
    const onWindowMove = (event: PointerEvent): void => {
      cursorX = event.clientX
      cursorY = event.clientY
      hasCursor = true
    }

    host.addEventListener('pointerenter', onEnter)
    host.addEventListener('pointerleave', onLeave)
    host.addEventListener('pointerdown', onDown)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerup', endDrag)
    host.addEventListener('pointercancel', endDrag)
    window.addEventListener('pointermove', onWindowMove, { passive: true })
    host.style.cursor = 'grab'

    const tanHalfFov = Math.tan((camera.fov * Math.PI) / 360)

    return {
      resize(width, height) {
        const aspect = width / height
        const fitV = FIT_HALF_HEIGHT / tanHalfFov
        const fitH = FIT_HALF_WIDTH / (tanHalfFov * aspect)
        camera.position.z = Math.max(fitV, fitH)
        rect = host.getBoundingClientRect()
      },

      update(dt, elapsed) {
        if (elapsed - rectAt > RECT_REFRESH_S) {
          rect = host.getBoundingClientRect()
          rectAt = elapsed
        }
        if (hasCursor) {
          const half = Math.max(1, window.innerWidth * 0.5)
          const halfV = Math.max(1, window.innerHeight * 0.5)
          const targetX = clamp((cursorX - (rect.left + rect.width / 2)) / half, -1, 1)
          const targetY = clamp((cursorY - (rect.top + rect.height / 2)) / halfV, -1, 1)
          const kTilt = damp(5, dt)
          tilt.x += (targetX - tilt.x) * kTilt
          tilt.y += (targetY - tilt.y) * kTilt
        }

        hover += ((inside || dragging ? 1 : 0) - hover) * damp(7, dt)
        pulse = Math.max(0, pulse - dt * 1.6)

        if (dragging) {
          yawVel *= Math.exp(-dt * 6)
        } else {
          yawVel += (AUTO_SPIN - yawVel) * damp(0.9, dt)
          yaw += yawVel * dt
        }
        spinner.rotation.y = yaw
        root.rotation.x = tilt.y * 0.35
        root.rotation.y = tilt.x * 0.5
        root.position.y = Math.sin(elapsed * 0.9) * 0.05

        const throb = Math.sin(elapsed * 5) * 0.015 * hover
        root.scale.setScalar(1 + hover * 0.07 + throb + pulse * pulse * 0.14)
        bodyMaterial.emissiveIntensity = 0.14 + hover * 0.5 + pulse * 0.6
        glowMaterial.opacity = 0.3 + hover * 0.25 + pulse * 0.3
        haloMaterial.opacity = 0.28 + hover * 0.22 + pulse * 0.3
        key.position.x = 2.5 + tilt.x * 1.4
        key.position.y = 2 - tilt.y * 1.2
        orbit.rotation.y = elapsed * 0.3
        burst.step(dt)
      },

      dispose() {
        host.removeEventListener('pointerenter', onEnter)
        host.removeEventListener('pointerleave', onLeave)
        host.removeEventListener('pointerdown', onDown)
        host.removeEventListener('pointermove', onMove)
        host.removeEventListener('pointerup', endDrag)
        host.removeEventListener('pointercancel', endDrag)
        window.removeEventListener('pointermove', onWindowMove)
        host.style.cursor = ''
        handleRef.current = null
      },
    }
  }
}
