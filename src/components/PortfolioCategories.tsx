'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, Utensils, Heart, Shield, Building2, Monitor, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';
import portfolioData from '@/data/portfolio.json';
import type { Project } from '@/types';

// Type assertion for the imported JSON
const data = portfolioData as { 
  projects: Project[]; 
  categories: { id: string; label: string }[];
  services: string[];
};

// Category data with icons and styling - Using brand colors
const categories = [
  {
    id: 'events',
    label: 'Events',
    description: 'Corporate events, virtual gatherings, and live experiences',
    icon: Calendar,
    color: 'from-primary-500 to-primary-600',
    bgColor: 'bg-primary-500/10',
    textColor: 'text-primary-600',
    borderColor: 'border-primary-500/20',
    hoverBg: 'hover:bg-primary-500/20'
  },
  {
    id: 'fnb',
    label: 'Food & Beverage',
    description: 'Restaurant branding and promotional content',
    icon: Utensils,
    color: 'from-secondary-500 to-secondary-600',
    bgColor: 'bg-secondary-500/10',
    textColor: 'text-secondary-600',
    borderColor: 'border-secondary-500/20',
    hoverBg: 'hover:bg-secondary-500/20'
  },
  {
    id: 'health',
    label: 'Health & Fitness',
    description: 'Wellness brands and fitness campaigns',
    icon: Heart,
    color: 'from-primary-500 to-primary-600',
    bgColor: 'bg-primary-500/10',
    textColor: 'text-primary-600',
    borderColor: 'border-primary-500/20',
    hoverBg: 'hover:bg-primary-500/20'
  },
  {
    id: 'insurance',
    label: 'Insurance',
    description: 'Financial services branding and educational content',
    icon: Shield,
    color: 'from-secondary-500 to-secondary-600',
    bgColor: 'bg-secondary-500/10',
    textColor: 'text-secondary-600',
    borderColor: 'border-secondary-500/20',
    hoverBg: 'hover:bg-secondary-500/20'
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    description: 'Property marketing and virtual tours',
    icon: Building2,
    color: 'from-primary-500 to-primary-600',
    bgColor: 'bg-primary-500/10',
    textColor: 'text-primary-600',
    borderColor: 'border-primary-500/20',
    hoverBg: 'hover:bg-primary-500/20'
  },
  {
    id: 'it',
    label: 'IT Services',
    description: 'Technology solutions and digital marketing',
    icon: Monitor,
    color: 'from-secondary-500 to-secondary-600',
    bgColor: 'bg-secondary-500/10',
    textColor: 'text-secondary-600',
    borderColor: 'border-secondary-500/20',
    hoverBg: 'hover:bg-secondary-500/20'
  }
];

// Simple fade animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Portfolio() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const bgLogo1Y = useTransform(scrollYProgress, [0, 1], ['60px', '-100px']);
  const bgLogo2Y = useTransform(scrollYProgress, [0, 1], ['100px', '-80px']);
  const bgLogo3Y = useTransform(scrollYProgress, [0, 1], ['30px', '-120px']);
  const bgLogo4Y = useTransform(scrollYProgress, [0, 1], ['80px', '-60px']);

  // Count projects per category
  const getProjectCount = (categoryId: string) => {
    return data.projects.filter(p => p.category === categoryId).length;
  };

  // Get total assets per category
  const getAssetCount = (categoryId: string) => {
    return data.projects
      .filter(p => p.category === categoryId)
      .reduce((total, project) => total + project.assets.length, 0);
  };

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative py-24 sm:py-32 bg-cream-300/80 overflow-hidden"
      aria-label="Portfolio categories"
    >
      {/* Parallax Background Elements */}
      <motion.div
        className="absolute top-[8%] right-[10%] w-32 h-32 opacity-[0.05] pointer-events-none"
        style={{ y: bgLogo1Y }}
      >
        <Image
          src="/logos/North-Star-Icon-Green_Kreativ-Nomads.png"
          alt=""
          fill
          sizes="128px"
          className="object-contain"
        />
      </motion.div>
      
      <motion.div
        className="absolute top-[25%] left-[5%] w-24 h-24 opacity-[0.04] pointer-events-none"
        style={{ y: bgLogo2Y }}
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
        className="absolute bottom-[20%] right-[8%] w-40 h-40 opacity-[0.03] pointer-events-none"
        style={{ y: bgLogo3Y }}
      >
        <Image
          src="/logos/One-Line-Logo_Green.png"
          alt=""
          fill
          sizes="160px"
          className="object-contain"
        />
      </motion.div>
      
      <motion.div
        className="absolute bottom-[35%] left-[15%] w-28 h-28 opacity-[0.04] pointer-events-none"
        style={{ y: bgLogo4Y }}
      >
        <Image
          src="/logos/North-Star-Icon-Black_Kreativ-Nomads.png"
          alt=""
          fill
          sizes="112px"
          className="object-contain"
        />
      </motion.div>

      {/* Simple Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(61, 90, 90, 0.08) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-primary-600 bg-primary-500/10 rounded-full border border-primary-500/20">
            <Sparkles className="w-4 h-4" />
            Our Work
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Explore Our <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a category to view our complete collection of projects, videos, and creative assets.
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const projectCount = getProjectCount(category.id);
            const assetCount = getAssetCount(category.id);

            return (
              <motion.div
                key={category.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.1 } }
                }}
              >
                <Link href={`/portfolio/${category.id}`}>
                  <div
                    className={cn(
                      "relative group p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "bg-white/80 hover:-translate-y-1 hover:shadow-lg",
                      category.borderColor,
                      category.hoverBg
                    )}
                  >
                    {/* Gradient Accent */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r",
                      category.color
                    )} />

                    {/* Icon */}
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                      category.bgColor
                    )}>
                      <Icon className={cn("w-7 h-7", category.textColor)} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                      {category.label}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>{projectCount} Projects</span>
                      <span>•</span>
                      <span>{assetCount} Assets</span>
                    </div>

                    {/* CTA */}
                    <div className={cn(
                      "flex items-center gap-2 font-medium transition-colors",
                      category.textColor
                    )}>
                      <span>View Portfolio</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <p className="text-gray-600 mb-4">
            Want to see something specific? Let us know what you're looking for.
          </p>
          <Link href="#contact">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-medium rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
              <Sparkles className="w-4 h-4" />
              Get in Touch
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
