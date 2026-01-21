'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Hero() {
  const handleScrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleScrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-primary-500/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-secondary-500/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20">
              Your Creative Virtual Assistant
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-display-xl lg:text-display-2xl font-display font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            We Are{' '}
            <span className="relative">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                Kreativ Nomads
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-500/30 -skew-x-3"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            A creative agency of experienced freelancers providing fresh and compelling 
            creative solutions to address your marketing and communication challenges.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <a
              href="#contact"
              className={cn(
                'inline-flex items-center px-8 py-4 rounded-full',
                'bg-primary-500 hover:bg-primary-600 text-white font-semibold',
                'transform hover:scale-105 transition-all duration-200',
                'shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900'
              )}
            >
              Inquire Today
            </a>
            
            <button
              onClick={handleScrollToPortfolio}
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4 rounded-full',
                'bg-white/5 hover:bg-white/10 text-white font-semibold',
                'border border-white/10 hover:border-white/20',
                'transform hover:scale-105 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-dark-900'
              )}
            >
              <Play size={18} className="text-primary-400" />
              View Our Work
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 pt-10 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <p className="text-sm text-gray-500 mb-6">Trusted by brands across industries</p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
              {['Real Estate', 'F&B', 'Insurance', 'Health & Fitness', 'Events'].map((industry) => (
                <span
                  key={industry}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  {industry}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={handleScrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white transition-colors"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        aria-label="Scroll to learn more"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={24} />
        </motion.div>
      </motion.button>
    </section>
  );
}
