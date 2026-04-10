/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://upgrowplan.com",
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
    } else if (path.includes("/solutions/") && !path.includes("descriptionPage")) {
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

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
