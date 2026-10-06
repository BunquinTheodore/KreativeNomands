import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/** Slim self-contained bar for the category route: logo home + back to the Work section. */
export default function TopBar() {
  return (
    <header className="flex items-center justify-between gap-3 py-3">
      <Link
        href="/"
        className="group inline-flex items-center gap-2.5 rounded-full py-1 pr-3"
        aria-label="Kreativ Nomads home"
      >
        <Image
          src="/logos/North-Star-Icon-Yellow_Kreativ-Nomads.png"
          alt=""
          width={64}
          height={64}
          sizes="32px"
          priority
          className="h-8 w-8 object-contain transition-transform duration-500 group-hover:rotate-[72deg]"
        />
        <span className="font-display text-sm font-semibold tracking-wide text-cream-500 sm:text-base">
          Kreativ Nomads
        </span>
      </Link>

      <Link
        href="/#portfolio"
        data-sfx="close"
        className="kp-pill glass shine"
        aria-label="Back to Portfolio"
      >
        <ArrowLeft className="relative z-10 h-4 w-4 text-secondary-400" aria-hidden="true" />
        <span className="relative z-10">Back to Portfolio</span>
      </Link>
    </header>
  );
}
