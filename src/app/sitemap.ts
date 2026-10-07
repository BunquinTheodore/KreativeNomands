import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const PORTFOLIO_CATEGORIES = ['events', 'fnb', 'health', 'insurance', 'realestate', 'it'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...PORTFOLIO_CATEGORIES.map((category) => ({
      url: `${SITE_URL}/portfolio/${category}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
