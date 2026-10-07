import SectionHeader from '@/components/fx/SectionHeader';
import SplitText from '@/components/fx/SplitText';
import Reveal from '@/components/fx/Reveal';
import DrawLine from '@/components/fx/DrawLine';
import ContactForm from './ContactForm';
import CtaCard from './CtaCard';
import InfoCards from './InfoCards';

/**
 * Contact section (id="contact") body. Rendered into the server HTML by ContactIsland; its JavaScript (info
 * cards with copy buttons, CTA, the form) is a separate chunk that hydrates after the first paint.
 */
export default function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="section-y relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-[34rem] bg-[radial-gradient(ellipse_at_50%_40%,rgba(245,158,11,0.07),transparent_65%)]"
      />
      <div className="container-x">
        <SectionHeader
          align="center"
          id="contact-heading"
          eyebrow="Contact Us"
          title={
            <>
              Let&apos;s Get <SplitText text="Started" variant="flip" className="text-secondary-400" />
            </>
          }
          subtitle="Tell us what you need"
        />
        <Reveal delay={0.2}>
          <p className="measure mx-auto mt-8 text-balance text-center text-base leading-relaxed text-[color:var(--ink-dim)] sm:text-lg">
            We&apos;re excited to know about your brand and creative needs. Send us an email or fill
            out the form below.
          </p>
        </Reveal>

        <div className="relative mt-12 pl-6 sm:pl-9 lg:mt-16">
          <div className="absolute inset-y-0 left-0 w-0.5">
            <DrawLine axis="y" />
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">
            <div className="space-y-8 lg:col-span-2">
              <InfoCards />
              <CtaCard />
            </div>
            <Reveal delay={0.15} className="lg:col-span-3">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
