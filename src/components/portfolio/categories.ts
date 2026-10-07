import { Building2, Calendar, Heart, Monitor, Shield, Utensils, type LucideIcon } from 'lucide-react';

/** Palette-only accents (hex values come from the tailwind brand tokens). */
export interface CategoryAccent {
  /** Gradient start (hairline, icon chip). */
  from: string;
  /** Gradient end. */
  to: string;
}

const AMBER: CategoryAccent = { from: '#f59e0b', to: '#fbbf24' };
const TEAL: CategoryAccent = { from: '#5a8585', to: '#8db1b1' };
const CREAM: CategoryAccent = { from: '#e6d9b8', to: '#f5f0dc' };

export const CATEGORY_IDS = ['events', 'fnb', 'health', 'insurance', 'realestate', 'it'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  /** One-line-friendly blurb (cards, category sub-heading). */
  blurb: string;
  /** Longer sentence for SEO metadata. */
  description: string;
  icon: LucideIcon;
  accent: CategoryAccent;
}

/** Single source of truth for category copy, icons and accents. */
export const CATEGORIES: readonly CategoryMeta[] = [
  {
    id: 'events',
    label: 'Events',
    blurb: 'Corporate events, virtual gatherings, and live experiences',
    description:
      'Corporate events, virtual gatherings, and live experiences that create lasting impressions.',
    icon: Calendar,
    accent: AMBER,
  },
  {
    id: 'fnb',
    label: 'Food & Beverage',
    blurb: 'Restaurant branding and promotional content',
    description:
      'Restaurant branding, menu design, and promotional content for the culinary industry.',
    icon: Utensils,
    accent: TEAL,
  },
  {
    id: 'health',
    label: 'Health & Fitness',
    blurb: 'Wellness brands and fitness campaigns',
    description: 'Wellness brands, fitness campaigns, and health-focused marketing materials.',
    icon: Heart,
    accent: CREAM,
  },
  {
    id: 'insurance',
    label: 'Insurance',
    blurb: 'Financial services branding and educational content',
    description:
      'Financial services branding and educational content for insurance providers.',
    icon: Shield,
    accent: AMBER,
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    blurb: 'Property marketing and virtual tours',
    description: 'Property marketing, virtual tours, and real estate promotional materials.',
    icon: Building2,
    accent: TEAL,
  },
  {
    id: 'it',
    label: 'IT Services',
    blurb: 'Technology solutions and digital marketing',
    description:
      'End-to-end web projects, from SaaS platforms and business tools to portfolios and data systems.',
    icon: Monitor,
    accent: CREAM,
  },
];

const BY_ID: ReadonlyMap<string, CategoryMeta> = new Map(CATEGORIES.map((c) => [c.id, c]));

export function isCategoryId(value: string): value is CategoryId {
  return BY_ID.has(value);
}

export function getCategory(id: string): CategoryMeta | undefined {
  return BY_ID.get(id);
}

/** "1 Project", "6 Projects". */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
