'use client';

import { motion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

// Common animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -10, scale: 0.9 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

export const flipIn: Variants = {
  hidden: { opacity: 0, rotateY: -90 },
  visible: {
    opacity: 1,
    rotateY: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  },
};

export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    }
  },
};

export const glowPulse: Variants = {
  hidden: { opacity: 0, boxShadow: '0 0 0 rgba(61, 90, 90, 0)' },
  visible: {
    opacity: 1,
    boxShadow: [
      '0 0 0 rgba(61, 90, 90, 0)',
      '0 0 30px rgba(61, 90, 90, 0.4)',
      '0 0 0 rgba(61, 90, 90, 0)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

export const floatAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: [0, -10, 0],
    transition: {
      y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      opacity: { duration: 0.6 }
    }
  },
};

export const textReveal: Variants = {
  hidden: { opacity: 0, y: 50, skewY: 3 },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] }
  },
};

export const cardHover: Variants = {
  rest: { scale: 1, boxShadow: '0 0 0 rgba(61, 90, 90, 0)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(61, 90, 90, 0.2)',
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

// Reusable animation components
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { duration: 0.6, delay, ease: 'easeOut' }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, delay, ease: 'easeOut' }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: { duration: 0.5, delay, ease: 'easeOut' }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.1 }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.2,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// New advanced animation components
export function SlideInLeft({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, x: -50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.6, delay, ease: 'easeOut' }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInRight({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, x: 50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.6, delay, ease: 'easeOut' }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BounceIn({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay,
          }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RotateIn({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, rotate: -15, scale: 0.9 },
        visible: {
          opacity: 1,
          rotate: 0,
          scale: 1,
          transition: { duration: 0.6, delay, ease: 'easeOut' }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Float({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Pulse({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlowPulse({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 0 20px rgba(61, 90, 90, 0.2)',
          '0 0 40px rgba(61, 90, 90, 0.4)',
          '0 0 20px rgba(61, 90, 90, 0.2)',
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TextReveal({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
        visible: {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          transition: {
            duration: 0.8,
            delay,
            ease: [0.6, 0.01, 0.05, 0.95]
          }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Enhanced stagger with more options
interface EnhancedStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function EnhancedStagger({ 
  children, 
  className, 
  staggerDelay = 0.1,
  direction = 'up'
}: EnhancedStaggerProps) {
  const directionVariants = {
    up: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.2,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function EnhancedStaggerItem({ 
  children, 
  className,
  direction = 'up'
}: { 
  children: ReactNode; 
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const directionMap = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...directionMap[direction] },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { duration: 0.5, ease: 'easeOut' }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
