import portfolioData from '@/data/portfolio.json';
import type { PortfolioAsset, PortfolioData, Project } from '@/types';
import type { CategoryId } from './categories';

/** Minimal, serialisable shapes handed to client components. */
export interface ShowcaseAsset {
  src: string;
  kind: 'image' | 'video';
  title: string;
  poster?: string;
  thumb?: string;
  width: number;
  height: number;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  client: string;
  description: string;
  services: string[];
  thumbnail: string;
  repoUrl?: string;
  liveUrl?: string;
  assets: ShowcaseAsset[];
}

export interface CategoryStats {
  projects: number;
  assets: number;
}

const FALLBACK_WIDTH = 1600;
const FALLBACK_HEIGHT = 900;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

const data = portfolioData as unknown as PortfolioData;

function inCategory(categoryId: CategoryId): Project[] {
  return data.projects.filter((project) => project.category === categoryId);
}

/** Only plain http(s) links are ever rendered as external anchors. */
function safeUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function toAsset(asset: PortfolioAsset, project: Project, index: number): ShowcaseAsset {
  const kind = asset.type ?? (VIDEO_EXT.test(asset.src) ? 'video' : 'image');
  return {
    src: asset.src,
    kind,
    title: asset.title?.trim() || `${project.title} ${index + 1}`,
    poster: asset.poster,
    thumb: asset.thumb ?? asset.poster,
    width: asset.width && asset.width > 0 ? asset.width : FALLBACK_WIDTH,
    height: asset.height && asset.height > 0 ? asset.height : FALLBACK_HEIGHT,
  };
}

function toProject(project: Project): ShowcaseProject {
  return {
    id: project.id,
    title: project.title,
    client: project.client,
    description: project.description,
    services: [...project.services],
    thumbnail: project.thumbnail,
    repoUrl: safeUrl(project.repoUrl),
    liveUrl: safeUrl(project.liveUrl),
    assets: project.assets.map((asset, index) => toAsset(asset, project, index)),
  };
}

/** Only this category's data crosses the server/client boundary. */
export function getShowcaseProjects(categoryId: CategoryId): ShowcaseProject[] {
  return inCategory(categoryId).map(toProject);
}

export function getCategoryStats(categoryId: CategoryId): CategoryStats {
  const projects = inCategory(categoryId);
  return {
    projects: projects.length,
    assets: projects.reduce((total, project) => total + project.assets.length, 0),
  };
}

/**
 * Up to `limit` distinct thumbnail URLs, taking one asset per project per round
 * so the strip shows variety instead of a single project's whole set.
 */
export function getStripThumbs(categoryId: CategoryId, limit: number): string[] {
  const projects = inCategory(categoryId);
  const seen = new Set<string>();
  const picked: string[] = [];
  const rounds = projects.reduce((max, project) => Math.max(max, project.assets.length), 0);

  for (let round = 0; round < rounds && picked.length < limit; round += 1) {
    for (const project of projects) {
      const asset = project.assets[round];
      const src = asset
        ? (asset.thumb ?? asset.poster ?? (asset.type === 'video' ? undefined : asset.src))
        : undefined;
      if (!src || seen.has(src) || picked.length >= limit) continue;
      seen.add(src);
      picked.push(src);
    }
  }
  return picked;
}
