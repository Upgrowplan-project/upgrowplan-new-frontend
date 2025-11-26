/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

// адреса сервисов
const USER_API_BASE_URL = isDev
  ? "http://localhost:8080" // твой локальный порт user-service
  : "https://upgrowplan-user-service-3b483837144a.herokuapp.com";

const BLOG_API_BASE_URL = isDev
  ? "http://localhost:8082"
  : "https://blog-service-14ba37a6adc0.herokuapp.com";

// WebSocket (если нужно)
const WS_BLOG_URL = isDev
  ? "http://localhost:8082/ws"
  : "https://blog-service-14ba37a6adc0.herokuapp.com/ws";

// Solutions Backend Services (запускаются через D:\UpgrowPlan\solutions-backend\start_services.py)
const OPEN_ABROAD_API_URL = isDev
  ? "http://localhost:8001" // open-abroad service
  : "https://open-abroad-production.herokuapp.com"; // TODO: добавить продакшн URL

const CLICK_ANALYTICS_API_URL = isDev
  ? "http://localhost:8002" // click-analytics service
  : "https://click-analytics-production.herokuapp.com"; // TODO: добавить продакшн URL

const nextConfig = {
  // Позволяет сборке продолжаться, даже если в проекте есть TypeScript/ESLint ошибки.
  // Это временная настройка для `upgrowplan_new` while we iterate on i18n integration.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_USER_URL: USER_API_BASE_URL,
    NEXT_PUBLIC_API_BLOG_URL: BLOG_API_BASE_URL,
    NEXT_PUBLIC_WS_BLOG_URL: WS_BLOG_URL,
    NEXT_PUBLIC_OPEN_ABROAD_API_URL: OPEN_ABROAD_API_URL,
    NEXT_PUBLIC_CLICK_ANALYTICS_API_URL: CLICK_ANALYTICS_API_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/blog/:path*",
        destination: `${BLOG_API_BASE_URL}/api/:path*`,
      },
      {
        source: "/api/user/:path*",
        destination: `${USER_API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

// Wrap Next config with next-intl plugin so the library can provide the
// runtime `next-intl/config` module and routing helpers for the App Router.
// The plugin expects to receive the locales/defaultLocale here instead of
// a top-level `i18n` property on nextConfig.
try {
  const createNextIntlPlugin = require("next-intl/plugin");
  const withNextIntl = createNextIntlPlugin({
    locales: ["en", "ru"],
    defaultLocale: "en",
    // Disable automatic locale detection for local testing so that
    // the root URL (/) consistently serves the default locale (en).
    // Users can still access Russian via /ru.
    localeDetection: false,
  });
  module.exports = withNextIntl(nextConfig);
} catch (err) {
  // If plugin can't be loaded for any reason, fallback to exporting the
  // plain nextConfig so builds can still run (useful for CI/debug).
  console.warn(
    "next-intl plugin not available, exporting plain nextConfig",
    err
  );
  module.exports = nextConfig;
}
