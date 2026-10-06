'use client';

import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play } from 'lucide-react';

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
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      className="kp-ctl glass shine"
    >
      <span className="relative z-10 inline-flex">{children}</span>
    </button>
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
}

/** Counter pill (top-left) and slideshow / fullscreen toggles (top-right). */
export function TopControls({
  counter,
  counterLabel,
  slideshowAvailable,
  slideshowOn,
  onToggleSlideshow,
  fullscreen,
  onToggleFullscreen,
}: TopControlsProps) {
  return (
    <>
      <p
        className="glass absolute left-3 top-3 z-10 rounded-full px-3.5 py-1.5 text-xs font-semibold tabular-nums tracking-wider text-cream-500 sm:left-4 sm:top-4 sm:text-sm"
        aria-label={counterLabel}
      >
        {counter}
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
        <ToggleButton
          pressed={fullscreen}
          onClick={onToggleFullscreen}
          label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </ToggleButton>
      </div>
    </>
  );
}
