'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Rocket } from 'lucide-react';
import { emitSfx } from '@/components/contact/emitSfx';

const LAUNCH_MS = 900;
const SCROLL_DELAY_MS = 180;

/** "Back to top" button: the rocket launches off the edge, re-enters, and the page scrolls up. */
export default function BackToTop() {
  const [launching, setLaunching] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const onClick = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    emitSfx('whoosh');
    setLaunching(true);
    const scroll = window.setTimeout(
      () => {
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch {
          // History updates can be blocked in sandboxed frames; the scroll still worked.
        }
      },
      reduced ? 0 : SCROLL_DELAY_MS,
    );
    const done = window.setTimeout(() => setLaunching(false), LAUNCH_MS);
    timers.current.push(scroll, done);
  }, []);

  return (
    <button
      type="button"
      className="kn-top glass shine"
      data-launching={launching ? 'true' : 'false'}
      data-sfx="none"
      onClick={onClick}
    >
      <span className="kn-top__rocket" aria-hidden="true">
        <Rocket className="h-4 w-4" />
      </span>
      Back to top
    </button>
  );
}
