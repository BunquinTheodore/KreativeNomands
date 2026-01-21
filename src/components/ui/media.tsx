'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  onLoad?: () => void;
}

/**
 * Optimized image component with lazy loading and blur placeholder
 */
export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Placeholder */}
      <div
        className={cn(
          'absolute inset-0 bg-dark-800 transition-opacity duration-300',
          isLoaded ? 'opacity-0' : 'opacity-100'
        )}
      />
      
      {/* Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          loading={priority ? 'eager' : 'lazy'}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
}

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
}

/**
 * Optimized video component with lazy loading
 */
export function OptimizedVideo({
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  playsInline = true,
}: OptimizedVideoProps) {
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        if (videoRef.current) {
          if (entry.isIntersecting && autoPlay) {
            videoRef.current.play().catch(() => {
              // Autoplay was prevented
            });
          } else {
            videoRef.current.pause();
          }
        }
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [autoPlay]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {isInView ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline={playsInline}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-dark-800 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-dark-700 animate-pulse" />
        </div>
      )}
    </div>
  );
}
