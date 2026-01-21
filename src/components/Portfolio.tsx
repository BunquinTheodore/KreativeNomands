'use client';

import { useState, useMemo, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Image as ImageIcon, X, ChevronLeft, ChevronRight, Film, ImageOff } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getAssetType } from '@/lib/utils';
import { SlideUp } from '@/lib/animations';
import type { Project, PortfolioAsset } from '@/types';
import portfolioData from '@/data/portfolio.json';

// Type for category filter
interface Category {
  id: string;
  label: string;
}

// Type assertion for the imported JSON
const data = portfolioData as { 
  projects: Project[]; 
  categories: Category[];
  services: string[];
};

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentAsset = project.assets[currentIndex];
  const assetType = getAssetType(currentAsset.src, currentAsset.type);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % project.assets.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + project.assets.length) % project.assets.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/95 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} project gallery`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-5xl bg-dark-900 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
            <div>
              <h3 className="text-xl font-display font-semibold text-white">
                {project.title}
              </h3>
              <p className="text-sm text-gray-400">{project.client}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Media Container */}
          <div className="relative aspect-video bg-dark-950">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {assetType === 'video' ? (
                  <video
                    src={currentAsset.src}
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                    aria-label={currentAsset.title || 'Project video'}
                  />
                ) : (
                  <Image
                    src={currentAsset.src}
                    alt={currentAsset.title || `${project.title} - Image ${currentIndex + 1}`}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-contain"
                    quality={85}
                    loading="eager"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {project.assets.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2',
                    'p-3 rounded-full bg-dark-900/80 hover:bg-dark-800',
                    'text-white transition-colors'
                  )}
                  aria-label="Previous asset"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className={cn(
                    'absolute right-4 top-1/2 -translate-y-1/2',
                    'p-3 rounded-full bg-dark-900/80 hover:bg-dark-800',
                    'text-white transition-colors'
                  )}
                  aria-label="Next asset"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
          )}
          </div>

          {/* Thumbnails */}
          {project.assets.length > 1 && (
            <div className="p-4 sm:p-6 border-t border-white/10">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {project.assets.map((asset, index) => {
                  const type = getAssetType(asset.src, asset.type);
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden',
                        'border-2 transition-colors bg-dark-800',
                        currentIndex === index
                          ? 'border-primary-500'
                          : 'border-transparent hover:border-white/20'
                      )}
                      aria-label={`View ${asset.title || `asset ${index + 1}`}`}
                    >
                      {type === 'video' ? (
                        <div className="w-full h-full bg-dark-700 flex items-center justify-center">
                          <Play className="w-5 h-5 text-primary-400" />
                        </div>
                      ) : (
                        <Image
                          src={asset.src}
                          alt={asset.title || ''}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {currentIndex + 1} of {project.assets.length}
              </p>
            </div>
          )}

          {/* Asset Title */}
          {currentAsset.title && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <p className="text-sm text-gray-400 text-center">
                {currentAsset.title}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

// ProjectCard as a motion component to fix Framer Motion ref warning
const ProjectCard = motion(
  forwardRef<HTMLElement, ProjectCardProps>(function ProjectCardInner(
    { project, onClick },
    ref
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mediaError, setMediaError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Use the FIRST asset as the preview (per requirements)
    const previewAsset = project.assets[0];
    const previewType = getAssetType(previewAsset.src, previewAsset.type);
    const assetCount = project.assets.length;
    const hasVideo = project.assets.some((a) => getAssetType(a.src, a.type) === 'video');

    const handleMouseEnter = () => {
      setIsHovered(true);
      if (videoRef.current && previewType === 'video') {
        videoRef.current.play().catch(() => {
          // Autoplay may be blocked
        });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (videoRef.current && previewType === 'video') {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    const handleMediaError = () => {
      setMediaError(true);
    };

    return (
      <article
        ref={ref as React.Ref<HTMLElement>}
        className={cn(
          'group relative rounded-2xl overflow-hidden bg-dark-800',
          'cursor-pointer transform hover:scale-[1.02] transition-transform duration-300'
        )}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-label={`View ${project.title} project`}
      >
        {/* Media Preview */}
        <div className="relative aspect-[4/3] overflow-hidden bg-dark-900">
          {mediaError ? (
            /* Fallback for missing media */
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
              <ImageOff className="w-12 h-12 text-gray-600 mb-2" />
              <span className="text-xs text-gray-500">Media unavailable</span>
            </div>
          ) : previewType === 'video' ? (
            /* Video Preview */
            <video
              ref={videoRef}
              src={previewAsset.src}
              poster={(previewAsset as PortfolioAsset & { poster?: string }).poster}
              muted
              loop
              playsInline
              preload="metadata"
              onError={handleMediaError}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            /* Image Preview using Next.js Image */
            <Image
              src={previewAsset.src}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={handleMediaError}
              loading="lazy"
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQAAP/2Q=="
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />

          {/* Type Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-900/80 backdrop-blur-sm">
            {hasVideo ? (
              <Film className="w-3.5 h-3.5 text-primary-400" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5 text-primary-400" />
            )}
            <span className="text-xs text-white font-medium">{assetCount}</span>
          </div>

          {/* Play Button Overlay for Videos */}
          {previewType === 'video' && (
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
                isHovered ? 'opacity-0' : 'opacity-100'
              )}
            >
              <div className="w-16 h-16 rounded-full bg-primary-500/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-display font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-400 mb-2">{project.client}</p>
          <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
        </div>
      </article>
    );
  })
);

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = data.categories;
  const projects = data.projects;

  // Get filtered projects based on active filter (by category)
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return projects;
    }
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <section
      id="portfolio"
      className="relative py-20 sm:py-28 lg:py-32 bg-dark-950"
      aria-labelledby="portfolio-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SlideUp className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20">
            Our Work
          </span>
          <h2
            id="portfolio-heading"
            className="text-3xl sm:text-4xl lg:text-display-md font-display font-bold text-white mb-6"
          >
            Featured Work
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our Kreativ Nomads have collaborated with corporations and local MSMEs,
            crafting content solutions to meet their unique needs.
          </p>
        </SlideUp>

        {/* Filter Bar */}
        <SlideUp className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                activeFilter === category.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
              )}
              aria-pressed={activeFilter === category.id}
            >
              {category.label}
            </button>
          ))}
        </SlideUp>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={`${project.client}-${index}`}
                project={project}
                onClick={() => setSelectedProject(project)}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">No projects found for this category.</p>
          </div>
        )}

        {/* Project Modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </section>
  );
}
