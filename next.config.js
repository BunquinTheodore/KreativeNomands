const path = require('path');

// The portfolio moved from industry pages to service pages (Oct 2026); old industry URLs land on the
// matching client tab of the new structure (?p=<tab id>) instead of 404ing.
const LEGACY_PORTFOLIO = {
  events: '/portfolio/photo-video?p=pv-baker-mckenzie',
  fnb: '/portfolio/photo-video?p=pv-monza',
  health: '/portfolio/photo-video?p=pv-xendurance',
  insurance: '/portfolio/photo-video?p=pv-sunlife',
  realestate: '/portfolio/photo-video?p=pv-twin-oaks',
};
// Next keeps the request query on a redirect (destination keys win), so an old shared ?a=<index> would
// open an unrelated piece of the merged tab: pin every legacy link to the start of its tab.
const LEGACY_ASSET_RESET = '&a=0';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 14 always bundles polyfill-module (Array.at/flat/flatMap, Object.fromEntries/hasOwn,
  // String.trimStart/trimEnd) for Chrome 64-era browsers: ~11 KiB of legacy JS in a shared chunk.
  webpack(config, { webpack, isServer }) {
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /polyfills[\/]polyfill-module$/,
          path.resolve(__dirname, 'src/lib/empty-polyfill.js'),
        ),
      );
    }
    return config;
  },
  images: {
    // Every image is pre-optimised at build time by scripts/optimize-media.mjs (WebP, <=1600px, plus 640px
    // thumbs), so Vercel's image optimizer adds nothing. Skipping it serves the files straight from the CDN and
    // avoids the free-tier optimization quota (over quota, /_next/image answers 402 and every image breaks).
    unoptimized: true,
    // Inert while `unoptimized` is on: next/image then emits the raw src and never checks remotePatterns, so
    // this restricts nothing (remote hosts are bounded by the portfolio data, not here). It is kept so that
    // turning optimisation back on still allows the Drive thumbnail endpoint (the browser follows its
    // redirect to googleusercontent itself).
    remotePatterns: [{ protocol: 'https', hostname: 'drive.google.com', pathname: '/thumbnail' }],
  },
  async redirects() {
    return [
      { source: '/portfolio', destination: '/#portfolio', permanent: false },
      ...Object.entries(LEGACY_PORTFOLIO).map(([id, destination]) => ({
        source: `/portfolio/${id}`,
        destination: `${destination}${LEGACY_ASSET_RESET}`,
        permanent: true,
      })),
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
