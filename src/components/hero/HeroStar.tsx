import NorthStar3D from '@/components/three/NorthStar3D';

/** Glass stage for the interactive 3D North Star (the hero's only WebGL instance). */
export default function HeroStar() {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.16),transparent_70%)]"
      />
      <div className="glass-strong shine relative rounded-[2rem] p-2 sm:p-3">
        <NorthStar3D height="clamp(240px, 46svh, 500px)" />
        <p className="hero-star-hint pointer-events-none mt-2 text-center text-[0.65rem] font-semibold uppercase text-[var(--ink-dim)]">
          Drag to spin &middot; Tap for a burst of light
        </p>
      </div>
    </div>
  );
}
