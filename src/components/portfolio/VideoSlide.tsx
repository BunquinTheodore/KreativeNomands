'use client';

import { useEffect, useRef, useState, type MutableRefObject, type RefObject } from 'react';
import Image from 'next/image';
import { useIsPresent } from 'framer-motion';
import { Pause, Play, VideoOff } from 'lucide-react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { DEFERRED_VIDEO_MIN_MS, onInteractionOrDelay } from '@/lib/boot-gate';
import type { ShowcaseAsset } from './data';
import { STAGE_SIZES } from './preload';
import { useSaveData } from './useStageHooks';
import { setVideoMuted, useVideoSound } from './videoSound';

/** Sets the mounted video's mute state synchronously (inside the viewer's gesture, for iOS Safari). */
export type SoundController = (muted: boolean) => void;

/** Set once the stage has started any video this page view (shared by every slide instance). */
let stageBooted = false;

interface VideoSlideProps {
  asset: ShowcaseAsset;
  label: string;
  /** Stage is on screen, tab visible: the only time playback is allowed. */
  canPlay: boolean;
  /** Hairline fill element owned by the stage; written directly (no re-render per frame). */
  progressRef: RefObject<HTMLElement>;
  /** First, server-rendered slide: fetch nothing until the visitor interacts or the boot delay passes. */
  priority?: boolean;
  /** Filled with this slide's sound controller while it is mounted. */
  soundCtlRef: MutableRefObject<SoundController | null>;
  /** The element's actual mute state (it can differ from the preference when unmuted autoplay is refused). */
  onMutedChange: (muted: boolean) => void;
  /** The clip could not be loaded (the stage hides its sound control). */
  onFailed: () => void;
}

/**
 * Looping video with sound on request. Autoplays muted while the stage is in view and pauses otherwise;
 * the session's sound choice (see videoSound.ts) is applied to every slide. Reduced motion / Save-Data
 * show the poster until the viewer taps. The first server-rendered slide waits for an interaction or
 * DEFERRED_VIDEO_MIN_MS before it fetches anything, so a lab run never downloads video. Click or tap
 * toggles play / pause; a tap on play may unmute while the viewer has not chosen mute explicitly.
 * Only this one <video> is ever mounted, so leaving the slide stops its sound.
 */
export default function VideoSlide({
  asset,
  label,
  canPlay,
  progressRef,
  priority = false,
  soundCtlRef,
  onMutedChange,
  onFailed,
}: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const saveData = useSaveData();
  const sound = useVideoSound();
  const autoplayAllowed = !reduced && !saveData;
  // Once any slide has booted, returning to the server-rendered first slide must not wait again.
  const [booted, setBooted] = useState(!priority || stageBooted);
  const [intent, setIntent] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  // False while this slide plays its exit transition: stop playback (and sound) at once.
  const present = useIsPresent();

  const wantPlay = (intent ?? autoplayAllowed) && booted;
  const shouldPlay = wantPlay && canPlay && present && !failed;
  const wantPlayRef = useRef(wantPlay);
  const reportRef = useRef(onMutedChange);
  const presentRef = useRef(present);
  // Declared first so the refs are current before any effect or event handler below reads them.
  useEffect(() => {
    wantPlayRef.current = wantPlay;
    reportRef.current = onMutedChange;
    presentRef.current = present;
  });

  useEffect(() => {
    if (booted) stageBooted = true;
  }, [booted]);

  // Only while the stage is in view: an unrelated tap elsewhere on the page must not queue the download.
  useEffect(() => {
    if (booted || !canPlay) return undefined;
    return onInteractionOrDelay(() => setBooted(true), DEFERRED_VIDEO_MIN_MS);
  }, [booted, canPlay]);

  // Before the play effect: a slide mounted after an unmute starts with sound where the browser allows.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = sound.muted;
    reportRef.current(sound.muted);
  }, [sound.muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!shouldPlay) {
      video.pause();
      return;
    }
    video.play()?.catch((error: unknown) => {
      const refused = error instanceof DOMException && error.name === 'NotAllowedError';
      if (!refused || video.muted) {
        setPlaying(false);
        return;
      }
      // Unmuted autoplay refused: mute this element only (the stored preference stays) and retry once.
      video.muted = true;
      reportRef.current(true);
      video.play()?.catch(() => setPlaying(false));
    });
  }, [shouldPlay]);

  useEffect(() => {
    const controller: SoundController = (nextMuted) => {
      const video = videoRef.current;
      // An exiting slide ignores the toggle: the incoming slide picks the stored choice up on mount.
      if (!video || !presentRef.current) return;
      video.muted = nextMuted;
      reportRef.current(nextMuted);
      if (nextMuted || !video.paused || !wantPlayRef.current) return;
      video.play()?.catch(() => setPlaying(false));
    };
    soundCtlRef.current = controller;
    return () => {
      // An exiting slide must not clear the controller of the slide that replaced it.
      if (soundCtlRef.current === controller) soundCtlRef.current = null;
    };
  }, [soundCtlRef]);

  useEffect(() => {
    if (!playing) return undefined;
    const video = videoRef.current;
    let frame = 0;
    const paint = () => {
      const bar = progressRef.current;
      if (video && bar && video.duration > 0) {
        bar.style.transform = `scaleX(${(video.currentTime / video.duration).toFixed(4)})`;
      }
      frame = window.requestAnimationFrame(paint);
    };
    frame = window.requestAnimationFrame(paint);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, progressRef]);

  useEffect(() => {
    const bar = progressRef.current;
    return () => {
      if (bar) bar.style.transform = 'scaleX(0)';
    };
  }, [progressRef]);

  const onPlayClick = () => {
    const next = !wantPlay;
    setIntent(next);
    setBooted(true);
    const video = videoRef.current;
    // A silent clip never changes the session's sound choice.
    if (!next || !video || !sound.muted || sound.explicit || asset.hasAudio !== true) return;
    // A deliberate play while sound was never chosen: unmute inside the gesture so iOS allows it.
    video.muted = false;
    reportRef.current(false);
    video.play()?.catch(() => setPlaying(false));
    setVideoMuted(false, false);
  };

  const backdrop = asset.thumb ?? asset.poster;

  return (
    <>
      {backdrop ? (
        <Image
          src={backdrop}
          alt=""
          aria-hidden="true"
          fill
          sizes="240px"
          draggable={false}
          className="scale-125 object-cover opacity-50 blur-2xl"
        />
      ) : null}

      {failed ? (
        <>
          {asset.poster ? (
            <Image
              src={asset.poster}
              alt={label}
              fill
              sizes={STAGE_SIZES}
              draggable={false}
              className="object-contain p-2 opacity-70 sm:p-5"
            />
          ) : null}
          <p
            role="status"
            className="glass absolute left-1/2 top-1/2 z-[1] inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm text-cream-500"
          >
            <VideoOff className="h-4 w-4 text-secondary-400" aria-hidden="true" />
            Video unavailable
          </p>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            src={asset.src}
            poster={asset.poster}
            muted
            loop
            playsInline
            preload={booted ? 'metadata' : 'none'}
            aria-label={label}
            className="absolute inset-0 h-full w-full object-contain p-2 sm:p-5"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              onFailed();
            }}
          />
          <button
            type="button"
            aria-label={`${wantPlay ? 'Pause' : 'Play'} video: ${label}`}
            onClick={onPlayClick}
            className="group absolute inset-0 z-[1] flex items-center justify-center rounded-3xl focus-visible:outline-offset-[-6px]"
          >
            <span
              className={`glass inline-flex h-16 w-16 items-center justify-center rounded-full text-cream-500 transition-[opacity,transform] duration-300 ${
                playing
                  ? 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100'
                  : 'opacity-100'
              }`}
              aria-hidden="true"
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-0.5" />}
            </span>
          </button>
        </>
      )}
    </>
  );
}
