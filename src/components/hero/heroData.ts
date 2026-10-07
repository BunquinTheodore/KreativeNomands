import portfolio from '@/data/portfolio.json';
import type { PortfolioData, Project } from '@/types';

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
}

/** Real copy from the previous design. Ids map to /portfolio/<id> routes. */
export const INDUSTRIES: readonly Industry[] = [
  { id: 'realestate', label: 'Real Estate' },
  { id: 'fnb', label: 'F&B' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'health', label: 'Health & Fitness' },
  { id: 'events', label: 'Events' },
  { id: 'it', label: 'IT Services' },
];

export const SERVICE_PHRASES: readonly string[] = [
  'Content Strategy',
  'Graphic Design',
  'Photo & Video Post-Production',
  'IT Services',
];

/** Frames shown per category so the rail is varied rather than 10 near-identical carousels. */
const PER_CATEGORY = 4;
const FALLBACK_RATIO = 1;

const data = portfolio as unknown as PortfolioData;

function thumbRatio(project: Project): number {
  const asset = project.assets.find(
    (a) => a.thumb === project.thumbnail || a.poster === project.thumbnail || a.src === project.thumbnail,
  );
  const width = asset?.width ?? 0;
  const height = asset?.height ?? 0;
  return width > 0 && height > 0 ? width / height : FALLBACK_RATIO;
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
  const labels = new Map(data.categories.map((c) => [c.id, c.label]));
  const groups = data.categories
    .filter((c) => c.id !== 'all')
    .map((category) =>
      data.projects
        .filter((p) => p.category === category.id)
        .slice(0, PER_CATEGORY)
        .map<ReelItem>((p) => ({
          id: p.id,
          title: p.title,
          categoryId: p.category,
          categoryLabel: labels.get(p.category) ?? p.category,
          src: p.thumbnail,
          ratio: thumbRatio(p),
        })),
    );
  const all = interleave(groups);
  return {
    top: all.filter((_, i) => i % 2 === 0),
    bottom: all.filter((_, i) => i % 2 === 1),
  };
}
