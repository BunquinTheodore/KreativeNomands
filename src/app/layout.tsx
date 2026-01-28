import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';

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

// Metadata configuration
export const metadata: Metadata = {
  title: {
    default: 'Kreativ Nomads | Creative Agency Philippines',
    template: '%s | Kreativ Nomads',
  },
  description:
    'Kreativ Nomads is a creative agency of experienced freelancers providing content strategy, graphic design, and photo/video post-production services.',
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
    ],
    apple: [{ url: '/favicon.svg' }],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
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
      <body className="min-h-screen font-sans antialiased bg-dark-950 dark:bg-dark-950 light:bg-gray-50 transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
