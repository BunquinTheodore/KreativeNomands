'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/kreativnomads', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/kreativnomads', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/kreativnomads', label: 'LinkedIn' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-dark-950 border-t border-white/5" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg" />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-display font-bold text-lg">
                    KN
                  </span>
                </div>
                <div>
                  <span className="block text-white font-display font-semibold leading-tight">
                    Kreativ
                  </span>
                  <span className="block text-primary-400 font-display text-sm leading-tight">
                    Nomads
                  </span>
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                Your creative virtual assistant, providing fresh and compelling creative 
                solutions for your marketing challenges.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center',
                      'text-gray-400 hover:text-white hover:bg-primary-500',
                      'transition-all duration-200'
                    )}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-display font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-white font-display font-semibold mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-display font-semibold mb-4">Contact</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:contact@kreativnomads.com.ph"
                    className="flex items-start gap-3 text-gray-400 hover:text-white text-sm transition-colors group"
                  >
                    <Mail className="w-4 h-4 mt-0.5 text-primary-400 group-hover:text-primary-300" />
                    <span>contact@kreativnomads.com.ph</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+639173125071"
                    className="flex items-start gap-3 text-gray-400 hover:text-white text-sm transition-colors group"
                  >
                    <Phone className="w-4 h-4 mt-0.5 text-primary-400 group-hover:text-primary-300" />
                    <span>+63 917 312 5071</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://maps.google.com/?q=Discovery+Suites+Ortigas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-gray-400 hover:text-white text-sm transition-colors group"
                  >
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-400 group-hover:text-primary-300" />
                    <span>2404 Discovery Suites, ADB Avenue, Ortigas Center, Pasig City</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © {currentYear} Kreativ Nomads. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
