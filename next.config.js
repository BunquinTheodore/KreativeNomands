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
    // WebP only: AVIF costs 0.1-0.3 s of CPU per image to encode on a cold cache (the first visit after a
    // deploy), which is exactly when the page is loading; WebP is ~5x cheaper and only a few KB larger.
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [{ source: '/portfolio', destination: '/#portfolio', permanent: false }];
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
