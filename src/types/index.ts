// Portfolio data types matching the JSON schema
/** 'drive' = video hosted on Google Drive (click-to-load iframe); 'case-study' = text-only write-up. */
export type AssetType = 'video' | 'image' | 'drive' | 'case-study';

/** One labelled meta row of a case study, e.g. { label: 'Client', value: 'Monza Barcade' }. */
export interface CaseStudyMeta {
  label: string;
  value: string;
}

/** A numbered "Key Contributions" entry. */
export interface CaseStudyItem {
  title: string;
  body: string;
}

/** Text-only case study for work that cannot be shown (client's exact wording). */
export interface CaseStudy {
  title: string;
  meta: CaseStudyMeta[];
  overview: string;
  contributions: CaseStudyItem[];
  expertise: string[];
  /** Confidentiality footnote. */
  note: string;
}

export interface PortfolioAsset {
  /** Local /media path; the Drive /preview URL for 'drive'; '' for 'case-study'. */
  src: string;
  type?: AssetType;
  /** Naming convention line 1: the project name. */
  title?: string;
  /** Naming convention line 2, left of the dot (e.g. 'Video Editing'). */
  service?: string;
  /** Naming convention line 2, right of the dot (e.g. 'Content'). */
  material?: string;
  poster?: string; // Optional poster image for video assets
  thumb?: string; // 640px WebP thumbnail (images) or the poster (videos, remote for Drive)
  width?: number; // Intrinsic pixel width of `src`
  height?: number; // Intrinsic pixel height of `src`
  driveId?: string; // Google Drive file id ('drive' only)
  caseStudy?: CaseStudy; // 'case-study' only
}

/** One portfolio tab: a single "Industry - Client" within a service category. */
export interface Project {
  id: string;
  /** '<Industry> - <Client>', e.g. 'F&B - Monza Barcade'. */
  title: string;
  industry: string;
  client: string;
  /** Service category id (see components/portfolio/categories.ts). */
  category: string;
  description: string;
  /** First asset still; '' for text-only tabs. */
  thumbnail: string;
  assets: PortfolioAsset[];
  services: string[];
  featured: boolean;
  repoUrl?: string;
  liveUrl?: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface PortfolioData {
  projects: Project[];
  categories: Category[];
  services: string[];
}

// Navigation types
export interface NavLink {
  label: string;
  href: string;
}

// Service card types for the services section
export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

// Animation variants for Framer Motion
export interface AnimationVariants {
  hidden: object;
  visible: object;
}
