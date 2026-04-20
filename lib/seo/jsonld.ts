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
          "Upgrowplan is an AI-powered platform that generates professional business plans, market research reports, financial models, and virtual respondent panels in minutes — without hiring consultants.",
      },
      {
        question: "How long does it take to generate a business plan?",
        answer:
          "Generation takes 7–15 minutes: the service needs time to collect and verify data from live sources before producing the final document.",
      },
      {
        question: "Is Upgrowplan suitable for investor presentations?",
        answer:
          "Yes. Upgrowplan services generate investor-ready documents with financial projections, market analysis, and SWOT, formatted according to international standards.",
      },
      {
        question: "What languages does Upgrowplan support?",
        answer:
          "Upgrowplan fully supports English and Russian across all tools and interfaces.",
      },
      {
        question: "Do I need technical knowledge to use Upgrowplan?",
        answer:
          "No. All Upgrowplan services work through a simple request form — just fill in your business details and the service handles the rest.",
      },
    ],
    ru: [
      {
        question: "Что такое Upgrowplan?",
        answer:
          "Upgrowplan — ИИ-платформа для генерации профессиональных бизнес-планов, исследований рынка, финансовых моделей и панелей виртуальных респондентов за считанные минуты — без найма консультантов.",
      },
      {
        question: "Сколько времени занимает генерация бизнес-плана?",
        answer:
          "Генерация занимает 7–15 минут: сервису необходимо время на сбор и проверку данных из живых источников перед формированием итогового документа.",
      },
      {
        question: "Подходит ли Upgrowplan для презентации инвесторам?",
        answer:
          "Да. Сервисы Upgrowplan генерируют готовые для инвесторов документы с финансовыми прогнозами, анализом рынка и SWOT, оформленные по международным стандартам.",
      },
      {
        question: "Какие языки поддерживает Upgrowplan?",
        answer:
          "Upgrowplan полностью поддерживает английский и русский языки во всех инструментах и интерфейсах.",
      },
      {
        question: "Нужны ли технические знания для работы с Upgrowplan?",
        answer:
          "Нет. Все сервисы Upgrowplan работают через простую форму запроса — просто заполните данные о вашем бизнесе, и сервис сделает остальное.",
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
          "Upgrowplan offers: PlanMaster AI (business plans), MarketSense AI (market research), Synth Focus Lab (virtual focus groups), Business Pulse (market monitoring), Fin Buddy (financial tracking), Open Abroad (international expansion), and FinPilot Free (financial modelling).",
      },
      {
        question: "Which tools are free?",
        answer:
          "FinPilot Free and Open Abroad (Relocation Service) are available for free. Visit the service pages and get free access to test the beta versions of our products. Other tools are available on a subscription or pay-per-use basis.",
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
          "Upgrowplan предлагает: PlanMaster AI (бизнес-планы), MarketSense AI (исследование рынка), Synth Focus Lab (виртуальные фокус-группы), Business Pulse (мониторинг рынка), Fin Buddy (финансовый учёт), Open Abroad (международная экспансия) и FinPilot Free (финансовое моделирование).",
      },
      {
        question: "Какие инструменты бесплатны?",
        answer:
          "FinPilot Free и Open Abroad (Relocation Service) доступны бесплатно. Посетите страницы сервисов и получите бесплатный доступ для тестирования бета-версии продуктов. Остальные инструменты доступны по подписке или по модели оплаты за использование.",
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
      url: `${SITE_URL}/solutions/planMaster`,
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
      url: `${SITE_URL}/ru/solutions/planMaster`,
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
