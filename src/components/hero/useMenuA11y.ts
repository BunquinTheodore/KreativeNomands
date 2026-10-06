'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface MenuA11yOptions {
  open: boolean;
  onClose: () => void;
  /** The sheet whose links are focusable while open. */
  sheetRef: RefObject<HTMLElement>;
  /** The toggle button; stays reachable (and receives focus back on close). */
  toggleRef: RefObject<HTMLButtonElement>;
}

/**
 * While the mobile menu is open: lock page scroll, close on Escape, trap Tab
 * inside (toggle + sheet), move focus into the sheet and restore it on close.
 */
export default function useMenuA11y({ open, onClose, sheetRef, toggleRef }: MenuA11yOptions): void {
  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const toggle = toggleRef.current;
    const focusables = (): HTMLElement[] => {
      const inside = Array.from(sheetRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      return toggle ? [toggle, ...inside] : inside;
    };
    // Wait a frame so the sheet is visible (visibility: hidden elements cannot take focus).
    const focusFrame = window.requestAnimationFrame(() => {
      sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      const active = document.activeElement as HTMLElement | null;
      if (!active || !items.includes(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKeyDown);
      root.style.overflow = previousOverflow;
      toggle?.focus({ preventScroll: true });
    };
  }, [open, onClose, sheetRef, toggleRef]);
}
