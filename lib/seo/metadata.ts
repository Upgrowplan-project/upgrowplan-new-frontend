import type { Metadata } from "next";

const SITE_URL = "https://www.upgrowplan.com";
const SITE_NAME = "Upgrowplan";

function buildOgImageUrl(title: string, description: string, locale: string): string {
  const params = new URLSearchParams({ title, description, locale });
  return `${SITE_URL}/api/og?${params.toString()}`;
}

type Locale = "en" | "ru";

interface PageMetaInput {
  locale: Locale;
  path: string; // e.g. "/about" or "/ru/about"
  enPath: string; // canonical English path, e.g. "/about"
  ruPath: string; // canonical Russian path, e.g. "/ru/about"
  title: { en: string; ru: string };
  description: { en: string; ru: string };
}

export function buildMetadata({
  locale,
  path,
  enPath,
  ruPath,
  title,
  description,
}: PageMetaInput): Metadata {
  const isRu = locale === "ru";
  const pageTitle = isRu ? title.ru : title.en;
  const pageDescription = isRu ? description.ru : description.en;
  const canonicalUrl = `${SITE_URL}${path}`;
  const enUrl = `${SITE_URL}${enPath}`;
  const ruUrl = `${SITE_URL}${ruPath}`;
  const ogImageUrl = buildOgImageUrl(pageTitle, pageDescription, locale);

  // Homepage uses absolute title to avoid template duplication ("Brand | Brand")
  const titleValue =
    path === "/" || path === "/ru"
      ? { absolute: pageTitle }
      : pageTitle;

  return {
    title: titleValue,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": enUrl,
        "ru": ruUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: isRu ? "ru_RU" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ─── Page metadata definitions ───────────────────────────────────────────────

export const pageMeta = {
  home: {
    // Homepage bypasses the template via absolute — brand is the title itself
    title: {
      en: "Upgrowplan | AI Business Plans & Market Research",
      ru: "Upgrowplan | ИИ Бизнес-планы и Исследование рынка",
    },
    description: {
      en: "Generate AI-powered business plans, market research reports, and strategic insights in minutes. Built for entrepreneurs and analysts.",
      ru: "Генерируйте бизнес-планы, исследования рынка и стратегические отчёты с помощью ИИ за считанные минуты. Для предпринимателей и аналитиков.",
    },
    enPath: "/",
    ruPath: "/ru",
  },
  about: {
    title: {
      en: "About | AI-Powered Business Planning",
      ru: "О нас | ИИ-платформа для бизнес-планирования",
    },
    description: {
      en: "Learn about Upgrowplan — the team and mission behind the AI platform for business planning, market research, and strategic analysis.",
      ru: "Узнайте об Upgrowplan — команде и миссии ИИ-платформы для бизнес-планирования, исследования рынка и стратегического анализа.",
    },
    enPath: "/about",
    ruPath: "/ru/about",
  },
  products: {
    title: {
      en: "Products | AI Business Planning Tools",
      ru: "Продукты | ИИ-инструменты для бизнес-планирования",
    },
    description: {
      en: "Explore Upgrowplan's suite of AI tools: business plan generation, market research, financial modelling, virtual respondents, and more.",
      ru: "Изучите набор ИИ-инструментов Upgrowplan: генерация бизнес-планов, исследование рынка, финансовое моделирование, виртуальные респонденты и другое.",
    },
    enPath: "/products",
    ruPath: "/ru/products",
  },
  blog: {
    title: {
      en: "Blog | AI Business Insights",
      ru: "Блог | Аналитика и инсайты",
    },
    description: {
      en: "Read expert articles on AI business planning, market research strategies, entrepreneurship, and the future of strategic analysis.",
      ru: "Читайте экспертные статьи о бизнес-планировании с ИИ, стратегиях исследования рынка, предпринимательстве и будущем стратегического анализа.",
    },
    enPath: "/blog",
    ruPath: "/ru/blog",
  },
  contacts: {
    title: {
      en: "Contact Us",
      ru: "Контакты",
    },
    description: {
      en: "Get in touch with the Upgrowplan team. We're here to answer questions about our AI business planning platform.",
      ru: "Свяжитесь с командой Upgrowplan. Мы готовы ответить на вопросы о нашей ИИ-платформе для бизнес-планирования.",
    },
    enPath: "/contacts",
    ruPath: "/ru/contacts",
  },
  privacy: {
    title: {
      en: "Privacy Policy",
      ru: "Политика конфиденциальности",
    },
    description: {
      en: "Read Upgrowplan's privacy policy to understand how we collect, use, and protect your personal data.",
      ru: "Прочитайте политику конфиденциальности Upgrowplan, чтобы понять, как мы собираем, используем и защищаем ваши персональные данные.",
    },
    enPath: "/privacy",
    ruPath: "/ru/privacy",
  },
  solutions: {
    title: {
      en: "AI Solutions for Business",
      ru: "ИИ-решения для бизнеса",
    },
    description: {
      en: "Discover all Upgrowplan AI solutions: market research, business plan generation, financial modelling, social strategy, and more.",
      ru: "Откройте все ИИ-решения Upgrowplan: исследование рынка, генерация бизнес-планов, финансовое моделирование, социальная стратегия и другое.",
    },
    enPath: "/solutions",
    ruPath: "/ru/solutions",
  },
  marketResearch: {
    title: {
      en: "AI Market Research",
      ru: "ИИ Исследование рынка",
    },
    description: {
      en: "Generate comprehensive AI-powered market research reports with competitor analysis, trends, and actionable insights in minutes.",
      ru: "Генерируйте комплексные отчёты по исследованию рынка с ИИ: анализ конкурентов, тренды и практические выводы за считанные минуты.",
    },
    enPath: "/solutions/marketResearch",
    ruPath: "/ru/solutions/marketResearch",
  },
  marketResearchDescription: {
    title: {
      en: "About AI Market Research",
      ru: "О сервисе Исследование рынка",
    },
    description: {
      en: "Learn how Upgrowplan's AI market research tool works — data sources, methodology, and what you get in your report.",
      ru: "Узнайте, как работает ИИ-инструмент исследования рынка Upgrowplan — источники данных, методология и содержание отчёта.",
    },
    enPath: "/solutions/marketResearch/descriptionPage",
    ruPath: "/ru/solutions/marketResearch/descriptionPage",
  },
  plan: {
    title: {
      en: "AI Business Plan Generator",
      ru: "ИИ Генератор бизнес-планов",
    },
    description: {
      en: "Create a professional AI-generated business plan in minutes. Tailored for investors, banks, and internal strategy.",
      ru: "Создайте профессиональный бизнес-план с помощью ИИ за несколько минут. Для инвесторов, банков и внутренней стратегии.",
    },
    enPath: "/solutions/plan",
    ruPath: "/ru/solutions/plan",
  },
  planMaster: {
    title: {
      en: "Plan Master | AI Strategic Planning",
      ru: "Plan Master | ИИ Стратегическое планирование",
    },
    description: {
      en: "Plan Master by Upgrowplan helps you build advanced strategic plans with AI-driven scenario analysis and forecasting.",
      ru: "Plan Master от Upgrowplan помогает строить продвинутые стратегические планы с ИИ-анализом сценариев и прогнозированием.",
    },
    enPath: "/solutions/planMaster",
    ruPath: "/ru/solutions/planMaster",
  },
  planMasterDescription: {
    title: {
      en: "About Plan Master",
      ru: "О продукте Plan Master",
    },
    description: {
      en: "Learn how Plan Master's AI strategic planning engine works, including methodology, inputs, and deliverables.",
      ru: "Узнайте, как работает ИИ-движок стратегического планирования Plan Master — методология, входные данные и результаты.",
    },
    enPath: "/solutions/planMaster/descriptionPage",
    ruPath: "/ru/solutions/planMaster/descriptionPage",
  },
  synthFocusLab: {
    title: {
      en: "Synthetic Focus Lab | AI Virtual Respondents",
      ru: "Synthetic Focus Lab | ИИ Виртуальные респонденты",
    },
    description: {
      en: "Run AI-powered focus groups and surveys using synthetic respondents. Get qualitative research insights without recruiting real participants.",
      ru: "Проводите ИИ-фокус-группы и опросы с виртуальными респондентами. Получайте качественные исследования без реального рекрутинга участников.",
    },
    enPath: "/solutions/synthFocusLab",
    ruPath: "/ru/solutions/synthFocusLab",
  },
  synthFocusLabDescription: {
    title: {
      en: "About Synthetic Focus Lab",
      ru: "О продукте Synthetic Focus Lab",
    },
    description: {
      en: "Discover how Synthetic Focus Lab uses AI personas to simulate focus group discussions and consumer surveys.",
      ru: "Узнайте, как Synthetic Focus Lab использует ИИ-персоны для симуляции фокус-групп и потребительских опросов.",
    },
    enPath: "/solutions/synthFocusLab/descriptionPage",
    ruPath: "/ru/solutions/synthFocusLab/descriptionPage",
  },
  socialPlanMaster: {
    title: {
      en: "Social Plan Master | AI Social Media Strategy",
      ru: "Social Plan Master | ИИ Стратегия в соцсетях",
    },
    description: {
      en: "Build a data-driven social media strategy with AI. Content plans, audience analysis, and platform recommendations.",
      ru: "Создайте стратегию в социальных сетях с ИИ: контент-планы, анализ аудитории и рекомендации по платформам.",
    },
    enPath: "/solutions/socialPlanMaster",
    ruPath: "/ru/solutions/socialPlanMaster",
  },
  finBuddy: {
    title: {
      en: "Fin Buddy | AI Financial Planning",
      ru: "Fin Buddy | ИИ Финансовое планирование",
    },
    description: {
      en: "Fin Buddy generates AI-powered financial projections, P&L statements, and cash flow models for your business.",
      ru: "Fin Buddy генерирует финансовые прогнозы, P&L и модели денежных потоков для вашего бизнеса с помощью ИИ.",
    },
    enPath: "/solutions/fin-buddy",
    ruPath: "/ru/solutions/fin-buddy",
  },
  openAbroad: {
    title: {
      en: "Open Abroad | International Expansion Planning",
      ru: "Open Abroad | Планирование выхода на международный рынок",
    },
    description: {
      en: "Plan your international business expansion with AI. Country analysis, regulatory overview, and market entry strategy.",
      ru: "Планируйте международную экспансию бизнеса с ИИ: анализ стран, обзор регуляторики и стратегия выхода на рынок.",
    },
    enPath: "/solutions/openAbroad",
    ruPath: "/ru/solutions/openAbroad",
  },
  businessPulse: {
    title: {
      en: "Business Pulse | AI Market Monitoring",
      ru: "Business Pulse | ИИ Мониторинг рынка",
    },
    description: {
      en: "Monitor market trends, competitor moves, and business signals in real time with Upgrowplan's AI-powered Business Pulse.",
      ru: "Мониторьте тренды рынка, действия конкурентов и бизнес-сигналы в реальном времени с Business Pulse от Upgrowplan.",
    },
    enPath: "/solutions/businessPulse",
    ruPath: "/ru/solutions/businessPulse",
  },
} as const;
