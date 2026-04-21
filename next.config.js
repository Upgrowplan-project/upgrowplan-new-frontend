/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

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
        source: '/:path*',
        has: [{ type: 'host', value: 'www.upgrowplan.com' }],
        destination: 'https://upgrowplan.com/:path*',
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
