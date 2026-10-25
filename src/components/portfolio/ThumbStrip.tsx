'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { FileText, Play } from 'lucide-react';
import { assetLabel, kindNoun } from './assetText';
import type { ShowcaseAsset, ShowcaseProject } from './data';
import { useCenterActive } from './useStageHooks';

interface ThumbStripProps {
  project: ShowcaseProject;
  activeIndex: number;
  onSelect: (index: number) => void;
}

/** Thumbnail body: the image (Drive thumbnails are remote), or a text tile for case studies. */
function ThumbFace({ asset }: { asset: ShowcaseAsset }) {
  if (asset.kind === 'case-study') {
    return (
      <span className="kp-thumb__doc">
        <FileText className="h-4 w-4 text-secondary-400" aria-hidden="true" />
        <span>Case study</span>
      </span>
    );
  }
  const src = asset.thumb ?? asset.poster;
  return (
    <>
      {src ? (
        <Image
          src={src}
          alt=""
          width={168}
          height={112}
          sizes="84px"
          draggable={false}
          referrerPolicy={asset.kind === 'drive' ? 'no-referrer' : undefined}
          className="h-full w-full object-cover"
        />
      ) : null}
      {asset.kind === 'video' || asset.kind === 'drive' ? (
        <span
          className="absolute bottom-1 right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-dark-950/70 text-secondary-400"
          aria-hidden="true"
        >
          <Play className="h-2.5 w-2.5 translate-x-px" fill="currentColor" />
        </span>
      ) : null}
    </>
  );
}

/** Glass thumbnails of the current project; the row follows the active one. */
export default function ThumbStrip({ project, activeIndex, onSelect }: ThumbStripProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  useCenterActive(rowRef, activeIndex, project.id);

  return (
    <div
      ref={rowRef}
      role="group"
      aria-label={`${project.title} thumbnails`}
      className="kp-row relative py-1.5 [mask-image:linear-gradient(90deg,transparent,#000_16px,#000_calc(100%-16px),transparent)] [&>*:first-child]:ml-auto [&>*:last-child]:mr-auto"
    >
      {project.assets.map((asset, index) => {
        const active = index === activeIndex;
        const label = assetLabel(asset);
        return (
          <button
            key={`${asset.src}-${index}`}
            type="button"
            data-sfx="none"
            data-sfx-hover=""
            aria-current={active ? 'true' : undefined}
            aria-label={`Show ${kindNoun(asset.kind)} ${index + 1} of ${project.assets.length}: ${label}`}
            title={label}
            onClick={() => onSelect(index)}
            className="kp-thumb glass"
          >
            <ThumbFace asset={asset} />
          </button>
        );
      })}
    </div>
  );
}
