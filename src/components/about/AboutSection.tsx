import DrawLine from '@/components/fx/DrawLine';
import Reveal from '@/components/fx/Reveal';
import SectionHeader from '@/components/fx/SectionHeader';
import SplitText from '@/components/fx/SplitText';
import BrandPlate from './BrandPlate';
import DirectionTabs from './DirectionTabs';
import StatsGrid from './StatsGrid';

/**
 * About (#about) body. Rendered into the server HTML by AboutIsland; its JavaScript (stats tilt,
 * count-up, tabs, value cards, drifting marks) is a separate chunk that hydrates after the first paint.
 */
export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section-y relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
        <div className="hairline" />
      </div>

      <div className="container-x">
        <div className="relative">
          {/* Vertical scroll line running down the section. */}
          <div aria-hidden="true" className="absolute inset-y-0 -left-2.5 w-0.5 sm:-left-4">
            <DrawLine axis="y" />
          </div>

          <SectionHeader
            id="about-heading"
            eyebrow="Who We Are"
            title={
              <>
                We Are <SplitText text="Kreativ Nomads" variant="mask" by="words" stagger={0.12} className="text-secondary-400" />
              </>
            }
            subtitle="Guiding Brands Toward Their North Star"
          />

          <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16">
            <div className="min-w-0">
              <Reveal>
                <p className="measure text-base leading-[1.8] text-cream-500/75 text-pretty sm:text-lg">
                  Established in 2023, Kreativ Nomads brings together{' '}
                  <span className="text-cream-500">experienced talent</span> across creative, digital, and business
                  disciplines to help businesses navigate challenges and reach their goals.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="mt-8 sm:mt-10">
                <StatsGrid />
              </Reveal>
            </div>

            <Reveal x={32} y={0} delay={0.1} className="min-w-0 py-10">
              <BrandPlate />
            </Reveal>
          </div>

          <Reveal className="mt-16 sm:mt-20">
            <DirectionTabs />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
