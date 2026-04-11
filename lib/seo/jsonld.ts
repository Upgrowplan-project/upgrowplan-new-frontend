/**
 * JSON-LD / Schema.org builders for Upgrowplan
 * Docs: https://schema.org | https://developers.google.com/search/docs/appearance/structured-data
 */

const SITE_URL = "https://upgrowplan.com";
const LOGO_URL = `${SITE_URL}/LogoUpGrowSmall2.png`;
const OG_IMAGE = `${SITE_URL}/api/og?title=Upgrowplan&locale=en`;

// ─── Organization (used on homepage + about) ─────────────────────────────────
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Upgrowplan",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 512,
      height: 512,
    },
    description:
      "AI-powered business planning platform. Generate business plans, market research reports, financial models and strategic insights in minutes.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contacts`,
      availableLanguage: ["English", "Russian"],
    },
    sameAs: [
      "https://t.me/upgrowplan",
      "https://vk.com/upgrowplan",
    ],
  };
}

// ─── WebSite (homepage only — enables Google Sitelinks Search) ───────────────
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Upgrowplan",
    url: SITE_URL,
    description:
      "AI-powered platform for business plans, market research, financial modelling and strategic analysis.",
    inLanguage: ["en", "ru"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── BreadcrumbList ──────────────────────────────────────────────────────────
export interface BreadcrumbItem {
  name: string;
  url?: string; // omit for last item (current page)
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

// ─── SoftwareApplication (solution pages) ────────────────────────────────────
export interface SoftwareAppInput {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  keywords?: readonly string[] | string[];
  isFree?: boolean;
}

export function softwareAppSchema({
  name,
  description,
  url,
  applicationCategory = "BusinessApplication",
  keywords = [],
  isFree = true,
}: SoftwareAppInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem: "Web",
    inLanguage: ["en", "ru"],
    offers: {
      "@type": "Offer",
      price: isFree ? "0" : undefined,
      priceCurrency: isFree ? "USD" : undefined,
      availability: "https://schema.org/OnlineOnly",
    },
    provider: {
      "@type": "Organization",
      name: "Upgrowplan",
      url: SITE_URL,
    },
    keywords: keywords.join(", "),
    image: OG_IMAGE,
  };
}

// ─── ItemList (solutions overview page) ──────────────────────────────────────
export interface ListItem {
  name: string;
  url: string;
  description: string;
  position: number;
}

export function itemListSchema(items: ListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Upgrowplan AI Solutions",
    description:
      "Complete list of AI-powered business tools by Upgrowplan",
    url: `${SITE_URL}/solutions`,
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
      description: item.description,
    })),
  };
}

// ─── Blog (blog listing page) ─────────────────────────────────────────────────
export function blogSchema(locale: "en" | "ru") {
  const isRu = locale === "ru";
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: isRu ? "Блог Upgrowplan" : "Upgrowplan Blog",
    description: isRu
      ? "Экспертные статьи о бизнес-планировании с ИИ, исследовании рынка, предпринимательстве и стратегическом анализе."
      : "Expert articles on AI business planning, market research, entrepreneurship and strategic analysis.",
    url: isRu ? `${SITE_URL}/ru/blog` : `${SITE_URL}/blog`,
    inLanguage: isRu ? "ru" : "en",
    publisher: {
      "@type": "Organization",
      name: "Upgrowplan",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
  };
}

// ─── ContactPage ──────────────────────────────────────────────────────────────
export function contactPageSchema(locale: "en" | "ru") {
  const isRu = locale === "ru";
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: isRu ? "Контакты | Upgrowplan" : "Contact Us | Upgrowplan",
    description: isRu
      ? "Свяжитесь с командой Upgrowplan"
      : "Get in touch with the Upgrowplan team",
    url: isRu ? `${SITE_URL}/ru/contacts` : `${SITE_URL}/contacts`,
    inLanguage: isRu ? "ru" : "en",
    mainEntity: {
      "@type": "Organization",
      name: "Upgrowplan",
      url: SITE_URL,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["English", "Russian"],
      },
    },
  };
}

// ─── AboutPage ────────────────────────────────────────────────────────────────
export function aboutPageSchema(locale: "en" | "ru") {
  const isRu = locale === "ru";
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: isRu
      ? "О нас | ИИ-платформа Upgrowplan"
      : "About Upgrowplan | AI Business Planning Platform",
    description: isRu
      ? "Команда и миссия ИИ-платформы Upgrowplan для бизнес-планирования и исследования рынка."
      : "Meet the team and mission behind the Upgrowplan AI platform for business planning and market research.",
    url: isRu ? `${SITE_URL}/ru/about` : `${SITE_URL}/about`,
    inLanguage: isRu ? "ru" : "en",
    mainEntity: organizationSchema(),
  };
}

// ─── Breadcrumb presets per page ─────────────────────────────────────────────
export const breadcrumbs = {
  about: (locale: "en" | "ru") => [
    { name: "Home", url: locale === "ru" ? `${SITE_URL}/ru` : SITE_URL },
    { name: locale === "ru" ? "О нас" : "About" },
  ],
  products: (locale: "en" | "ru") => [
    { name: "Home", url: locale === "ru" ? `${SITE_URL}/ru` : SITE_URL },
    { name: locale === "ru" ? "Продукты" : "Products" },
  ],
  blog: (locale: "en" | "ru") => [
    { name: "Home", url: locale === "ru" ? `${SITE_URL}/ru` : SITE_URL },
    { name: "Blog" },
  ],
  contacts: (locale: "en" | "ru") => [
    { name: "Home", url: locale === "ru" ? `${SITE_URL}/ru` : SITE_URL },
    { name: locale === "ru" ? "Контакты" : "Contacts" },
  ],
  privacy: (locale: "en" | "ru") => [
    { name: "Home", url: locale === "ru" ? `${SITE_URL}/ru` : SITE_URL },
    { name: locale === "ru" ? "Политика конфиденциальности" : "Privacy Policy" },
  ],
  solutions: (locale: "en" | "ru") => [
    { name: "Home", url: locale === "ru" ? `${SITE_URL}/ru` : SITE_URL },
    { name: locale === "ru" ? "Решения" : "Solutions" },
  ],
  solutionPage: (locale: "en" | "ru", solutionName: string) => [
    { name: "Home", url: locale === "ru" ? `${SITE_URL}/ru` : SITE_URL },
    {
      name: locale === "ru" ? "Решения" : "Solutions",
      url: locale === "ru" ? `${SITE_URL}/ru/solutions` : `${SITE_URL}/solutions`,
    },
    { name: solutionName },
  ],
};

// ─── Solution definitions (used across solution pages) ───────────────────────
export const solutionData = {
  marketResearch: {
    en: {
      name: "MarketSense AI Agent",
      description:
        "AI agent for discovery, analysis and full marketing research. Verifies sources and adapts results to your daily business tasks.",
      keywords: ["market research", "AI agent", "competitor analysis", "business intelligence"],
    },
    ru: {
      name: "MarketSense AI Agent",
      description:
        "ИИ-агент для поиска, анализа и полноценного маркетингового исследования. Проверяет источники и адаптирует результаты под ваши бизнес-задачи.",
      keywords: ["исследование рынка", "ИИ агент", "анализ конкурентов", "бизнес-аналитика"],
    },
    url: "/solutions/marketResearch",
    isFree: false,
  },
  plan: {
    en: {
      name: "Business Plan Generator",
      description:
        "Generate a professional AI-powered business plan in minutes. Tailored for investors, banks, and internal strategy.",
      keywords: ["business plan", "AI", "investor", "financial projections"],
    },
    ru: {
      name: "Генератор бизнес-планов",
      description:
        "Создайте профессиональный бизнес-план с помощью ИИ за несколько минут. Для инвесторов, банков и внутренней стратегии.",
      keywords: ["бизнес-план", "ИИ", "инвестор", "финансовые прогнозы"],
    },
    url: "/solutions/plan",
    isFree: true,
  },
  planMaster: {
    en: {
      name: "PlanMaster AI",
      description:
        "Generates an expert business plan based on modern methodology, live search and verified data. Investor-ready documents with clear handling of AI hallucinations.",
      keywords: ["business plan", "PlanMaster", "AI", "investor", "strategy"],
    },
    ru: {
      name: "PlanMaster AI",
      description:
        "Генерирует экспертный бизнес-план на основе современной методологии, живого поиска и проверенных данных. Документы для инвесторов с чёткой обработкой галлюцинаций ИИ.",
      keywords: ["бизнес-план", "PlanMaster", "ИИ", "инвестор", "стратегия"],
    },
    url: "/solutions/planMaster",
    isFree: false,
  },
  synthFocusLab: {
    en: {
      name: "Synth Focus Lab",
      description:
        "Virtual panel of AI respondents. Create focus groups and analyze answers based on detailed demographic, social and financial parameters.",
      keywords: ["focus group", "virtual respondents", "AI", "market research", "demographics"],
    },
    ru: {
      name: "Synth Focus Lab",
      description:
        "Виртуальная панель ИИ-респондентов. Создавайте фокус-группы и анализируйте ответы с учётом демографических, социальных и финансовых параметров.",
      keywords: ["фокус-группа", "виртуальные респонденты", "ИИ", "исследование рынка"],
    },
    url: "/solutions/synthFocusLab",
    isFree: false,
  },
  socialPlanMaster: {
    en: {
      name: "Social Plan Master",
      description:
        "Build a data-driven social media strategy with AI. Content plans, audience analysis, and platform recommendations.",
      keywords: ["social media strategy", "content plan", "AI", "SMM", "audience analysis"],
    },
    ru: {
      name: "Social Plan Master",
      description:
        "Создайте стратегию в социальных сетях с ИИ: контент-планы, анализ аудитории и рекомендации по платформам.",
      keywords: ["стратегия SMM", "контент-план", "ИИ", "социальные сети", "аудитория"],
    },
    url: "/solutions/socialPlanMaster",
    isFree: false,
  },
  finBuddy: {
    en: {
      name: "Fin Buddy",
      description:
        "AI-powered expense tracking and financial planning. Scan receipts, categorize expenses, and get budget insights for your business.",
      keywords: ["financial planning", "expense tracking", "AI", "budget", "receipts"],
    },
    ru: {
      name: "Fin Buddy",
      description:
        "ИИ-учёт расходов и финансовое планирование. Сканируйте чеки, категоризируйте траты и получайте бюджетную аналитику для бизнеса.",
      keywords: ["финансовое планирование", "учёт расходов", "ИИ", "бюджет", "чеки"],
    },
    url: "/solutions/fin-buddy",
    isFree: true,
  },
  openAbroad: {
    en: {
      name: "Relocation Service",
      description:
        "Information and assistance for opening or relocating a business to another country. Free country analysis and regulatory overview.",
      keywords: ["business relocation", "international expansion", "market entry", "regulations"],
    },
    ru: {
      name: "Relocation Service",
      description:
        "Информация и помощь в открытии или переносе бизнеса в другую страну. Бесплатный анализ страны и обзор регуляторики.",
      keywords: ["релокация бизнеса", "международная экспансия", "выход на рынок", "регуляторика"],
    },
    url: "/solutions/openAbroad",
    isFree: true,
  },
  businessPulse: {
    en: {
      name: "Business Pulse Workspace",
      description:
        "Your daily digital department for market monitoring and business protection. Real-time competitor tracking and business signals with AI.",
      keywords: ["market monitoring", "competitor tracking", "business intelligence", "AI", "real-time"],
    },
    ru: {
      name: "Business Pulse Workspace",
      description:
        "Ваш ежедневный цифровой отдел для мониторинга рынка и защиты бизнеса. Отслеживание конкурентов и бизнес-сигналов в реальном времени с ИИ.",
      keywords: ["мониторинг рынка", "отслеживание конкурентов", "бизнес-аналитика", "ИИ"],
    },
    url: "/solutions/businessPulse",
    isFree: false,
  },
} as const;
