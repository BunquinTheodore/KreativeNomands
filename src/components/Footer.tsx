'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Contact', href: '#contact' },
  ],
  services: [
    { label: 'Content Strategy', href: '#services' },
    { label: 'Graphic Design', href: '#services' },
    { label: 'Photo Post-Production', href: '#services' },
    { label: 'Video Post-Production', href: '#services' },
    { label: 'IT Services', href: '#services' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/kreativnomads', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/kreativnomads', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/kreativnomads', label: 'LinkedIn' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer 
      className={cn(
        'border-t',
        theme === 'dark' 
          ? 'bg-dark-950 border-primary-500/10' 
          : 'bg-gray-50 border-primary-500/15'
      )} 
      role="contentinfo"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                <motion.div 
                  className="relative w-10 h-10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div 
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #3d5a5a 0%, #2d4545 100%)' }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-display font-bold text-lg">
                    KN
                  </span>
                </motion.div>
                <div>
                  <span className={cn(
                    'block font-display font-semibold leading-tight group-hover:text-primary-400 transition-colors',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    Kreativ
                  </span>
                  <span className="block text-primary-400 font-display text-sm leading-tight">
                    Nomads
                  </span>
                </div>
              </Link>
              <p className={cn(
                "text-sm leading-relaxed mb-6 max-w-xs",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                Your creative virtual assistant, providing fresh and compelling creative 
                solutions for your marketing challenges.
              </p>
              
              {/* Social Links with enhanced animation */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300',
                      theme === 'dark'
                        ? 'bg-dark-800 text-gray-400 hover:text-white hover:bg-primary-500 border-primary-500/10 hover:border-primary-500/50'
                        : 'bg-gray-100 text-gray-600 hover:text-white hover:bg-primary-500 border-gray-300 hover:border-primary-500'
                    )}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className={cn(
                "font-display font-semibold mb-4",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <motion.li 
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-gray-400 hover:text-primary-400 text-sm transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-primary-500 transition-all duration-300" />
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h3 className={cn(
                "font-display font-semibold mb-4",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <motion.li 
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={cn(
                        "text-sm transition-colors inline-flex items-center gap-1 group",
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-primary-400'
                          : 'text-gray-600 hover:text-primary-600'
                      )}
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-primary-500 transition-all duration-300" />
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className={cn(
                "font-display font-semibold mb-4",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>Contact</h3>
              <ul className="space-y-4">
                <motion.li
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <a
                    href="mailto:contact@kreativnomads.com.ph"
                    className={cn(
                      "flex items-start gap-3 text-sm transition-colors group",
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <Mail className="w-4 h-4 mt-0.5 text-primary-400 group-hover:text-primary-300 transition-colors" />
                    <span>contact@kreativnomads.com.ph</span>
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <a
                    href="tel:+639173125071"
                    className={cn(
                      "flex items-start gap-3 text-sm transition-colors group",
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <Phone className="w-4 h-4 mt-0.5 text-primary-400 group-hover:text-primary-300 transition-colors" />
                    <span>+63 917 312 5071</span>
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <a
                    href="https://maps.google.com/?q=Discovery+Suites+Ortigas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-start gap-3 text-sm transition-colors group",
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-400 group-hover:text-primary-300 transition-colors" />
                    <span>2404 Discovery Suites, ADB Avenue, Ortigas Center, Pasig City</span>
                  </a>
                </motion.li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={cn(
          "py-6 border-t",
          theme === 'dark' ? 'border-primary-500/10' : 'border-gray-200'
        )}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.p 
              className={cn(
                "text-sm text-center sm:text-left",
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              )}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © {currentYear} <span className="text-primary-400">Kreativ Nomads</span>. All rights reserved.
            </motion.p>
            <div className="flex items-center gap-6 text-sm">
              <motion.a 
                href="#" 
                className={cn(
                  "transition-colors",
                  theme === 'dark'
                    ? 'text-gray-500 hover:text-primary-400'
                    : 'text-gray-600 hover:text-primary-600'
                )}
                whileHover={{ scale: 1.05 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                href="#" 
                className={cn(
                  "transition-colors",
                  theme === 'dark'
                    ? 'text-gray-500 hover:text-primary-400'
                    : 'text-gray-600 hover:text-primary-600'
                )}
                whileHover={{ scale: 1.05 }}
              >
                Terms of Service
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
