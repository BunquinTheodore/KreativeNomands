/**
 * Absolute origin of the deployed site. Social-preview crawlers need absolute og:image URLs on the host that
 * actually serves them, so prefer an explicit NEXT_PUBLIC_SITE_URL, then Vercel's production domain, and only
 * then the brand domain.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) return `https://${vercelHost}`;
  return 'https://kreativnomads.com.ph';
}

export const SITE_URL = resolveSiteUrl();
