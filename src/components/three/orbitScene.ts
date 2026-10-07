import type * as T from 'three'
import { emitSfx } from './capability'
import { angleDelta, buildStarGeometry, createSoftDotTexture, damp } from './geometry'
import { PALETTE } from './palette'
import type { SceneController, SceneFactory, ThreeModule } from './ThreeCanvas'

export interface OrbitItem {
  readonly id: string
  readonly label: string
}

/** Latest props, mutated by the React component each render and read each frame. */
export interface OrbitState {
  items: readonly OrbitItem[]
  activeId: string
  onSelect: (id: string) => void
}

const RING_RADIUS = 2.1
const RING_TILT = 0.35
const FRONT_ANGLE = Math.PI / 2
const FIT_HALF_WIDTH = 2.8
const FIT_HALF_HEIGHT = 1.7
const ORB_RADIUS = 0.17
const HIT_RADIUS = 0.36
const RING_SEGMENTS = 128
const IDLE_RING_SPEED = 0.15

interface Orb {
  readonly group: T.Group
  readonly core: T.MeshBasicMaterial
  readonly halo: T.SpriteMaterial
  readonly haloSprite: T.Sprite
  emphasis: number
  hover: number
}

interface OrbShared {
  readonly sphere: T.SphereGeometry
  readonly hit: T.SphereGeometry
  readonly hitMaterial: T.MeshBasicMaterial
  readonly dot: T.Texture
  readonly idleColor: T.Color
  readonly activeColor: T.Color
}

function buildOrb(THREE: ThreeModule, shared: OrbShared, index: number): Orb {
  const group = new THREE.Group()
  const core = new THREE.MeshBasicMaterial({ color: PALETTE.tealLight, transparent: true, toneMapped: false })
  group.add(new THREE.Mesh(shared.sphere, core))
  const halo = new THREE.SpriteMaterial({
    map: shared.dot,
    color: PALETTE.tealLight,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const haloSprite = new THREE.Sprite(halo)
  group.add(haloSprite)
  const hit = new THREE.Mesh(shared.hit, shared.hitMaterial)
  hit.userData.index = index
  group.add(hit)
  return { group, core, halo, haloSprite, emphasis: 0, hover: 0 }
}

function buildRing(THREE: ThreeModule): T.LineLoop {
  const positions = new Float32Array(RING_SEGMENTS * 3)
  for (let i = 0; i < RING_SEGMENTS; i += 1) {
    const a = (i / RING_SEGMENTS) * Math.PI * 2
    positions[i * 3] = Math.cos(a) * RING_RADIUS
    positions[i * 3 + 2] = Math.sin(a) * RING_RADIUS
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.LineBasicMaterial({
    color: PALETTE.tealMid,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  })
  return new THREE.LineLoop(geometry, material)
}

/** Factory for the orbit selector scene. `tooltipRef` is an HTML overlay positioned from projected coords. */
export function createOrbitFactory(
  stateRef: { current: OrbitState },
  tooltipRef: { current: HTMLElement | null },
): SceneFactory {
  return (ctx): SceneController => {
    const { THREE, scene, camera, host } = ctx

    const dot = createSoftDotTexture(THREE)
    const shared: OrbShared = {
      sphere: new THREE.SphereGeometry(ORB_RADIUS, 24, 16),
      hit: new THREE.SphereGeometry(HIT_RADIUS, 8, 6),
      hitMaterial: new THREE.MeshBasicMaterial({ visible: false }),
      dot,
      idleColor: new THREE.Color(PALETTE.tealLight),
      activeColor: new THREE.Color(PALETTE.amberLight),
    }

    const tilt = new THREE.Group()
    tilt.rotation.x = RING_TILT
    scene.add(tilt)
    tilt.add(buildRing(THREE))

    // Dim central star with a faint halo.
    const centre = new THREE.Mesh(
      buildStarGeometry(THREE),
      new THREE.MeshBasicMaterial({
        color: PALETTE.tealMid,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    centre.scale.setScalar(0.5)
    tilt.add(centre)
    const centreHalo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: dot,
        color: PALETTE.tealMid,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    centreHalo.scale.set(2, 2, 1)
    tilt.add(centreHalo)

    const orbGroup = new THREE.Group()
    tilt.add(orbGroup)
    let orbs: Orb[] = []
    let orbsKey = ''
    let hitMeshes: T.Mesh[] = []

    const rebuildOrbs = (items: readonly OrbitItem[]): void => {
      for (const orb of orbs) {
        orbGroup.remove(orb.group)
        orb.core.dispose()
        orb.halo.dispose()
      }
      orbs = items.map((_, i) => buildOrb(THREE, shared, i))
      hitMeshes = []
      for (const orb of orbs) {
        orbGroup.add(orb.group)
        orb.group.traverse((node) => {
          if (node.userData.index !== undefined) hitMeshes.push(node as T.Mesh)
        })
      }
      orbsKey = items.map((item) => item.id).join('|')
    }

    // ---- interaction ---------------------------------------------------------------
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    let hovered = -1
    let width = 1
    let height = 1

    const pick = (clientX: number, clientY: number): number => {
      const rect = host.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return -1
      ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1))
      raycaster.setFromCamera(ndc, camera)
      const hit = raycaster.intersectObjects(hitMeshes, false)[0]
      return hit ? (hit.object.userData.index as number) : -1
    }

    const setHovered = (index: number): void => {
      if (index === hovered) return
      hovered = index
      host.style.cursor = index >= 0 ? 'pointer' : ''
    }

    const onMove = (event: PointerEvent): void => {
      if (event.pointerType === 'touch') return
      setHovered(pick(event.clientX, event.clientY))
    }
    const onLeave = (): void => setHovered(-1)
    const onClick = (event: MouseEvent): void => {
      const index = pick(event.clientX, event.clientY)
      const item = stateRef.current.items[index]
      if (!item) return
      emitSfx('click')
      stateRef.current.onSelect(item.id)
    }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    host.addEventListener('click', onClick)

    // ---- per-frame --------------------------------------------------------------------
    let ring = 0
    let ringPrimed = false
    const projected = new THREE.Vector3()
    const mixed = new THREE.Color()
    let tooltipText = ''
    let tooltipX = -1
    let tooltipY = -1
    let tooltipShown = false

    const updateTooltip = (index: number): void => {
      const el = tooltipRef.current
      if (!el) return
      const orb = orbs[index]
      const item = stateRef.current.items[index]
      if (!orb || !item) {
        if (tooltipShown) {
          el.style.opacity = '0'
          tooltipShown = false
        }
        return
      }
      if (tooltipText !== item.label) {
        el.textContent = item.label
        tooltipText = item.label
      }
      orb.group.getWorldPosition(projected)
      projected.project(camera)
      const x = Math.round((projected.x * 0.5 + 0.5) * width * 2) / 2
      const y = Math.round((-projected.y * 0.5 + 0.5) * height * 2) / 2
      if (x !== tooltipX || y !== tooltipY) {
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -190%)`
        tooltipX = x
        tooltipY = y
      }
      if (!tooltipShown) {
        el.style.opacity = '1'
        tooltipShown = true
      }
    }

    return {
      resize(w, h) {
        width = w
        height = h
        const tanHalfFov = Math.tan((camera.fov * Math.PI) / 360)
        const distance = Math.max(FIT_HALF_HEIGHT / tanHalfFov, FIT_HALF_WIDTH / (tanHalfFov * (w / h)))
        camera.position.set(0, distance * 0.14, distance)
        camera.lookAt(0, 0, 0)
      },

      update(dt, elapsed) {
        const state = stateRef.current
        const key = state.items.map((item) => item.id).join('|')
        if (key !== orbsKey) rebuildOrbs(state.items)

        const count = orbs.length
        const activeIndex = state.items.findIndex((item) => item.id === state.activeId)
        if (count > 0 && activeIndex >= 0) {
          const target = FRONT_ANGLE - (activeIndex / count) * Math.PI * 2
          if (!ringPrimed) {
            ring = target
            ringPrimed = true
          }
          ring += angleDelta(ring, target) * damp(4, dt)
        } else {
          ring += dt * IDLE_RING_SPEED
        }

        for (let i = 0; i < count; i += 1) {
          const orb = orbs[i]
          const angle = (i / count) * Math.PI * 2 + ring
          const depth = (Math.sin(angle) + 1) / 2
          orb.group.position.set(
            Math.cos(angle) * RING_RADIUS,
            Math.sin(elapsed * 0.8 + i * 1.7) * 0.05,
            Math.sin(angle) * RING_RADIUS,
          )
          orb.emphasis += ((i === activeIndex ? 1 : 0) - orb.emphasis) * damp(6, dt)
          orb.hover += ((i === hovered ? 1 : 0) - orb.hover) * damp(10, dt)

          const scale = (0.78 + depth * 0.22) * (1 + orb.emphasis * 0.65 + orb.hover * 0.25)
          orb.group.scale.setScalar(scale)
          mixed.lerpColors(shared.idleColor, shared.activeColor, orb.emphasis)
          orb.core.color.copy(mixed)
          orb.core.opacity = 0.5 + depth * 0.5
          orb.halo.color.copy(mixed)
          orb.halo.opacity = 0.2 + orb.emphasis * 0.45 + orb.hover * 0.3
          orb.haloSprite.scale.setScalar(1.1 + orb.emphasis * 0.8 + orb.hover * 0.3)
        }

        centre.rotation.y = elapsed * 0.4
        centre.scale.setScalar(0.5 + Math.sin(elapsed * 1.3) * 0.015)
        updateTooltip(hovered >= 0 ? hovered : activeIndex)
      },

      dispose() {
        host.removeEventListener('pointermove', onMove)
        host.removeEventListener('pointerleave', onLeave)
        host.removeEventListener('click', onClick)
        host.style.cursor = ''
        const el = tooltipRef.current
        if (el) el.style.opacity = '0'
      },
    }
  }
}
