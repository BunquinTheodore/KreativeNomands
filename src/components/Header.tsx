'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { Sparkles } from 'lucide-react';
import AnimatedLogo from '@/components/fx/AnimatedLogo';
import SoundToggle from '@/components/fx/SoundToggle';
import Button from '@/components/ui/Button';
import MobileSheet from '@/components/hero/MobileSheet';
import { NAV_LINKS, SECTION_IDS } from '@/components/hero/navLinks';
import useMenuA11y from '@/components/hero/useMenuA11y';
import '@/components/hero/hero.css';
import { scrollToId, useActiveSection } from '@/lib/scroll';
import { cn } from '@/lib/utils';

const SCROLLED_AT_PX = 24;
const DESKTOP_QUERY = '(min-width: 1024px)';
const SHEET_ID = 'site-menu';

/**
 * Fixed header. Transparent over the hero, frosted glass once scrolled.
 * Desktop: logo + wordmark, nav with active-section underline, sound toggle and CTA.
 * Mobile: burger opening a full-screen glass sheet (focus trap, Escape, scroll lock).
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const userScrolled = useRef(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useMenuA11y({ open: menuOpen, onClose: closeMenu, sheetRef, toggleRef });

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLLED_AT_PX);
    };
    const onScroll = () => {
      userScrolled.current = true;
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Keep the URL hash in step with the section being read (never before the user scrolls).
  useEffect(() => {
    if (!userScrolled.current) return;
    try {
      const url = activeId === 'hero' ? window.location.pathname + window.location.search : `#${activeId}`;
      window.history.replaceState(null, '', url);
    } catch {
      // Sandboxed contexts may forbid history updates; the highlight still works.
    }
  }, [activeId]);

  // The sheet is mobile-only: close it if the viewport grows past the breakpoint.
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (mql.matches) setMenuOpen(false);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const navigate = useCallback((event: MouseEvent<HTMLElement>, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    // Release the scroll lock first: the effect cleanup runs after paint, scrolling needs it now.
    document.documentElement.style.overflow = '';
    scrollToId(id);
  }, []);

  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <header data-scrolled={scrolled} className="site-header fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'site-header__bar relative mx-auto flex items-center justify-between gap-3 px-4 sm:px-6',
          scrolled
            ? 'mt-2 h-14 w-[calc(100%-1.5rem)] max-w-6xl rounded-full'
            : 'mt-3 h-16 w-full max-w-7xl',
        )}
      >
        <span aria-hidden="true" className="site-header__glass glass-strong" />

        <a
          href="#hero"
          onClick={(event) => navigate(event, 'hero')}
          aria-label="Kreativ Nomads - back to top"
          className="group relative z-[70] flex items-center gap-2.5 rounded-full py-1 pr-2"
        >
          <AnimatedLogo size={38} loop className="flex-none" />
          <span className="font-display text-base font-semibold tracking-tight text-cream-500 transition-colors group-hover:text-secondary-400 sm:text-lg">
            Kreativ Nomads
          </span>
        </a>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => navigate(event, link.id)}
                  aria-current={activeId === link.id ? 'location' : undefined}
                  className="site-nav__link block rounded-full px-4 py-2.5 text-sm font-medium tracking-wide"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative z-[70] flex items-center gap-2 sm:gap-3">
          <SoundToggle />
          <Button
            href="#contact"
            onClick={(event) => navigate(event, 'contact')}
            icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
            className="hidden px-5 py-2.5 lg:inline-flex"
          >
            Inquire Today
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls={SHEET_ID}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            data-sfx={menuOpen ? 'close' : 'open'}
            className="site-burger glass inline-flex h-10 w-10 flex-col items-center justify-center rounded-full text-cream-500 lg:hidden"
          >
            <span className="site-burger__bar" />
            <span className="site-burger__bar" />
            <span className="site-burger__bar" />
          </button>
        </div>
      </div>

      <MobileSheet ref={sheetRef} id={SHEET_ID} open={menuOpen} activeId={activeId} onNavigate={navigate} />
    </header>
  );
}
