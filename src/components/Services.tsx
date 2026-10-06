import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/fx/Reveal';
import SectionHeader from '@/components/fx/SectionHeader';
import SplitText from '@/components/fx/SplitText';
import Button from '@/components/ui/Button';
import ProcessStepper from './services/ProcessStepper';
import ServicesExplorer from './services/ServicesExplorer';
import './services/services.css';

/**
 * Services (#services). Server component: heading, CTA and layout are static;
 * the orbit selector + detail panel and the process stepper are client islands.
 * three is only imported (lazily) by the orbit once it nears the viewport.
 */
export default function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="section-y relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
        <div className="hairline" />
      </div>

      <div className="container-x">
        <SectionHeader
          id="services-heading"
          align="center"
          eyebrow="What We Do"
          title={
            <>
              Our Creative{' '}
              <SplitText text="Solutions" variant="wave" by="chars" stagger={0.05} className="text-secondary-400" />
            </>
          }
          subtitle="Services tailored to elevate your brand"
        />

        <Reveal className="mt-12 lg:mt-16">
          <ServicesExplorer />
        </Reveal>

        <div className="mt-20 sm:mt-28">
          <SectionHeader
            id="process-heading"
            align="center"
            eyebrow="Our Process"
            title={
              <>
                How Our Process{' '}
                <SplitText text="Works" variant="rise" by="chars" stagger={0.06} className="text-secondary-400" />
              </>
            }
            subtitle="A smooth collaboration from start to finish"
          />
          <div className="mt-12 lg:mt-14">
            <ProcessStepper />
          </div>
        </div>

        <Reveal className="mt-14 flex justify-center sm:mt-16">
          <Button href="#contact" magnetic icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />} iconPosition="right" className="px-8 py-4 text-base">
            Let&apos;s Get Started
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
