import { ArrowRight } from 'lucide-react';
import GlassCard from '@/components/fx/GlassCard';
import Reveal from '@/components/fx/Reveal';
import SplitText from '@/components/fx/SplitText';
import Typewriter from '@/components/fx/Typewriter';
import Button from '@/components/ui/Button';
import { CONTACT_EMAIL } from './data';

const SERVICE_PHRASES = [
  'Content strategy',
  'Graphic design',
  'Photo post-production',
  'Video post-production',
  'IT services',
] as const;

/** "Book a Call" card: masked word-reveal heading, typewriter service line and a mailto button. */
export default function CtaCard() {
  return (
    <Reveal delay={0.1}>
      <GlassCard glow className="p-6 sm:p-7">
        <h3 className="font-display text-xl font-semibold leading-snug text-cream-500 sm:text-2xl">
          <SplitText text="Ready to elevate your brand?" variant="mask" by="words" />
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-[color:var(--ink-dim)]">
          Schedule a free consultation call to discuss your creative needs.
        </p>
        <p className="mt-4 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[color:var(--ink-dim)]">
          We craft{' '}
          <Typewriter phrases={SERVICE_PHRASES} className="font-medium text-secondary-400" />
        </p>
        <div className="mt-6">
          <Button
            href={`mailto:${CONTACT_EMAIL}?subject=Consultation%20Request`}
            magnetic
            iconPosition="right"
            icon={
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            }
          >
            Book a Call
          </Button>
        </div>
      </GlassCard>
    </Reveal>
  );
}
