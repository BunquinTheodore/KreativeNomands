'use client';

import { forwardRef, type CSSProperties, type MouseEvent } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { NAV_LINKS } from './navLinks';

interface MobileSheetProps {
  id: string;
  open: boolean;
  activeId: string;
  onNavigate: (event: MouseEvent<HTMLElement>, id: string) => void;
}

/**
 * Full-screen glass menu. Always in the DOM (so it can animate with CSS only)
 * but `visibility: hidden` while closed, which also removes it from the tab order.
 */
const MobileSheet = forwardRef<HTMLDivElement, MobileSheetProps>(function MobileSheet(
  { id, open, activeId, onNavigate },
  ref,
) {
  return (
    <div
      ref={ref}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-open={open}
      className="site-sheet glass-strong fixed inset-0 z-[60] flex flex-col justify-center overflow-y-auto px-8 pb-10 pt-28 lg:hidden"
    >
      <nav aria-label="Mobile">
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => (
            <li key={link.id} className="site-sheet__item" style={{ '--i': i } as CSSProperties}>
              <a
                href={`#${link.id}`}
                onClick={(event) => onNavigate(event, link.id)}
                aria-current={activeId === link.id ? 'location' : undefined}
                className="site-sheet__link flex items-baseline justify-between gap-4 border-b border-[var(--glass-border)] py-4 font-display text-3xl font-semibold text-cream-500 sm:text-4xl"
              >
                <span>{link.label}</span>
                <span className="text-sm font-medium tracking-widest text-[var(--ink-dim)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="site-sheet__item mt-10" style={{ '--i': NAV_LINKS.length } as CSSProperties}>
        <Button
          href="#contact"
          onClick={(event) => onNavigate(event, 'contact')}
          icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
          className="w-full py-4 text-base"
        >
          Inquire Today
        </Button>
        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.24em] text-[var(--ink-dim)]">
          Kreativ Nomads <ArrowUpRight className="h-3.5 w-3.5 text-secondary-400" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
});

export default MobileSheet;
