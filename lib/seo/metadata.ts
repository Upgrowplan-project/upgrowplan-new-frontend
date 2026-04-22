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
      en: "About | AI Business Planning Platform",
      ru: "О платформе | ИИ-инструменты для бизнеса",
    },
    description: {
      en: "Upgrowplan — AI platform for business plans, market research and financial modelling. Founded 2024, Tel Aviv. 230+ plans, UNIDO/EBRD methodology.",
      ru: "Upgrowplan — ИИ-платформа для бизнес-планов, исследований рынка и финансового моделирования. Основана в 2024, Тель-Авив. 230+ планов, методология ЮНИДО/ЕБРР.",
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
      en: "Business Planning & AI Strategy Blog",
      ru: "Блог: ИИ для бизнеса, планирование и рынки",
    },
    description: {
      en: "Expert articles on AI business planning, market research, UNIDO standards, RAG technology, and AI hallucination prevention — for entrepreneurs and analysts.",
      ru: "Экспертные статьи об ИИ для бизнеса, исследованиях рынка, стандартах ЮНИДО, технологии RAG и предотвращении галлюцинаций ИИ — для предпринимателей и аналитиков.",
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
      en: "AI Tools: Business Plans, Market Research & Finance",
      ru: "ИИ-инструменты: планы, исследования и финансы",
    },
    description: {
      en: "All Upgrowplan AI tools: business plan generator (UNIDO/EBRD), market research in 15 min, financial modelling, virtual focus groups, and market monitoring.",
      ru: "Все ИИ-инструменты Upgrowplan: генератор бизнес-планов (ЮНИДО/ЕБРР), исследование рынка за 15 мин, финансовое моделирование, виртуальные фокус-группы и мониторинг.",
    },
    enPath: "/solutions",
    ruPath: "/ru/solutions",
  },
  marketResearch: {
    title: {
      en: "AI Market Research Tool — Reports in 15 Minutes",
      ru: "ИИ-исследование рынка — отчёт за 15 минут",
    },
    description: {
      en: "Generate AI market research reports with real competitor data, market sizing, trends and pricing — from 50+ verified sources in 15 minutes.",
      ru: "Генерируйте отчёты по исследованию рынка с реальными данными о конкурентах, размером рынка и ценами — из 50+ верифицированных источников за 15 минут.",
    },
    enPath: "/solutions/marketResearch",
    ruPath: "/ru/solutions/marketResearch",
  },
  marketResearchDescription: {
    title: {
      en: "How AI Market Research Works | MarketSense Agent",
      ru: "Как работает ИИ-исследование рынка | MarketSense",
    },
    description: {
      en: "MarketSense AI Agent: live web search + RAG + Skeptic Agent validation. 50 verified sources, competitor mapping, market sizing — in 15 minutes.",
      ru: "MarketSense AI Agent: живой поиск + RAG + проверка Skeptic Agent. 50 верифицированных источников, карта конкурентов, объём рынка — за 15 минут.",
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
      en: "PlanMaster AI | Business Plan Generator UNIDO/EBRD",
      ru: "PlanMaster AI | Генератор бизнес-планов ЮНИДО/ЕБРР",
    },
    description: {
      en: "Generate investor-ready business plans with AI — following UNIDO and EBRD standards. Financial modelling, market analysis, and Skeptic Agent hallucination check.",
      ru: "Генерируйте бизнес-планы инвесторского качества с ИИ по стандартам ЮНИДО и ЕБРР. Финансовое моделирование, анализ рынка и проверка Skeptic Agent.",
    },
    enPath: "/solutions/planMaster",
    ruPath: "/ru/solutions/planMaster",
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
    enPath: "/solutions/planMaster/descriptionPage",
    ruPath: "/ru/solutions/planMaster/descriptionPage",
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
      en: "Synth Focus Lab builds AI personas from market data, simulates group discussions, and surfaces consumer sentiment — faster and cheaper than traditional research.",
      ru: "Synth Focus Lab создаёт ИИ-персоны на основе рыночных данных, симулирует групповые дискуссии и выявляет потребительские настроения — быстрее и дешевле классических исследований.",
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
      en: "FinPilot Free | AI Financial Model & P&L Generator",
      ru: "FinPilot Free | ИИ Финансовая модель и P&L",
    },
    description: {
      en: "Free AI financial modelling: P&L, cash flow, break-even, 3-year projections and sensitivity analysis. Built on Python deterministic calculations — no AI guesses.",
      ru: "Бесплатное ИИ-финансовое моделирование: P&L, денежные потоки, точка безубыточности, прогноз на 3 года и анализ чувствительности. Python-расчёты без вероятностных моделей.",
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
      ru: "Ежедневный ИИ-мониторинг конкурентов, трендов рынка и отраслевых сигналов. Автоматические оповещения и еженедельный дайджест — чтобы не пропустить изменения рынка.",
    },
    enPath: "/solutions/businessPulse",
    ruPath: "/ru/solutions/businessPulse",
  },
} as const;
