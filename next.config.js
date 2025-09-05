/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverComponentsExternalPackages: ['canvas'],
    // Reduce memory usage and prevent Jest worker crashes
    workerThreads: false,
    esmExternals: 'loose'
  },
  // Optimize build performance and memory usage
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          maxSize: 200000, // 200KB chunks to reduce memory pressure
        }
      }
    }
    return config
  }
};

module.exports = nextConfig;