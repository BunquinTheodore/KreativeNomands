'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import type { Project } from '@/types';

interface ITPortfolioGridProps {
  projects: Project[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function ITPortfolioGrid({ projects }: ITPortfolioGridProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Projects
          </motion.h2>
          <motion.p
            className="text-gray-500 text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Selected web projects delivered end‑to‑end.
          </motion.p>
        </div>

        {/* 3‑column × 2‑row grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 leading-snug mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-grow">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex flex-wrap items-center gap-3 mt-auto">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Repository
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
