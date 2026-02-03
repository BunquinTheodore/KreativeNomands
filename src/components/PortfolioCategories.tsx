'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Utensils, Heart, Shield, Building2, Monitor, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SlideUp, StaggerContainer, StaggerItem } from '@/lib/animations';
import { useTheme } from '@/lib/theme-context';
import portfolioData from '@/data/portfolio.json';
import type { Project } from '@/types';

// Type assertion for the imported JSON
const data = portfolioData as { 
  projects: Project[]; 
  categories: { id: string; label: string }[];
  services: string[];
};

// Category data with icons and styling
const categories = [
  {
    id: 'events',
    label: 'Events',
    description: 'Corporate events, virtual gatherings, and live experiences',
    icon: Calendar,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-500/20',
    hoverBg: 'hover:bg-purple-500/20'
  },
  {
    id: 'fnb',
    label: 'Food & Beverage',
    description: 'Restaurant branding and promotional content',
    icon: Utensils,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-500/20',
    hoverBg: 'hover:bg-orange-500/20'
  },
  {
    id: 'health',
    label: 'Health & Fitness',
    description: 'Wellness brands and fitness campaigns',
    icon: Heart,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600',
    borderColor: 'border-green-500/20',
    hoverBg: 'hover:bg-green-500/20'
  },
  {
    id: 'insurance',
    label: 'Insurance',
    description: 'Financial services branding and educational content',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-500/20',
    hoverBg: 'hover:bg-blue-500/20'
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    description: 'Property marketing and virtual tours',
    icon: Building2,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-500/20',
    hoverBg: 'hover:bg-amber-500/20'
  },
  {
    id: 'it',
    label: 'IT Services',
    description: 'Technology solutions and digital marketing',
    icon: Monitor,
    color: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-500/20',
    hoverBg: 'hover:bg-slate-500/20'
  }
];

export default function Portfolio() {
  const { theme } = useTheme();

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
      id="portfolio"
      className="relative py-24 sm:py-32 bg-cream-300/80 backdrop-blur-sm overflow-hidden"
      aria-label="Portfolio categories"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(61, 90, 90, 0.08) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <SlideUp className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-primary-600 bg-primary-500/10 rounded-full border border-primary-500/20"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            Our Work
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Explore Our <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a category to view our complete collection of projects, videos, and creative assets.
          </p>
        </SlideUp>

        {/* Category Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const projectCount = getProjectCount(category.id);
            const assetCount = getAssetCount(category.id);

            return (
              <StaggerItem key={category.id}>
                <Link href={`/portfolio/${category.id}`}>
                  <motion.div
                    className={cn(
                      "relative group p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "bg-white/80 backdrop-blur-sm",
                      category.borderColor,
                      category.hoverBg
                    )}
                    whileHover={{ 
                      scale: 1.02,
                      y: -5,
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                    }}
                    whileTap={{ scale: 0.98 }}
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

                    {/* Hover Gradient Background */}
                    <motion.div
                      className={cn(
                        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br",
                        category.color
                      )}
                    />
                  </motion.div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 mb-4">
            Want to see something specific? Let us know what you're looking for.
          </p>
          <Link href="#contact">
            <motion.span
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-medium rounded-full transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4" />
              Get in Touch
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
