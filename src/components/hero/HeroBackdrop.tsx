'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getDeviceTier } from '@/hooks/useDeviceTier';

const REEL_SRC = '/media/hero/reel.mp4';
const POSTER_SRC = '/media/hero/reel-poster.webp';
const POSTER_WIDTH = 1280;
const POSTER_HEIGHT = 720;

/**
 * Background reel. The poster is the server-rendered layer; the video is only
 * mounted after hydration (and never on reduced-motion / Save-Data / low-end
 * devices), fades in on `canplay`, and plays only while the hero is on screen.
 */
export default function HeroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAllowVideo(getDeviceTier() !== 'low');
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!allowVideo || !root || !video) return undefined;

    const play = () => {
      void video.play().catch(() => undefined);
    };
    const observer = new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1];
      if (!last) return;
      if (last.isIntersecting) play();
      else video.pause();
    });
    observer.observe(root);
    const onVisibility = () => {
      if (document.hidden) video.pause();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      video.pause();
    };
  }, [allowVideo]);

  return (
    <div ref={rootRef} className="hero-backdrop pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <Image
        src={POSTER_SRC}
        alt=""
        width={POSTER_WIDTH}
        height={POSTER_HEIGHT}
        sizes="100vw"
        quality={60}
        loading="eager"
        fetchPriority="low"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      {allowVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER_SRC}
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
