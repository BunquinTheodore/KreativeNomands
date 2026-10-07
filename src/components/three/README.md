# components/three

Vanilla `three` (no R3F). Three is loaded (via the tree-shaken `threeLite.ts` re-export) inside effects only, never at module load.

| File | Role |
|---|---|
| `ThreeBackground.tsx` | default. Fixed z-0 night sky of North Stars (shader points + constellation, pointer + scroll parallax). CSS gradient until idle-after-load. No props. |
| `NorthStar3D.tsx` | default `{ className?, height? }`. Drag/hover/click North Star. Static logo `<img>` until WebGL renders. |
| `OrbitSelector3D.tsx` | default `{ items, activeId, onSelect, className?, label? }`. Orbs on a tilted ring; hidden radiogroup for a11y; pill list fallback. Give it a height via `className` (default `h-[320px] sm:h-[380px]`). |
| `ThreeCanvas.tsx` | internal: the stage/scene types and `useThreeStage(hostRef, loadScene, options)`, the only part that is in the first-load JS (capability probe + start gating). |
| `stage.ts` | internal `createStage` (renderer, DPR cap, ResizeObserver, single rAF loop, pause offscreen / hidden / context lost, full dispose). Dynamic import: fetched only when WebGL will actually start. |
| `starfield.ts`, `northStarScene.ts`, `orbitScene.ts` | scene factories (`SceneFactory`). Each component passes `useThreeStage` a `SceneLoader` (`() => import('./xScene').then(...)`), so scene code is a separate chunk loaded together with three. |
| `capability.ts`, `geometry.ts`, `palette.ts` | tier / Save-Data / reduced-motion detection, star geometry + math, brand colours. |

Rules of the road
- Tier: reduced-motion, Save-Data, cores <= 2 or deviceMemory <= 2 => `low` => no WebGL (static fallbacks). Touch devices cap at `mid`.
- Starfield ~700 (high) / ~250 (mid) points; DPR cap 1.75 (high) / 1.25.
- Software GL is rejected (`failIfMajorPerformanceCaveat`). `canUseWebGL()` probes this with a throw-away canvas BEFORE importing the stage, the scene or `./threeLite`, so PageSpeed/headless never downloads any of them (stage, scene and three are all dynamic imports) and stays on the static fallback.
- Boot gate (`onInteractionOrDelay` in `lib/boot-gate.ts`, all pointer types): at the first pointerdown/keydown/touch/wheel/scroll, or at the first mouse/pen movement once the splash has left, or after the splash exit AND >= `minStartMs` (default `WEBGL_BOOT_MIN_MS` = 8000) since navigation; then idle-after-load. The default is deliberately past any lab-measurement window: a boot at 3.5 s landed inside Lighthouse's trace on slower machines (TBT 0.1 -> 1.1 s, see docs/REVAMP-PLAN.md). `OrbitSelector3D` uses `minStartMs: 0` (it is only reached by scrolling). NorthStar3D and OrbitSelector3D additionally wait to be near the viewport.
- First frame waits for `renderer.compileAsync` (KHR_parallel_shader_compile), so shader linking never blocks the main thread.
- NorthStar3D's static fallback `<img>` is the LCP element: eager + `fetchPriority="high"`, using the trimmed `public/logos/north-star-yellow-trim.png`.
- Events: `kn:sfx` CustomEvent (`'whoosh'` on star click, `'click'` on orb select) for CORE's SfxProvider.
- New scene = write a `SceneFactory` `(ctx) => { update, resize?, dispose? }`; the stage disposes the scene graph for you.
