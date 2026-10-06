import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import '@/components/fx/fx.css';
import Splash from '@/components/fx/Splash';
import ThreeBackground from '@/components/three/ThreeBackground';
import Cursor from '@/components/fx/Cursor';
import SfxProvider from '@/components/fx/SfxProvider';
import ScrollProgressLine from '@/components/fx/ScrollProgressLine';
import ShineGate from '@/components/fx/ShineGate';

// Font configuration
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

const SITE_URL = 'https://kreativnomads.com.ph';

// Organization structured data (JSON-LD).
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kreativ Nomads',
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  email: 'contact@kreativnomads.com.ph',
  telephone: '+63 917 312 5071',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2404 Discovery Suites, ADB Avenue, Ortigas Center',
    addressLocality: 'Pasig City',
    addressCountry: 'PH',
  },
  sameAs: [
    'https://facebook.com/kreativnomads',
    'https://instagram.com/kreativnomads',
    'https://linkedin.com/company/kreativnomads',
  ],
};
// "<" is escaped so the payload can never close the script tag.
const organizationJsonLdString = JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c');

// Metadata configuration
export const metadata: Metadata = {
  title: {
    default: 'Kreativ Nomads | Creative Agency Philippines',
    template: '%s | Kreativ Nomads',
  },
  description:
    'Philippines creative agency of experienced freelancers: content strategy, graphic design, and photo and video post-production.',
  applicationName: 'Kreativ Nomads',
  category: 'business',
  keywords: [
    'creative agency',
    'Philippines',
    'graphic design',
    'video editing',
    'content strategy',
    'branding',
    'marketing',
    'freelance',
    'digital marketing',
    'social media',
    'photo post-production',
    'video post-production',
    'IT services',
    'Pasig',
    'Ortigas',
  ],
  authors: [{ name: 'Kreativ Nomads' }],
  creator: 'Kreativ Nomads',
  publisher: 'Kreativ Nomads',
  metadataBase: new URL('https://kreativnomads.com.ph'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://kreativnomads.com.ph',
    siteName: 'Kreativ Nomads',
    title: 'Kreativ Nomads | Creative Agency Philippines',
    description:
      'Your creative virtual assistant. We provide fresh and compelling creative solutions for your marketing and communication challenges.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kreativ Nomads - Creative Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kreativ Nomads | Creative Agency Philippines',
    description:
      'Your creative virtual assistant. Fresh and compelling creative solutions for your marketing challenges.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0a1111',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        {/* Experience layer: all render in the server HTML (Splash) or attach after idle. */}
        <Splash />
        <Cursor />
        <SfxProvider />
        <ScrollProgressLine />
        <ShineGate />
        <ThreeBackground />

        {/* Content sits above the (future) canvas at z-0. */}
        <div className="relative z-10">{children}</div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLdString }}
        />
      </body>
    </html>
  );
}
