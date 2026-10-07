import type { Metadata } from 'next';

const SITE_NAME = 'Kreativ Nomads';
const OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Kreativ Nomads - Creative Agency',
} as const;

/** Next replaces (not merges) the parent openGraph/twitter, so pages that set their own must repeat the shared fields. */
export function buildSocialMetadata(
  title: string,
  description: string,
  path: string,
): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      type: 'website',
      locale: 'en_PH',
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
