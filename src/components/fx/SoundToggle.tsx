'use client';

import { useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sfx } from '@/lib/sfx';
import { cn } from '@/lib/utils';

const subscribe = (fn: () => void) => sfx.subscribe(fn);
const getSnapshot = () => sfx.isMuted();
const getServerSnapshot = () => false;

interface SoundToggleProps {
  className?: string;
}

/** Small glass button that mutes/unmutes UI sounds (persisted). */
export default function SoundToggle({ className }: SoundToggleProps) {
  const muted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next = !muted;
    sfx.unlock();
    sfx.setMuted(next);
    if (!next) sfx.play('click');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      data-sfx="none"
      aria-pressed={!muted}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      title={muted ? 'Sound off' : 'Sound on'}
      className={cn(
        'glass inline-flex h-10 w-10 items-center justify-center rounded-full text-cream-500',
        'transition-colors duration-300 hover:text-secondary-400',
        className,
      )}
    >
      {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
    </button>
  );
}
