'use client';

import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const NOOP_THEME: ThemeContextType = {
  theme: 'dark' as Theme,
  toggleTheme() {
    // Theme switching was removed: the site is dark-only.
  },
  setTheme() {
    // Theme switching was removed: the site is dark-only.
  },
};

/**
 * @deprecated The site is dark-only. Kept as a pass-through so legacy imports
 * compile until Wave 2 removes the remaining `useTheme()` callers. Renders
 * children immediately (no blank first paint).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * @deprecated Always returns the dark theme; needs no provider. Remove usages.
 */
export function useTheme(): ThemeContextType {
  return NOOP_THEME;
}
