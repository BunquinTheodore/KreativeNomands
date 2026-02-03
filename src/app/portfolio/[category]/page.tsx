'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getAssetType } from '@/lib/utils';
import portfolioData from '@/data/portfolio.json';
import type { Project, PortfolioAsset } from '@/types';

// Category metadata
const categoryMeta: Record<string, { title: string; description: string; color: string }> = {
  events: {
    title: 'Events',
    description: 'Corporate events, virtual gatherings, and live experiences that create lasting impressions.',
    color: 'from-purple-500 to-indigo-600'
  },
  fnb: {
    title: 'Food & Beverage',
    description: 'Restaurant branding, menu design, and promotional content for the culinary industry.',
    color: 'from-orange-500 to-red-500'
  },
  health: {
    title: 'Health & Fitness',
    description: 'Wellness brands, fitness campaigns, and health-focused marketing materials.',
    color: 'from-green-500 to-emerald-600'
  },
  insurance: {
    title: 'Insurance',
    description: 'Financial services branding and educational content for insurance providers.',
    color: 'from-blue-500 to-cyan-500'
  },
  realestate: {
    title: 'Real Estate',
    description: 'Property marketing, virtual tours, and real estate promotional materials.',
    color: 'from-amber-500 to-yellow-500'
  },
  it: {
    title: 'IT Services',
    description: 'Technology solutions, software branding, and digital service marketing.',
    color: 'from-slate-500 to-gray-600'
  }
};

// Type assertion for the imported JSON
const data = portfolioData as { 
  projects: Project[]; 
  categories: { id: string; label: string }[];
  services: string[];
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.category as string;
  
  const meta = categoryMeta[categoryId];
  const projects = data.projects.filter(p => p.category === categoryId);
  
  // Get all assets from all projects in this category
  const allAssets: { asset: PortfolioAsset; project: Project }[] = [];
  projects.forEach(project => {
    project.assets.forEach(asset => {
      allAssets.push({ asset, project });
    });
  });

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link href="/#portfolio" className="text-primary-600 hover:underline">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => router.push('/#portfolio')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/10 text-primary-700 hover:bg-primary-500/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={cn(
        "relative py-20 bg-gradient-to-r",
        meta.color
      )}>
        <div className="container mx-auto px-4 text-center text-white">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {meta.title}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-2xl mx-auto opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {meta.description}
          </motion.p>
          <motion.div
            className="mt-6 text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {projects.length} Projects • {allAssets.length} Assets
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {projects.map((project, projectIndex) => (
            <motion.div
              key={project.id}
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: projectIndex * 0.1 }}
            >
              {/* Project Header */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
                  {project.title}
                </h2>
                <p className="text-gray-600 mb-2">{project.client}</p>
                <p className="text-gray-500 max-w-3xl">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.services.map((service, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm bg-primary-500/10 text-primary-700 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.assets.map((asset, assetIndex) => {
                  const assetType = getAssetType(asset.src, asset.type);
                  const isVideo = assetType === 'video';

                  return (
                    <motion.div
                      key={`${project.id}-${assetIndex}`}
                      className="relative group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: assetIndex * 0.05 }}
                    >
                      {isVideo ? (
                        <div className="relative aspect-video">
                          <video
                            src={asset.src}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                          <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                            <Play className="w-3 h-3" />
                            Video
                          </div>
                        </div>
                      ) : (
                        <div className="relative aspect-video">
                          <Image
                            src={asset.src}
                            alt={asset.title || project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      
                      {/* Asset Title */}
                      <div className="p-4 bg-white">
                        <h3 className="font-medium text-gray-900 truncate">
                          {asset.title || `Asset ${assetIndex + 1}`}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No projects in this category yet.</p>
              <Link
                href="/#portfolio"
                className="inline-block mt-4 text-primary-600 hover:underline"
              >
                Back to Portfolio
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Back to Portfolio CTA */}
      <section className="py-12 bg-cream-200">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/#portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-medium rounded-full hover:bg-primary-700 transition-colors shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Explore Other Categories
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
