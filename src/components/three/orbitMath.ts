/**
 * Pure angle helpers for the services orbit. Kept free of three.js so they can
 * be unit tested in isolation.
 *
 * Orientation: the camera sits on +z looking at the origin, and an orb at
 * angle `a` is placed at (cos a, _, sin a). A rising angle therefore moves an
 * orb right, then to the front, then left, which reads as CLOCKWISE when the
 * ring is seen from above. Every helper here is written so that "Next"
 * (01 to 02 to 03 to 04 to 01) raises the ring angle and turns the orbit
 * clockwise, with the next orb entering the front from the right.
 */

const TWO_PI = Math.PI * 2
/** Tolerance for treating a wrapped delta as an exact half turn. */
const HALF_TURN_EPSILON = 1e-6

/** Angle of orb `i` of `count` for the given ring rotation. Later orbs sit clockwise behind earlier ones. */
export function orbAngle(i: number, count: number, ring: number): number {
  return ring - (i / count) * TWO_PI
}

/** Ring rotation that brings orb `activeIndex` to the `front` angle. */
export function targetRing(activeIndex: number, count: number, front: number): number {
  return front + (activeIndex / count) * TWO_PI
}

/**
 * Shortest signed delta from `from` to `to`, wrapped into (-π, π]. An exact
 * half turn (within HALF_TURN_EPSILON) resolves to +π so ambiguous jumps such
 * as 01 to 03 with four orbs still turn clockwise.
 */
export function clockwiseDelta(from: number, to: number): number {
  let d = (to - from) % TWO_PI
  if (d > Math.PI) d -= TWO_PI
  else if (d <= -Math.PI) d += TWO_PI
  if (Math.abs(Math.abs(d) - Math.PI) <= HALF_TURN_EPSILON) return Math.PI
  return d
}
