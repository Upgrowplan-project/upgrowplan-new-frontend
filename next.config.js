/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  skipTrailingSlashRedirect: true,
  experimental: {
    serverComponentsExternalPackages: ["@vercel/blob"],
  },

  env: {
    // Теперь мы говорим: возьми переменную из системы,
    // а если её там НЕТ (например, локально), тогда используй localhost
    NEXT_PUBLIC_API_USER_URL:
      process.env.NEXT_PUBLIC_API_USER_URL || "http://localhost:8080",
    NEXT_PUBLIC_API_BLOG_URL:
      process.env.NEXT_PUBLIC_API_BLOG_URL || "http://localhost:8082",
    NEXT_PUBLIC_WS_BLOG_URL:
      process.env.NEXT_PUBLIC_WS_BLOG_URL || "http://localhost:8082/ws",
    NEXT_PUBLIC_OPEN_ABROAD_API_URL:
      process.env.NEXT_PUBLIC_OPEN_ABROAD_API_URL || "http://localhost:8001",
    NEXT_PUBLIC_CLICK_ANALYTICS_API_URL:
      process.env.NEXT_PUBLIC_CLICK_ANALYTICS_API_URL ||
      "http://localhost:8002",
    NEXT_PUBLIC_BACKEND_PLANMASTER_URL:
      process.env.NEXT_PUBLIC_BACKEND_PLANMASTER_URL || "http://localhost:8004",
  },

  webpack: (config, { isServer }) => {
    // Обработка mapbox-gl для избежания ошибок при сборке
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // ── Security headers (external audit 2026-09-12; tightened 2026-09-23) ──
  // Two policies are sent at once:
  //   1) Content-Security-Policy (ENFORCED) — the exact policy that was in
  //      Report-Only for 10 days and produced ZERO violations on /ru, /,
  //      /blog, /auth, openAbroad, marketResearch, businessPulse, synthFocusLab
  //      (headless check with cookie consent accepted; a control test with a
  //      deliberately foreign script/frame/object proved the detector works).
  //   2) Content-Security-Policy-Report-Only — a STRICTER draft (narrow
  //      connect-src/img-src) whose violations are reported to /api/csp-report
  //      so it can be promoted to enforced once it proves clean.
  // Deliberately NOT set: HSTS includeSubDomains/preload (irreversible).
  async headers() {
    // Hosts actually contacted by the site, measured with a headless browser:
    //   script  : self, cdn.jsdelivr.net (bootstrap), accounts.google.com (GSI)
    //   fetch   : self, api.mapbox.com, events.mapbox.com, *.herokuapp.com backends
    //   beacon  : monitoring-service (pageview)
    //   img/font/css: self only (next/font is self-hosted)
    // Analytics hosts stay allow-listed: they load only after cookie consent and
    // only when their IDs are configured, and must not break when they are.
    const SCRIPT_HOSTS = [
      "https://cdn.jsdelivr.net",
      "https://accounts.google.com",
      "https://apis.google.com",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://mc.yandex.ru",
      "https://connect.facebook.net",
      "https://static.hotjar.com",
      "https://script.hotjar.com",
    ].join(" ");

    // В разработке фронт ходит к локальным бэкендам по http://localhost:PORT — это не
    // 'self' (другой порт) и не https:, поэтому боевая политика их блокировала бы.
    // На Vercel/при сборке NODE_ENV=production, и локальные адреса не попадают в политику.
    const DEV_LOCAL = process.env.NODE_ENV === "production"
      ? ""
      : " http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*";

    const enforced = [
      "default-src 'self'",
      // 'unsafe-inline'/'unsafe-eval': Next.js 13 hydration + mapbox-gl.
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${SCRIPT_HOSTS}`,
      "style-src 'self' 'unsafe-inline' https://accounts.google.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      // Wide on purpose in the enforced policy; the draft below narrows it.
      `connect-src 'self' https: wss:${DEV_LOCAL}`,
      "frame-src 'self' https://accounts.google.com https://www.googletagmanager.com https://vars.hotjar.com",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "media-src 'self' data: blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com",
      "frame-ancestors 'self'",
      "report-uri /api/csp-report",
    ].join("; ");

    // Draft: same as enforced, but connect-src/img-src limited to observed hosts.
    const CONNECT_HOSTS = [
      "https://*.herokuapp.com",
      "wss://*.herokuapp.com",
      "https://api.mapbox.com",
      "https://events.mapbox.com",
      "https://*.vercel.app",
      "https://www.google-analytics.com",
      "https://mc.yandex.ru",
      "https://connect.facebook.net",
      "https://*.hotjar.com",
      "wss://*.hotjar.com",
      "https://www.googleapis.com",
      "https://accounts.google.com",
    ].join(" ");
    const IMG_HOSTS = [
      "https://*.mapbox.com",
      "https://images.unsplash.com",
      "https://api.qrserver.com",
      "https://*.googleusercontent.com",
      "https://www.google-analytics.com",
      "https://mc.yandex.ru",
    ].join(" ");

    const draft = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${SCRIPT_HOSTS}`,
      "style-src 'self' 'unsafe-inline' https://accounts.google.com",
      `img-src 'self' data: blob: ${IMG_HOSTS}`,
      "font-src 'self' data:",
      `connect-src 'self' ${CONNECT_HOSTS}${DEV_LOCAL}`,
      "frame-src 'self' https://accounts.google.com https://www.googletagmanager.com https://vars.hotjar.com",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "media-src 'self' data: blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com",
      "frame-ancestors 'self'",
      "report-uri /api/csp-report",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // geolocation=(self): homepage + Business Pulse use navigator.geolocation
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=()" },
          { key: "Content-Security-Policy", value: enforced },
          { key: "Content-Security-Policy-Report-Only", value: draft },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // ── locale ──────────────────────────────────────────────────────────
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      { source: "/ru/monitoring", destination: "/monitoring", permanent: false },
      { source: "/ru/monitoring/:path*", destination: "/monitoring/:path*", permanent: false },

      // ── solution renames ─────────────────────────────────────────────────
      { source: "/solutions/plan", destination: "/ai-business-plan-generator", permanent: true },
      { source: "/ru/solutions/plan", destination: "/ru/ai-business-plan-generator", permanent: true },
      { source: "/solutions/planMaster", destination: "/ai-business-plan-generator", permanent: true },
      { source: "/ru/solutions/planMaster", destination: "/ru/ai-business-plan-generator", permanent: true },
      { source: "/solutions/planMaster/descriptionPage", destination: "/ai-business-plan-generator", permanent: true },
      { source: "/ru/solutions/planMaster/descriptionPage", destination: "/ru/ai-business-plan-generator", permanent: true },
      { source: "/solutions/synthFocusLab/descriptionPage", destination: "/solutions/synthetic-customer-research", permanent: true },
      { source: "/ru/solutions/synthFocusLab/descriptionPage", destination: "/ru/solutions/synthetic-customer-research", permanent: true },

      // ── doubled paths — GSC 404 cleanup (Navigation bug, June-July 2026) ─
      // Pattern /X/X → /X
      { source: "/blog/blog", destination: "/blog", permanent: true },
      { source: "/about/about", destination: "/about", permanent: true },
      { source: "/products/products", destination: "/products", permanent: true },
      { source: "/privacy/privacy", destination: "/privacy", permanent: true },
      { source: "/contacts/contacts", destination: "/contacts", permanent: true },
      { source: "/solutions/solutions", destination: "/solutions", permanent: true },

      // Pattern /ru/X/ru/X → /ru/X
      { source: "/ru/ru", destination: "/ru", permanent: true },
      { source: "/ru/blog/ru/blog", destination: "/ru/blog", permanent: true },
      { source: "/ru/about/ru/about", destination: "/ru/about", permanent: true },
      { source: "/ru/products/ru/products", destination: "/ru/products", permanent: true },
      { source: "/ru/privacy/ru/privacy", destination: "/ru/privacy", permanent: true },
      { source: "/ru/contacts/ru/contacts", destination: "/ru/contacts", permanent: true },
      { source: "/ru/solutions/ru/solutions", destination: "/ru/solutions", permanent: true },
      { source: "/ru/why-upgrowplan/ru/why-upgrowplan", destination: "/ru/why-upgrowplan", permanent: true },
      { source: "/ru/ai-business-plan-generator/ru/ai-business-plan-generator", destination: "/ru/ai-business-plan-generator", permanent: true },

      // Pattern /X/ru/X → /ru/X
      { source: "/blog/ru/blog", destination: "/ru/blog", permanent: true },
      { source: "/about/ru/about", destination: "/ru/about", permanent: true },
      { source: "/products/ru/products", destination: "/ru/products", permanent: true },
      { source: "/privacy/ru/privacy", destination: "/ru/privacy", permanent: true },
      { source: "/contacts/ru/contacts", destination: "/ru/contacts", permanent: true },
      { source: "/solutions/ru/solutions", destination: "/ru/solutions", permanent: true },
      { source: "/why-upgrowplan/ru/why-upgrowplan", destination: "/ru/why-upgrowplan", permanent: true },
      { source: "/ai-business-plan-generator/ru/ai-business-plan-generator", destination: "/ru/ai-business-plan-generator", permanent: true },

      // Pattern /ru/X/X → /ru/X
      { source: "/ru/blog/blog", destination: "/ru/blog", permanent: true },
      { source: "/ru/about/about", destination: "/ru/about", permanent: true },
      { source: "/ru/products/products", destination: "/ru/products", permanent: true },
      { source: "/ru/privacy/privacy", destination: "/ru/privacy", permanent: true },
      { source: "/ru/contacts/contacts", destination: "/ru/contacts", permanent: true },
      { source: "/ru/solutions/solutions", destination: "/ru/solutions", permanent: true },

      // Pattern /solutions/X/solutions/X → correct destination
      { source: "/solutions/plan/solutions/plan", destination: "/ai-business-plan-generator", permanent: true },
      { source: "/solutions/businessPulse/solutions/businessPulse", destination: "/solutions", permanent: true },
      { source: "/solutions/socialPlanMaster/solutions/socialPlanMaster", destination: "/solutions", permanent: true },
      { source: "/solutions/openAbroad/solutions/openAbroad", destination: "/solutions", permanent: true },
      { source: "/solutions/marketResearch/solutions/marketResearch", destination: "/solutions/marketResearch/descriptionPage", permanent: true },
    ];
  },

  async rewrites() {
    // Для реврайтов тоже используем переменные, которые уже точно определены выше
    return [
      {
        source: "/api/blog/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BLOG_URL || "http://localhost:8082"}/api/:path*`,
      },
      {
        source: "/api/user/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_USER_URL || "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
};

const withNextIntl = require("next-intl/plugin")("./i18n/request.ts");
module.exports = withNextIntl(nextConfig);
