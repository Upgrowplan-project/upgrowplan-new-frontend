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
