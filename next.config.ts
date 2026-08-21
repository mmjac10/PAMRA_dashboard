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
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");
// Deliberately no `upgrade-insecure-requests` here: unlike a response header,
// it rewrites the page's own http:// sub-resource requests (CSS/JS/images)
// to https:// even when the page itself was loaded over plain HTTP — which
// breaks the app outright on any deployment that hasn't put TLS in front of
// it yet. Add it back only once this is actually served over HTTPS.

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Isolates this page's browsing context group so a window it opens (or
  // that opens it) can't reach back in via `window.opener`.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Browsers ignore this over plain HTTP, so it's a no-op in local dev and
  // only takes effect once this is actually deployed behind HTTPS — at
  // which point it forces HTTPS for this host (and subdomains) for two
  // years, including on the very first request via the HSTS preload list.
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  // Stop advertising the framework in responses (`X-Powered-By: Next.js`) —
  // no functional benefit to leaking that for free.
  poweredByHeader: false,
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
