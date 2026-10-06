'use client';

import { useEffect, useRef, useState } from 'react';
import { getDeviceTier } from '@/hooks/useDeviceTier';

const REEL_SRC = '/media/hero/reel.mp4';
/**
 * Plain static files (scripts/static-image-sizes.mjs makes the two smaller widths), not next/image: the poster is
 * one of the few things the first paint waits for, and the image optimizer has to encode it on a cold cache.
 */
const POSTER_SRC = '/media/hero/reel-poster.webp';
const POSTER_SRCSET =
  '/media/hero/reel-poster-640.webp 640w, /media/hero/reel-poster-828.webp 828w, /media/hero/reel-poster.webp 1280w';
const POSTER_WIDTH = 1280;
const POSTER_HEIGHT = 720;
/** The reel never competes with the first paint: wait for window load, then this long. */
const VIDEO_DELAY_MS = 2000;

/** Calls `fn` once the window has loaded and `VIDEO_DELAY_MS` has passed; returns a cancel function. */
function afterLoadAndIdle(fn: () => void): () => void {
  let timer = 0;
  const arm = () => {
    timer = window.setTimeout(fn, VIDEO_DELAY_MS);
  };
  if (document.readyState === 'complete') {
    arm();
    return () => window.clearTimeout(timer);
  }
  window.addEventListener('load', arm, { once: true });
  return () => {
    window.removeEventListener('load', arm);
    window.clearTimeout(timer);
  };
}

/**
 * Background reel. The poster is the server-rendered layer; the video is only
 * mounted after window load + ~2s (and never on reduced-motion / Save-Data /
 * low-end devices), fades in on `canplay`, and plays only while the hero is on
 * screen. Below the lg breakpoint the layer is capped at ~1 viewport tall so the
 * object-cover video is not scaled to a multi-thousand-pixel-wide surface.
 */
export default function HeroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (getDeviceTier() === 'low') return undefined;
    return afterLoadAndIdle(() => setAllowVideo(true));
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!allowVideo || !root || !video) return undefined;

    const play = () => {
      void video.play().catch(() => undefined);
    };
    let onScreen = false;
    const observer = new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1];
      if (!last) return;
      onScreen = last.isIntersecting;
      if (onScreen && !document.hidden) play();
      else video.pause();
    });
    observer.observe(root);
    // The observer will not re-fire when the tab returns, so resume by hand.
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (onScreen) play();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      video.pause();
    };
  }, [allowVideo]);

  return (
    <div ref={rootRef} className="hero-backdrop pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(100%,115svh)] lg:h-full" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={POSTER_SRC}
        srcSet={POSTER_SRCSET}
        sizes="100vw"
        width={POSTER_WIDTH}
        height={POSTER_HEIGHT}
        alt=""
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      {allowVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          data-ready={ready}
          onCanPlay={() => setReady(true)}
          className="hero-backdrop__video absolute inset-0 h-full w-full object-cover"
        >
          <source src={REEL_SRC} type="video/mp4" />
        </video>
      )}
      <div className="hero-backdrop__scrim absolute inset-0" />
    </div>
  );
}
