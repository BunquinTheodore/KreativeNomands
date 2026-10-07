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
| `Marquee` | `<Marquee speed={40} direction="left" pauseOnHover gap={16}>imgs</Marquee>` CSS-only loop. `deferChildren` (+ `reserveHeight`, or a CSS `min-height` on `.kn-marquee__group`) mounts the children after hydration and fades the rail in: use it for rails of decorative images so they stay out of the server HTML and off the load-time network. |
| `GlassCard` | `<GlassCard href tilt glow shine>`; `href` uses next/link; `onClick` makes it a button-role div. |
| `SectionHeader` | `<SectionHeader eyebrow title subtitle align id />` one-line title + subtitle fitted to the title width. |
| `FitLine` | `<FitLine maxPx minPx fluid onFit match>` one-line shrink-to-fit text. All fits on the page run in one batched reset/measure/apply pass (`lib/fit.ts`), so there is one forced layout per frame, not one per line. |
| `ShineGate` | mounted once in the layout. Sets `data-off` on `.shine`, `.kp-sweep` and `[data-pause-offscreen]` elements that are far off-screen; globals.css pauses their looping animation. Add `data-pause-offscreen` to any element with an infinite non-compositable animation. |
| `DrawLine` | `<DrawLine axis="y\|x" targetRef />` draws with the scroll progress of its parent/target. |
| `ui/Button` | `<Button variant="primary\|glass\|ghost" href magnetic icon>`; `#id` hrefs smooth-scroll. |

Libs/hooks: `lib/sfx` (`sfx.play('click')`), `lib/scroll` (`scrollToId`, `useActiveSection`),
`hooks/useInView`, `usePrefersReducedMotion`, `useDeviceTier`, `useReveal`.

Notes
- Load-time budget (see `docs/REVAMP-PLAN.md`): nothing below the hero hydrates before the first paint. Sections are *islands* (`about/AboutIsland.tsx` etc.): the server renders the section markup inline into the HTML, the browser fetches the section's JavaScript behind `lib/after-paint.ts` (first contentful paint + 100 ms + idle, or the first input) and React hydrates it then. Fonts and the web manifest are started by one inline script after the first paint (`lib/post-paint.ts`); until then `--font-inter` / `--font-poppins` point at metric-matched fallbacks (globals.css). Keep new below-the-fold sections on the same pattern, and keep CSS imports in the *server* wrapper so the styles stay in the page stylesheet.
- Splash tempo: `.kn-splash { --k }` in fx.css scales every splash duration/delay (1 = the original 1.8 s intro, 0.62 now).
- SFX: delegated click on `a,button,[role=button],[data-sfx]`; hover on `[data-sfx-hover]` (GlassCard sets it);
  opt out with `data-sfx="none"`; `data-sfx="open"` etc. picks another sound. Sounds start after the first gesture.
- Subtitle fit is clamped to 11-24px; pick subtitles of similar length to the title for an exact width match.
- Reveal/SplitText/CountUp stay visible in SSR and arm after hydration; reduced motion never arms.
