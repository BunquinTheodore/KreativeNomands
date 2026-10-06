'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { scrollToId } from '@/lib/scroll';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'glass' | 'ghost';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  href?: string;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  /** Pulls toward the pointer (mouse only, off for reduced motion). */
  magnetic?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  target?: string;
  rel?: string;
}

export type ButtonProps = ButtonOwnProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ButtonOwnProps
  >;

const MAGNET_PX = 8;

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-secondary-400 to-secondary-500 text-dark-950 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.55)] hover:from-secondary-300 hover:to-secondary-400',
  glass: 'glass text-cream-500 hover:text-white',
  ghost: 'bg-transparent text-cream-500 hover:text-secondary-400 hover:bg-cream-500/5',
};

function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

/**
 * Anchor or button with a continuous shine, optional magnetic pull and focus
 * ring. Internal routes use next/link; "#id" hrefs smooth-scroll with a header
 * offset. Click sounds come from the delegated SfxProvider (no wiring here).
 */
export default function Button({
  variant = 'primary',
  href,
  onClick,
  magnetic = false,
  icon,
  iconPosition = 'left',
  className,
  children,
  disabled,
  type = 'button',
  target,
  rel,
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef(0);

  useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || event.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { clientX, clientY } = event;
    window.cancelAnimationFrame(frame.current);
    frame.current = window.requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const dx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      el.style.transform = `translate3d(${(dx * MAGNET_PX).toFixed(2)}px, ${(dy * MAGNET_PX).toFixed(2)}px, 0)`;
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    window.cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.style.transform = '';
  }, []);

  const classes = cn(
    'kn-btn shine group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden',
    'rounded-full px-6 py-3 text-sm font-semibold tracking-wide',
    'transition-[background-color,color,box-shadow,transform] duration-300',
    'disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    className,
  );
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };
  const magnet = magnetic ? { onPointerMove, onPointerLeave } : {};
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="relative z-10 inline-flex">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && <span className="relative z-10 inline-flex">{icon}</span>}
    </>
  );

  if (href && !disabled) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    if (href.startsWith('#')) {
      const handle = (event: ReactMouseEvent<HTMLElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (scrollToId(href.slice(1))) event.preventDefault();
      };
      return (
        <a ref={setRef} href={href} onClick={handle} className={classes} {...anchorProps} {...magnet}>
          {content}
        </a>
      );
    }
    if (isExternal(href)) {
      const newTab = target ?? (href.startsWith('http') ? '_blank' : undefined);
      return (
        <a
          ref={setRef}
          href={href}
          onClick={onClick}
          target={newTab}
          rel={rel ?? (newTab === '_blank' ? 'noopener noreferrer' : undefined)}
          className={classes}
          {...anchorProps}
          {...magnet}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        ref={setRef}
        href={href}
        onClick={onClick}
        target={target}
        rel={rel}
        className={classes}
        {...anchorProps}
        {...magnet}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={setRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      {...magnet}
    >
      {content}
    </button>
  );
}

export { Button };
