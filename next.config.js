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
      {
        source: "/solutions/",
        destination: "/solutions",
        permanent: true,
      },
      {
        source: "/ru/solutions/",
        destination: "/ru/solutions",
        permanent: true,
      },
      {
        source: "/solutions/planMaster",
        destination: "/ai-business-plan-generator",
        permanent: true,
      },
      {
        source: "/ru/solutions/planMaster",
        destination: "/ru/ai-business-plan-generator",
        permanent: true,
      },
      {
        source: "/solutions/planMaster/descriptionPage",
        destination: "/ai-business-plan-generator",
        permanent: true,
      },
      {
        source: "/ru/solutions/planMaster/descriptionPage",
        destination: "/ru/ai-business-plan-generator",
        permanent: true,
      },
      {
        source: "/solutions/synthFocusLab/descriptionPage",
        destination: "/solutions/synthetic-customer-research",
        permanent: true,
      },
      {
        source: "/ru/solutions/synthFocusLab/descriptionPage",
        destination: "/ru/solutions/synthetic-customer-research",
        permanent: true,
      },
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
