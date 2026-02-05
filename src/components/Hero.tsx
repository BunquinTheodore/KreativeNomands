'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles, Compass } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Transform values for parallax
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.6]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.5], [0.1, 0]);
  
  // Floating logos parallax
  const logo1Y = useTransform(scrollYProgress, [0, 1], ['0px', '-150px']);
  const logo2Y = useTransform(scrollYProgress, [0, 1], ['0px', '-100px']);
  const logo3Y = useTransform(scrollYProgress, [0, 1], ['0px', '-200px']);
  const logo4Y = useTransform(scrollYProgress, [0, 1], ['0px', '-80px']);

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
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background with Parallax */}
      <div className="absolute inset-0 z-0">
        {/* Background Video with parallax */}
        <motion.div 
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
          style={{ y: videoY }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src="/videos/landing-page-background.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        {/* Dynamic overlay */}
        <motion.div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
        
        {/* Floating Logo Elements with Parallax */}
        <motion.div
          className="absolute top-[15%] left-[5%] w-32 h-32 opacity-10"
          style={{ y: logo1Y, opacity: logoOpacity }}
        >
          <Image
            src="/logos/North-Star-Icon-White_Kreativ-Nomads.png"
            alt=""
            fill
            sizes="128px"
            className="object-contain"
          />
        </motion.div>
        
        <motion.div
          className="absolute top-[25%] right-[8%] w-24 h-24 opacity-10"
          style={{ y: logo2Y, opacity: logoOpacity }}
        >
          <Image
            src="/logos/North-Star-Icon-Yellow_Kreativ-Nomads.png"
            alt=""
            fill
            sizes="96px"
            className="object-contain"
          />
        </motion.div>
        
        <motion.div
          className="absolute bottom-[30%] left-[10%] w-20 h-20 opacity-10"
          style={{ y: logo3Y, opacity: logoOpacity }}
        >
          <Image
            src="/logos/North-Star-Icon-Green_Kreativ-Nomads.png"
            alt=""
            fill
            sizes="80px"
            className="object-contain"
          />
        </motion.div>
        
        <motion.div
          className="absolute bottom-[25%] right-[12%] w-28 h-28 opacity-10"
          style={{ y: logo4Y, opacity: logoOpacity }}
        >
          <Image
            src="/logos/North-Star-Icon-Ivory_Kreativ-Nomads.png"
            alt=""
            fill
            sizes="112px"
            className="object-contain"
          />
        </motion.div>
      </div>

      {/* Content with Parallax */}
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20"
        style={{ y: contentY }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-sm font-medium text-white bg-primary-500/20 rounded-full border border-white/30">
              <Compass className="w-4 h-4" />
              Your Creative Virtual Assistant
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-display-xl lg:text-display-2xl font-display font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We Are{' '}
            <span className="relative inline-block">
              <span className="relative z-10 gradient-text">
                Kreativ Nomads
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-500/30 -skew-x-3 rounded" />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A creative agency of experienced freelancers providing fresh and compelling 
            creative solutions to address your marketing and communication challenges.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Inquire Today
            </a>
            <button
              onClick={handleScrollToPortfolio}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-medium hover:bg-white/10 transition-colors"
            >
              <span>View Our Work</span>
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 pt-10 border-t border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-sm mb-6 text-white/70">
              Trusted by brands across industries
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
              {['Real Estate', 'F&B', 'Insurance', 'Health & Fitness', 'Events', 'IT Services'].map((industry) => (
                <span
                  key={industry}
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors cursor-default"
                >
                  {industry}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={handleScrollToAbout}
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
          aria-label="Scroll to about section"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </button>
      </motion.div>
    </section>
  );
}
