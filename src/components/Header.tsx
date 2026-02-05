'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? cn(
              'py-3 shadow-lg border-b',
              theme === 'dark' 
                ? 'bg-dark-900/95 border-primary-500/10' 
                : 'bg-white/95 border-primary-500/15'
            )
          : 'bg-transparent py-5'
      )}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo - using actual brand logos */}
          <Link
            href="/"
            className="flex items-center group flex-shrink-0"
            aria-label="Kreativ Nomads - Home"
          >
            <div className="relative">
              {/* Mobile: North Star Icon */}
              <div className="sm:hidden relative w-12 h-12 drop-shadow-lg">
                <Image
                  src='/logos/North-Star-Icon-Yellow_Kreativ-Nomads.png'
                  alt="Kreativ Nomads"
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </div>
              {/* Desktop: One Line Logo */}
              <div className="hidden sm:block relative h-14 w-[280px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                <Image
                  src='/logos/One-Line-Logo_Yellow.png'
                  alt="Kreativ Nomads"
                  fill
                  sizes="280px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-white hover:bg-primary-500/10' 
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-500/10',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    theme === 'dark' ? 'focus:ring-offset-dark-900' : 'focus:ring-offset-white',
                    'relative group'
                  )}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-400 group-hover:w-1/2 transition-all duration-200 rounded-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
                'bg-secondary-500 hover:bg-secondary-600 text-white font-medium text-sm',
                'transition-all duration-200 hover:-translate-y-0.5',
                'focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2',
                'shadow-lg hover:shadow-xl',
                theme === 'dark' ? 'focus:ring-offset-dark-900' : 'focus:ring-offset-cream-500'
              )}
            >
              <Sparkles className="w-4 h-4" />
              Inquire Today
            </a>
          </div>

          {/* Mobile: Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'p-2 rounded-lg',
                theme === 'dark' ? 'text-white hover:bg-primary-500/20' : 'text-gray-700 hover:bg-primary-500/10',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'md:hidden border-t',
              theme === 'dark' 
                ? 'bg-dark-900/98 border-primary-500/10' 
                : 'bg-white/98 border-primary-500/15'
            )}
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={cn(
                        'block px-4 py-3 rounded-lg text-base font-medium',
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-primary-500/15'
                          : 'text-gray-600 hover:text-primary-700 hover:bg-primary-500/10',
                        'transition-colors duration-200'
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="mt-3 pt-3 border-t border-primary-500/10">
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, '#contact')}
                    className={cn(
                      'flex items-center justify-center gap-2 w-full text-center px-4 py-3 rounded-full',
                      'bg-secondary-500 hover:bg-secondary-600 text-white font-medium',
                      'transition-colors duration-200 shadow-lg'
                    )}
                  >
                    <Sparkles className="w-4 h-4" />
                    Inquire Today
                  </a>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
