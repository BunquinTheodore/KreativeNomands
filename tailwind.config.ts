import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Kreativ Nomads palette (Based on logo: Dark Teal/Forest Green)
        primary: {
          50: '#f0fdf9',
          100: '#ccfbec',
          200: '#9af5da',
          300: '#5fe9c5',
          400: '#2dd4ab',
          500: '#3d5a5a', // Main brand color from logo
          600: '#355050',
          700: '#2d4545',
          800: '#263a3a',
          900: '#1f2f2f',
          950: '#141f1f',
        },
        secondary: {
          50: '#f4f9f8',
          100: '#daf0eb',
          200: '#b5e0d8',
          300: '#88c9be',
          400: '#5daba0',
          500: '#428f86',
          600: '#34736c',
          700: '#2d5d58',
          800: '#284b48',
          900: '#253f3d',
          950: '#122524',
        },
        accent: {
          50: '#f6f7f6',
          100: '#e3e5e3',
          200: '#c6cbc6',
          300: '#a1a9a1',
          400: '#7c857c',
          500: '#626a62',
          600: '#4d544d',
          700: '#404540',
          800: '#363936',
          900: '#2f322f',
          950: '#1a1c1a',
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
          800: '#2a2d2a',
          900: '#1a1c1a',
          950: '#0f100f',
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
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(61, 90, 90, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(61, 90, 90, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.85) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
