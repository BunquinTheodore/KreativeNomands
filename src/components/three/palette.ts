/**
 * Brand palette for every Three.js scene. Values mirror the tailwind tokens
 * (primary / secondary / cream) so no new hues are introduced.
 */
export const PALETTE = {
  /** Page base, teal-black. */
  base: 0x0a1111,
  /** primary-950 */
  deep: 0x141f1f,
  /** primary-500 */
  teal: 0x3d5a5a,
  /** primary-400 */
  tealMid: 0x5a8585,
  /** primary-300 */
  tealLight: 0x8db1b1,
  /** secondary-500 */
  amber: 0xf59e0b,
  /** secondary-400 */
  amberLight: 0xfbbf24,
  /** cream-500 */
  cream: 0xf5f0dc,
} as const

export type PaletteKey = keyof typeof PALETTE

/** CSS radial-gradient used as the fallback / backdrop beneath the canvas. */
export const CSS_NIGHT_SKY =
  'radial-gradient(60% 40% at 82% 8%, rgba(245,158,11,0.07), transparent 70%),' +
  'radial-gradient(70% 55% at 12% 90%, rgba(90,133,133,0.10), transparent 70%),' +
  'radial-gradient(130% 100% at 50% 0%, #1b2e2e 0%, #141f1f 42%, #0a1111 100%)'

/** A handful of static pin-point stars for the no-WebGL fallback (cheap, paint-only). */
export const CSS_STATIC_STARS = [
  'radial-gradient(1.5px 1.5px at 12% 18%, rgba(245,240,220,0.65), transparent)',
  'radial-gradient(1px 1px at 27% 62%, rgba(245,240,220,0.5), transparent)',
  'radial-gradient(2px 2px at 41% 30%, rgba(245,158,11,0.55), transparent)',
  'radial-gradient(1px 1px at 58% 78%, rgba(141,177,177,0.6), transparent)',
  'radial-gradient(1.5px 1.5px at 71% 22%, rgba(245,240,220,0.6), transparent)',
  'radial-gradient(1px 1px at 84% 55%, rgba(251,191,36,0.5), transparent)',
  'radial-gradient(1.5px 1.5px at 93% 86%, rgba(245,240,220,0.5), transparent)',
  'radial-gradient(1px 1px at 6% 82%, rgba(141,177,177,0.5), transparent)',
].join(',')
