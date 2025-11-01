import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/engines"],

  turbopack: {
    // Turbopack config jika diperlukan nanti
  },

  // Webpack hanya untuk production build (jika butuh)
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push("@prisma/client", "@prisma/engines");
      }
    }
    return config;
  },
};

export default nextConfig;
