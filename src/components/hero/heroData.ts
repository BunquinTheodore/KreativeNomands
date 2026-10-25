import portfolio from '@/data/portfolio.json';
import type { PortfolioAsset, PortfolioData, Project } from '@/types';

export interface ReelItem {
  id: string;
  title: string;
  categoryId: string;
  categoryLabel: string;
  src: string;
  /** Width / height of the thumbnail. */
  ratio: number;
}

export interface Industry {
  id: string;
  label: string;
  /** Deep link into the service page + client tab that best shows this industry. */
  href: string;
}

/** "Trusted by brands across industries" chips, in the client's order. */
export const INDUSTRIES: readonly Industry[] = [
  { id: 'realestate', label: 'Real Estate', href: '/portfolio/photo-video?p=pv-twin-oaks' },
  { id: 'fnb', label: 'F&B', href: '/portfolio/photo-video?p=pv-monza' },
  { id: 'insurance', label: 'Insurance', href: '/portfolio/photo-video?p=pv-sunlife' },
  { id: 'health', label: 'Health, Wellness & Nutrition', href: '/portfolio/photo-video?p=pv-xendurance' },
  { id: 'events', label: 'Events', href: '/portfolio/photo-video?p=pv-baker-mckenzie' },
  { id: 'it', label: 'IT', href: '/portfolio/it' },
  { id: 'ai', label: 'AI', href: '/portfolio/virtual-support?p=vs-ponder' },
  { id: 'wedding', label: 'Wedding', href: '/portfolio/photo-video?p=pv-tone-media' },
];

/** The four services (components/services/data.ts), typed after "Nomads for". */
export const SERVICE_PHRASES: readonly string[] = [
  'IT & Digital Solutions',
  'Creative & Digital Content',
  'Business & Virtual Support',
  'Branding & Marketing',
];

/** Frames shown per category so the rail is varied rather than one client's near-identical pages. */
const PER_CATEGORY = 6;
const FALLBACK_RATIO = 1;

const data = portfolio as unknown as PortfolioData;

/** Local (same-origin) file: keeps the reel off Drive's servers and the LCP path free of third parties. */
const isLocal = (src: string | undefined): src is string => typeof src === 'string' && src.startsWith('/');

function assetRatio(asset: PortfolioAsset | undefined): number {
  const width = asset?.width ?? 0;
  const height = asset?.height ?? 0;
  return width > 0 && height > 0 ? width / height : FALLBACK_RATIO;
}

/** Still frame of an asset when it has a local one (thumb, then poster, then the image itself). */
function localStill(asset: PortfolioAsset): string | null {
  if (isLocal(asset.thumb)) return asset.thumb;
  if (isLocal(asset.poster)) return asset.poster;
  return (asset.type ?? 'image') === 'image' && isLocal(asset.src) ? asset.src : null;
}

/**
 * The project's cover when it is a local file, otherwise its first asset with a local still.
 * Text-only case studies and Drive-only tabs have none and are left out of the reel.
 */
function reelThumb(project: Project): { src: string; ratio: number } | null {
  if (isLocal(project.thumbnail)) {
    const asset = project.assets.find(
      (a) => a.thumb === project.thumbnail || a.poster === project.thumbnail || a.src === project.thumbnail,
    );
    return { src: project.thumbnail, ratio: assetRatio(asset) };
  }
  for (const asset of project.assets) {
    const src = localStill(asset);
    if (src) return { src, ratio: assetRatio(asset) };
  }
  return null;
}

/** Round-robin across categories so neighbouring frames differ. */
function interleave(groups: readonly (readonly ReelItem[])[]): ReelItem[] {
  const longest = groups.reduce((max, g) => Math.max(max, g.length), 0);
  const out: ReelItem[] = [];
  for (let i = 0; i < longest; i += 1) {
    for (const group of groups) {
      const item = group[i];
      if (item) out.push(item);
    }
  }
  return out;
}

/** Two rails of project thumbnails (even / odd positions of the interleaved list). */
export function getReelRows(): { top: readonly ReelItem[]; bottom: readonly ReelItem[] } {
  const groups = data.categories.map((category) =>
    data.projects
      .filter((p) => p.category === category.id)
      .flatMap<ReelItem>((p) => {
        const thumb = reelThumb(p);
        return thumb
          ? [{ id: p.id, title: p.title, categoryId: p.category, categoryLabel: category.label, ...thumb }]
          : [];
      })
      .slice(0, PER_CATEGORY),
  );
  const all = interleave(groups);
  return {
    top: all.filter((_, i) => i % 2 === 0),
    bottom: all.filter((_, i) => i % 2 === 1),
  };
}
