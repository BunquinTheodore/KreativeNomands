import HeroBackdrop from './hero/HeroBackdrop';
import HeroCopy from './hero/HeroCopy';
import HeroIndustries from './hero/HeroIndustries';
import HeroReel from './hero/HeroReel';
import HeroStar from './hero/HeroStar';
import ScrollCue from './hero/ScrollCue';
import './hero/hero.css';

/**
 * Landing hero (server component; interactive leaves are client components).
 * LCP element is the h1 text. Layers: background reel -> copy + 3D star ->
 * drifting work reel with a sideways draw line -> industries -> scroll cue.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 sm:pt-28"
    >
      <HeroBackdrop />

      <div className="container-x flex flex-1 items-center py-6 sm:py-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
          <HeroCopy />
          <HeroStar />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-8 sm:gap-10">
        <HeroReel />
        <HeroIndustries />
        <ScrollCue />
      </div>
    </section>
  );
}
