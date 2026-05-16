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
      en: "Upgrowplan: AI Business Validation Platform | Based in Tel Aviv",
      ru: "Upgrowplan: ИИ-платформа валидации бизнеса | Тель-Авив",
    },
    description: {
      en: "Upgrowplan is an AI business validation platform based in Tel Aviv. Founded in 2024 to bridge the gap between raw data and strategic planning for founders, analysts, and consultants.",
      ru: "Upgrowplan — ИИ-платформа валидации бизнеса из Тель-Авива. Основана в 2024 году, чтобы сократить разрыв между сырыми данными и стратегическим планированием для фаундеров, аналитиков и консультантов.",
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
      en: "AI Business Validation Blog | Market Research, Business Plans, Financial Models",
      ru: "Блог об ИИ-валидации бизнеса | Исследования рынка, бизнес-планы, финансовые модели",
    },
    description: {
      en: "Guides on AI market research, business plan writing, startup validation, financial modeling, and investor preparation for founders, analysts, and consultants.",
      ru: "Практические материалы об ИИ-исследованиях рынка, бизнес-планах, валидации стартапов, финансовом моделировании и подготовке к работе с инвесторами для фаундеров, аналитиков и консультантов.",
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
      en: "AI Startup Validation Tools | Market Research, Financial Modeling, Business Plans",
      ru: "ИИ-инструменты валидации стартапа | Исследование рынка, финмодели, бизнес-планы",
    },
    description: {
      en: "Explore Upgrowplan's AI tools for startup validation: synthetic respondents, live market research, financial modeling, business plans, and investor decks.",
      ru: "Изучите ИИ-инструменты Upgrowplan для валидации стартапов: синтетические респонденты, живые исследования рынка, финансовое моделирование, бизнес-планы и инвесторские материалы.",
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
      en: "AI Market Research Tool | Live Web Research, Competitor Analysis, Market Sizing",
      ru: "ИИ-инструмент исследования рынка | Живые данные, анализ конкурентов, оценка рынка",
    },
    description: {
      en: "Run AI-powered market research with live web data, competitor mapping, source validation, and market sizing in minutes with MarketSense AI Agent.",
      ru: "Проводите ИИ-исследование рынка с живыми веб-данными, картой конкурентов, валидацией источников и оценкой объёма рынка за считанные минуты с MarketSense AI Agent.",
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
      en: "Generate investor-ready business plans with AI — following UNIDO and EBRD standards. Financial modelling, market analysis, and Skeptic Agent hallucination check.",
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
      en: "Synth Focus Lab builds AI personas from market data, simulates group discussions, and surfaces consumer sentiment — faster and cheaper than traditional research.",
      ru: "Synth Focus Lab создаёт ИИ-персоны на основе рыночных данных, симулирует групповые дискуссии и выявляет потребительские настроения — быстрее и дешевле классических исследований.",
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
      en: "AI Business Plan Generator | Get Investor-Ready in 20 Min",
      ru: "ИИ-генератор бизнес-планов | Инвесторский уровень за 20 минут",
    },
    description: {
      en: "Create an investor-ready business plan with AI: validate demand with synthetic respondents, run live market research, build a financial model, and generate a plan compliant with UNIDO and EBRD standards.",
      ru: "Создайте бизнес-план инвесторского уровня с помощью ИИ: проверьте спрос на синтетических респондентах, выполните живое исследование рынка, постройте финансовую модель и получите план по стандартам ЮНИДО и ЕБРР.",
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
      en: "AI Synthetic Customer Research Tool | Test Ideas on Virtual Buyers",
      ru: "ИИ-инструмент синтетического customer research | Проверка идей на виртуальных покупателях",
    },
    description: {
      en: "Run AI synthetic customer research with virtual buyers built from real market patterns. Test demand, pricing, objections, and messaging in minutes without recruiting participants.",
      ru: "Проводите ИИ-сustomer research на виртуальных покупателях, построенных по реальным рыночным паттернам. Проверяйте спрос, цены, возражения и позиционирование за минуты без рекрутинга участников.",
    },
    enPath: "/solutions/synthetic-customer-research",
    ruPath: "/ru/solutions/synthetic-customer-research",
  },
} as const;
