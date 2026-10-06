import { Sparkles } from 'lucide-react';
import DrawLine from '@/components/fx/DrawLine';
import Reveal from '@/components/fx/Reveal';
import SectionHeader from '@/components/fx/SectionHeader';
import Button from '@/components/ui/Button';
import CategoryCard from '@/components/portfolio/CategoryCard';
import { CATEGORIES } from '@/components/portfolio/categories';
import { getCategoryStats, getStripThumbs } from '@/components/portfolio/data';
import '@/components/portfolio/portfolio.css';

const THUMBS_PER_CARD = 6;

/**
 * Home "Work" section. Server component: the six category cards, their
 * thumbnail strips and stats are rendered on the server; GlassCard, Marquee,
 * CountUp, SplitText, DrawLine and Button are the only client leaves.
 */
export default function PortfolioCategories() {
  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="section-y relative overflow-hidden"
    >
      <div className="container-x relative">
        <SectionHeader
          id="portfolio-heading"
          align="center"
          eyebrow="Our Work"
          title={
            <>
              Explore Our <span className="kp-sweep">Portfolio</span>
            </>
          }
          subtitle="Pick a category and dive right in"
        />

        <Reveal delay={0.2} className="mx-auto mt-6 text-center">
          <p className="measure mx-auto text-base leading-relaxed text-cream-500/70 text-balance sm:text-lg">
            Select a category to view our complete collection of projects, videos, and creative
            assets.
          </p>
        </Reveal>

        <div className="relative mt-12 pl-6 sm:mt-16 lg:pl-0">
          {/* Sideways connector between the two rows on desktop, vertical rail on mobile. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-0.5 lg:hidden" aria-hidden="true">
            <DrawLine axis="y" />
          </div>
          <div
            className="pointer-events-none absolute inset-0 hidden items-center lg:flex"
            aria-hidden="true"
          >
            <DrawLine axis="x" />
          </div>

          <ul className="relative z-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
            {CATEGORIES.map((category, index) => (
              <li key={category.id} className="min-w-0">
                <CategoryCard
                  category={category}
                  stats={getCategoryStats(category.id)}
                  thumbs={getStripThumbs(category.id, THUMBS_PER_CARD)}
                  index={index}
                />
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="mt-16 flex flex-col items-center gap-4 text-center sm:mt-20">
          <p className="font-display text-xl font-semibold text-cream-500 sm:text-2xl">
            Have a project in mind?
          </p>
          <p className="measure text-base leading-relaxed text-cream-500/70 text-pretty">
            Want to see something specific? Let us know what you&apos;re looking for.
          </p>
          <Button href="#contact" variant="primary" magnetic icon={<Sparkles className="h-4 w-4" />}>
            Get in Touch
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
