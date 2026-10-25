import type { ShowcaseAsset } from './data';

/** Noun used in thumb / slide labels ("Show video 2 of 9: …"). Drive assets are videos too. */
export function kindNoun(kind: ShowcaseAsset['kind']): string {
  switch (kind) {
    case 'image':
      return 'image';
    case 'video':
    case 'drive':
      return 'video';
    case 'case-study':
      return 'case study';
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

/** Both caption lines in one string: "British GP Highlights (Video Editing · Content)". */
export function assetLabel(asset: ShowcaseAsset): string {
  return asset.subtitle ? `${asset.title} (${asset.subtitle})` : asset.title;
}
