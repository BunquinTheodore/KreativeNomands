# Kreativ Nomads — Revamp Plan & Interface Contracts

Stack stays: Next.js 14 App Router, TypeScript, Tailwind 3, framer-motion 11, `three` (vanilla, no R3F), `sharp` (dev, build-time media script).
Fonts stay: **Inter** (`font-sans`) + **Poppins** (`font-display`). Palette stays (tailwind tokens `primary-*` #3d5a5a family, `secondary/accent-*` amber #f59e0b, `cream-*` #f5f0dc, `dark-*`). No new hues.

## Art direction — "Midnight Forest & Amber"
Dark-only premium. Base `#0a1111`→`primary-950 #141f1f` depth, cream (`cream-500`) text, amber highlights, teal-green (`primary-300/400`) secondary light. Glass = `rgba(245,240,220,.06)` fill + `backdrop-blur(18px) saturate(140%)` + 1px `rgba(245,240,220,.14)` border + inner top highlight + a **continuously sweeping shine** (CSS keyframe, `::after` gradient, transform-only). Theme switching is deleted (`theme-context`, `ThemeToggle`, all `theme === 'dark'` ternaries).

## Global behaviours (all owned by CORE, available to every section)
- Splash on every load/refresh (≈1.8s, CSS/SVG only, no sessionStorage gating) with the animated logo, then reveals the page.
- Custom cursor `public/cursor/pointer.svg` (amber-recoloured icons8 pointer) + soft trailing ring; fine pointers only; native cursor kept on touch.
- SFX: WebAudio-synthesised (no audio files). Auto-delegated: scroll ticks (distance-throttled), `click` on `a,button,[role=button],[data-sfx]`, `hover` on `[data-sfx-hover]`/cards, section-enter whoosh. Opt-out `data-sfx="none"`. Starts after first user gesture (browser policy), persisted mute toggle in header.
- Scroll lines: global vertical progress line (left edge desktop / top bar mobile) + `DrawLine` for per-section lines (vertical or horizontal/sideways).
- Three.js background behind everything (lazy, idle-loaded, DPR cap, pauses offscreen/hidden, disabled for reduced-motion / Save-Data / very low-end).
- One-line headings, sub-headings one line the same width as the heading, paragraphs shaped with `text-wrap: pretty/balance` and a 58–66ch measure.

## Contracts (import paths are stable — section agents code against these)
```
src/lib/sfx.ts                  export const sfx: { play(name: SfxName): void; setMuted(b:boolean): void; isMuted(): boolean; subscribe(fn):()=>void }
                                SfxName = 'tick'|'click'|'hover'|'whoosh'|'open'|'close'|'success'|'error'|'next'|'prev'
src/components/fx/SfxProvider.tsx   default; mounts delegated listeners (rendered in layout)
src/components/fx/SoundToggle.tsx   default; small glass button (header)
src/components/fx/Cursor.tsx        default (layout)
src/components/fx/Splash.tsx        default (layout)
src/components/fx/AnimatedLogo.tsx  default ({ size?: number; loop?: boolean; className? }) North-Star mark with draw/orbit animation
src/components/fx/ScrollProgressLine.tsx  default (layout)
src/components/fx/DrawLine.tsx      default ({ axis?:'y'|'x'; className?; targetRef?: RefObject<HTMLElement> })  line that draws with scroll progress of its section
src/components/fx/Reveal.tsx        default ({ as?; delay?; y?; x?; className?; children })
src/components/fx/SplitText.tsx     default ({ text:string; as?; variant?:'rise'|'blur'|'wave'|'flip'|'mask'|'scramble'; stagger?:number; by?:'chars'|'words'; className?; once?:boolean })
src/components/fx/Typewriter.tsx    default ({ phrases:string[]; className? })
src/components/fx/CountUp.tsx       default ({ to:number; suffix?; prefix?; duration?; className? })
src/components/fx/Marquee.tsx       default ({ children; speed?:number(px/s); direction?:'left'|'right'; pauseOnHover?; className?; gap?:number })  side-to-side animating rail (CSS transform loop)
src/components/fx/GlassCard.tsx     default ({ as?; href?; onClick?; tilt?:boolean; shine?:boolean(default true); glow?:boolean; className?; children })
src/components/fx/SectionHeader.tsx default ({ eyebrow:string; title:ReactNode; subtitle:string; align?:'left'|'center'; id?:string })
                                    title = ONE line (fluid font-size via clamp + JS fit fallback, never wraps); subtitle = ONE line fitted to the title's width.
src/components/fx/FitLine.tsx       default ({ children; maxPx?; minPx?; className? }) shrink-to-fit one-line text
src/components/ui/Button.tsx        default + named export ({ variant:'primary'|'glass'|'ghost'; href?; onClick?; magnetic?; icon?; children }) anchor/button, shine, SFX-ready
src/lib/scroll.ts               export scrollToId(id:string, offset?:number); export function useActiveSection(ids:string[]): string
src/hooks/useInView.ts  usePrefersReducedMotion.ts  useDeviceTier.ts  ('high'|'mid'|'low' from cores/memory/saveData/reducedMotion)
src/components/three/ThreeBackground.tsx   default client component, lazy; fixed canvas at z-0; props: none
src/components/three/NorthStar3D.tsx       default ({ className?; height?:number|string }) draggable/hoverable 3D North Star with pointer-follow, click burst
src/components/three/OrbitSelector3D.tsx   default ({ items:{id:string;label:string}[]; activeId:string; onSelect(id:string):void; className? }) clickable orbiting nodes
src/components/three/ThreeCanvas.tsx       shared: renderer factory, visibility pause, dispose (internal)
```
Tailwind/global utilities added by CORE in `globals.css`: `.glass`, `.glass-strong`, `.shine` (continuous sweep), `.eyebrow`, `.container-x`, `.section-y`, `.text-pretty`, `.text-balance`, `.hairline`, `.noise`; CSS vars `--glass-bg`, `--glass-border`, `--amber`, `--ink`, `--ink-dim`, `--ease-out-expo`.

## Data & media (owned by ASSETS)
- `scripts/optimize-media.mjs` (sharp + ffmpeg) → `public/media/<category>/<project>/<slug>.{webp,mp4,jpg}`; slug-safe names (no spaces/&/+).
- Images: ≤1600px long edge WebP q≈78, plus `thumb` 640px WebP. Videos: H.264 mp4 `+faststart`, no audio, ≤720p (≤540×960 for 9:16), ≤12s loop-friendly clip, target ≤1.5 MB each; `poster` WebP for each. Hero reel ≤3 MB.
- `src/data/portfolio.json` rewritten (BOM stripped): every asset `{src, type, title, poster?, thumb?, width, height}`; `project.thumbnail` is **always an image**. IDs/titles/services/links preserved. `src/types/index.ts` updated accordingly.
- Delete `public/portfolio`, `public/videos`, oversized `public/logos/*_BG-*.png`, remove Git LFS rule from `.gitattributes`, `vercel.json` buildCommand → `next build`. Also `public/og-image.jpg` (1200×630), PNG apple-touch icon, favicon.

## Wave 2 ownership (no file overlap)
| Worktree | Owns |
|---|---|
| hero-header | `components/Header.tsx`, `components/Hero.tsx`, `app/page.tsx` |
| about-services | `components/About.tsx`, `components/Services.tsx` |
| portfolio | `components/PortfolioCategories.tsx`, `components/portfolio/*` (StageViewer, ProjectRail, MediaTile), `app/portfolio/[category]/*`, delete `Portfolio.tsx`, `ITPortfolioGrid.tsx` (folded in) |
| contact-footer | `components/Contact.tsx`, `components/Footer.tsx`, `app/api/contact/route.ts`, `app/privacy`, `app/terms`, `app/not-found.tsx`, SEO (`app/sitemap.ts`, `app/robots.ts`, layout metadata fields only) |

## Flow
Splash → **Hero** (headline, Three star, autoplaying reel rail drifting sideways) → **About** (count-up stats, interactive Vision/Mission/Values, 3D star) → **Services** (orbit selector + glass detail panel, animated process stepper with sideways line) → **Work** (category cards, side-scrolling marquees of thumbnails) → **/portfolio/[category]** (project rail + one-asset-at-a-time Stage viewer; no vertical asset scrolling) → **Contact** (working form via `/api/contact`, mailto fallback) → Footer.

## Performance budget (Lighthouse mobile ≥ 90)
LCP element = hero headline (text) with poster fallback; no render-blocking; Three + SFX + cursor loaded after idle; only the in-view video plays (max 3 concurrent); `next/image` with correct `sizes`; no layout shift (explicit dimensions/aspect ratios); `will-change` only on animating layers; framer `LazyMotion` where practical; reduced-motion & Save-Data honoured.
