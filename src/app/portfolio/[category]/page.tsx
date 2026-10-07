import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryShowcase from '@/components/portfolio/CategoryShowcase';
import { CATEGORY_IDS, getCategory, isCategoryId } from '@/components/portfolio/categories';
import { getShowcaseProjects } from '@/components/portfolio/data';
import { buildSocialMetadata } from '@/lib/seo';

interface CategoryPageProps {
  params: { category: string };
}

export const dynamicParams = false;

export function generateStaticParams(): { category: string }[] {
  return CATEGORY_IDS.map((category) => ({ category }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategory(params.category);
  if (!category) return { title: 'Portfolio' };
  return {
    title: `${category.label} Portfolio`,
    description: category.description,
    alternates: { canonical: `/portfolio/${category.id}` },
    ...buildSocialMetadata(
      `${category.label} Portfolio | Kreativ Nomads`,
      category.description,
      `/portfolio/${category.id}`,
    ),
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  if (!isCategoryId(params.category)) notFound();
  return (
    <CategoryShowcase
      categoryId={params.category}
      projects={getShowcaseProjects(params.category)}
    />
  );
}
