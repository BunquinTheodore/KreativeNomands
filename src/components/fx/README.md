# fx/ - experience layer

Import paths are stable. All components are client components that also render in the server HTML.
Styles: `src/app/globals.css` (tokens + utilities) and `./fx.css` (component styles, imported in `layout.tsx`).

| Component | Use |
|---|---|
| `Splash`, `Cursor`, `SfxProvider`, `ScrollProgressLine` | Mounted once in `layout.tsx`. Do not render elsewhere. |
| `SoundToggle` | `<SoundToggle />` glass mute button for the header. |
| `AnimatedLogo` | `<AnimatedLogo size={96} loop />` North-Star mark (draw, fill, orbit, shimmer). |
| `Reveal` | `<Reveal as="section" delay={0.1} y={24} x={0}>` scroll fade/slide. |
| `SplitText` | `<SplitText text="..." variant="rise\|blur\|wave\|flip\|mask\|scramble" by="chars\|words" stagger once />` |
| `Typewriter` | `<Typewriter phrases={['a','b']} />` |
| `CountUp` | `<CountUp to={120} prefix suffix duration />` |
| `Marquee` | `<Marquee speed={40} direction="left" pauseOnHover gap={16}>imgs</Marquee>` CSS-only loop. |
| `GlassCard` | `<GlassCard href tilt glow shine>`; `href` uses next/link; `onClick` makes it a button-role div. |
| `SectionHeader` | `<SectionHeader eyebrow title subtitle align id />` one-line title + subtitle fitted to the title width. |
| `FitLine` | `<FitLine maxPx minPx fluid onFit match>` one-line shrink-to-fit text. All fits on the page run in one batched reset/measure/apply pass (`lib/fit.ts`), so there is one forced layout per frame, not one per line. |
| `ShineGate` | mounted once in the layout. Sets `data-off` on `.shine`, `.kp-sweep` and `[data-pause-offscreen]` elements that are far off-screen; globals.css pauses their looping animation. Add `data-pause-offscreen` to any element with an infinite non-compositable animation. |
| `DrawLine` | `<DrawLine axis="y\|x" targetRef />` draws with the scroll progress of its parent/target. |
| `ui/Button` | `<Button variant="primary\|glass\|ghost" href magnetic icon>`; `#id` hrefs smooth-scroll. |

Libs/hooks: `lib/sfx` (`sfx.play('click')`), `lib/scroll` (`scrollToId`, `useActiveSection`),
`hooks/useInView`, `usePrefersReducedMotion`, `useDeviceTier`, `useReveal`.

Notes
- SFX: delegated click on `a,button,[role=button],[data-sfx]`; hover on `[data-sfx-hover]` (GlassCard sets it);
  opt out with `data-sfx="none"`; `data-sfx="open"` etc. picks another sound. Sounds start after the first gesture.
- Subtitle fit is clamped to 11-24px; pick subtitles of similar length to the title for an exact width match.
- Reveal/SplitText/CountUp stay visible in SSR and arm after hydration; reduced motion never arms.
