import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js always injects an inline <script> to hydrate the page with
  // server-rendered data, in dev and production alike, so 'unsafe-inline'
  // is required regardless of env — a per-request nonce would avoid this,
  // but that forces every page (including static ones) into dynamic
  // rendering, which isn't worth it here. 'unsafe-eval' is dev-only (React
  // uses eval for dev-mode error reconstruction; neither React nor Next use
  // it in production).
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Leaflet positions markers/panes via inline `style` attributes, so
  // style-src needs 'unsafe-inline'. This does not permit script execution.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.tile.openstreetmap.org",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Produces a self-contained .next/standalone build (traced deps only,
  // no full node_modules) — what the Docker runtime image copies in.
  output: "standalone",
  // The Prisma query engine binary is loaded dynamically at runtime rather
  // than via a static import, so Next's file tracer can miss it. Force it
  // to be included so the standalone build works inside the container.
  outputFileTracingIncludes: {
    "/*": ["./src/generated/prisma/**/*"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
