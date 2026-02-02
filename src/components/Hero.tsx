'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Play, Sparkles, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';

export default function Hero() {
  const { theme } = useTheme();
  
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
      {/* Enhanced Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Overlay with brand colors - semi-transparent */}
        <div className={cn(
          'absolute inset-0 backdrop-blur-[2px]',
          theme === 'dark' 
            ? 'bg-gradient-to-br from-dark-950/90 via-primary-950/40 to-dark-950/90'
            : 'bg-gradient-to-br from-gray-50/90 via-primary-50/40 to-white/90'
        )} />
        
        {/* Animated Background Elements with brand colors */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary-500/10 blur-[120px]"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] rounded-full bg-secondary-500/10 blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-400/5 blur-[80px]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Enhanced Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(61, 90, 90, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(61, 90, 90, 0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary-400/30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline with enhanced animation */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-sm font-medium text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: 'rgba(61, 90, 90, 0.4)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Compass className="w-4 h-4" />
              </motion.span>
              Your Creative Virtual Assistant
            </motion.span>
          </motion.div>

          {/* Main Heading with enhanced gradient */}
          <motion.h1
            className={cn(
              'text-4xl sm:text-5xl md:text-display-xl lg:text-display-2xl font-display font-bold mb-6',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            We Are{' '}
            <span className="relative inline-block">
              <motion.span 
                className="relative z-10 gradient-text"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Kreativ Nomads
              </motion.span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-500/30 -skew-x-3 rounded"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.6, 0.01, 0.05, 0.95] }}
              />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className={cn(
              'text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            A creative agency of experienced freelancers providing fresh and compelling 
            creative solutions to address your marketing and communication challenges.
          </motion.p>

          {/* CTA Buttons with enhanced styling */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <motion.a
              href="#contact"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4 rounded-full',
                'bg-secondary-500 hover:bg-secondary-600 text-white font-semibold',
                'transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2',
                theme === 'dark' ? 'focus:ring-offset-dark-900' : 'focus:ring-offset-cream-500'
              )}
              style={{ boxShadow: '0 15px 40px rgba(245, 158, 11, 0.35)' }}
              whileHover={{ scale: 1.05, y: -3, boxShadow: '0 20px 50px rgba(245, 158, 11, 0.45)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              Inquire Today
            </motion.a>
            
            <motion.button
              onClick={handleScrollToPortfolio}
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold',
                'border transition-all duration-300 backdrop-blur-sm',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                theme === 'dark'
                  ? 'bg-white/5 hover:bg-white/10 text-white border-primary-500/30 hover:border-primary-500/50 focus:ring-white/50 focus:ring-offset-dark-900'
                  : 'bg-primary-500/5 hover:bg-primary-500/10 text-primary-700 border-primary-500/30 hover:border-primary-500/50 focus:ring-primary-500/50 focus:ring-offset-white'
              )}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play size={18} className="text-primary-400" />
              View Our Work
            </motion.button>
          </motion.div>

          {/* Trust Indicators with enhanced animation */}
          <motion.div
            className={cn(
              'mt-16 pt-10 border-t',
              theme === 'dark' ? 'border-primary-500/10' : 'border-primary-500/15'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <motion.p 
              className={cn(
                'text-sm mb-6',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Trusted by brands across industries
            </motion.p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
              {['Real Estate', 'F&B', 'Insurance', 'Health & Fitness', 'Events', 'IT Services'].map((industry, index) => (
                <motion.span
                  key={industry}
                  className="text-sm font-medium text-gray-500 hover:text-primary-400 transition-colors cursor-default"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  whileHover={{ opacity: 1, scale: 1.1 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  {industry}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.button
        onClick={handleScrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-primary-400/60 hover:text-primary-400 transition-colors"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        aria-label="Scroll to learn more"
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
          <ArrowDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
}
