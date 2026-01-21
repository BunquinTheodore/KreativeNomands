'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: cn(
        'bg-primary-500 hover:bg-primary-600 text-white',
        'shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30',
        'focus:ring-primary-500'
      ),
      secondary: cn(
        'bg-white/5 hover:bg-white/10 text-white',
        'border border-white/10 hover:border-white/20',
        'focus:ring-white/50'
      ),
      ghost: cn(
        'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white',
        'focus:ring-white/50'
      ),
      outline: cn(
        'bg-transparent border-2 border-primary-500 text-primary-400',
        'hover:bg-primary-500 hover:text-white',
        'focus:ring-primary-500'
      ),
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-medium',
          'transition-all duration-200 transform hover:scale-105',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
