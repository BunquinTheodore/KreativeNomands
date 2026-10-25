'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { Film, Loader2, Play } from 'lucide-react';
import type { ShowcaseAsset } from './data';
import { STAGE_SIZES } from './preload';

interface DriveSlideProps {
  asset: ShowcaseAsset;
  label: string;
  /** Server-rendered first slide: its facade still is the page's LCP, so load it eagerly. */
  priority?: boolean;
  /** The viewer asked to play: mount the Google Drive player. Owned by the stage (resets per slide). */
  active: boolean;
  onActivate: () => void;
}

/**
 * Google Drive–hosted video behind a click-to-load facade: the Drive thumbnail
 * and a play button until the viewer asks, then the Drive preview player in an
 * iframe sized to the video. Nothing from Drive except the thumbnail loads
 * before that, and only the current slide ever mounts the iframe.
 */
export default function DriveSlide({ asset, label, priority = false, active, onActivate }: DriveSlideProps) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Small still for the blurred backdrop, the large one (sz=w1000) for the facade itself.
  const backdrop = thumbFailed ? undefined : (asset.thumb ?? asset.poster);
  const still = thumbFailed ? undefined : (asset.poster ?? asset.thumb);
  const style = { '--kp-ratio': asset.width / asset.height } as CSSProperties;

  // The play button unmounts on activation: hand focus to the player so keyboard users don't drop to <body>.
  useEffect(() => {
    if (active) frameRef.current?.focus();
  }, [active]);

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
          referrerPolicy="no-referrer"
          className="scale-125 object-cover opacity-50 blur-2xl"
        />
      ) : (
        <span className="kp-drive-fallback absolute inset-0" aria-hidden="true" />
      )}

      {active ? (
        <div className="kp-drive-wrap">
          <div className="kp-drive-frame" style={style}>
            {loaded ? null : (
              <p
                role="status"
                className="glass pointer-events-none absolute left-1/2 top-1/2 z-[1] inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm text-cream-500"
              >
                <Loader2 className="h-4 w-4 animate-spin text-secondary-400 motion-reduce:animate-none" aria-hidden="true" />
                Loading player…
              </p>
            )}
            <iframe
              ref={frameRef}
              src={asset.src}
              title={label}
              allow="autoplay; encrypted-media; fullscreen"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setLoaded(true)}
              className="relative h-full w-full border-0"
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          aria-label={`Play video: ${label} (loads the Google Drive player)`}
          onClick={onActivate}
          className="group absolute inset-0 z-[1] flex items-center justify-center focus-visible:outline-none"
        >
          {still ? (
            <Image
              src={still}
              alt=""
              fill
              sizes={STAGE_SIZES}
              priority={priority}
              draggable={false}
              referrerPolicy="no-referrer"
              onError={() => setThumbFailed(true)}
              className="object-contain p-2 sm:p-5"
            />
          ) : (
            <Film className="absolute h-16 w-16 text-cream-500/15" aria-hidden="true" />
          )}
          <span className="relative flex flex-col items-center gap-3" aria-hidden="true">
            <span className="kp-drive-play glass inline-flex h-20 w-20 items-center justify-center rounded-full text-cream-500 sm:h-24 sm:w-24">
              <Play className="h-8 w-8 translate-x-0.5 sm:h-9 sm:w-9" fill="currentColor" />
            </span>
            <span className="glass rounded-full px-3 py-1 text-[0.7rem] font-medium tracking-wide text-cream-500/80 sm:text-xs">
              Plays via Google Drive
            </span>
          </span>
        </button>
      )}
    </>
  );
}
