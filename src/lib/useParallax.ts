'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface ParallaxConfig {
  speed?: number; // 0.1 to 1, where 1 is normal scroll speed
  direction?: 'up' | 'down';
  offset?: number;
}

interface ParallaxState {
  y: number;
  opacity: number;
  scale: number;
}

export function useParallax(config: ParallaxConfig = {}): ParallaxState {
  const { speed = 0.5, direction = 'up', offset = 0 } = config;
  const [state, setState] = useState<ParallaxState>({ y: 0, opacity: 1, scale: 1 });
  const ticking = useRef(false);

  const updateParallax = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Calculate parallax offset
    const parallaxY = direction === 'up' 
      ? -(scrollY * speed) + offset
      : (scrollY * speed) + offset;
    
    // Calculate opacity based on scroll position (fade effect)
    const scrollProgress = Math.min(scrollY / (windowHeight * 2), 1);
    const opacity = Math.max(1 - scrollProgress * 0.3, 0.7);
    
    // Subtle scale effect
    const scale = 1 + (scrollProgress * 0.05);

    setState({ y: parallaxY, opacity, scale });
    ticking.current = false;
  }, [speed, direction, offset]);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateParallax);
      ticking.current = true;
    }
  }, [updateParallax]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateParallax(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, updateParallax]);

  return state;
}

// Hook for element-specific parallax based on viewport intersection
export function useElementParallax(ref: React.RefObject<HTMLElement>, config: ParallaxConfig = {}) {
  const { speed = 0.3 } = config;
  const [offset, setOffset] = useState(0);
  const ticking = useRef(false);

  const updateOffset = useCallback(() => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how far the element is from center of viewport
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const distanceFromCenter = viewportCenter - elementCenter;
    
    // Apply parallax based on distance from center
    const parallaxOffset = distanceFromCenter * speed;
    
    setOffset(parallaxOffset);
    ticking.current = false;
  }, [ref, speed]);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateOffset);
      ticking.current = true;
    }
  }, [updateOffset]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateOffset();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, updateOffset]);

  return offset;
}

// Simple scroll progress hook (0 to 1)
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  const updateProgress = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
    setProgress(Math.min(Math.max(currentProgress, 0), 1));
    ticking.current = false;
  }, []);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateProgress);
      ticking.current = true;
    }
  }, [updateProgress]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, updateProgress]);

  return progress;
}
