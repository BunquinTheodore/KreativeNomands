import portfolioData from '@/data/portfolio.json';
import type { AssetType, CaseStudy, PortfolioAsset, PortfolioData, Project } from '@/types';
import type { CategoryId } from './categories';

/** Minimal, serialisable shapes handed to client components. */
export interface ShowcaseAsset {
  /** Local file; the Drive /preview URL for 'drive'; '' for 'case-study'. */
  src: string;
  kind: AssetType;
  /** Caption line 1: the project name. */
  title: string;
  /** Caption line 2: "Service · Type of Material" (when both are known). */
  subtitle?: string;
  poster?: string;
  thumb?: string;
  width: number;
  height: number;
  driveId?: string;
  caseStudy?: CaseStudy;
}

export interface ShowcaseProject {
  id: string;
  /** Tab label: "Industry - Client". */
  title: string;
  industry: string;
  client: string;
  description: string;
  services: string[];
  /** First asset still; '' for text-only tabs. */
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
/** Centered middot between service and material, as in the client's naming convention. */
const SUBTITLE_SEPARATOR = ' · ';

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

function subtitleOf(asset: PortfolioAsset): string | undefined {
  const service = asset.service?.trim();
  const material = asset.material?.trim();
  return service && material ? `${service}${SUBTITLE_SEPARATOR}${material}` : service || material || undefined;
}

function toAsset(asset: PortfolioAsset, project: Project, index: number): ShowcaseAsset {
  const kind = asset.type ?? (VIDEO_EXT.test(asset.src) ? 'video' : 'image');
  return {
    src: asset.src,
    kind,
    title: asset.title?.trim() || `${project.client} ${index + 1}`,
    subtitle: subtitleOf(asset),
    poster: asset.poster,
    thumb: asset.thumb ?? asset.poster,
    width: asset.width && asset.width > 0 ? asset.width : FALLBACK_WIDTH,
    height: asset.height && asset.height > 0 ? asset.height : FALLBACK_HEIGHT,
    driveId: kind === 'drive' ? asset.driveId : undefined,
    caseStudy: kind === 'case-study' ? asset.caseStudy : undefined,
  };
}

function toProject(project: Project): ShowcaseProject {
  return {
    id: project.id,
    title: project.title,
    industry: project.industry,
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
 * A still for the card strip: the thumb / poster, never a video or a case study. Local files only:
 * the card has no error fallback, and this keeps the home page off Drive's servers (as heroData does).
 */
function stripThumb(asset: PortfolioAsset | undefined): string | undefined {
  if (!asset || asset.type === 'case-study') return undefined;
  const still = asset.thumb ?? asset.poster ?? (asset.type === 'image' ? asset.src : undefined);
  return still?.startsWith('/') ? still : undefined;
}

/**
 * Up to `limit` distinct thumbnail URLs, taking one asset per project per round
 * so the strip shows variety instead of a single project's whole set.
 * Text-only categories yield an empty list.
 */
export function getStripThumbs(categoryId: CategoryId, limit: number): string[] {
  const projects = inCategory(categoryId);
  const seen = new Set<string>();
  const picked: string[] = [];
  const rounds = projects.reduce((max, project) => Math.max(max, project.assets.length), 0);

  for (let round = 0; round < rounds && picked.length < limit; round += 1) {
    for (const project of projects) {
      const src = stripThumb(project.assets[round]);
      if (!src || seen.has(src) || picked.length >= limit) continue;
      seen.add(src);
      picked.push(src);
    }
  }
  return picked;
}
