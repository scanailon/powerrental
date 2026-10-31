import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build autocontenido para cPanel (Node.js App): `.next/standalone` + server.js
  output: "standalone",
  images: {
    unoptimized: true,
    qualities: [75, 85],
  },
  experimental: {
    serverActions: {
      // Subida de imágenes desde el panel admin (máx. 10 MB por imagen)
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
