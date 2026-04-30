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
      en: "Upgrowplan — AI Business Plan Generator with Market Validation, Synthetic Respondents & Financial Model",
      ru: "Upgrowplan — ИИ Генератор бизнес-планов с валидацией рынка, синтетическими респондентами и финансовой моделью",
    },
    description: {
      en: "Generate an investor-ready business plan in 20 minutes: validate your idea on synthetic respondents, get real market research from 50+ sources, build a full financial model (P&L, cash flow, break-even) — UNIDO/EBRD standard, Skeptic Agent verified, no hallucinations.",
      ru: "Создайте бизнес-план инвесторского уровня за 20 минут: проверьте идею на синтетических респондентах, получите исследование рынка из 50+ источников, постройте финансовую модель (P&L, денежный поток, точка безубыточности) — стандарт ЮНИДО/ЕБРР, проверка Skeptic Agent, без галлюцинаций.",
    },
    enPath: "/",
    ruPath: "/ru",
  },
  about: {
    title: {
      en: "About Upgrowplan — AI Business Validation Platform | Founded Tel Aviv 2024",
      ru: "О платформе Upgrowplan — ИИ-валидация бизнеса | Основана Тель-Авив 2024",
    },
    description: {
      en: "Upgrowplan is an AI-powered business validation platform: market simulation, synthetic respondents, UNIDO/EBRD plans, financial modelling. Founded 2024, Tel Aviv. 230+ investor-ready plans delivered.",
      ru: "Upgrowplan — ИИ-платформа для валидации бизнеса: симуляция рынка, синтетические респонденты, планы по ЮНИДО/ЕБРР, финансовое моделирование. Основана в 2024, Тель-Авив. 230+ планов для инвесторов.",
    },
    enPath: "/about",
    ruPath: "/ru/about",
  },
  products: {
    title: {
      en: "Upgrowplan Products — AI Business Validation Suite for Founders & Analysts",
      ru: "Продукты Upgrowplan — ИИ-инструменты для валидации бизнеса: для фаундеров и аналитиков",
    },
    description: {
      en: "Explore Upgrowplan's AI validation suite: market simulation on synthetic respondents, UNIDO/EBRD business plan generator, live market research, financial modelling, competitor monitoring — built for founders, analysts, and investors.",
      ru: "Инструменты Upgrowplan для валидации бизнеса: симуляция рынка на синтетических респондентах, генератор бизнес-планов по ЮНИДО/ЕБРР, живые исследования рынка, финансовое моделирование, мониторинг конкурентов — для фаундеров, аналитиков и инвесторов.",
    },
    enPath: "/products",
    ruPath: "/ru/products",
  },
  blog: {
    title: {
      en: "AI Business Validation Blog — Market Simulation, Investor Plans & Startup Research",
      ru: "Блог об ИИ-валидации бизнеса — симуляция рынка, планы для инвесторов и исследования стартапов",
    },
    description: {
      en: "Expert articles on AI business validation, market simulation, synthetic respondents, UNIDO/EBRD standards, RAG technology, and hallucination-free AI — for founders and analysts.",
      ru: "Экспертные статьи об ИИ-валидации бизнеса, симуляции рынка, синтетических респондентах, стандартах ЮНИДО/ЕБРР, RAG-технологии и ИИ без галлюцинаций — для фаундеров и аналитиков.",
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
      en: "AI Business Plan Generator & Validation Tools — Market Research, Financial Model, Synthetic Respondents",
      ru: "ИИ Генератор бизнес-планов и инструменты валидации — исследование рынка, финансовая модель, синтетические респонденты",
    },
    description: {
      en: "One platform, complete workflow: validate idea on synthetic respondents → live market research from 50+ sources → UNIDO/EBRD business plan → Python financial model → investor pitch deck. No consultants, no hallucinations.",
      ru: "Одна платформа, полный процесс: валидация идеи на синтетических респондентах → живое исследование рынка из 50+ источников → бизнес-план ЮНИДО/ЕБРР → Python-финансовая модель → питч для инвесторов. Без консультантов, без галлюцинаций.",
    },
    enPath: "/solutions",
    ruPath: "/ru/solutions",
  },
  marketResearch: {
    title: {
      en: "AI Market Research — Live Data from 50+ Sources, Competitor Analysis in 15 Minutes",
      ru: "ИИ-исследование рынка — живые данные из 50+ источников, анализ конкурентов за 15 минут",
    },
    description: {
      en: "MarketSense AI Agent: live web search + RAG + Skeptic Agent validation. Get competitor mapping, market sizing, pricing trends, and entry barriers from 50+ verified sources — in 15 minutes, not weeks.",
      ru: "MarketSense AI Agent: живой поиск + RAG + проверка Skeptic Agent. Карта конкурентов, объём рынка, ценовые тренды и барьеры входа из 50+ верифицированных источников — за 15 минут, а не недели.",
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
  aiBizPlanGenerator: {
    title: {
      en: "AI Business Plan Generator — Idea Validation + Market Research + Financial Model + UNIDO/EBRD Plan in 20 Min",
      ru: "ИИ Генератор бизнес-планов — валидация идеи + исследование рынка + финансовая модель + план ЮНИДО/ЕБРР за 20 мин",
    },
    description: {
      en: "The only AI business plan generator that validates before it generates: synthetic respondent testing, live market research from 50+ sources, Python financial model (P&L, cash flow, break-even), Skeptic Agent hallucination check — delivered as Word + pitch deck. No consultants needed.",
      ru: "Единственный ИИ-генератор бизнес-планов, который сначала валидирует: тест на синтетических респондентах, живое исследование рынка из 50+ источников, Python-финансовая модель (P&L, денежный поток, точка безубыточности), проверка Skeptic Agent — в формате Word + питч. Без консультантов.",
    },
    enPath: "/ai-business-plan-generator",
    ruPath: "/ru/ai-business-plan-generator",
  },
  whyUpgrowplan: {
    title: {
      en: "Why Upgrowplan vs ChatGPT, Consultants & Upmetrics — AI Business Plan Generator That Validates First",
      ru: "Почему Upgrowplan, а не ChatGPT, консультанты и Upmetrics — ИИ-генератор бизнес-планов, который сначала валидирует",
    },
    description: {
      en: "Upgrowplan vs ChatGPT vs consultants vs Upmetrics: the difference is validation before generation — synthetic respondent testing, RAG with live data, Skeptic Agent hallucination check, Python financial model, UNIDO/EBRD methodology. Full comparison.",
      ru: "Upgrowplan против ChatGPT, консультантов и Upmetrics: разница — в валидации до генерации: тест на синтетических респондентах, RAG с живыми данными, Skeptic Agent против галлюцинаций, Python-финансовая модель, методология ЮНИДО/ЕБРР. Полное сравнение.",
    },
    enPath: "/why-upgrowplan",
    ruPath: "/ru/why-upgrowplan",
  },
  syntheticCustomerResearch: {
    title: {
      en: "AI Market Simulation — Validate Your Idea on Synthetic Respondents in 15 Minutes",
      ru: "ИИ-симуляция рынка — протестируй идею на синтетических респондентах за 15 минут",
    },
    description: {
      en: "Replace expensive focus groups with AI market simulation: synthetic respondents built from real market data, 85–92% accuracy, instant results. Test product ideas, pricing, messaging — no recruitment needed.",
      ru: "Замените дорогие фокус-группы ИИ-симуляцией рынка: синтетические респонденты на основе реальных данных, точность 85–92%, мгновенный результат. Тестируйте идеи, цены, позиционирование — без рекрутинга.",
    },
    enPath: "/solutions/synthetic-customer-research",
    ruPath: "/ru/solutions/synthetic-customer-research",
  },
} as const;
