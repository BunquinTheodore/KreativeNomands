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
    formats: ['image/avif', 'image/webp'],
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
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
