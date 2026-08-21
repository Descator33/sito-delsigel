import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // il display retina largo richiede varianti oltre il default di 3840px
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 4672],
    qualities: [75, 90],
  },
  async headers() {
    return [
      {
        /* La directory è versionata: i frame possono restare nella cache
           senza revalidare a ogni scroll o visita successiva. */
        source: "/hero/sequence/intriko-v1/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
