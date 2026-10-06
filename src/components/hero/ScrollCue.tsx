'use client';

import { scrollToId } from '@/lib/scroll';

/** Animated "scroll" hint at the foot of the hero; also a button to the About section. */
export default function ScrollCue() {
  return (
    <div className="flex justify-center pb-6 pt-2">
      <button
        type="button"
        onClick={() => scrollToId('about')}
        aria-label="Scroll to the About section"
        className="group flex flex-col items-center gap-2 rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--ink-dim)] transition-colors hover:text-secondary-400"
      >
        <span className="hero-cue__mouse" aria-hidden="true">
          <span className="hero-cue__wheel" />
        </span>
        Scroll
      </button>
    </div>
  );
}
