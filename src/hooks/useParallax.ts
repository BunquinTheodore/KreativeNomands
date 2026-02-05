'use client';

import { useEffect, useState, useCallback } from 'react';

interface ParallaxValues {
  scrollY: number;
  scrollProgress: number;
  direction: 'up' | 'down' | null;
}

export function useParallax(): ParallaxValues {
  const [values, setValues] = useState<ParallaxValues>({
    scrollY: 0,
    scrollProgress: 0,
    direction: null,
  });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;
    
    setValues(prev => ({
      scrollY,
      scrollProgress,
      direction: scrollY > prev.scrollY ? 'down' : scrollY < prev.scrollY ? 'up' : prev.direction,
    }));
  }, []);

  useEffect(() => {
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return values;
}

// Calculate parallax offset based on scroll position
export function getParallaxOffset(scrollY: number, speed: number = 0.5, offset: number = 0): number {
  return (scrollY - offset) * speed;
}

// Calculate element visibility based on scroll
export function getElementVisibility(
  scrollY: number, 
  elementTop: number, 
  elementHeight: number,
  windowHeight: number
): number {
  const start = elementTop - windowHeight;
  const end = elementTop + elementHeight;
  
  if (scrollY < start) return 0;
  if (scrollY > end) return 1;
  
  return (scrollY - start) / (end - start);
}
