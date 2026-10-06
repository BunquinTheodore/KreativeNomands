'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import Image from 'next/image';
import { Pause, Play, VideoOff } from 'lucide-react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import type { ShowcaseAsset } from './data';
import { STAGE_SIZES } from './preload';
import { useSaveData } from './useStageHooks';

interface VideoSlideProps {
  asset: ShowcaseAsset;
  label: string;
  /** Stage is on screen, tab visible: the only time playback is allowed. */
  canPlay: boolean;
  /** Hairline fill element owned by the stage; written directly (no re-render per frame). */
  progressRef: RefObject<HTMLElement>;
}

/**
 * Muted looping video. Autoplays only while the stage is in view, pauses
 * otherwise. Reduced motion / Save-Data show the poster until the viewer taps.
 * Click or tap toggles play / pause. Only this one <video> is ever mounted.
 */
export default function VideoSlide({ asset, label, canPlay, progressRef }: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const saveData = useSaveData();
  const autoplayAllowed = !reduced && !saveData;
  const [intent, setIntent] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const wantPlay = intent ?? autoplayAllowed;
  const shouldPlay = wantPlay && canPlay && !failed;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      const attempt = video.play();
      attempt?.catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [shouldPlay]);

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

  return (
    <>
      {asset.poster ? (
        <Image
          src={asset.poster}
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
            preload={autoplayAllowed ? 'auto' : 'none'}
            aria-label={label}
            className="absolute inset-0 h-full w-full object-contain p-2 sm:p-5"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
          />
          <button
            type="button"
            aria-label={`${wantPlay ? 'Pause' : 'Play'} video: ${label}`}
            aria-pressed={wantPlay}
            onClick={() => setIntent(!wantPlay)}
            className="group absolute inset-0 z-[1] flex items-center justify-center"
          >
            <span
              className={`glass inline-flex h-16 w-16 items-center justify-center rounded-full text-cream-500 transition-[opacity,transform] duration-300 ${
                playing ? 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100' : 'opacity-100'
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
