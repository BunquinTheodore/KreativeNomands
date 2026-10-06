import Link from 'next/link';
import AnimatedLogo from '@/components/fx/AnimatedLogo';
import DrawLine from '@/components/fx/DrawLine';
import Marquee from '@/components/fx/Marquee';
import { CONTACT_INFO } from '@/components/contact/data';
import BackToTop from './BackToTop';
import FooterNav, { type FooterNavLink } from './FooterNav';
import SocialLinks from './SocialLinks';

const COMPANY_LINKS: readonly FooterNavLink[] = [
  { label: 'About Us', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'Contact', id: 'contact' },
];

const SERVICE_LINKS: readonly FooterNavLink[] = [
  { label: 'Content Strategy', id: 'services-content-strategy' },
  { label: 'Graphic Design', id: 'services-graphic-design' },
  { label: 'Photo Post-Production', id: 'services-post-production' },
  { label: 'Video Post-Production', id: 'services-post-production' },
  { label: 'IT Services', id: 'services-it-services' },
];

const RAIL_WORDS = ['Strategy', 'Design', 'Photo', 'Video', 'IT', 'Branding'] as const;

interface FooterSectionProps {
  /** Copyright year, decided on the server so the hydrated text always matches the server HTML. */
  year: number;
}

/**
 * Site footer body. Rendered into the server HTML by FooterIsland; its JavaScript (FooterNav smooth
 * scroll, BackToTop rocket, the fx primitives) is a separate chunk that hydrates after the first paint.
 * A sideways DrawLine draws along the top edge as it enters.
 */
export default function FooterSection({ year }: FooterSectionProps) {
  return (
    <footer className="kn-footer glass shine" role="contentinfo" suppressHydrationWarning>
      <div className="kn-footer__edge">
        <DrawLine axis="x" />
      </div>

      <div className="container-x pt-14">
        <div aria-hidden="true" className="select-none">
          <Marquee speed={36} gap={36} pauseOnHover>
            {RAIL_WORDS.map((word) => (
              <span key={word} className="flex items-center gap-9">
                <span className="kn-footer__outline">{word}</span>
                <span className="kn-footer__star">&#10022;</span>
              </span>
            ))}
          </Marquee>
        </div>

        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.35fr] lg:gap-8">
          <div>
            <div className="flex items-center gap-3">
              <AnimatedLogo size={52} loop />
              <p className="font-display text-xl font-semibold tracking-tight text-cream-500">
                Kreativ Nomads
              </p>
            </div>
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-[color:var(--ink-dim)]">
              Your creative virtual assistant, providing fresh and compelling creative solutions for
              your marketing challenges.
            </p>
            <div className="mt-6">
              <SocialLinks />
            </div>
          </div>

          <FooterNav heading="Company" links={COMPANY_LINKS} />
          <FooterNav heading="Services" links={SERVICE_LINKS} />

          <div>
            <h2 className="mb-4 font-display text-base font-semibold text-cream-500">Contact</h2>
            <address className="not-italic">
              <ul className="space-y-3">
                {CONTACT_INFO.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className="group flex items-start gap-3 text-sm leading-snug text-[color:var(--ink-dim)] transition-colors hover:text-cream-500"
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <item.icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-secondary-400 transition-transform duration-300 group-hover:scale-110"
                        aria-hidden="true"
                      />
                      <span className="break-words">{item.value}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </address>
          </div>
        </div>

        <div className="hairline" />

        <div className="flex flex-col items-center gap-5 py-6 sm:flex-row sm:justify-between">
          <p className="text-center text-sm text-[color:var(--ink-dim)] sm:text-left">
            &copy; {year} <span className="text-secondary-400">Kreativ Nomads</span>. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="kn-flink">
              Privacy Policy
            </Link>
            <Link href="/terms" className="kn-flink">
              Terms of Service
            </Link>
          </nav>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
