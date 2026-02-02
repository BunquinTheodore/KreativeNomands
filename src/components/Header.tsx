'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? cn(
              'py-3 backdrop-blur-lg shadow-lg border-b',
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
          {/* Logo with enhanced design */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Kreativ Nomads - Home"
          >
            <motion.div 
              className="relative w-10 h-10 sm:w-12 sm:h-12"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div 
                className="absolute inset-0 rounded-lg transform group-hover:scale-105 transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #3d5a5a 0%, #2d4545 100%)',
                  boxShadow: isScrolled ? '0 4px 20px rgba(61, 90, 90, 0.3)' : 'none'
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white font-display font-bold text-lg sm:text-xl">
                KN
              </span>
            </motion.div>
            <div className="hidden sm:block">
              <span className={cn(
                'block font-display font-semibold text-lg leading-tight',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                Kreativ
              </span>
              <span className="block text-primary-500 font-display text-sm leading-tight">
                Nomads
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with enhanced styling */}
          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link, index) => (
              <motion.li 
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-white hover:bg-primary-500/10' 
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-500/10',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    theme === 'dark' ? 'focus:ring-offset-dark-900' : 'focus:ring-offset-white',
                    'relative group'
                  )}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-400 group-hover:w-1/2 transition-all duration-300 rounded-full" />
                </a>
              </motion.li>
            ))}
          </ul>

          {/* CTA Button and Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <motion.a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
                'bg-secondary-500 hover:bg-secondary-600 text-white font-medium text-sm',
                'transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2',
                theme === 'dark' ? 'focus:ring-offset-dark-900' : 'focus:ring-offset-cream-500'
              )}
              style={{ boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)' }}
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 12px 30px rgba(245, 158, 11, 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-4 h-4" />
              Inquire Today
            </motion.a>
          </div>

          {/* Mobile: Theme Toggle and Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'p-2 rounded-lg',
                theme === 'dark' ? 'text-white hover:bg-primary-500/20' : 'text-gray-700 hover:bg-primary-500/10',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu with enhanced styling */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              'md:hidden backdrop-blur-lg border-t',
              theme === 'dark' 
                ? 'bg-dark-900/98 border-primary-500/10' 
                : 'bg-white/98 border-primary-500/15'
            )}
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={cn(
                        'block px-4 py-3 rounded-lg text-base font-medium',
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-primary-500/15'
                          : 'text-gray-600 hover:text-primary-700 hover:bg-primary-500/10',
                        'transition-colors duration-300'
                      )}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-3 pt-3 border-t border-primary-500/10"
                >
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, '#contact')}
                    className={cn(
                      'flex items-center justify-center gap-2 w-full text-center px-4 py-3 rounded-full',
                      'bg-secondary-500 hover:bg-secondary-600 text-white font-medium',
                      'transition-colors duration-300'
                    )}
                    style={{ boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)' }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Inquire Today
                  </a>
                </motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
