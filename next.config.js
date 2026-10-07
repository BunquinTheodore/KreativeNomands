const path = require('path');

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
  },
  async redirects() {
    return [{ source: '/portfolio', destination: '/#portfolio', permanent: false }];
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
