import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';
import SplitText from '@/components/fx/SplitText';
import Button from '@/components/ui/Button';
import type { ShowcaseAsset, ShowcaseProject } from './data';
import { BROWSER_SIZES } from './preload';

interface BrowserSlideProps {
  project: ShowcaseProject;
  asset: ShowcaseAsset;
  priority?: boolean;
}

function addressLabel(project: ShowcaseProject): string {
  const source = project.liveUrl ?? project.repoUrl;
  if (!source) return 'kreativnomads.com.ph';
  try {
    const url = new URL(source);
    const path = url.pathname.replace(/\/$/, '');
    return `${url.host}${path}`;
  } catch {
    return source;
  }
}

/** IT projects: the screenshot in a glass browser window with Repository / Live Demo buttons. */
export default function BrowserSlide({ project, asset, priority = false }: BrowserSlideProps) {
  const style = { '--kp-ratio': asset.width / asset.height } as CSSProperties;

  return (
    <>
      <Image
        src={asset.thumb ?? asset.src}
        alt=""
        aria-hidden="true"
        width={asset.width}
        height={asset.height}
        sizes="240px"
        draggable={false}
        className="absolute inset-0 h-full w-full scale-125 object-cover opacity-35 blur-2xl"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 pb-4 pt-14 sm:gap-4 sm:px-8 sm:pb-5 sm:pt-5">
        <div className="kp-browser kp-browser--sized" style={style}>
          <div className="kp-browser__bar">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="kp-dot bg-secondary-500" />
              <span className="kp-dot bg-cream-500/70" />
              <span className="kp-dot bg-primary-300" />
            </span>
            <span className="min-w-0 flex-1 truncate rounded-full bg-dark-950/50 px-3 py-0.5 text-center text-[0.7rem] text-cream-500/70 sm:text-xs">
              {addressLabel(project)}
            </span>
          </div>
          <Image
            src={asset.src}
            alt={`${project.title}: ${asset.title}`}
            width={asset.width}
            height={asset.height}
            sizes={BROWSER_SIZES}
            priority={priority}
            draggable={false}
            className="block h-auto w-full"
          />
        </div>

        <div className="flex w-full max-w-3xl flex-col items-center gap-3 text-center">
          <h2 title={project.title} className="max-w-full truncate font-display text-lg font-semibold text-cream-500 sm:text-2xl">
            <SplitText text={project.title} variant="blur" by="words" stagger={0.07} />
          </h2>
          <p className="measure line-clamp-2 text-sm leading-relaxed text-cream-500/70 text-pretty sm:text-[0.9375rem]">
            {project.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {project.repoUrl ? (
              <Button
                href={project.repoUrl}
                variant="glass"
                className="!px-4 !py-2"
                icon={<Github className="h-4 w-4" aria-hidden="true" />}
                aria-label={`Repository for ${project.title} (opens in a new tab)`}
              >
                Repository
              </Button>
            ) : null}
            {project.liveUrl ? (
              <Button
                href={project.liveUrl}
                variant="primary"
                className="!px-4 !py-2"
                icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
                aria-label={`Live demo of ${project.title} (opens in a new tab)`}
              >
                Live Demo
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
