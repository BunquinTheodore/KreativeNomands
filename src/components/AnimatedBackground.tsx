'use client';

import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';

export default function AnimatedBackground() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient layer */}
      <div
        className={cn(
          'absolute inset-0 transition-colors duration-500',
          theme === 'dark' ? 'bg-dark-950' : 'bg-cream-500'
        )}
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        {/* Large slow-moving orb 1 - primary green */}
        <div
          className={cn(
            'absolute w-[800px] h-[800px] rounded-full blur-[120px] animate-float-slow',
            theme === 'dark'
              ? 'bg-primary-900/20'
              : 'bg-primary-200/30'
          )}
          style={{
            top: '-20%',
            left: '-10%',
            animationDelay: '0s',
          }}
        />

        {/* Large slow-moving orb 2 - orange accent */}
        <div
          className={cn(
            'absolute w-[600px] h-[600px] rounded-full blur-[100px] animate-float-slow-reverse',
            theme === 'dark'
              ? 'bg-secondary-900/15'
              : 'bg-secondary-200/20'
          )}
          style={{
            top: '30%',
            right: '-15%',
            animationDelay: '-5s',
          }}
        />

        {/* Medium orb 3 */}
        <div
          className={cn(
            'absolute w-[500px] h-[500px] rounded-full blur-[80px] animate-float-medium',
            theme === 'dark'
              ? 'bg-primary-800/10'
              : 'bg-cream-300/50'
          )}
          style={{
            bottom: '10%',
            left: '20%',
            animationDelay: '-3s',
          }}
        />

        {/* Medium orb 4 - orange */}
        <div
          className={cn(
            'absolute w-[400px] h-[400px] rounded-full blur-[70px] animate-float-medium-reverse',
            theme === 'dark'
              ? 'bg-secondary-800/10'
              : 'bg-secondary-100/25'
          )}
          style={{
            top: '50%',
            left: '50%',
            animationDelay: '-7s',
          }}
        />

        {/* Small accent orb 5 - orange tint */}
        <div
          className={cn(
            'absolute w-[300px] h-[300px] rounded-full blur-[60px] animate-float-fast',
            theme === 'dark'
              ? 'bg-secondary-700/10'
              : 'bg-secondary-200/20'
          )}
          style={{
            top: '70%',
            right: '10%',
            animationDelay: '-2s',
          }}
        />

        {/* Small accent orb 6 - cream accent */}
        <div
          className={cn(
            'absolute w-[250px] h-[250px] rounded-full blur-[50px] animate-float-fast-reverse',
            theme === 'dark'
              ? 'bg-primary-700/10'
              : 'bg-cream-200/30'
          )}
          style={{
            top: '10%',
            left: '60%',
            animationDelay: '-4s',
          }}
        />
      </div>

      {/* Subtle grid overlay for texture */}
      <div
        className={cn(
          'absolute inset-0 opacity-[0.02]',
          theme === 'dark' ? 'bg-grid-dark' : 'bg-grid-light'
        )}
      />

      {/* Animated noise texture overlay */}
      <div
        className={cn(
          'absolute inset-0 animate-grain',
          theme === 'dark' ? 'opacity-[0.03]' : 'opacity-[0.02]'
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating particles with orange accent */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'absolute rounded-full animate-particle',
              theme === 'dark'
                ? 'bg-secondary-400/20'
                : 'bg-secondary-500/15'
            )}
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 20 + 20}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle moving gradient wave at bottom */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-[400px] animate-wave',
          theme === 'dark'
            ? 'bg-gradient-to-t from-dark-950/40 via-transparent to-transparent'
            : 'bg-gradient-to-t from-cream-300/40 via-transparent to-transparent'
        )}
      />
    </div>
  );
}
