'use client';

import { useState, useMemo, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Image as ImageIcon, X, ChevronLeft, ChevronRight, Film, ImageOff, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getAssetType } from '@/lib/utils';
import { SlideUp, StaggerContainer, StaggerItem, scaleIn, staggerContainer } from '@/lib/animations';
import { useTheme } from '@/lib/theme-context';
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
  const { theme } = useTheme();

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
          className={cn(
            "relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl",
            theme === 'dark' ? 'bg-dark-900' : 'bg-cream-100'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={cn(
            "flex items-center justify-between p-4 sm:p-6 border-b",
            theme === 'dark' ? 'border-white/10' : 'border-cream-400'
          )}>
            <div>
              <h3 className={cn(
                "text-xl font-display font-semibold",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {project.title}
              </h3>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>{project.client}</p>
            </div>
            <button
              onClick={onClose}
              className={cn(
                "p-2 rounded-full transition-colors",
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-cream-300'
              )}
              aria-label="Close modal"
            >
              <X className={cn(
                "w-6 h-6",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )} />
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
const ProjectCard = motion.create(
  forwardRef<HTMLElement, ProjectCardProps>(function ProjectCardInner(
    { project, onClick },
    ref
  ) {
    const { theme } = useTheme();
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
          'group relative rounded-2xl overflow-hidden transform transition-all duration-500 cursor-pointer border',
          theme === 'dark'
            ? 'bg-dark-800 border-primary-500/0 hover:border-primary-500/30'
            : 'bg-cream-100 border-cream-400 hover:border-secondary-300 shadow-sm hover:shadow-2xl'
        )}
        style={{ 
          boxShadow: isHovered 
            ? (theme === 'dark' ? '0 25px 50px rgba(61, 90, 90, 0.2)' : '0 25px 50px rgba(61, 90, 90, 0.15)')
            : '0 0 0 rgba(61, 90, 90, 0)' 
        }}
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
          <h3 className={cn(
            "text-lg font-display font-semibold mb-1 group-hover:text-primary-400 transition-colors",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {project.title}
          </h3>
          <p className={cn(
            "text-sm mb-2",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>{project.client}</p>
          <p className={cn(
            "text-xs line-clamp-2",
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          )}>{project.description}</p>
        </div>
      </article>
    );
  })
);

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { theme } = useTheme();

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
      className={cn(
        'relative py-20 sm:py-28 lg:py-32 overflow-hidden',
        theme === 'dark' ? 'bg-dark-950/80 backdrop-blur-sm' : 'bg-cream-400/60 backdrop-blur-sm'
      )}
      aria-labelledby="portfolio-heading"
    >
      {/* Enhanced Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-secondary-500/5 blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Decorative grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(61, 90, 90, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(61, 90, 90, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header with enhanced animation */}
        <SlideUp className="text-center mb-12 sm:mb-16">
          <motion.span 
            className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-medium rounded-full border',
              theme === 'dark'
                ? 'text-primary-400 bg-primary-500/10 border-primary-500/20'
                : 'text-primary-600 bg-primary-500/10 border-primary-500/25'
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Sparkles className="w-4 h-4" />
            Our Work
          </motion.span>
          <motion.h2
            id="portfolio-heading"
            className={cn(
              'text-3xl sm:text-4xl lg:text-display-md font-display font-bold mb-6',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Featured{' '}
            <span className="gradient-text">Work</span>
          </motion.h2>
          <motion.p 
            className={cn(
              'text-lg max-w-2xl mx-auto',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Our Kreativ Nomads have collaborated with corporations and local MSMEs,
            crafting content solutions to meet their unique needs.
          </motion.p>
        </SlideUp>

        {/* Filter Bar with enhanced animations */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border',
                activeFilter === category.id
                  ? 'bg-primary-500 text-white shadow-lg border-primary-500'
                  : theme === 'dark'
                    ? 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 border-primary-500/10 hover:border-primary-500/30'
                    : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-300 hover:border-primary-400'
              )}
              style={activeFilter === category.id ? { boxShadow: '0 10px 30px rgba(61, 90, 90, 0.3)' } : {}}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              aria-pressed={activeFilter === category.id}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid with enhanced stagger */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={`${project.client}-${index}`}
                project={project}
                onClick={() => setSelectedProject(project)}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className={cn(
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>No projects found for this category.</p>
          </motion.div>
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
