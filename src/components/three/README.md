# components/three

Vanilla `three` (no R3F). Three is loaded with `import('three')` inside effects only, never at module load.

| File | Role |
|---|---|
| `ThreeBackground.tsx` | default. Fixed z-0 night sky of North Stars (shader points + constellation, pointer + scroll parallax). CSS gradient until idle-after-load. No props. |
| `NorthStar3D.tsx` | default `{ className?, height? }`. Drag/hover/click North Star. Static logo `<img>` until WebGL renders. |
| `OrbitSelector3D.tsx` | default `{ items, activeId, onSelect, className?, label? }`. Orbs on a tilted ring; hidden radiogroup for a11y; pill list fallback. Give it a height via `className` (default `h-[320px] sm:h-[380px]`). |
| `ThreeCanvas.tsx` | internal `createStage` + `useThreeStage` (renderer, DPR cap, ResizeObserver, single rAF loop, pause offscreen / hidden / context lost, full dispose). |
| `starfield.ts`, `northStarScene.ts`, `orbitScene.ts` | scene factories (`SceneFactory`). |
| `capability.ts`, `geometry.ts`, `palette.ts` | tier / Save-Data / reduced-motion detection, star geometry + math, brand colours. |

Rules of the road
- Tier: reduced-motion, Save-Data, cores <= 2 or deviceMemory <= 2 => `low` => no WebGL (static fallbacks). Touch devices cap at `mid`.
- Starfield ~700 (high) / ~250 (mid) points; DPR cap 1.75 (high) / 1.25.
- Software GL is rejected (`failIfMajorPerformanceCaveat`) so headless/PageSpeed falls back to static.
- Events: `kn:sfx` CustomEvent (`'whoosh'` on star click, `'click'` on orb select) for CORE's SfxProvider.
- New scene = write a `SceneFactory` `(ctx) => { update, resize?, dispose? }`; the stage disposes the scene graph for you.
