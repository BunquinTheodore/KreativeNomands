'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play, Volume2, VolumeX } from 'lucide-react';

interface NavButtonProps {
  side: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  /** Sit at the bottom edge on phones (keeps the arrows off the content). */
  lowOnMobile?: boolean;
}

/** Glass round arrow, vertically centred on the stage edge. */
export function NavButton({ side, onClick, disabled, lowOnMobile }: NavButtonProps) {
  const Icon = side === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      data-noswipe=""
      data-sfx="none"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'prev' ? 'Previous asset' : 'Next asset'}
      className={`kp-ctl glass shine absolute top-1/2 z-10 -translate-y-1/2 ${
        lowOnMobile ? 'max-sm:bottom-3 max-sm:top-auto max-sm:translate-y-0' : ''
      } ${
        side === 'prev' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'
      }`}
    >
      <Icon className="relative z-10 h-5 w-5" aria-hidden="true" />
    </button>
  );
}

interface ToggleButtonProps {
  pressed: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}

function ToggleButton({ pressed, onClick, label, children }: ToggleButtonProps) {
  return (
    <button
      type="button"
      data-noswipe=""
      onClick={onClick}
      data-pressed={pressed}
      aria-label={label}
      title={label}
      className="kp-ctl glass shine"
    >
      <span className="relative z-10 inline-flex">{children}</span>
    </button>
  );
}

export interface SoundControl {
  muted: boolean;
  onToggle: () => void;
  /** The viewer has not chosen yet: show the small "Tap for sound" nudge under the button row. */
  showHint: boolean;
}

const SOUND_LABEL = 'Video sound';
/** How long the "Tap for sound" nudge stays up before it gets out of the way. */
const SOUND_HINT_MS = 6000;

/** Mute / unmute for the stage video (aria-pressed = sound on; label and tooltip stay the same). */
function SoundButton({ muted, onToggle }: SoundControl) {
  return (
    <button
      type="button"
      data-noswipe=""
      onClick={onToggle}
      aria-label={SOUND_LABEL}
      aria-pressed={!muted}
      title={SOUND_LABEL}
      className="kp-ctl glass shine"
    >
      <span className="relative z-10 inline-flex">
        {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
      </span>
    </button>
  );
}

/** Small nudge under the button row; hides itself after SOUND_HINT_MS. */
function SoundHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), SOUND_HINT_MS);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <span className="kp-sound-hint glass" aria-hidden="true">
      Tap for sound
    </span>
  );
}

interface TopControlsProps {
  counter: string;
  counterLabel: string;
  slideshowAvailable: boolean;
  slideshowOn: boolean;
  onToggleSlideshow: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  /** Local video slides only. */
  sound?: SoundControl;
}

/** Counter pill (top-left) and slideshow / sound / fullscreen toggles (top-right). */
export function TopControls({
  counter,
  counterLabel,
  slideshowAvailable,
  slideshowOn,
  onToggleSlideshow,
  fullscreen,
  onToggleFullscreen,
  sound,
}: TopControlsProps) {
  return (
    <>
      <p className="glass absolute left-3 top-3 z-10 rounded-full px-3.5 py-1.5 text-xs font-semibold tabular-nums tracking-wider text-cream-500 sm:left-4 sm:top-4 sm:text-sm">
        <span aria-hidden="true">{counter}</span>
        <span className="sr-only">{counterLabel}</span>
      </p>
      <div className="absolute right-3 top-3 z-10 flex gap-2 sm:right-4 sm:top-4">
        {slideshowAvailable ? (
          <ToggleButton
            pressed={slideshowOn}
            onClick={onToggleSlideshow}
            label={slideshowOn ? 'Pause slideshow' : 'Start slideshow'}
          >
            {slideshowOn ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
          </ToggleButton>
        ) : null}
        {sound ? <SoundButton {...sound} /> : null}
        <ToggleButton
          pressed={fullscreen}
          onClick={onToggleFullscreen}
          label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </ToggleButton>
        {sound?.showHint ? <SoundHint /> : null}
      </div>
    </>
  );
}
