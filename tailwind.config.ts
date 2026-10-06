import type { Config } from 'tailwindcss';

const config: Config = {
  // The site is dark-only; the class strategy is kept (unused) for compatibility.
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Kreativ Nomads palette
        primary: {
          50: '#f0f5f5',
          100: '#d9e5e5',
          200: '#b3cbcb',
          300: '#8db1b1',
          400: '#5a8585',
          500: '#3d5a5a', // Main dark green from logo
          600: '#354f4f',
          700: '#2d4545',
          800: '#263a3a',
          900: '#1f2f2f',
          950: '#141f1f',
        },
        // Orange/Amber accent color
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Main orange/amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Cream/beige for light backgrounds
        cream: {
          50: '#fefdfb',
          100: '#fdf9f0',
          200: '#fbf5e6',
          300: '#f8f0d8',
          400: '#f5eaca',
          500: '#f5f0dc', // Main cream color
          600: '#e6d9b8',
          700: '#d4c394',
          800: '#b8a370',
          900: '#9c8456',
          950: '#6b5a3a',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        dark: {
          50: '#f6f7f6',
          100: '#e3e5e3',
          200: '#c6cbc6',
          300: '#a1a9a1',
          400: '#7c857c',
          500: '#626a62',
          600: '#4d544d',
          700: '#404540',
          800: '#1a1a1a',
          900: '#121212',
          950: '#0a0a0a', // True black
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography Scale
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3' }],
        'display-xs': ['1.5rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      // Utility mirrors of the fx/ keyframes (fx.css defines the kn-* versions
      // used internally). All transform/opacity-only.
      animation: {
        shine: 'shine 7s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee 40s linear infinite reverse',
        orbit: 'orbit 14s linear infinite',
        draw: 'draw 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translate3d(0,0,0) skewX(-18deg)' },
          '55%, 100%': { transform: 'translate3d(420%,0,0) skewX(-18deg)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        orbit: {
          to: { transform: 'rotate(360deg)' },
        },
        draw: {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
