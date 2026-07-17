import type { NextConfig } from "next";

/**
 * Security headers that are the same on every request, so they belong here
 * rather than in the proxy — this way they also cover static assets and
 * /uploads, which the proxy deliberately skips.
 *
 * The Content-Security-Policy is NOT here: it carries a per-request nonce and
 * so has to be built in src/proxy.ts.
 */
const SECURITY_HEADERS = [
  // Two years, subdomains included, and preload-eligible. Ignored by browsers
  // over plain HTTP, so it is inert in local dev and arms itself in production.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Stops the browser second-guessing a Content-Type. Load-bearing here: review
  // videos are the one upload we do not re-encode, so a file that lies about
  // being a video must never be sniffed into being executed as something else.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the full URL to ourselves, only the origin cross-site, nothing over
  // plain HTTP. Keeps order numbers and account paths out of third-party logs.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // We ask for none of these. An injected script cannot turn on the camera.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()",
  },
  // Severs window.opener between us and anything we open, and vice versa.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // frame-ancestors 'none' in the CSP already says this; X-Frame-Options is the
  // fallback for anything that does not implement CSP level 2.
  { key: "X-Frame-Options", value: "DENY" },
  // Do not advertise the framework and its version to a scanner.
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  // Suppress `X-Powered-By: Next.js` — free reconnaissance for an attacker.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },

  turbopack: {
    root: __dirname,
  },
  images: {
    // Uploads are served from Vercel Blob, and the optimizer refuses any remote
    // host that is not listed here — a missing entry is a 400 and a broken
    // image, not a fallback. The pathname is left open because every upload area
    // (products/, home/, categories/, journal/, avatars/, reviews/) lives under
    // the same store.
    //
    // Keep in step with the BLOB_URL pattern in src/features/shared/optimized.ts:
    // that decides what to SEND here, this decides what is accepted. If the two
    // disagree the images break, so they are wrong together or right together.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
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
