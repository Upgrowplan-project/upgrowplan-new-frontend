/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.upgrowplan.com",
  generateRobotsTxt: false, // robots.txt managed manually in /public/robots.txt
  exclude: [
    // Locale prefix — redirected to non-prefixed EN routes
    "/en",
    "/en/*",
    // App-level pages (not for indexing)
    "/account",
    "/ru/account",
    "/auth",
    "/ru/auth",
    "/monitoring",
    "/ru/monitoring",
    "/fin-model",
    "/fin-model/*",
    "/ru/fin-model",
    "/ru/fin-model/*",
    // Duplicate slug — finBuddy is duplicate of fin-buddy
    "/solutions/finBuddy",
    "/ru/solutions/finBuddy",
    // Redirected pages — canonical is /ai-business-plan-generator
    "/solutions/planMaster",
    "/ru/solutions/planMaster",
    "/solutions/planMaster/descriptionPage",
    "/ru/solutions/planMaster/descriptionPage",
    // Old synthFocusLab paths — canonical is /solutions/synthetic-customer-research
    "/solutions/synthFocusLab",
    "/ru/solutions/synthFocusLab",
    "/solutions/synthFocusLab/descriptionPage",
    "/ru/solutions/synthFocusLab/descriptionPage",
  ],
  alternateRefs: [
    {
      href: "https://www.upgrowplan.com",
      hreflang: "en",
    },
    {
      href: "https://www.upgrowplan.com/ru",
      hreflang: "ru",
    },
  ],
  transform: async (config, path) => {
    // Priority tiers
    let priority = 0.7;
    let changefreq = "weekly";

    if (path === "/" || path === "/ru") {
      priority = 1.0;
      changefreq = "daily";
    } else if (
      path === "/products" ||
      path === "/ru/products" ||
      path === "/solutions" ||
      path === "/ru/solutions"
    ) {
      priority = 0.9;
      changefreq = "weekly";
    } else if (
      path === "/ai-business-plan-generator" ||
      path === "/ru/ai-business-plan-generator" ||
      path === "/why-upgrowplan" ||
      path === "/ru/why-upgrowplan"
    ) {
      priority = 0.9;
      changefreq = "weekly";
    } else if (path.includes("/solutions/") && !path.includes("descriptionPage")) {
      priority = 0.8;
      changefreq = "weekly";
    } else if (path.includes("descriptionPage")) {
      priority = 0.8;
      changefreq = "weekly";
    } else if (path === "/blog" || path === "/ru/blog") {
      priority = 0.8;
      changefreq = "daily";
    } else if (path === "/about" || path === "/ru/about") {
      priority = 0.7;
      changefreq = "monthly";
    } else if (path === "/contacts" || path === "/ru/contacts") {
      priority = 0.6;
      changefreq = "monthly";
    } else if (path === "/privacy" || path === "/ru/privacy") {
      priority = 0.3;
      changefreq = "yearly";
    }

    // Build hreflang alternates per page
    const isRu = path.startsWith("/ru");
    const enPath = isRu ? path.replace(/^\/ru/, "") || "/" : path;
    const ruPath = isRu ? path : `/ru${path === "/" ? "" : path}`;

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        { href: `https://www.upgrowplan.com${enPath}`, hreflang: "en" },
        { href: `https://www.upgrowplan.com${ruPath}`, hreflang: "ru" },
        { href: `https://www.upgrowplan.com${enPath}`, hreflang: "x-default" },
      ],
    };
  },
};
