'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative p-2.5 rounded-full',
        'bg-primary-500/10 hover:bg-primary-500/20',
        'border border-primary-500/20 hover:border-primary-500/40',
        'text-primary-400 hover:text-primary-300',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        theme === 'dark' ? 'focus:ring-offset-dark-900' : 'focus:ring-offset-white',
        className
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full opacity-0',
          theme === 'dark' 
            ? 'bg-yellow-400/20' 
            : 'bg-blue-400/20'
        )}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}
