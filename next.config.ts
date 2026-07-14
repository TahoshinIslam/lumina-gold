import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // The photographs ARE the page: 3.9 MB of JPEG was most of the home page's
    // transfer, and over a slow connection that is the Largest Contentful Paint
    // — the pixels simply have not arrived yet. AVIF first, WebP for anything
    // that cannot take it; Next negotiates on the Accept header and falls back
    // to the original for a browser that wants neither.
    formats: ["image/avif", "image/webp"],
    // Uploads are big originals (a 2560px backdrop) shown at a fraction of that.
    // These are the widths the optimizer may hand back, so a phone is never sent
    // a desktop backdrop.
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
