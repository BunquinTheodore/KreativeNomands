'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // -1 to 1, negative = move opposite to scroll
  opacity?: number;
  scale?: number;
}

export function ParallaxImage({ 
  src, 
  alt, 
  className = '', 
  speed = 0.2,
  opacity = 0.15,
  scale = 1.2
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);

  return (
    <motion.div
      ref={ref}
      className={`absolute pointer-events-none ${className}`}
      style={{ 
        y,
        opacity,
        scale,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-contain"
        priority={false}
      />
    </motion.div>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  parallaxSpeed?: number;
}

export function ParallaxSection({
  children,
  className = '',
  backgroundImage,
  overlayOpacity = 0.6,
  parallaxSpeed = 0.3
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${parallaxSpeed * 50}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <>
          <motion.div
            className="absolute inset-0 -z-10"
            style={{ y, scale }}
          >
            <Image
              src={backgroundImage}
              alt="Background"
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />
          </motion.div>
          <div 
            className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-300/90 via-cream-300/80 to-cream-300/90"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}
      {children}
    </div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function FloatingElement({
  children,
  speed = 0.2,
  direction = 'up',
  className = ''
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const getTransform = () => {
    const range = speed * 200;
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [`${range}px`, `${-range}px`]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [`${-range}px`, `${range}px`]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [`${range}px`, `${-range}px`]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [`${-range}px`, `${range}px`]);
    }
  };

  const transform = getTransform();
  const isHorizontal = direction === 'left' || direction === 'right';

  return (
    <motion.div
      ref={ref}
      className={className}
      style={isHorizontal ? { x: transform } : { y: transform }}
    >
      {children}
    </motion.div>
  );
}
