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
        // Animated background animations
        'float-slow': 'floatSlow 30s ease-in-out infinite',
        'float-slow-reverse': 'floatSlowReverse 35s ease-in-out infinite',
        'float-medium': 'floatMedium 25s ease-in-out infinite',
        'float-medium-reverse': 'floatMediumReverse 28s ease-in-out infinite',
        'float-fast': 'floatFast 20s ease-in-out infinite',
        'float-fast-reverse': 'floatFastReverse 22s ease-in-out infinite',
        'particle': 'particle 30s linear infinite',
        'wave': 'wave 15s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
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
        // Animated background keyframes
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(50px, 30px) rotate(5deg)' },
          '50%': { transform: 'translate(20px, 60px) rotate(-5deg)' },
          '75%': { transform: 'translate(-30px, 40px) rotate(3deg)' },
        },
        floatSlowReverse: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(-40px, 50px) rotate(-5deg)' },
          '50%': { transform: 'translate(-60px, 20px) rotate(5deg)' },
          '75%': { transform: 'translate(-20px, -30px) rotate(-3deg)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -40px) scale(1.05)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.95)' },
        },
        floatMediumReverse: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-50px, 40px) scale(0.95)' },
          '66%': { transform: 'translate(30px, -50px) scale(1.05)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, -30px)' },
        },
        floatFastReverse: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-30px, 30px)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(-20px) translateY(-10px)' },
          '50%': { transform: 'translateX(0) translateY(-20px)' },
          '75%': { transform: 'translateX(20px) translateY(-10px)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
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
