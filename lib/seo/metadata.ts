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
      en: "Upgrowplan — AI Business Plan Generator & Market Research",
      ru: "Upgrowplan — ИИ-генератор бизнес-планов и анализ рынка",
    },
    description: {
      en: "Investor-ready business plan in 20 min: synthetic-respondent validation, live market research from 50+ sources, full financial model — UNIDO/EBRD, no fluff.",
      ru: "Бизнес-план инвесторского уровня за 20 минут: проверка на синтетических респондентах, живое исследование рынка, финмодель — ЮНИДО/ЕБРР, без воды.",
    },
    enPath: "/",
    ruPath: "/ru",
  },
  about: {
    title: {
      en: "About Upgrowplan — AI Business Validation",
      ru: "О Upgrowplan — ИИ-валидация бизнеса, Тель-Авив",
    },
    description: {
      en: "Upgrowplan is an AI business validation platform in Tel Aviv, founded 2024 to bridge raw data and strategic planning for founders and analysts.",
      ru: "Upgrowplan — ИИ-платформа валидации бизнеса из Тель-Авива (2024): соединяем сырые данные и стратегическое планирование для фаундеров и аналитиков.",
    },
    enPath: "/about",
    ruPath: "/ru/about",
  },
  products: {
    title: {
      en: "AI Business Validation Tools for Founders",
      ru: "ИИ-инструменты валидации бизнеса",
    },
    description: {
      en: "Upgrowplan's AI suite: market simulation on synthetic respondents, UNIDO/EBRD business plans, live market research, financial modelling, competitor monitoring.",
      ru: "Набор ИИ Upgrowplan: симуляция рынка на респондентах, бизнес-планы ЮНИДО/ЕБРР, живые исследования рынка, финмоделирование и мониторинг конкурентов.",
    },
    enPath: "/products",
    ruPath: "/ru/products",
  },
  blog: {
    title: {
      en: "AI Business Planning & Market Research Blog",
      ru: "Блог об ИИ-валидации бизнеса",
    },
    description: {
      en: "Guides on AI market research, business plan writing, startup validation, financial modeling, and investor prep for founders, analysts, and consultants.",
      ru: "Материалы об ИИ-исследованиях рынка, бизнес-планах, валидации стартапов, финмоделировании и подготовке к инвесторам — для фаундеров и аналитиков.",
    },
    enPath: "/blog",
    ruPath: "/ru/blog",
  },
  contacts: {
    title: {
      en: "Contact | AI Business Planning Support",
      ru: "Контакты | Поддержка Upgrowplan",
    },
    description: {
      en: "Get in touch with the Upgrowplan team. Questions about AI business plans, market research, or partnership — we're here to help.",
      ru: "Свяжитесь с командой Upgrowplan. Вопросы о бизнес-планах с ИИ, исследованиях рынка или партнёрстве — мы готовы помочь.",
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
      en: "AI Startup Validation Tools & Business Plans",
      ru: "ИИ-инструменты валидации стартапа",
    },
    description: {
      en: "Upgrowplan's AI tools for startup validation: synthetic respondents, live market research, financial modeling, business plans, and investor decks.",
      ru: "ИИ-инструменты Upgrowplan для валидации стартапов: синтетические респонденты, живые исследования рынка, финмодели, бизнес-планы и инвест-материалы.",
    },
    enPath: "/solutions",
    ruPath: "/ru/solutions",
  },
  marketResearch: {
    title: {
      en: "AI Market Research from 50+ Sources in 15 Min",
      ru: "ИИ-исследование рынка из 50+ источников",
    },
    description: {
      en: "MarketSense AI: live web search + RAG + Skeptic Agent. Competitor mapping, market sizing, pricing and entry barriers from 50+ sources — in 15 minutes.",
      ru: "MarketSense AI: живой поиск + RAG + Skeptic Agent. Карта конкурентов, объём рынка, цены и барьеры входа из 50+ источников — за 15 минут.",
    },
    enPath: "/solutions/marketResearch",
    ruPath: "/ru/solutions/marketResearch",
  },
  marketResearchDescription: {
    title: {
      en: "AI Market Research Tool — Live Web Data",
      ru: "ИИ-инструмент исследования рынка",
    },
    description: {
      en: "Run AI-powered market research with live web data, competitor mapping, source validation, and market sizing in minutes with MarketSense AI Agent.",
      ru: "ИИ-исследование рынка с живыми веб-данными, картой конкурентов, валидацией источников и оценкой объёма за минуты — MarketSense AI Agent.",
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
    enPath: "/ai-business-plan-generator",
    ruPath: "/ru/ai-business-plan-generator",
  },
  planMaster: {
    title: {
      en: "PlanMaster AI | Business Plan Generator UNIDO/EBRD",
      ru: "PlanMaster AI | Генератор бизнес-планов ЮНИДО/ЕБРР",
    },
    description: {
      en: "Generate investor-ready business plans with AI — UNIDO/EBRD standards. Financial modelling, market analysis, Skeptic Agent hallucination check.",
      ru: "Генерируйте бизнес-планы инвесторского качества с ИИ по стандартам ЮНИДО и ЕБРР. Финансовое моделирование, анализ рынка и проверка Skeptic Agent.",
    },
    enPath: "/ai-business-plan-generator",
    ruPath: "/ru/ai-business-plan-generator",
  },
  planMasterDescription: {
    title: {
      en: "How PlanMaster AI Works | UNIDO Business Plan Method",
      ru: "Как работает PlanMaster AI | Метод ЮНИДО/ЕБРР",
    },
    description: {
      en: "PlanMaster AI: RAG + live search + Python financial modelling + Skeptic Agent. Outputs Word/PDF business plan following UNIDO/EBRD investor standards.",
      ru: "PlanMaster AI: RAG + живой поиск + финансовое моделирование на Python + Skeptic Agent. Бизнес-план в Word/PDF по стандартам ЮНИДО/ЕБРР для инвесторов.",
    },
    enPath: "/ai-business-plan-generator",
    ruPath: "/ru/ai-business-plan-generator",
  },
  synthFocusLab: {
    title: {
      en: "Synth Focus Lab | AI Virtual Focus Groups & Surveys",
      ru: "Synth Focus Lab | ИИ Фокус-группы и опросы",
    },
    description: {
      en: "Run AI-powered virtual focus groups with synthetic personas. Test product ideas, pricing, and messaging — no real participant recruitment needed.",
      ru: "Проводите виртуальные фокус-группы с ИИ-персонами. Тестируйте продукт, ценообразование и позиционирование — без рекрутинга реальных участников.",
    },
    enPath: "/solutions/synthFocusLab",
    ruPath: "/ru/solutions/synthFocusLab",
  },
  synthFocusLabDescription: {
    title: {
      en: "How Synth Focus Lab Works | AI Synthetic Respondents",
      ru: "Как работает Synth Focus Lab | ИИ-респонденты",
    },
    description: {
      en: "Synth Focus Lab builds AI personas from market data, simulates discussions, and surfaces consumer sentiment — faster than traditional research.",
      ru: "Synth Focus Lab создаёт ИИ-персоны из рыночных данных, симулирует дискуссии и выявляет настроения потребителей — быстрее и дешевле классики.",
    },
    enPath: "/solutions/synthetic-customer-research",
    ruPath: "/ru/solutions/synthetic-customer-research",
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
      en: "FinPilot Free | AI Financial Model & P&L Generator",
      ru: "FinPilot Free | ИИ Финансовая модель и P&L",
    },
    description: {
      en: "Free AI financial modelling: P&L, cash flow, break-even, 3-year projections, sensitivity analysis — deterministic Python, no AI guesses.",
      ru: "Бесплатное ИИ-финмоделирование: P&L, денежные потоки, точка безубыточности, прогноз на 3 года, анализ чувствительности — Python-расчёты.",
    },
    enPath: "/solutions/fin-buddy",
    ruPath: "/ru/solutions/fin-buddy",
  },
  openAbroad: {
    title: {
      en: "Open Abroad | AI International Business Expansion",
      ru: "Open Abroad | ИИ Открытие бизнеса за рубежом",
    },
    description: {
      en: "Free AI tool for international business expansion: country comparison, regulatory requirements, tax overview, and market entry strategy — for 50+ countries.",
      ru: "Бесплатный ИИ-инструмент для открытия бизнеса за рубежом: сравнение стран, регуляторные требования, налоги и стратегия выхода — для 50+ стран.",
    },
    enPath: "/solutions/openAbroad",
    ruPath: "/ru/solutions/openAbroad",
  },
  businessPulse: {
    title: {
      en: "Business Pulse | Daily AI Competitor & Market Monitor",
      ru: "Business Pulse | Ежедневный ИИ-мониторинг рынка",
    },
    description: {
      en: "Daily AI monitoring of your competitors, market trends, and industry signals. Automated alerts and weekly digest — so you never miss a market shift.",
      ru: "Ежедневный ИИ-мониторинг конкурентов, трендов и отраслевых сигналов. Автооповещения и еженедельный дайджест — не пропустите изменения рынка.",
    },
    enPath: "/solutions/businessPulse",
    ruPath: "/ru/solutions/businessPulse",
  },
  aiBizPlanGenerator: {
    title: {
      en: "AI Business Plan Generator — Investor-Ready",
      ru: "ИИ-генератор бизнес-планов инвесторского уровня",
    },
    description: {
      en: "Create an investor-ready business plan with AI: synthetic-respondent validation, live market research, Python financial model — UNIDO/EBRD standards.",
      ru: "Бизнес-план инвесторского уровня с ИИ: проверка на респондентах, живое исследование рынка, финмодель на Python — стандарты ЮНИДО/ЕБРР.",
    },
    enPath: "/ai-business-plan-generator",
    ruPath: "/ru/ai-business-plan-generator",
  },
  whyUpgrowplan: {
    title: {
      en: "Why Upgrowplan vs ChatGPT & Consultants",
      ru: "Почему Upgrowplan, а не ChatGPT и консультанты",
    },
    description: {
      en: "Upgrowplan vs ChatGPT, consultants and Upmetrics: validation before generation — synthetic respondents, live-data RAG, Skeptic Agent, UNIDO/EBRD.",
      ru: "Upgrowplan против ChatGPT, консультантов и Upmetrics: валидация до генерации — синтет. респонденты, RAG на живых данных, Skeptic Agent, ЮНИДО/ЕБРР.",
    },
    enPath: "/why-upgrowplan",
    ruPath: "/ru/why-upgrowplan",
  },
  syntheticCustomerResearch: {
    title: {
      en: "AI Synthetic Customer Research Tool",
      ru: "ИИ синтетический customer research",
    },
    description: {
      en: "AI synthetic customer research on virtual buyers built from real market patterns. Test demand, pricing, objections, and messaging in minutes.",
      ru: "ИИ-customer research на виртуальных покупателях по реальным рыночным паттернам: проверяйте спрос, цены, возражения и позиционирование за минуты.",
    },
    enPath: "/solutions/synthetic-customer-research",
    ruPath: "/ru/solutions/synthetic-customer-research",
  },
} as const;
