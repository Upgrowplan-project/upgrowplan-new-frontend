/**
 * JSON-LD / Schema.org builders for Upgrowplan
 * Docs: https://schema.org | https://developers.google.com/search/docs/appearance/structured-data
 */

const SITE_URL = "https://www.upgrowplan.com";
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
      "AI business plan generator that validates before it generates. Upgrowplan combines AI market simulation on synthetic respondents, live market research from 50+ sources, UNIDO/EBRD business plan generation, and Python financial modelling — all data Skeptic Agent verified, no hallucinations. Founded 2024, Tel Aviv.",
    foundingDate: "2024",
    foundingLocation: {
      "@type": "Place",
      name: "Tel Aviv, Israel",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contacts`,
      availableLanguage: ["English", "Russian"],
    },
    sameAs: [
      // Verified brand profiles — help LLMs associate these entities as one brand (GEO "Labrador").
      "https://www.linkedin.com/company/upgrowplan",
      "https://t.me/upgrowplan",
      "https://vk.com/upgrowplan",
      // Add each URL below ONLY after the profile actually exists (a 404 in sameAs hurts trust):
      // "https://www.crunchbase.com/organization/upgrowplan",
      // "https://www.producthunt.com/products/upgrowplan",
    ],
    knowsAbout: [
      "AI business plan generation",
      "UNIDO business plan methodology",
      "EBRD business plan standards",
      "AI market research",
      "Synthetic respondents",
      "AI market simulation",
      "Financial modelling",
      "RAG architecture",
      "Skeptic Agent hallucination prevention",
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
      "AI business plan generator that validates before it generates: synthetic respondent market simulation, live market research from 50+ sources, UNIDO/EBRD investor-ready plan, Python financial model — Skeptic Agent verified, no hallucinations.",
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

// ─── Speakable (GEO: marks key content for AI voice/search extraction) ────────
export function speakableSchema({
  url,
  name,
  description,
  locale = "en",
}: {
  url: string;
  name: string;
  description: string;
  locale?: "en" | "ru";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    inLanguage: locale === "ru" ? "ru" : "en",
    speakable: {
      "@type": "SpeakableSpecification",
      // Target h1, h2 headings and elements marked with data-speakable attribute
      cssSelector: ["h1", "h2", "[data-speakable]"],
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

const DIGITAL_OFFER_EXTRAS = {
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "001", // worldwide
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
  },
  shippingDetails: {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "MIN" },
    },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "001" },
  },
};

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
      // All products are free (permanently free or free beta access)
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
      ...DIGITAL_OFFER_EXTRAS,
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
    author: teamMembersSchema(),
  };
}

// ─── Team members (Person schema) ────────────────────────────────────────────
export function teamMembersSchema() {
  return [
    {
      "@type": "Person",
      name: "Denis Naletov",
      alternateName: "Денис Налетов",
      jobTitle: "Founder, Economist & Full-Stack Developer",
      worksFor: { "@type": "Organization", name: "Upgrowplan" },
      url: `${SITE_URL}/about`,
      image: `${SITE_URL}/images/denis.jpg`,
      knowsAbout: [
        "Business planning",
        "Financial modelling",
        "LLM integration",
        "RAG architecture",
        "Market research",
        "UNIDO/EBRD standards",
      ],
      description:
        "15+ years of experience in business planning and consulting. Specialises in financial modelling, AI integration into business processes, and digital solutions for SMBs. Co-authored 230+ business plans.",
    },
    {
      "@type": "Person",
      name: "Natalia Kovaleva",
      alternateName: "Наталья Ковалева",
      jobTitle: "Economist & Business Analyst",
      worksFor: { "@type": "Organization", name: "Upgrowplan" },
      url: `${SITE_URL}/about`,
      image: `${SITE_URL}/images/kovaleva.jpg`,
      knowsAbout: [
        "Financial analysis",
        "Market research",
        "Investment attraction",
        "Business planning",
        "Management accounting",
        "Subsidies and grants",
      ],
      description:
        "Financial analyst with expertise in market research, business plans, feasibility studies, investment attraction, management accounting, and credit portfolio servicing.",
    },
    {
      "@type": "Person",
      name: "Dmitry Volkov",
      alternateName: "Дмитрий Волков",
      jobTitle: "Web Developer & Technical Specialist",
      worksFor: { "@type": "Organization", name: "Upgrowplan" },
      url: `${SITE_URL}/about`,
      image: `${SITE_URL}/images/dima.jpg`,
      knowsAbout: [
        "Backend development",
        "API integration",
        "Database management",
        "System optimisation",
        "Node.js",
        "Spring Boot",
      ],
      description:
        "Experienced developer specialising in server-side architecture and data processing. Handles API integrations, system optimisation, database management, and external service interactions.",
    },
  ];
}

// ─── About page FAQ ───────────────────────────────────────────────────────────
export function aboutFaqSchema(locale: "en" | "ru") {
  const isRu = locale === "ru";
  const items = isRu
    ? [
        {
          q: "Что такое Upgrowplan?",
          a: "Upgrowplan — ИИ-платформа для предпринимателей, аналитиков и консультантов. Автоматизирует создание бизнес-планов по стандартам ЮНИДО/ЕБРР, маркетинговые исследования, финансовое моделирование и конкурентный мониторинг. Основана в 2024 году в Тель-Авиве.",
        },
        {
          q: "Чем Upgrowplan отличается от ChatGPT?",
          a: "ChatGPT генерирует текст на основе обучающей выборки и может галлюцинировать. Upgrowplan использует архитектуру RAG: сначала агент поиска собирает живые данные из 50+ источников, затем Python-скрипты выполняют детерминированные финансовые расчёты, и только потом LLM обрабатывает верифицированный контекст при температуре ≤ 0,2. Встроенный Skeptic Agent проверяет каждый раздел на галлюцинации.",
        },
        {
          q: "Какие методологии используются в бизнес-планах?",
          a: "Бизнес-планы формируются по стандартам ЮНИДО (UNIDO) и ЕБРР (EBRD) — фреймворкам, которые используют банки развития и международные инвесторы. Финансовые расчёты выполняются детерминированными Python-скриптами, а не вероятностными моделями ИИ.",
        },
        {
          q: "Для кого подходят инструменты Upgrowplan?",
          a: "Для предпринимателей, которые готовят бизнес-план для банка или инвестора; для аналитиков, которым нужно быстрое исследование рынка; для консультантов, которые хотят автоматизировать рутинную часть работы; и для стартапов, которые проверяют гипотезы через виртуальные фокус-группы.",
        },
        {
          q: "Сколько стоит использование платформы?",
          a: "FinPilot (финансовые модели) и Relocation Service (открытие бизнеса за рубежом) — бесплатны. MarketSense AI Agent, PlanMaster AI, Synth Focus Lab и Business Pulse доступны по подписке. Актуальные тарифы — на странице каждого продукта.",
        },
      ]
    : [
        {
          q: "What is Upgrowplan?",
          a: "Upgrowplan is an AI platform for entrepreneurs, analysts and consultants. It automates business plan creation following UNIDO/EBRD standards, market research, financial modelling, and competitor monitoring. Founded in 2024 in Tel Aviv.",
        },
        {
          q: "How is Upgrowplan different from ChatGPT?",
          a: "ChatGPT generates text from its training data and can hallucinate. Upgrowplan uses RAG architecture: a search agent collects live data from 50+ sources, Python scripts run deterministic financial calculations, and only then does the LLM process the verified context at temperature ≤ 0.2. A built-in Skeptic Agent checks every section for hallucinations.",
        },
        {
          q: "What methodologies are used in the business plans?",
          a: "Business plans follow UNIDO and EBRD standards — frameworks used by development banks and international investors. Financial calculations use deterministic Python scripts, not probabilistic AI models.",
        },
        {
          q: "Who is Upgrowplan for?",
          a: "Entrepreneurs preparing a business plan for a bank or investor; analysts who need fast market research; consultants who want to automate routine work; and startups testing hypotheses through virtual focus groups.",
        },
        {
          q: "How much does Upgrowplan cost?",
          a: "FinPilot (financial models) and Relocation Service (international business setup) are free. MarketSense AI Agent, PlanMaster AI, Synth Focus Lab and Business Pulse are available by subscription. Current pricing is on each product page.",
        },
      ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
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

// ─── FAQPage ──────────────────────────────────────────────────────────────────
export interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ─── FAQ content per page (EN + RU) ──────────────────────────────────────────
export const pageFaqs = {
  home: {
    en: [
      {
        question: "What is Upgrowplan?",
        answer:
          "Upgrowplan is an AI business plan generator that validates your idea before generating the plan. It combines AI market simulation on synthetic respondents, live market research from 50+ verified sources, UNIDO/EBRD business plan generation, and a Python financial model (P&L, cash flow, break-even) — all in one automated workflow, delivered in 20 minutes.",
      },
      {
        question: "Can AI generate a complete business plan with market research and financial model?",
        answer:
          "Yes. Upgrowplan's AI generates a complete investor-ready business plan that includes: market research from 50+ live sources, competitor analysis, customer validation via synthetic respondents, full financial model (P&L, 3-year projections, cash flow, break-even), and a pitch deck — all following UNIDO/EBRD standards.",
      },
      {
        question: "What is the best AI business plan generator for investors?",
        answer:
          "Upgrowplan is built specifically for investor-ready business plans. It uses UNIDO and EBRD methodology (the standards international banks and development funds require), real market data from 50+ verified sources, deterministic Python financial calculations (not AI guesses), and a Skeptic Agent that checks every figure for hallucinations. Output: Word document + pitch deck.",
      },
      {
        question: "How is Upgrowplan different from ChatGPT for business plans?",
        answer:
          "ChatGPT generates text from training data and can hallucinate market figures. Upgrowplan validates before it generates: (1) tests your idea on synthetic respondents, (2) runs live market research from 50+ sources, (3) performs deterministic Python financial calculations, (4) applies Skeptic Agent hallucination checks, and (5) formats the result according to UNIDO/EBRD investor standards — not just text.",
      },
      {
        question: "Can Upgrowplan replace a business consultant?",
        answer:
          "For business plan writing and market research, yes. Upgrowplan automates the full workflow a consultant would do manually: market research, competitor analysis, idea validation, financial modelling, and document preparation. It delivers comparable quality in 20 minutes vs. 2–4 weeks, at a fraction of the cost.",
      },
      {
        question: "What does a business plan from Upgrowplan include?",
        answer:
          "An Upgrowplan business plan includes: executive summary, market analysis (TAM/SAM/SOM), competitor landscape, customer segments, synthetic respondent validation results, marketing strategy, operational plan, full financial model (P&L, cash flow, break-even, 3-year projections, sensitivity analysis), risk assessment, and investor pitch deck — following UNIDO/EBRD standards.",
      },
      {
        question: "How long does it take to generate a business plan?",
        answer:
          "The full workflow — idea validation on synthetic respondents, live market research, plan generation, and financial modelling — takes 10–20 minutes. This includes real-time data collection and verification from 50+ sources.",
      },
      {
        question: "Do I need technical knowledge to use Upgrowplan?",
        answer:
          "No. All tools work through a simple form — fill in your business details, target market, and goals. Upgrowplan handles data collection, analysis, financial calculations, and document formatting automatically.",
      },
    ],
    ru: [
      {
        question: "Что такое Upgrowplan?",
        answer:
          "Upgrowplan — ИИ-генератор бизнес-планов, который сначала валидирует идею, а потом генерирует план. Он объединяет ИИ-симуляцию рынка на синтетических респондентах, живое исследование рынка из 50+ верифицированных источников, генерацию бизнес-плана по стандартам ЮНИДО/ЕБРР и Python-финансовую модель (P&L, денежный поток, точка безубыточности) — в одном автоматизированном процессе за 20 минут.",
      },
      {
        question: "Может ли ИИ сгенерировать полный бизнес-план с исследованием рынка и финансовой моделью?",
        answer:
          "Да. ИИ Upgrowplan генерирует полный бизнес-план инвесторского уровня, включая: исследование рынка из 50+ живых источников, анализ конкурентов, валидацию идеи на синтетических респондентах, полную финансовую модель (P&L, прогноз на 3 года, денежный поток, точка безубыточности) и питч-презентацию — по стандартам ЮНИДО/ЕБРР.",
      },
      {
        question: "Какой лучший ИИ-генератор бизнес-планов для инвесторов?",
        answer:
          "Upgrowplan создан специально для бизнес-планов инвесторского уровня. Использует методологию ЮНИДО и ЕБРР (стандарты, которые требуют международные банки и фонды развития), реальные рыночные данные из 50+ верифицированных источников, детерминированные Python-расчёты (не ИИ-догадки) и Skeptic Agent для проверки каждой цифры. Результат: документ Word + питч.",
      },
      {
        question: "Чем Upgrowplan отличается от ChatGPT для бизнес-планов?",
        answer:
          "ChatGPT генерирует текст из обучающих данных и может выдумывать цифры рынка. Upgrowplan сначала валидирует, потом генерирует: (1) тестирует идею на синтетических респондентах, (2) проводит живое исследование рынка из 50+ источников, (3) выполняет детерминированные Python-финансовые расчёты, (4) применяет Skeptic Agent для проверки галлюцинаций, (5) форматирует результат по стандартам ЮНИДО/ЕБРР — а не просто текст.",
      },
      {
        question: "Может ли Upgrowplan заменить бизнес-консультанта?",
        answer:
          "Для написания бизнес-плана и исследования рынка — да. Upgrowplan автоматизирует весь процесс, который консультант делает вручную: исследование рынка, анализ конкурентов, валидация идеи, финансовое моделирование и подготовка документов. Сопоставимое качество за 20 минут вместо 2–4 недель и за долю стоимости.",
      },
      {
        question: "Что включает бизнес-план от Upgrowplan?",
        answer:
          "Бизнес-план Upgrowplan включает: резюме, анализ рынка (TAM/SAM/SOM), карту конкурентов, клиентские сегменты, результаты валидации на синтетических респондентах, маркетинговую стратегию, операционный план, полную финансовую модель (P&L, денежный поток, точка безубыточности, прогноз на 3 года, анализ чувствительности), оценку рисков и питч-презентацию — по стандартам ЮНИДО/ЕБРР.",
      },
      {
        question: "Сколько времени занимает генерация бизнес-плана?",
        answer:
          "Полный процесс — валидация идеи на синтетических респондентах, живое исследование рынка, генерация плана и финансовое моделирование — занимает 10–20 минут. Включает сбор и проверку данных в реальном времени из 50+ источников.",
      },
      {
        question: "Нужны ли технические знания для работы с Upgrowplan?",
        answer:
          "Нет. Все инструменты работают через простую форму — укажите детали бизнеса, целевой рынок и цели. Upgrowplan автоматически выполняет сбор данных, анализ, финансовые расчёты и форматирование документов.",
      },
    ],
  },
  planMaster: {
    en: [
      {
        question: "What is PlanMaster AI?",
        answer:
          "PlanMaster AI is an advanced business plan generator that uses live web search, verified data sources, and modern methodology to produce investor-ready business plans.",
      },
      {
        question: "What sections does a PlanMaster business plan include?",
        answer:
          "A generated plan includes: executive summary, market analysis, competitor research, financial projections (P&L, cash flow, break-even), marketing strategy, operational plan, and risk assessment.",
      },
      {
        question: "How does PlanMaster handle AI hallucinations?",
        answer:
          "PlanMaster uses a built-in Skeptic Agent that cross-checks generated data against live sources and flags unrealistic assumptions before finalising the document.",
      },
      {
        question: "Can I download the business plan as a Word document?",
        answer:
          "Yes. The final business plan is available for download as a .docx file, ready for presentation to investors, banks, or funds.",
      },
      {
        question: "Which countries and industries does PlanMaster support?",
        answer:
          "PlanMaster supports businesses in any country and industry. You select the country, currency, business type (B2B, B2C, etc.), and scale during setup.",
      },
    ],
    ru: [
      {
        question: "Что такое PlanMaster AI?",
        answer:
          "PlanMaster AI — продвинутый генератор бизнес-планов, использующий живой веб-поиск, проверенные источники данных и современную методологию для создания готовых к инвестированию бизнес-планов.",
      },
      {
        question: "Какие разделы включает бизнес-план от PlanMaster?",
        answer:
          "Сгенерированный план включает: резюме, анализ рынка, исследование конкурентов, финансовые прогнозы (P&L, денежный поток, точка безубыточности), маркетинговую стратегию, операционный план и оценку рисков.",
      },
      {
        question: "Как PlanMaster борется с галлюцинациями ИИ?",
        answer:
          "PlanMaster использует встроенного агента-скептика, который перекрёстно проверяет сгенерированные данные с живыми источниками и помечает нереалистичные предположения до финализации документа.",
      },
      {
        question: "Можно ли скачать бизнес-план в формате Word?",
        answer:
          "Да. Готовый бизнес-план доступен для скачивания в формате .docx, готовый к презентации инвесторам, банкам или фондам.",
      },
      {
        question: "Какие страны и отрасли поддерживает PlanMaster?",
        answer:
          "PlanMaster поддерживает бизнес в любой стране и отрасли. Вы выбираете страну, валюту, тип бизнеса (B2B, B2C и др.) и масштаб при настройке.",
      },
    ],
  },
  marketResearch: {
    en: [
      {
        question: "What is AI market research?",
        answer:
          "AI market research is an automated analysis of your target market using artificial intelligence — including competitor mapping, trend identification, customer segmentation, and market size estimation.",
      },
      {
        question: "What data sources does MarketSense AI use?",
        answer:
          "MarketSense AI pulls from 10+ live sources including Google Maps, Statista, open web data, and industry databases, then verifies and synthesises the findings.",
      },
      {
        question: "How is this different from a manual market research report?",
        answer:
          "A manual report from a consultant takes 2–4 weeks and costs thousands. MarketSense AI delivers a comparable report in 10–30 minutes at a fraction of the cost.",
      },
      {
        question: "Can I customise the research for my specific city or niche?",
        answer:
          "Yes. You can specify the country, city, industry, and target audience. The AI adapts the research scope and competitor search accordingly.",
      },
    ],
    ru: [
      {
        question: "Что такое ИИ-исследование рынка?",
        answer:
          "ИИ-исследование рынка — автоматизированный анализ целевого рынка с помощью искусственного интеллекта: картирование конкурентов, выявление трендов, сегментация клиентов и оценка объёма рынка.",
      },
      {
        question: "Какие источники данных использует MarketSense AI?",
        answer:
          "MarketSense AI использует 10+ живых источников, включая Google Maps, Statista, открытые веб-данные и отраслевые базы, затем верифицирует и синтезирует результаты.",
      },
      {
        question: "Чем это отличается от ручного исследования рынка?",
        answer:
          "Ручной отчёт от консультанта занимает 2–4 недели и стоит тысячи рублей. MarketSense AI предоставляет сопоставимый отчёт за 10–30 минут по значительно меньшей цене.",
      },
      {
        question: "Можно ли настроить исследование под конкретный город или нишу?",
        answer:
          "Да. Вы можете указать страну, город, отрасль и целевую аудиторию. ИИ адаптирует охват исследования и поиск конкурентов под ваши параметры.",
      },
    ],
  },
  synthFocusLab: {
    en: [
      {
        question: "What is Synth Focus Lab?",
        answer:
          "Synth Focus Lab is an AI tool that creates virtual focus groups using synthetic respondents — AI personas with defined demographics, income, age, and preferences — to simulate real audience reactions.",
      },
      {
        question: "Why use virtual respondents instead of real people?",
        answer:
          "Recruiting real participants takes weeks and is expensive. Virtual respondents are available instantly, can be configured for any demographic, and provide consistent, unbiased responses.",
      },
      {
        question: "How realistic are the AI respondents?",
        answer:
          "Each persona is built from detailed demographic, social, and financial parameters. Responses are generated based on these profiles and calibrated against real behavioural data patterns.",
      },
    ],
    ru: [
      {
        question: "Что такое Synth Focus Lab?",
        answer:
          "Synth Focus Lab — ИИ-инструмент для создания виртуальных фокус-групп с синтетическими респондентами — ИИ-персонами с заданными демографией, доходом, возрастом и предпочтениями — для симуляции реакций целевой аудитории.",
      },
      {
        question: "Зачем использовать виртуальных респондентов вместо реальных?",
        answer:
          "Рекрутинг реальных участников занимает недели и стоит дорого. Виртуальные респонденты доступны мгновенно, настраиваются под любую демографию и дают стабильные, непредвзятые ответы.",
      },
      {
        question: "Насколько реалистичны ИИ-респонденты?",
        answer:
          "Каждая персона строится на основе детальных демографических, социальных и финансовых параметров. Ответы генерируются на основе этих профилей и калиброваны по реальным поведенческим паттернам.",
      },
    ],
  },
  finBuddy: {
    en: [
      {
        question: "What is Fin Buddy?",
        answer:
          "Fin Buddy is Upgrowplan's AI-assisted financial modelling tool for founders and analysts. It helps build P&L, cash flow, break-even, and scenario-based forecasts faster than manual spreadsheets.",
      },
      {
        question: "Who should use Fin Buddy?",
        answer:
          "Fin Buddy is designed for startup founders, small business owners, consultants, and analysts who need fast financial projections for planning, fundraising, or internal decision-making.",
      },
      {
        question: "What outputs can Fin Buddy generate?",
        answer:
          "Fin Buddy can generate core business finance outputs such as revenue projections, operating cost models, gross margin estimates, break-even analysis, and simple scenario comparisons.",
      },
    ],
    ru: [
      {
        question: "Что такое Fin Buddy?",
        answer:
          "Fin Buddy — это инструмент Upgrowplan для финансового моделирования с ИИ. Он помогает быстрее собирать P&L, cash flow, точку безубыточности и сценарные прогнозы, чем ручная работа в таблицах.",
      },
      {
        question: "Для кого подходит Fin Buddy?",
        answer:
          "Fin Buddy подходит фаундерам стартапов, владельцам малого бизнеса, консультантам и аналитикам, которым нужны быстрые финансовые прогнозы для планирования, привлечения инвестиций и внутренних решений.",
      },
      {
        question: "Какие результаты выдаёт Fin Buddy?",
        answer:
          "Fin Buddy помогает строить прогноз выручки, модель расходов, оценку маржинальности, анализ точки безубыточности и простые сравнения сценариев.",
      },
    ],
  },
  openAbroad: {
    en: [
      {
        question: "What is Open Abroad?",
        answer:
          "Open Abroad is Upgrowplan's AI-assisted relocation and market entry tool. It helps compare countries, regulatory factors, and market conditions for international expansion.",
      },
      {
        question: "Who is Open Abroad for?",
        answer:
          "Open Abroad is useful for founders, small business owners, and consultants evaluating where to relocate a company, launch a new entity, or expand into a new international market.",
      },
      {
        question: "What does Open Abroad analyse?",
        answer:
          "The tool analyses country-specific business conditions such as taxation, legal setup, documentation, market accessibility, and practical expansion considerations.",
      },
    ],
    ru: [
      {
        question: "Что такое Open Abroad?",
        answer:
          "Open Abroad — это инструмент Upgrowplan для оценки релокации и выхода на зарубежные рынки с помощью ИИ. Он помогает сравнивать страны, регуляторные условия и рыночную среду.",
      },
      {
        question: "Для кого подходит Open Abroad?",
        answer:
          "Open Abroad полезен фаундерам, владельцам малого бизнеса и консультантам, которые выбирают страну для релокации компании, открытия юрлица или международной экспансии.",
      },
      {
        question: "Что анализирует Open Abroad?",
        answer:
          "Инструмент анализирует налоги, юридические условия, требования к документам, доступность рынка и практические факторы выхода в новую страну.",
      },
    ],
  },
  socialPlanMaster: {
    en: [
      {
        question: "What is Social Plan Master?",
        answer:
          "Social Plan Master is Upgrowplan's AI social media strategy tool. It helps define content direction, audience priorities, and platform-specific messaging for business growth.",
      },
      {
        question: "Who should use Social Plan Master?",
        answer:
          "It is designed for founders, marketers, consultants, and small teams that need a structured social media plan without building one manually from scratch.",
      },
      {
        question: "What does Social Plan Master produce?",
        answer:
          "The tool helps generate content themes, audience insights, channel recommendations, and a more consistent social media plan aligned with business goals.",
      },
    ],
    ru: [
      {
        question: "Что такое Social Plan Master?",
        answer:
          "Social Plan Master — это инструмент Upgrowplan для построения стратегии в социальных сетях с помощью ИИ. Он помогает определить контентные направления, приоритеты аудитории и позиционирование по платформам.",
      },
      {
        question: "Для кого подходит Social Plan Master?",
        answer:
          "Он подходит фаундерам, маркетологам, консультантам и небольшим командам, которым нужна структурная стратегия в соцсетях без ручной сборки с нуля.",
      },
      {
        question: "Что выдаёт Social Plan Master?",
        answer:
          "Инструмент помогает формировать контентные темы, инсайты по аудитории, рекомендации по каналам и более последовательный social media plan, связанный с бизнес-целями.",
      },
    ],
  },
  solutions: {
    en: [
      {
        question: "What AI tools does Upgrowplan offer?",
        answer:
          "Upgrowplan offers 7 AI tools: PlanMaster AI (business plans following UNIDO/EBRD standards), MarketSense AI Agent (market research in 15 min from 50+ sources), Synth Focus Lab (virtual AI focus groups), Business Pulse (daily competitor monitoring), FinPilot Free (financial modelling, free), Open Abroad (international expansion planning, free), and Social Plan Master (AI social media strategy).",
      },
      {
        question: "How is Upgrowplan different from ChatGPT for business planning?",
        answer:
          "ChatGPT uses training data that can be outdated and generates probabilistic outputs prone to hallucinations. Upgrowplan uses RAG architecture: a dedicated search agent collects live data from 50+ verified sources, Python scripts run deterministic financial calculations, and the LLM only processes verified context at temperature ≤ 0.2. A Skeptic Agent checks every section before delivery.",
      },
      {
        question: "What does UNIDO/EBRD standard mean for a business plan?",
        answer:
          "UNIDO (UN Industrial Development Organization) and EBRD (European Bank for Reconstruction and Development) frameworks are the international standards used by development banks and institutional investors to evaluate business plans. Plans following these standards have a defined structure: executive summary, market analysis, production/service plan, organisational structure, financial model, and risk assessment — making them suitable for bank financing and investor presentations.",
      },
      {
        question: "Which tools are free?",
        answer:
          "FinPilot Free (financial models: P&L, cash flow, break-even, 3-year projections) and Open Abroad / Relocation Service (international business setup guide for 50+ countries) are completely free. Other tools are available on a subscription or pay-per-use basis.",
      },
      {
        question: "Can I use Upgrowplan tools for an existing business?",
        answer:
          "Yes. All tools work for both startups and established businesses. Business Pulse and MarketSense AI are especially useful for ongoing competitive monitoring and market tracking. PlanMaster can generate strategic plans for expansion, new product lines, or investor pitches.",
      },
    ],
    ru: [
      {
        question: "Какие ИИ-инструменты предлагает Upgrowplan?",
        answer:
          "Upgrowplan предлагает 7 ИИ-инструментов: PlanMaster AI (бизнес-планы по стандартам ЮНИДО/ЕБРР), MarketSense AI Agent (исследование рынка за 15 мин из 50+ источников), Synth Focus Lab (виртуальные ИИ-фокус-группы), Business Pulse (ежедневный мониторинг конкурентов), FinPilot Free (финансовое моделирование, бесплатно), Open Abroad (планирование выхода на международный рынок, бесплатно) и Social Plan Master (ИИ-стратегия в соцсетях).",
      },
      {
        question: "Чем Upgrowplan отличается от ChatGPT для бизнес-планирования?",
        answer:
          "ChatGPT использует обучающие данные, которые могут быть устаревшими, и генерирует вероятностные ответы, склонные к галлюцинациям. Upgrowplan использует архитектуру RAG: отдельный агент поиска собирает живые данные из 50+ верифицированных источников, Python-скрипты выполняют детерминированные финансовые расчёты, и LLM обрабатывает только проверенный контекст при температуре ≤ 0,2. Skeptic Agent проверяет каждый раздел перед выдачей.",
      },
      {
        question: "Что означает стандарт ЮНИДО/ЕБРР для бизнес-плана?",
        answer:
          "ЮНИДО (Организация ООН по промышленному развитию) и ЕБРР (Европейский банк реконструкции и развития) — международные стандарты, которые используют банки развития и институциональные инвесторы при оценке бизнес-планов. Планы по этим стандартам имеют чёткую структуру: резюме, анализ рынка, производственный план, организационная структура, финансовая модель и оценка рисков — что делает их подходящими для банковского финансирования и инвесторских презентаций.",
      },
      {
        question: "Какие инструменты бесплатны?",
        answer:
          "FinPilot Free (финансовые модели: P&L, денежные потоки, точка безубыточности, прогноз на 3 года) и Open Abroad / Relocation Service (руководство по открытию бизнеса за рубежом для 50+ стран) — полностью бесплатны. Остальные инструменты доступны по подписке или по модели оплаты за использование.",
      },
      {
        question: "Можно ли использовать инструменты Upgrowplan для действующего бизнеса?",
        answer:
          "Да. Все инструменты работают как для стартапов, так и для действующих компаний. Business Pulse и MarketSense AI особенно полезны для постоянного мониторинга конкурентов и отслеживания рынка. PlanMaster может создавать стратегические планы для расширения, новых продуктовых линеек или инвесторских презентаций.",
      },
    ],
  },
  planMasterDescription: {
    en: [
      {
        question: "What methodology does PlanMaster use to build a business plan?",
        answer:
          "PlanMaster follows UNIDO and EBRD standards — the same frameworks used by international development banks. The plan includes executive summary, market analysis, competitive landscape, financial model, and risk assessment.",
      },
      {
        question: "How does PlanMaster verify data accuracy?",
        answer:
          "A built-in Skeptic Agent cross-checks every key figure against live web sources. If a number looks unrealistic — like a 90% market share or 200% margins — it flags the assumption and suggests a correction.",
      },
      {
        question: "What file formats can I download?",
        answer:
          "The finished business plan is available as a .docx (Word) file, ready to send to investors, banks, or grant committees without additional formatting.",
      },
      {
        question: "Can I generate a plan for any country and currency?",
        answer:
          "Yes. PlanMaster supports any country and automatically adapts currency, tax assumptions, and market context. USA, UK, Germany, Russia, Israel, India and more are pre-configured.",
      },
    ],
    ru: [
      {
        question: "Какую методологию использует PlanMaster для построения бизнес-плана?",
        answer:
          "PlanMaster следует стандартам UNIDO и ЕБРР — тем же методологиям, которые используют международные банки развития. План включает резюме, анализ рынка, конкурентную среду, финансовую модель и оценку рисков.",
      },
      {
        question: "Как PlanMaster проверяет точность данных?",
        answer:
          "Встроенный агент-скептик перекрёстно проверяет каждую ключевую цифру по живым веб-источникам. Если показатель выглядит нереалистично — например, доля рынка 90% или маржа 200% — он помечает предположение и предлагает корректировку.",
      },
      {
        question: "В каких форматах можно скачать документ?",
        answer:
          "Готовый бизнес-план доступен в формате .docx (Word), готовый к отправке инвесторам, банкам или грантовым комитетам без дополнительного форматирования.",
      },
      {
        question: "Можно ли создать план для любой страны и валюты?",
        answer:
          "Да. PlanMaster поддерживает любую страну и автоматически адаптирует валюту, налоговые допущения и рыночный контекст. США, Великобритания, Германия, Россия, Израиль, Индия и другие — предварительно настроены.",
      },
    ],
  },
  marketResearchDescription: {
    en: [
      {
        question: "What does a market research report include?",
        answer:
          "A MarketSense report includes: market size and growth forecast, competitor mapping (up to 20 players), customer segmentation, demand trends, pricing benchmarks, and strategic recommendations — all sourced from live data.",
      },
      {
        question: "How long does market research take?",
        answer:
          "Most reports are ready in 7–15 minutes. Complex multi-city or multi-segment analyses may take longer. Compare that to 2–4 weeks for a traditional research agency.",
      },
      {
        question: "What sources does the service use?",
        answer:
          "MarketSense uses up to 50 verified sources: competitor websites, service aggregators, tax and regulatory resources, Google Maps, Statista, open business registries, news databases, and industry reports. Every data point is tagged with its source for full transparency.",
      },
      {
        question: "Can I use the report to pitch to investors?",
        answer:
          "Yes. The report is structured for business use — with clear sections, data visualisations, and source references. It can be downloaded and included in investor decks or strategic documents.",
      },
      {
        question: "What is AI market research?",
        answer:
          "AI market research is automated analysis where artificial intelligence collects and processes competitor data, audience insights, and market trends in minutes instead of weeks. MarketSense AI generates a structured report adapted to a specific jurisdiction and industry.",
      },
      {
        question: "How does AI conduct market research?",
        answer:
          "MarketSense AI uses a multi-agent RAG architecture: specialized agents analyze competitive landscape, consumer demand, price segments, and market trends in parallel. A Skeptic Agent verifies conclusions for contradictions, producing a verified report in 8–15 minutes.",
      },
      {
        question: "How is AI market research different from manual analysis?",
        answer:
          "Manual analysis takes 2–4 weeks and costs from $2,000. MarketSense AI delivers a comparable depth report in 15 minutes, enabling you to test multiple hypotheses in a single day and make data-driven decisions faster.",
      },
    ],
    ru: [
      {
        question: "Что включает маркетинговое исследование рынка?",
        answer:
          "Отчёт MarketSense включает: объём рынка и прогноз роста, картирование конкурентов (до 20 игроков), сегментацию клиентов, тренды спроса, ценовые бенчмарки и стратегические рекомендации — всё на основе живых данных.",
      },
      {
        question: "Сколько времени занимает исследование рынка?",
        answer:
          "Большинство отчётов готовы за 7–15 минут. Сложные многогородские или многосегментные анализы могут занять больше времени. Для сравнения: традиционное исследовательское агентство тратит 2–4 недели.",
      },
      {
        question: "Какие источники использует сервис?",
        answer:
          "MarketSense использует до 50 верифицированных источников: сайты конкурентов, агрегаторы услуг, налоговые и регуляционные ресурсы, Google Maps, Statista, открытые бизнес-реестры, новостные базы данных и отраслевые отчёты. Каждый показатель помечен источником для полной прозрачности.",
      },
      {
        question: "Можно ли использовать отчёт для питча инвесторам?",
        answer:
          "Да. Отчёт структурирован для делового использования — с чёткими разделами, визуализацией данных и ссылками на источники. Его можно скачать и включить в инвесторские презентации или стратегические документы.",
      },
      {
        question: "Что такое ИИ-маркетинговое исследование?",
        answer:
          "ИИ-маркетинговое исследование — автоматизированный анализ рынка, при котором ИИ собирает и обрабатывает данные о конкурентах, целевой аудитории и трендах за минуты вместо недель. MarketSense AI генерирует структурированный отчёт, адаптированный под конкретную юрисдикцию и отрасль.",
      },
      {
        question: "Как ИИ проводит маркетинговое исследование?",
        answer:
          "MarketSense AI использует мультиагентную архитектуру RAG: специализированные агенты анализируют конкурентную среду, потребительский спрос, ценовые сегменты и тренды параллельно. Скептик-агент проверяет выводы на противоречия, выдавая верифицированный отчёт за 8–15 минут.",
      },
      {
        question: "Чем ИИ-исследование отличается от ручного анализа рынка?",
        answer:
          "Ручной анализ занимает 2–4 недели и стоит от 150 000 ₽. MarketSense AI выдаёт сопоставимый по глубине отчёт за 15 минут, позволяя проверить несколько гипотез за один день и принимать решения на основе данных.",
      },
    ],
  },
  synthFocusLabDescription: {
    en: [
      {
        question: "How do I set up a virtual focus group?",
        answer:
          "You define your target audience parameters (age, income, location, lifestyle), describe the product or concept to test, and the AI generates a panel of synthetic respondents who discuss and react to it.",
      },
      {
        question: "What types of research can I run with Synth Focus Lab?",
        answer:
          "You can run: concept testing, product feedback, pricing sensitivity, brand perception, ad copy testing, and UX feedback sessions — all with a configurable audience.",
      },
      {
        question: "How many respondents can I include in a session?",
        answer:
          "You can configure panels from 5 to 50+ synthetic respondents, each with independent demographic and behavioural profiles. Larger panels surface more diverse perspectives.",
      },
    ],
    ru: [
      {
        question: "Как настроить виртуальную фокус-группу?",
        answer:
          "Вы задаёте параметры целевой аудитории (возраст, доход, геолокация, образ жизни), описываете продукт или концепцию для тестирования, и ИИ генерирует панель синтетических респондентов, которые обсуждают и реагируют на неё.",
      },
      {
        question: "Какие виды исследований можно проводить в Synth Focus Lab?",
        answer:
          "Вы можете проводить: тестирование концепций, обратную связь по продукту, чувствительность к цене, восприятие бренда, тестирование рекламных текстов и UX-сессии — всё с настраиваемой аудиторией.",
      },
      {
        question: "Сколько респондентов можно включить в сессию?",
        answer:
          "Вы можете настроить панели от 5 до 50+ синтетических респондентов, каждый с независимым демографическим и поведенческим профилем. Более крупные панели выявляют более разнообразные точки зрения.",
      },
    ],
  },
  blog: {
    en: [
      {
        question: "What topics does the Upgrowplan blog cover?",
        answer:
          "The Upgrowplan blog covers AI business planning, market research strategies, competitor analysis, financial modelling, startup fundraising, and practical entrepreneurship guides — with real case studies and data-backed insights.",
      },
      {
        question: "How long does it take to write a business plan with AI?",
        answer:
          "With Upgrowplan's PlanMaster AI, a complete investor-ready business plan is generated in 5–10 minutes. This includes market analysis, financial projections (P&L, cash flow, break-even), competitor research, and risk assessment.",
      },
      {
        question: "What is AI market research and how is it different from traditional research?",
        answer:
          "AI market research uses artificial intelligence to automatically collect, analyse, and synthesise market data from multiple live sources. Unlike traditional research (which takes 2–4 weeks and costs thousands), AI market research delivers a comparable report in 10–30 minutes at a fraction of the cost.",
      },
      {
        question: "Can AI replace a business consultant for writing a business plan?",
        answer:
          "For the structural and analytical parts of a business plan — market analysis, financials, competitor mapping — AI tools like PlanMaster deliver consultant-quality output in minutes. Human expertise remains valuable for unique strategic decisions and investor relationship building.",
      },
      {
        question: "What should a good AI-generated business plan include?",
        answer:
          "A complete AI business plan should include: executive summary, market size and growth analysis, competitor landscape, target customer segments, product/service description, marketing and sales strategy, operational plan, financial projections (P&L, cash flow, break-even), and risk assessment. PlanMaster generates all of these sections automatically.",
      },
    ],
    ru: [
      {
        question: "О чём пишет блог Upgrowplan?",
        answer:
          "Блог Upgrowplan освещает темы бизнес-планирования с ИИ, стратегий исследования рынка, анализа конкурентов, финансового моделирования, привлечения инвестиций и практического предпринимательства — с реальными кейсами и аналитикой.",
      },
      {
        question: "Сколько времени занимает составление бизнес-плана с ИИ?",
        answer:
          "С PlanMaster AI от Upgrowplan полный бизнес-план для инвесторов генерируется за 5–10 минут. Это включает анализ рынка, финансовые прогнозы (P&L, денежный поток, точка безубыточности), исследование конкурентов и оценку рисков.",
      },
      {
        question: "Что такое ИИ-исследование рынка и чем оно отличается от традиционного?",
        answer:
          "ИИ-исследование рынка использует искусственный интеллект для автоматического сбора, анализа и синтеза рыночных данных из множества живых источников. В отличие от традиционного исследования (2–4 недели, стоимость тысячи рублей), ИИ-инструмент даёт сопоставимый отчёт за 10–30 минут.",
      },
      {
        question: "Может ли ИИ заменить бизнес-консультанта при написании бизнес-плана?",
        answer:
          "Для структурных и аналитических частей бизнес-плана — анализ рынка, финансы, конкуренты — ИИ-инструменты вроде PlanMaster дают результат уровня консультанта за минуты. Экспертиза человека остаётся ценной для уникальных стратегических решений и выстраивания отношений с инвесторами.",
      },
      {
        question: "Что должен включать качественный бизнес-план, созданный с помощью ИИ?",
        answer:
          "Полноценный бизнес-план должен включать: резюме, анализ объёма и роста рынка, конкурентную среду, целевые сегменты клиентов, описание продукта/услуги, маркетинговую и операционную стратегию, финансовые прогнозы (P&L, денежный поток, точка безубыточности) и оценку рисков. PlanMaster генерирует все эти разделы автоматически.",
      },
    ],
  },
  aiBizPlanGenerator: {
    en: [
      {
        question: "What does an AI business plan generator produce?",
        answer: "Upgrowplan's PlanMaster AI generates a complete investor-ready business plan: executive summary, market analysis with competitor mapping, financial model (P&L, cash flow, break-even, 3-year projections), marketing strategy, operational plan, and risk assessment — delivered as a Word (.docx) file plus a pitch deck.",
      },
      {
        question: "How long does it take to generate a business plan with AI?",
        answer: "The full process takes 10–20 minutes. The AI needs time to collect live data from 50+ verified sources, run Python-based financial calculations, and pass each section through Skeptic Agent validation before producing the final document.",
      },
      {
        question: "What makes this different from ChatGPT or a business plan template?",
        answer: "Templates are static — they don't include your actual market data. ChatGPT generates text from training data and can hallucinate numbers. PlanMaster uses RAG architecture: a search agent collects live competitor prices, market size, and industry data; Python scripts run deterministic financial calculations; and a Skeptic Agent cross-checks every figure before the document is produced.",
      },
      {
        question: "Does the AI business plan follow UNIDO or EBRD standards?",
        answer: "Yes. PlanMaster generates plans following UNIDO (UN Industrial Development Organization) and EBRD (European Bank for Reconstruction and Development) frameworks — the international standards used by development banks and institutional investors. This structure is accepted by banks, grant committees, and investment funds.",
      },
      {
        question: "Can I get a pitch deck as well as the business plan?",
        answer: "Yes. In addition to the Word business plan document, PlanMaster generates a pitch deck summarising the key investment thesis, market opportunity, financials, and competitive positioning.",
      },
      {
        question: "Which countries and industries does the AI business plan generator support?",
        answer: "PlanMaster supports any country and industry. You specify the country, city, currency, and business type (B2B, B2C, B2B2C). The system adapts tax assumptions, market context, and financial benchmarks automatically.",
      },
      {
        question: "How do I write a business plan with AI?",
        answer: "With PlanMaster AI: describe your business idea and target market, set the country and business type, and the system automatically collects live market data, builds a financial model using Python calculations, validates every figure through Skeptic Agent, and delivers a complete Word document with pitch deck in 10–20 minutes.",
      },
      {
        question: "What is the best AI tool for writing a business plan?",
        answer: "The best AI business plan tool collects live market data (not training-data guesses), runs real financial calculations, and validates output before delivery. PlanMaster AI does all three: RAG-based live search, deterministic Python financial modelling, and Skeptic Agent validation — following UNIDO/EBRD international standards.",
      },
    ],
    ru: [
      {
        question: "Что выдаёт ИИ-генератор бизнес-планов?",
        answer: "PlanMaster AI от Upgrowplan генерирует полноценный бизнес-план для инвесторов: резюме, анализ рынка с картой конкурентов, финансовая модель (P&L, денежный поток, точка безубыточности, прогноз на 3 года), маркетинговая стратегия, операционный план и оценка рисков — в формате Word (.docx) плюс питч-презентация.",
      },
      {
        question: "Сколько времени занимает генерация бизнес-плана с ИИ?",
        answer: "Полный процесс занимает 10–20 минут. ИИ собирает живые данные из 50+ верифицированных источников, выполняет финансовые расчёты на Python и проверяет каждый раздел через Skeptic Agent перед выдачей документа.",
      },
      {
        question: "Чем это отличается от ChatGPT или шаблона бизнес-плана?",
        answer: "Шаблоны статичны — в них нет ваших реальных рыночных данных. ChatGPT генерирует текст на основе обучающих данных и может галлюцинировать. PlanMaster использует RAG-архитектуру: агент поиска собирает живые данные о конкурентах и рынке, Python-скрипты выполняют детерминированные расчёты, а Skeptic Agent проверяет каждую цифру.",
      },
      {
        question: "Соответствует ли бизнес-план стандартам ЮНИДО или ЕБРР?",
        answer: "Да. PlanMaster генерирует планы по стандартам ЮНИДО (Организация ООН по промышленному развитию) и ЕБРР (Европейский банк реконструкции и развития) — международным стандартам, которые используют банки развития и институциональные инвесторы. Такая структура принимается банками, грантовыми комитетами и инвестиционными фондами.",
      },
      {
        question: "Можно ли получить питч-презентацию вместе с бизнес-планом?",
        answer: "Да. Помимо Word-документа, PlanMaster генерирует питч-презентацию с ключевым инвестиционным тезисом, анализом рынка, финансами и конкурентным позиционированием.",
      },
      {
        question: "Какие страны и отрасли поддерживает генератор?",
        answer: "PlanMaster поддерживает любую страну и отрасль. Вы указываете страну, город, валюту и тип бизнеса (B2B, B2C, B2B2C). Система автоматически адаптирует налоговые допущения, рыночный контекст и финансовые бенчмарки.",
      },
      {
        question: "Как написать бизнес-план с помощью ИИ?",
        answer: "С PlanMaster AI: опишите бизнес-идею и целевой рынок, укажите страну и тип бизнеса — система автоматически соберёт живые рыночные данные, построит финансовую модель на Python-расчётах, проверит каждую цифру через Skeptic Agent и выдаст готовый Word-документ с питч-презентацией за 10–20 минут.",
      },
      {
        question: "Какой ИИ лучше всего подходит для написания бизнес-плана?",
        answer: "Лучший ИИ для бизнес-плана собирает живые рыночные данные (не угадывает из обучающей выборки), выполняет реальные финансовые расчёты и валидирует результат перед выдачей. PlanMaster AI делает всё три: RAG-поиск живых данных, детерминированное финансовое моделирование на Python и проверка Skeptic Agent — по стандартам ЮНИДО/ЕБРР.",
      },
    ],
  },
  whyUpgrowplan: {
    en: [
      {
        question: "What is the main difference between Upgrowplan and ChatGPT for business planning?",
        answer: "ChatGPT generates text from training data — it cannot access current market prices, competitor data, or real financial benchmarks. It produces plausible-sounding but often inaccurate numbers. Upgrowplan uses RAG: a live search agent collects real data from 50+ sources, Python scripts run deterministic financial calculations, and a Skeptic Agent validates every figure before the document is produced.",
      },
      {
        question: "How does Upgrowplan prevent AI hallucinations?",
        answer: "Every business plan goes through a three-layer validation: (1) Search agents collect live data from verified sources before any text is generated. (2) Financial calculations use deterministic Python scripts — not probabilistic AI estimates. (3) A Skeptic Agent reviews each section, flags unrealistic assumptions (e.g. 90% market share, 300% margins), and requires corrections before finalising.",
      },
      {
        question: "How does Upgrowplan compare to Upmetrics or LivePlan?",
        answer: "Upmetrics and LivePlan are template-and-wizard tools — you fill in the data, they format the document. Upgrowplan actively researches the market, finds your competitors, sizes the opportunity, builds the financial model from your inputs, and validates the output. The result is a data-backed document, not a formatted template.",
      },
      {
        question: "Is Upgrowplan cheaper than hiring a business plan consultant?",
        answer: "A professional business plan consultant typically charges $1,500–$5,000 and takes 2–4 weeks. Upgrowplan produces a comparable investor-ready document in 10–20 minutes at a fraction of the cost — with live market data and structured financial modelling included.",
      },
      {
        question: "Does Upgrowplan follow recognised international standards?",
        answer: "Yes. Plans follow UNIDO (UN Industrial Development Organization) and EBRD (European Bank for Reconstruction and Development) frameworks — the standards used by development banks, grant committees, and international investors to evaluate submissions.",
      },
    ],
    ru: [
      {
        question: "В чём главное отличие Upgrowplan от ChatGPT для бизнес-планирования?",
        answer: "ChatGPT генерирует текст на основе обучающих данных — он не может получить актуальные рыночные цены, данные конкурентов или реальные финансовые бенчмарки. Он выдаёт правдоподобно звучащие, но часто неточные цифры. Upgrowplan использует RAG: агент живого поиска собирает данные из 50+ источников, Python-скрипты выполняют детерминированные расчёты, а Skeptic Agent проверяет каждую цифру.",
      },
      {
        question: "Как Upgrowplan предотвращает галлюцинации ИИ?",
        answer: "Каждый бизнес-план проходит трёхуровневую проверку: (1) Агенты поиска собирают живые данные из верифицированных источников до генерации текста. (2) Финансовые расчёты выполняются детерминированными Python-скриптами, а не вероятностными моделями. (3) Skeptic Agent проверяет каждый раздел, помечает нереалистичные допущения (доля рынка 90%, маржа 300%) и требует исправлений.",
      },
      {
        question: "Как Upgrowplan сравнивается с Upmetrics или другими конструкторами?",
        answer: "Upmetrics и LivePlan — это инструменты по шаблону: вы вводите данные, они форматируют документ. Upgrowplan активно исследует рынок, находит конкурентов, оценивает объём возможности, строит финансовую модель из ваших вводных и валидирует результат. Итог — документ на основе реальных данных, а не отформатированный шаблон.",
      },
      {
        question: "Дешевле ли Upgrowplan, чем нанять консультанта?",
        answer: "Профессиональный консультант по бизнес-планам берёт 100 000–400 000 руб. и тратит 2–4 недели. Upgrowplan создаёт сопоставимый документ инвесторского качества за 10–20 минут — с живыми рыночными данными и структурированным финансовым моделированием.",
      },
      {
        question: "Соответствует ли Upgrowplan признанным международным стандартам?",
        answer: "Да. Планы следуют стандартам ЮНИДО (Организация ООН по промышленному развитию) и ЕБРР (Европейский банк реконструкции и развития) — стандартам, которые используют банки развития, грантовые комитеты и международные инвесторы.",
      },
    ],
  },
  syntheticCustomerResearch: {
    en: [
      {
        question: "What are synthetic respondents?",
        answer:
          "Synthetic respondents are AI personas with defined demographics, income level, age, lifestyle, and behaviour patterns. They simulate how real buyers would react to your product, price, or message — without recruiting actual participants.",
      },
      {
        question: "How accurate are synthetic respondents compared to real focus groups?",
        answer:
          "Research comparing AI synthetic panels to traditional focus groups shows 85–92% alignment in purchase intent and sentiment direction. Synthetic respondents are best for early-stage validation, concept testing, and pricing research — where speed and cost matter most.",
      },
      {
        question: "How is this different from a traditional focus group?",
        answer:
          "Traditional focus groups take 2–4 weeks to recruit, cost $3,000–$10,000 per session, and are limited by geography. Synthetic respondents are available in minutes, cost a fraction of the price, and can be configured for any demographic or geography instantly.",
      },
      {
        question: "Can I test pricing sensitivity with synthetic respondents?",
        answer:
          "Yes. One of the most valuable use cases is pricing research. You can configure panels to test willingness-to-pay at different price points — simulating the Van Westendorp model or conjoint-style analysis without the logistics of a real survey.",
      },
      {
        question: "Which tool does Upgrowplan use for synthetic respondent research?",
        answer:
          "Upgrowplan's Synth Focus Lab creates virtual focus groups with AI synthetic respondents. You define your audience, describe the concept, and receive structured feedback — purchase intent, objections, sentiment, and actionable insights.",
      },
      {
        question: "What types of research can I run?",
        answer:
          "Concept testing, product-market fit validation, pricing sensitivity, brand perception, ad copy testing, UX feedback, and competitive positioning — all with a configurable audience of 5 to 50+ AI personas.",
      },
      {
        question: "How do I validate a business idea without real surveys?",
        answer: "Use synthetic respondents. Configure an AI panel matching your target audience — age, income, lifestyle, purchase behaviour — describe your concept or product, and receive structured feedback: purchase intent score, top objections, sentiment direction, and pricing insights. No recruiting, no scheduling, no waiting. Results in 15 minutes.",
      },
      {
        question: "What is the fastest way to test a business idea before launch?",
        answer: "Synth Focus Lab lets you test a business idea on a virtual buyer panel in 15 minutes. AI synthetic respondents simulate how your target segment reacts to your concept, pricing, and messaging — giving you 85–92% accurate feedback compared to real focus groups, at a fraction of the cost and time.",
      },
    ],
    ru: [
      {
        question: "Что такое синтетические респонденты?",
        answer:
          "Синтетические респонденты — это ИИ-персоны с заданными демографией, уровнем дохода, возрастом, образом жизни и поведенческими паттернами. Они симулируют реакцию реальных покупателей на ваш продукт, цену или сообщение — без рекрутинга живых участников.",
      },
      {
        question: "Насколько точны синтетические респонденты по сравнению с реальными фокус-группами?",
        answer:
          "Исследования, сравнивающие ИИ-панели с традиционными фокус-группами, показывают 85–92% совпадение по намерению купить и направлению настроений. Синтетические респонденты лучше всего работают для валидации на ранних этапах, тестирования концепций и ценового исследования.",
      },
      {
        question: "Чем это отличается от традиционной фокус-группы?",
        answer:
          "Традиционные фокус-группы занимают 2–4 недели на рекрутинг, стоят от 150 000 до 500 000 рублей за сессию и ограничены географией. Синтетические респонденты доступны за минуты, стоят кратно меньше и настраиваются под любую демографию мгновенно.",
      },
      {
        question: "Можно ли тестировать ценовую чувствительность с синтетическими респондентами?",
        answer:
          "Да. Одно из ценнейших применений — ценовое исследование. Вы настраиваете панель для тестирования готовности платить при разных ценах — симулируя модель Van Westendorp или conjoint-анализ без логистики реального опроса.",
      },
      {
        question: "Какой инструмент Upgrowplan использует для исследования с синтетическими респондентами?",
        answer:
          "Synth Focus Lab от Upgrowplan создаёт виртуальные фокус-группы с ИИ-синтетическими респондентами. Вы задаёте аудиторию, описываете концепцию и получаете структурированную обратную связь: намерение купить, возражения, настроения и практические инсайты.",
      },
      {
        question: "Какие виды исследований можно проводить?",
        answer:
          "Тестирование концепций, валидация product-market fit, ценовая чувствительность, восприятие бренда, тестирование рекламных текстов, UX-обратная связь и конкурентное позиционирование — всё с настраиваемой аудиторией от 5 до 50+ ИИ-персон.",
      },
      {
        question: "Как проверить бизнес-идею без опроса реальных людей?",
        answer: "Используйте синтетических респондентов. Настройте ИИ-панель под свою целевую аудиторию — возраст, доход, образ жизни, поведение при покупке — опишите концепцию и получите структурированную обратную связь: оценку намерения купить, основные возражения, направление настроений и ценовые инсайты. Без рекрутинга и ожидания — за 15 минут.",
      },
      {
        question: "Как быстро протестировать бизнес-идею перед запуском?",
        answer: "Synth Focus Lab позволяет протестировать бизнес-идею на виртуальной панели покупателей за 15 минут. ИИ-синтетические респонденты симулируют реакцию вашего целевого сегмента на концепцию, цену и сообщение — с точностью 85–92% по сравнению с реальными фокус-группами, в разы дешевле и быстрее.",
      },
    ],
  },
  businessPulse: {
    en: [
      {
        question: "What is Business Pulse Workspace?",
        answer:
          "Business Pulse is your AI-powered daily market intelligence department. It monitors competitors, tracks industry news, detects market signals, and alerts you to threats and opportunities in real time.",
      },
      {
        question: "What does Business Pulse monitor?",
        answer:
          "Business Pulse tracks: competitor price changes, new product launches, social media sentiment, news mentions, regulatory changes, and market trend shifts — all in one dashboard.",
      },
      {
        question: "How is Business Pulse different from Google Alerts?",
        answer:
          "Google Alerts sends raw links. Business Pulse analyses the content, extracts business-relevant insights, scores their importance, and presents a structured briefing — saving you hours of manual reading.",
      },
      {
        question: "How often is data updated?",
        answer:
          "The service updates data on a schedule that works for you. A convenient interface lets you configure the frequency, location, format, and delivery channel of your report — for example: a full report on your niche and area every Monday at 9 AM in PDF format. For critical signals like competitor price drops or major news events, alerts are sent in near real-time.",
      },
    ],
    ru: [
      {
        question: "Что такое Business Pulse Workspace?",
        answer:
          "Business Pulse — ваш ИИ-отдел ежедневной рыночной разведки. Он мониторит конкурентов, отслеживает отраслевые новости, выявляет рыночные сигналы и предупреждает об угрозах и возможностях в реальном времени.",
      },
      {
        question: "Что отслеживает Business Pulse?",
        answer:
          "Business Pulse отслеживает: изменения цен конкурентов, запуск новых продуктов, тональность в социальных сетях, упоминания в новостях, изменения в регуляторике и сдвиги рыночных трендов — всё в одном дашборде.",
      },
      {
        question: "Чем Business Pulse отличается от Google Alerts?",
        answer:
          "Google Alerts присылает сырые ссылки. Business Pulse анализирует контент, извлекает бизнес-релевантные инсайты, оценивает их важность и представляет структурированный брифинг — экономя часы ручного чтения.",
      },
      {
        question: "Как часто обновляются данные?",
        answer:
          "Обновление данных сервис производит по графику, удобному для вас. Удобный интерфейс позволяет настроить периодичность, локацию, формат и канал получения отчёта. Например: полный отчёт по вашей нише и району еженедельно по понедельникам в 9 утра в PDF формате. Для критических сигналов — например, снижения цен конкурентами или крупных новостных событий — уведомления приходят в режиме близком к реальному времени.",
      },
    ],
  },
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
    url: "/ai-business-plan-generator",
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
    url: "/ai-business-plan-generator",
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
    url: "/solutions/synthetic-customer-research",
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

// ─── HowTo (step-by-step guides for AI citation) ─────────────────────────────
export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToInput {
  name: string;
  description: string;
  url: string;
  totalTime?: string; // ISO 8601, e.g. "PT10M"
  steps: HowToStep[];
}

export function howToSchema({ name, description, url, totalTime, steps }: HowToInput) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    url,
    ...(totalTime ? { totalTime } : {}),
    tool: {
      "@type": "HowToTool",
      name: "Upgrowplan",
      url: SITE_URL,
    },
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

// ─── HowTo steps per product (EN + RU) ────────────────────────────────────────
export const howToSteps = {
  planMaster: {
    en: {
      name: "How to Create an AI Business Plan with PlanMaster",
      description:
        "Generate a complete investor-ready business plan in 5–10 minutes using PlanMaster AI — no consultants needed.",
      totalTime: "PT10M",
      url: `${SITE_URL}/ai-business-plan-generator`,
      steps: [
        {
          name: "Describe your business idea",
          text: "Enter a brief description of your business: the product or service, your target market, and the country where you plan to operate.",
        },
        {
          name: "Set plan parameters",
          text: "Choose your business type (B2B, B2C, or B2B2C), scale, industry, country, and preferred currency. PlanMaster supports any country and adapts tax and market context automatically.",
        },
        {
          name: "AI generates all sections",
          text: "PlanMaster AI orchestrates multiple specialised agents to draft each section: executive summary, market analysis, competitor research, marketing strategy, operational plan, and financial model (P&L, cash flow, break-even).",
        },
        {
          name: "Skeptic Agent verifies data accuracy",
          text: "A built-in Skeptic Agent cross-checks every key figure against live web sources and flags unrealistic assumptions — such as a 90% market share or 200% margins — before finalising the document.",
        },
        {
          name: "Download your business plan",
          text: "The formatted business plan is available for download as a .docx (Word) file, ready to share with investors, banks, or grant committees without additional editing.",
        },
      ],
    },
    ru: {
      name: "Как создать бизнес-план с помощью PlanMaster AI",
      description:
        "Создайте полноценный бизнес-план для инвесторов за 5–10 минут с PlanMaster AI — без консультантов.",
      totalTime: "PT10M",
      url: `${SITE_URL}/ru/ai-business-plan-generator`,
      steps: [
        {
          name: "Опишите бизнес-идею",
          text: "Введите краткое описание бизнеса: продукт или услугу, целевую аудиторию и страну работы.",
        },
        {
          name: "Задайте параметры плана",
          text: "Выберите тип бизнеса (B2B, B2C или B2B2C), масштаб, отрасль, страну и предпочтительную валюту. PlanMaster поддерживает любую страну и автоматически адаптирует налоги и рыночный контекст.",
        },
        {
          name: "ИИ генерирует все разделы",
          text: "PlanMaster AI координирует несколько специализированных агентов для составления каждого раздела: резюме, анализ рынка, конкурентная среда, маркетинговая стратегия, операционный план и финансовая модель (P&L, денежный поток, точка безубыточности).",
        },
        {
          name: "Агент-скептик проверяет данные",
          text: "Встроенный агент-скептик перекрёстно проверяет каждую ключевую цифру по живым веб-источникам и помечает нереалистичные предположения — например, долю рынка 90% или маржу 200% — до финализации документа.",
        },
        {
          name: "Скачайте бизнес-план",
          text: "Готовый отформатированный бизнес-план доступен для скачивания в формате .docx (Word) — готов к отправке инвесторам, банкам или грантовым комитетам без дополнительного редактирования.",
        },
      ],
    },
  },
  marketResearch: {
    en: {
      name: "How to Conduct AI Market Research with MarketSense",
      description:
        "Get a comprehensive market research report for your niche in 10–30 minutes using MarketSense AI Agent.",
      totalTime: "PT30M",
      url: `${SITE_URL}/solutions/marketResearch`,
      steps: [
        {
          name: "Define your target market",
          text: "Specify the industry, product or service category, target country and city (if applicable), and the type of customers you want to analyse.",
        },
        {
          name: "Configure the research scope",
          text: "Set the number of competitors to track (up to 20), customer segments to profile, data recency requirements, and any specific focus areas such as pricing or distribution channels.",
        },
        {
          name: "AI pulls live data from 10+ sources",
          text: "MarketSense AI queries live data sources — Google Maps, Statista, open business registries, and industry news databases — to gather current, real-world market information.",
        },
        {
          name: "Multi-agent validation filters the results",
          text: "A Deep Search Agent, Skeptic Agent, and Validator Agent cross-check all findings, remove duplicates, flag inconsistencies, and verify data before synthesis.",
        },
        {
          name: "Receive your full market research report",
          text: "The final report includes: market size and growth forecasts, competitor mapping with profiles, customer segmentation, demand trends, pricing benchmarks, and strategic recommendations — all with source references.",
        },
      ],
    },
    ru: {
      name: "Как провести ИИ-исследование рынка с MarketSense",
      description:
        "Получите комплексный отчёт по исследованию рынка для вашей ниши за 10–30 минут с MarketSense AI Agent.",
      totalTime: "PT30M",
      url: `${SITE_URL}/ru/solutions/marketResearch`,
      steps: [
        {
          name: "Определите целевой рынок",
          text: "Укажите отрасль, категорию продукта или услуги, целевую страну и город (если применимо) и тип клиентов для анализа.",
        },
        {
          name: "Настройте охват исследования",
          text: "Задайте количество конкурентов для отслеживания (до 20), сегменты клиентов для профилирования, требования к актуальности данных и любые конкретные фокусные области — например, ценообразование или каналы сбыта.",
        },
        {
          name: "ИИ собирает живые данные из 10+ источников",
          text: "MarketSense AI запрашивает живые источники данных — Google Maps, Statista, открытые бизнес-реестры и отраслевые новостные базы — для сбора актуальной рыночной информации.",
        },
        {
          name: "Многоагентная валидация фильтрует результаты",
          text: "Агент глубокого поиска, агент-скептик и агент-валидатор перекрёстно проверяют все находки, удаляют дубли, отмечают несоответствия и верифицируют данные перед синтезом.",
        },
        {
          name: "Получите полный отчёт по рынку",
          text: "Итоговый отчёт включает: прогнозы объёма и роста рынка, картирование конкурентов с профилями, сегментацию клиентов, тренды спроса, ценовые бенчмарки и стратегические рекомендации — всё со ссылками на источники.",
        },
      ],
    },
  },
  synthFocusLab: {
    en: {
      name: "How to Run a Virtual Focus Group with Synth Focus Lab",
      description:
        "Test your product concept or marketing message with AI-powered synthetic respondents in minutes — no recruiting needed.",
      totalTime: "PT15M",
      url: `${SITE_URL}/solutions/synthFocusLab`,
      steps: [
        {
          name: "Define your research question",
          text: "Describe the concept, product, ad copy, or UX element you want to test. State what kind of feedback you need — emotional reaction, purchase intent, usability, or price sensitivity.",
        },
        {
          name: "Configure your respondent panel",
          text: "Set panel size (5–50+ respondents), demographics (age range, income level, location, lifestyle), and any niche characteristics relevant to your target audience.",
        },
        {
          name: "AI generates synthetic personas",
          text: "Each respondent is built as a detailed AI persona with consistent demographic, behavioural, and financial attributes — calibrated against real population data patterns to simulate authentic reactions.",
        },
        {
          name: "Run the test session",
          text: "The personas respond to your questions, react to your concept, and provide feedback — just like real focus group participants, but available instantly without scheduling or incentive fees.",
        },
        {
          name: "Receive analysed insights",
          text: "Get a structured summary of key findings, sentiment breakdown, common objections, and actionable recommendations based on the full panel responses.",
        },
      ],
    },
    ru: {
      name: "Как провести виртуальную фокус-группу с Synth Focus Lab",
      description:
        "Протестируйте концепцию продукта или маркетинговое сообщение с синтетическими ИИ-респондентами за считанные минуты — без рекрутинга.",
      totalTime: "PT15M",
      url: `${SITE_URL}/ru/solutions/synthFocusLab`,
      steps: [
        {
          name: "Определите исследовательский вопрос",
          text: "Опишите концепцию, продукт, рекламный текст или элемент UX для тестирования. Укажите тип обратной связи: эмоциональная реакция, намерение купить, удобство использования или ценовая чувствительность.",
        },
        {
          name: "Настройте панель респондентов",
          text: "Задайте размер панели (5–50+ респондентов), демографику (возраст, уровень дохода, геолокация, образ жизни) и нишевые характеристики целевой аудитории.",
        },
        {
          name: "ИИ создаёт синтетические персоны",
          text: "Каждый респондент формируется как детальная ИИ-персона с согласованными демографическими, поведенческими и финансовыми атрибутами — откалиброванными по реальным паттернам данных населения.",
        },
        {
          name: "Запустите тестовую сессию",
          text: "Персоны отвечают на вопросы, реагируют на концепцию и дают обратную связь — как реальные участники фокус-группы, но доступные мгновенно без расписания и вознаграждений.",
        },
        {
          name: "Получите проанализированные инсайты",
          text: "Получите структурированное резюме ключевых выводов, разбивку настроений, типичные возражения и практические рекомендации на основе ответов всей панели.",
        },
      ],
    },
  },
  syntheticCustomerResearch: {
    en: {
      name: "How to Run AI Synthetic Customer Research with Synth Focus Lab",
      description:
        "Test your business idea on virtual buyers in 15 minutes — no focus group recruiting needed.",
      totalTime: "PT15M",
      url: `${SITE_URL}/solutions/synthetic-customer-research`,
      steps: [
        {
          name: "Describe your idea and define your audience",
          text: "Enter the product or concept you want to test. Set target audience parameters: age range, income level, location, and lifestyle characteristics.",
        },
        {
          name: "AI builds a panel of synthetic personas",
          text: "Synth Focus Lab generates 5–50+ AI personas, each with a unique demographic, behavioural, and financial profile calibrated against real population data.",
        },
        {
          name: "Personas react to your concept",
          text: "Each AI persona responds to your product idea, raises objections, asks questions, and names the price they would pay — simulating authentic buyer reactions.",
        },
        {
          name: "Receive a structured insight report",
          text: "Get a full analysis: purchase intent score, top objections, willingness-to-pay range, product strengths and weaknesses — all within 15 minutes.",
        },
      ],
    },
    ru: {
      name: "Как провести ИИ-исследование покупателей с Synth Focus Lab",
      description:
        "Проверьте бизнес-идею на виртуальных покупателях за 15 минут — без рекрутинга фокус-группы.",
      totalTime: "PT15M",
      url: `${SITE_URL}/ru/solutions/synthetic-customer-research`,
      steps: [
        {
          name: "Опишите идею и определите аудиторию",
          text: "Введите продукт или концепцию для тестирования. Задайте параметры целевой аудитории: возраст, уровень дохода, геолокация и образ жизни.",
        },
        {
          name: "ИИ создаёт панель синтетических персон",
          text: "Synth Focus Lab генерирует 5–50+ ИИ-персон, каждая с уникальным демографическим, поведенческим и финансовым профилем, откалиброванным по реальным данным населения.",
        },
        {
          name: "Персоны реагируют на вашу концепцию",
          text: "Каждая ИИ-персона отвечает на вашу идею продукта, высказывает возражения, задаёт вопросы и называет цену, которую готова заплатить.",
        },
        {
          name: "Получите структурированный отчёт с инсайтами",
          text: "Полный анализ: индекс намерения купить, топ-возражения, диапазон готовности платить, сильные и слабые стороны продукта — за 15 минут.",
        },
      ],
    },
  },
  businessPulse: {
    en: {
      name: "How to Monitor Your Market with Business Pulse",
      description:
        "Set up AI-powered daily market intelligence to track competitors, news, and industry signals automatically.",
      totalTime: "PT5M",
      url: `${SITE_URL}/solutions/businessPulse`,
      steps: [
        {
          name: "Define your monitoring targets",
          text: "Specify your industry, key competitors (by name or website), geographic market, and the types of signals you care about — pricing, product launches, news mentions, or regulatory changes.",
        },
        {
          name: "Configure alert priorities",
          text: "Set thresholds for what triggers an immediate alert versus a daily digest. Critical signals like competitor price drops or major news events are flagged in near real-time.",
        },
        {
          name: "AI monitors continuously",
          text: "Business Pulse scans competitor websites, social media, news feeds, and business registries every day — collecting raw signals from across the web without manual effort.",
        },
        {
          name: "Intelligent scoring and summarisation",
          text: "Unlike Google Alerts (which sends raw links), Business Pulse analyses each signal, scores its business relevance, and summarises the key insight so you can act immediately.",
        },
        {
          name: "Review your daily intelligence briefing",
          text: "Each day you receive a structured briefing: what changed, who moved, what it means for your business, and recommended next actions — all in one dashboard.",
        },
      ],
    },
    ru: {
      name: "Как мониторить рынок с Business Pulse",
      description:
        "Настройте ИИ-мониторинг рынка для автоматического отслеживания конкурентов, новостей и отраслевых сигналов.",
      totalTime: "PT5M",
      url: `${SITE_URL}/ru/solutions/businessPulse`,
      steps: [
        {
          name: "Определите объекты мониторинга",
          text: "Укажите отрасль, ключевых конкурентов (по имени или сайту), географический рынок и типы сигналов: ценообразование, запуски продуктов, упоминания в новостях или изменения регуляторики.",
        },
        {
          name: "Настройте приоритеты уведомлений",
          text: "Задайте пороги для немедленных уведомлений и ежедневного дайджеста. Критические сигналы — снижение цен конкурентами или крупные новости — приходят в режиме близком к реальному времени.",
        },
        {
          name: "ИИ мониторит непрерывно",
          text: "Business Pulse ежедневно сканирует сайты конкурентов, социальные сети, новостные ленты и бизнес-реестры — собирая сырые сигналы со всего интернета без ручных усилий.",
        },
        {
          name: "Интеллектуальная оценка и обобщение",
          text: "В отличие от Google Alerts (который присылает сырые ссылки), Business Pulse анализирует каждый сигнал, оценивает его бизнес-релевантность и формулирует ключевой инсайт для немедленного действия.",
        },
        {
          name: "Читайте ежедневный разведывательный брифинг",
          text: "Каждый день вы получаете структурированный брифинг: что изменилось, кто сдвинулся, что это значит для вашего бизнеса и рекомендуемые следующие шаги — всё в одном дашборде.",
        },
      ],
    },
  },
};

// ─── Product schema (boosts rich results + AI citation signals) ───────────────
export interface ProductInput {
  name: string;
  description: string;
  url: string;
  image?: string;
  /**
   * Only add aggregateRating when you have real verified user reviews.
   * Fake or placeholder ratings violate Google guidelines.
   */
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
  };
}

export function productSchema({ name, description, url, image, aggregateRating }: ProductInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    brand: {
      "@type": "Brand",
      name: "Upgrowplan",
      url: SITE_URL,
    },
    image: image ?? OG_IMAGE,
    offers: {
      "@type": "Offer",
      url,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
      seller: {
        "@type": "Organization",
        name: "Upgrowplan",
        url: SITE_URL,
      },
      ...DIGITAL_OFFER_EXTRAS,
    },
    ...(aggregateRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
            bestRating: aggregateRating.bestRating ?? 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

// ─── Consulting products schema (/products page) ─────────────────────────────
export interface ConsultingProduct {
  name: string;
  description: string;
  price: string;       // numeric string, e.g. "200" or "0"
  priceCurrency?: string;
  unitText?: string;   // "MON" for monthly, omit for one-time
}

export function consultingProductsSchema(
  products: ConsultingProduct[],
  locale: "en" | "ru"
) {
  return products.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    brand: { "@type": "Brand", name: "Upgrowplan", url: SITE_URL },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.priceCurrency ?? "USD",
      availability: "https://schema.org/InStock",
      ...(p.unitText
        ? { priceSpecification: { "@type": "UnitPriceSpecification", price: p.price, priceCurrency: p.priceCurrency ?? "USD", unitText: p.unitText } }
        : {}),
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "001",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 7, unitCode: "DAY" },
        },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "001" },
      },
      seller: { "@type": "Organization", name: "Upgrowplan", url: SITE_URL },
    },
  }));
}
