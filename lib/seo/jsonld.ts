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
          "Upgrowplan is an AI-powered platform that generates professional business plans, market research reports, financial models, and strategic analyses in minutes — without hiring consultants.",
      },
      {
        question: "How long does it take to generate a business plan?",
        answer:
          "Depending on the tool, a full business plan is ready in 5–20 minutes. Market research reports typically take 10–30 minutes with live data verification.",
      },
      {
        question: "Is Upgrowplan suitable for investor presentations?",
        answer:
          "Yes. Our PlanMaster AI generates investor-ready documents with financial projections, market analysis, and SWOT, formatted according to international standards.",
      },
      {
        question: "What languages does Upgrowplan support?",
        answer:
          "Upgrowplan fully supports English and Russian across all tools and interfaces.",
      },
      {
        question: "Do I need technical knowledge to use Upgrowplan?",
        answer:
          "No. All tools work through a simple chat interface — just describe your business idea and the AI handles the rest.",
      },
    ],
    ru: [
      {
        question: "Что такое Upgrowplan?",
        answer:
          "Upgrowplan — ИИ-платформа для генерации профессиональных бизнес-планов, исследований рынка, финансовых моделей и стратегических анализов за считанные минуты — без найма консультантов.",
      },
      {
        question: "Сколько времени занимает генерация бизнес-плана?",
        answer:
          "В зависимости от инструмента, полный бизнес-план готов за 5–20 минут. Отчёты по исследованию рынка занимают 10–30 минут с верификацией живых данных.",
      },
      {
        question: "Подходит ли Upgrowplan для презентации инвесторам?",
        answer:
          "Да. PlanMaster AI генерирует готовые для инвесторов документы с финансовыми прогнозами, анализом рынка и SWOT, оформленные по международным стандартам.",
      },
      {
        question: "Какие языки поддерживает Upgrowplan?",
        answer:
          "Upgrowplan полностью поддерживает английский и русский языки во всех инструментах и интерфейсах.",
      },
      {
        question: "Нужны ли технические знания для работы с Upgrowplan?",
        answer:
          "Нет. Все инструменты работают через простой чат-интерфейс — просто опишите бизнес-идею, а ИИ сделает остальное.",
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
  solutions: {
    en: [
      {
        question: "What AI tools does Upgrowplan offer?",
        answer:
          "Upgrowplan offers: PlanMaster AI (business plans), MarketSense AI (market research), Synth Focus Lab (virtual focus groups), Business Pulse (market monitoring), Social Plan Master (SMM strategy), Fin Buddy (financial tracking), Open Abroad (international expansion), and FinPilot Free (financial modelling).",
      },
      {
        question: "Which tools are free?",
        answer:
          "FinPilot Free and Open Abroad (Relocation Service) are available for free. Other tools are available on a subscription or pay-per-use basis.",
      },
      {
        question: "Can I use Upgrowplan tools for an existing business?",
        answer:
          "Absolutely. All tools work for both startups and existing businesses. Business Pulse and MarketSense are especially useful for ongoing competitive monitoring.",
      },
    ],
    ru: [
      {
        question: "Какие ИИ-инструменты предлагает Upgrowplan?",
        answer:
          "Upgrowplan предлагает: PlanMaster AI (бизнес-планы), MarketSense AI (исследование рынка), Synth Focus Lab (виртуальные фокус-группы), Business Pulse (мониторинг рынка), Social Plan Master (SMM-стратегия), Fin Buddy (финансовый учёт), Open Abroad (международная экспансия) и FinPilot Free (финансовое моделирование).",
      },
      {
        question: "Какие инструменты бесплатны?",
        answer:
          "FinPilot Free и Open Abroad (Relocation Service) доступны бесплатно. Остальные инструменты доступны по подписке или по модели оплаты за использование.",
      },
      {
        question: "Можно ли использовать инструменты Upgrowplan для действующего бизнеса?",
        answer:
          "Абсолютно. Все инструменты работают как для стартапов, так и для действующих компаний. Business Pulse и MarketSense особенно полезны для постоянного мониторинга конкурентов.",
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
        question: "What does an AI market research report include?",
        answer:
          "A MarketSense report includes: market size and growth forecast, competitor mapping (up to 20 players), customer segmentation, demand trends, pricing benchmarks, and strategic recommendations — all sourced from live data.",
      },
      {
        question: "How long does market research take?",
        answer:
          "Most reports are ready in 10–30 minutes. Complex multi-city or multi-segment analyses may take up to an hour. Compare that to 2–4 weeks for a traditional research agency.",
      },
      {
        question: "What sources does the AI use?",
        answer:
          "MarketSense pulls from 10+ live sources: Google Maps, Statista, open business registries, news databases, and industry reports. Every data point is tagged with its source for full transparency.",
      },
      {
        question: "Can I use the report to pitch to investors?",
        answer:
          "Yes. The report is structured for business use — with clear sections, data visualisations, and source references. It can be downloaded and included in investor decks or strategic documents.",
      },
    ],
    ru: [
      {
        question: "Что включает отчёт ИИ-исследования рынка?",
        answer:
          "Отчёт MarketSense включает: объём рынка и прогноз роста, картирование конкурентов (до 20 игроков), сегментацию клиентов, тренды спроса, ценовые бенчмарки и стратегические рекомендации — всё на основе живых данных.",
      },
      {
        question: "Сколько времени занимает исследование рынка?",
        answer:
          "Большинство отчётов готовы за 10–30 минут. Сложные многогородские или многосегментные анализы могут занять до часа. Для сравнения: традиционное исследовательское агентство тратит 2–4 недели.",
      },
      {
        question: "Какие источники использует ИИ?",
        answer:
          "MarketSense использует 10+ живых источников: Google Maps, Statista, открытые бизнес-реестры, новостные базы данных и отраслевые отчёты. Каждый показатель помечен источником для полной прозрачности.",
      },
      {
        question: "Можно ли использовать отчёт для питча инвесторам?",
        answer:
          "Да. Отчёт структурирован для делового использования — с чёткими разделами, визуализацией данных и ссылками на источники. Его можно скачать и включить в инвесторские презентации или стратегические документы.",
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
          "Data is refreshed daily. For critical signals like competitor price drops or major news events, alerts are sent in near real-time.",
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
          "Данные обновляются ежедневно. Для критических сигналов — например, снижения цен конкурентами или крупных новостных событий — уведомления приходят в режиме близком к реальному времени.",
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
