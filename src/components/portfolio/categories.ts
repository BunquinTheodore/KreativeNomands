import { Clapperboard, Headset, Megaphone, Monitor, type LucideIcon } from 'lucide-react';

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

export const CATEGORY_IDS = ['it', 'photo-video', 'virtual-support', 'brand-marketing'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  /** Longer sentence for SEO metadata. */
  description: string;
  /** Industries served, shown as tags on the portfolio cards. */
  industries: readonly string[];
  icon: LucideIcon;
  accent: CategoryAccent;
}

/** Single source of truth for service category copy, industry tags, icons and accents. */
export const CATEGORIES: readonly CategoryMeta[] = [
  {
    id: 'it',
    label: 'IT & Digital Solutions',
    description:
      'Websites, mobile apps, custom systems and workflow automations built for businesses across food and beverage, finance, fitness, education and more.',
    industries: [
      'F&B',
      'Finance',
      'Fitness & Wellness',
      'Education',
      'Personal Care',
      'Investment',
      'Public Safety',
      'Automation',
    ],
    icon: Monitor,
    accent: AMBER,
  },
  {
    id: 'photo-video',
    label: 'Photo & Video Editing',
    description:
      'Video editing, photo editing and graphic design for food and beverage, wellness, real estate, insurance, wedding and event clients.',
    industries: [
      'Food & Beverage',
      'Health, Wellness & Nutrition',
      'Real Estate',
      'Insurance',
      'Wedding',
      'AI',
      'Events',
    ],
    icon: Clapperboard,
    accent: TEAL,
  },
  {
    id: 'virtual-support',
    label: 'Business & Virtual Support',
    description:
      'Community management, customer support, product quality assurance and editorial operations for food and beverage and AI companies.',
    industries: ['Food & Beverage', 'AI'],
    icon: Headset,
    accent: CREAM,
  },
  {
    id: 'brand-marketing',
    label: 'Brand & Content Marketing',
    description:
      'Brand identities, social content and content strategy for food and beverage businesses and insurance providers.',
    industries: ['Food & Beverage', 'Insurance'],
    icon: Megaphone,
    accent: AMBER,
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
