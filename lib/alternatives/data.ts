// «Alternatives» pages (INFO.md TODO п.24, owner decision 26.11.2026 «да»).
// Single source for every competitor fact shown on /alternatives/* (EN) and /ru/alternatives/* (RU):
// prices are numbers here, all text and FAQ answers are built from them — do not copy prices into page text.
// Every fact was read on the tool's own site on CHECKED_AT; `sourceUrl` is that page.
// Upgrowplan facts come from the company fact sheet (INFO.md §0) only.

export type Locale = "en" | "ru";
type L = { en: string; ru: string };

export const CHECKED_AT = "2026-11-26";
export const CHECKED_AT_LABEL: L = { en: "26 Nov 2026", ru: "26.11.2026" };

export interface Tool {
  id: string;
  name: string;
  site: string;
  sourceUrl: string;
  sourceLabel: string;
  free: boolean;
  // Cheapest paid plan, USD per month: when paying monthly / per month when paying yearly (null = not shown on the site)
  fromMonthly: number | null;
  fromYearly: number | null;
  whatItIs: L;
  plans: L[];
  trial: L;
  bestFor: L;
  limits: L;
}

export const TOOLS: Record<string, Tool> = {
  growexa: {
    id: "growexa",
    name: "Growexa",
    site: "https://www.growexa.com",
    sourceUrl: "https://www.growexa.com/pricing",
    sourceLabel: "growexa.com/pricing",
    free: false,
    fromMonthly: 19,
    fromYearly: 13,
    whatItIs: {
      en: "AI business plan software focused on bank-ready plans: three formats (bank, investor, one-page), P&L, cash flow and balance sheet, financial ratios, a structure “based on 40+ bank & SBA requirements”. Generates plans in English, German and Ukrainian; first draft in about 5 minutes.",
      ru: "ИИ-сервис бизнес-планов под банковский кредит: три формата (для банка, для инвестора, одностраничный), отчёт о прибылях и убытках, движение денег и баланс, финансовые коэффициенты, структура «по 40+ требованиям банков и SBA». Пишет планы на английском, немецком и украинском; первый черновик — около 5 минут.",
    },
    plans: [
      { en: "Starter — $19/month, or $13/month billed yearly; up to 3 active projects", ru: "Starter — $19 в месяц или $13 в месяц при оплате за год; до 3 проектов одновременно" },
      { en: "Professional — $35/month, or $24/month billed yearly; up to 10 active projects", ru: "Professional — $35 в месяц или $24 в месяц при оплате за год; до 10 проектов" },
      { en: "Banks & lenders — custom terms", ru: "Для банков и кредиторов — условия по договорённости" },
    ],
    trial: { en: "3-day free trial", ru: "3 дня бесплатно" },
    bestFor: {
      en: "Founders preparing a loan application; consultants with several client projects",
      ru: "Тем, кто готовит заявку на кредит; консультантам с несколькими проектами клиентов",
    },
    limits: {
      en: "No permanent free plan; plan languages are English, German and Ukrainian only.",
      ru: "Постоянного бесплатного тарифа нет; языки плана — только английский, немецкий и украинский.",
    },
  },
  planarmory: {
    id: "planarmory",
    name: "PlanArmory",
    site: "https://planarmory.com",
    sourceUrl: "https://planarmory.com/",
    sourceLabel: "planarmory.com",
    free: true,
    fromMonthly: 39,
    fromYearly: null,
    whatItIs: {
      en: "AI business plan generator: you answer 14 simple questions and get a 30+ page plan with 9 sections and 5-year financial projections in about 60 seconds. PDF and Word export; the Pro plan adds marketing plans with a content calendar.",
      ru: "ИИ-генератор бизнес-плана: ответы на 14 простых вопросов — и примерно за 60 секунд план на 30+ страниц из 9 разделов с финансовым прогнозом на 5 лет. Выгрузка в PDF и Word; в тарифе Pro — ещё маркетинговый план с календарём публикаций.",
    },
    plans: [
      { en: "Free — $0: 1 business plan (2-section preview), 1 marketing plan preview", ru: "Free — $0: 1 бизнес-план (предпросмотр 2 разделов), предпросмотр маркетингового плана" },
      { en: "Pro — $39/month: unlimited plans, 5-year financials, PDF downloads; 20% off when billed yearly", ru: "Pro — $39 в месяц: без ограничения числа планов, прогноз на 5 лет, PDF; при оплате за год скидка 20%" },
    ],
    trial: { en: "Free plan, no credit card", ru: "Бесплатный тариф без банковской карты" },
    bestFor: {
      en: "First-time founders and students who need a complete first draft fast",
      ru: "Начинающим предпринимателям и студентам, которым быстро нужен полный черновик",
    },
    limits: {
      en: "The free plan shows only 2 sections of the business plan; the full plan needs Pro.",
      ru: "Бесплатно видны только 2 раздела бизнес-плана; полный план — на тарифе Pro.",
    },
  },
  prometai: {
    id: "prometai",
    name: "PrometAI",
    site: "https://prometai.app",
    sourceUrl: "https://prometai.app/pricing",
    sourceLabel: "prometai.app/pricing",
    free: true,
    fromMonthly: 55,
    fromYearly: null,
    whatItIs: {
      en: "AI business plan generator “with strategy built in”: plans for loans, visas, investors and class submissions, financial dashboards, and on the Pro plan DCF valuation, stress testing, NDA and term-sheet templates and PowerPoint export.",
      ru: "ИИ-генератор бизнес-плана «со встроенной стратегией»: планы для кредита, визы, инвесторов и учёбы, финансовые панели, а в тарифе Pro — оценка компании методом дисконтированных денежных потоков, стресс-тест, шаблоны NDA и term sheet, выгрузка в PowerPoint.",
    },
    plans: [
      { en: "Explore — free: 1 business plan, 25 AI requests/month", ru: "Explore — бесплатно: 1 бизнес-план, 25 запросов к ИИ в месяц" },
      { en: "Application-Ready — $55/month billed monthly: PDF export, 2 plans, 200 AI requests/month", ru: "Application-Ready — $55 в месяц при помесячной оплате: PDF, 2 плана, 200 запросов в месяц" },
      { en: "Investor-Grade — $145/month billed monthly: PowerPoint export, DCF valuation and stress testing, 5 plans", ru: "Investor-Grade — $145 в месяц при помесячной оплате: PowerPoint, оценка DCF и стресс-тест, 5 планов" },
      { en: "Quarterly billing saves about 18%, yearly about 55% (site wording)", ru: "Оплата за квартал — экономия около 18%, за год — около 55% (по словам сайта)" },
    ],
    trial: { en: "Free plan; money-back guarantee on paid plans", ru: "Бесплатный тариф; возврат денег на платных тарифах" },
    bestFor: {
      en: "Founders raising investment who want valuation and stress tests in the same tool",
      ru: "Тем, кто привлекает инвестиции и хочет оценку компании и стресс-тест в одном сервисе",
    },
    limits: {
      en: "The highest starting price of the paid plans compared here; PDF export is not on the free plan.",
      ru: "Самая высокая стартовая цена платного тарифа среди сравниваемых здесь; на бесплатном тарифе нет выгрузки в PDF.",
    },
  },
  upmetrics: {
    id: "upmetrics",
    name: "Upmetrics",
    site: "https://upmetrics.co",
    sourceUrl: "https://help.upmetrics.co/article/163-pricing-update",
    sourceLabel: "help.upmetrics.co — Upmetrics Pricing (updated 28 May 2026)",
    free: false,
    fromMonthly: 19,
    fromYearly: 14,
    whatItIs: {
      en: "AI business planning software to draft, forecast and pitch: business plan builder, financial forecasting, AI plan and pitch deck generators, 400+ sample plans, team collaboration and white label.",
      ru: "ИИ-сервис бизнес-планирования «написать, посчитать, презентовать»: конструктор плана, финансовый прогноз, ИИ-генераторы плана и презентации, 400+ примеров планов, совместная работа и white label.",
    },
    plans: [
      { en: "Premium — $19/month, or $14/month billed yearly", ru: "Premium — $19 в месяц или $14 в месяц при оплате за год" },
      { en: "Professional — $49/month, or $37/month billed yearly", ru: "Professional — $49 в месяц или $37 в месяц при оплате за год" },
      { en: "Add-ons: extra workspace $7/month, team member $5/month, white label $249/month (less when billed yearly)", ru: "Дополнительно: рабочее пространство $7 в месяц, участник $5 в месяц, white label $249 в месяц (за год — дешевле)" },
    ],
    trial: { en: "No free trial; 15-day money-back guarantee", ru: "Бесплатного периода нет; 15 дней на возврат денег" },
    bestFor: {
      en: "Entrepreneurs and students (Premium); consultants, incubators and advisors (Professional)",
      ru: "Предпринимателям и студентам (Premium); консультантам, инкубаторам и советникам (Professional)",
    },
    limits: {
      en: "No free plan or trial — you pay first and can ask for a refund within 15 days.",
      ru: "Нет ни бесплатного тарифа, ни пробного периода — сначала оплата, вернуть деньги можно в течение 15 дней.",
    },
  },
  liveplan: {
    id: "liveplan",
    name: "LivePlan",
    site: "https://www.liveplan.com",
    sourceUrl: "https://www.liveplan.com/pricing",
    sourceLabel: "liveplan.com/pricing",
    free: false,
    fromMonthly: 20,
    fromYearly: 15,
    whatItIs: {
      en: "Business planning and forecasting software by Palo Alto Software: linked P&L, cash flow and balance sheet, a lender-readiness review, AI writing help, 550+ sample plans, pitch export to PDF or PowerPoint; Premium connects to QuickBooks Online and Xero.",
      ru: "Сервис бизнес-планирования и прогноза от Palo Alto Software: связанные отчёт о прибылях, движение денег и баланс, проверка готовности плана для банка, помощь ИИ в тексте, 550+ примеров планов, презентация в PDF или PowerPoint; Premium подключается к QuickBooks Online и Xero.",
    },
    plans: [
      { en: "Standard — $20/month, or $15/month billed yearly", ru: "Standard — $20 в месяц или $15 в месяц при оплате за год" },
      { en: "Premium — $40/month, or $30/month billed yearly", ru: "Premium — $40 в месяц или $30 в месяц при оплате за год" },
      { en: "On the check date the site ran a promotion: 50% off the first year when billed yearly", ru: "В день проверки на сайте шла акция: −50% на первый год при оплате за год" },
    ],
    trial: { en: "35-day money-back guarantee", ru: "35 дней на возврат денег" },
    bestFor: {
      en: "Running businesses that want the plan tied to their accounting (QuickBooks, Xero) and budget-vs-actual tracking",
      ru: "Работающему бизнесу, которому нужен план, связанный с бухгалтерией (QuickBooks, Xero), и сравнение плана с фактом",
    },
    limits: {
      en: "No free plan; one active company at a time on each plan.",
      ru: "Бесплатного тарифа нет; на тарифе одновременно активна одна компания.",
    },
  },
};

// Upgrowplan — strictly from the fact sheet (INFO.md §0): PlanMaster in development, MarketSense free beta by invitation.
export const UPGROWPLAN = {
  name: "Upgrowplan",
  whatItIs: {
    en: "AI business planning platform that collects live market and competitor data before any text is written, runs the financial math in deterministic Python and checks assumptions with a Skeptic Agent. Available today: MarketSense AI market research — competitors, their prices and market size from open sources. The full business plan generator, PlanMaster, is in development.",
    ru: "ИИ-платформа бизнес-планирования: сначала собирает живые данные о рынке и конкурентах, считает финансы кодом на Python, а допущения проверяет агент-скептик. Доступно сейчас: исследование рынка MarketSense AI — конкуренты, их цены и объём рынка из открытых источников. Полный генератор бизнес-плана PlanMaster — в разработке.",
  },
  plans: [
    { en: "MarketSense AI market research — free beta by invitation", ru: "Исследование рынка MarketSense AI — бесплатная бета по приглашению" },
    { en: "PlanMaster business plan generator — in development", ru: "Генератор бизнес-плана PlanMaster — в разработке" },
  ],
  bestFor: {
    en: "Checking the market, competitors and real prices before you write the plan — together with any planner from this list",
    ru: "Проверить рынок, конкурентов и реальные цены до того, как писать план — вместе с любым сервисом из этого списка",
  },
  limits: {
    en: "Does not produce a finished business plan yet. If you need a plan document today, pick one of the tools above.",
    ru: "Готовый бизнес-план пока не выдаёт. Если документ нужен сегодня — выбирайте сервис из списка выше.",
  },
};

export const ALTERNATIVE_SLUGS = ["growexa", "planarmory", "prometai", "upmetrics"] as const;
export type AlternativeSlug = (typeof ALTERNATIVE_SLUGS)[number];

// Alternatives shown on each page: the other three of the four + LivePlan; Upgrowplan goes last as its own section.
export function alternativesFor(slug: AlternativeSlug): Tool[] {
  return [...ALTERNATIVE_SLUGS.filter((s) => s !== slug), "liveplan"].map((id) => TOOLS[id]);
}

export function enPath(slug: string) {
  return `/alternatives/${slug}`;
}
export function ruPath(slug: string) {
  return `/ru/alternatives/${slug}`;
}

export function priceLabel(t: Tool, locale: Locale): string {
  const ru = locale === "ru";
  if (t.fromMonthly == null) return ru ? "—" : "—";
  const base = ru ? `от $${t.fromMonthly}/мес` : `from $${t.fromMonthly}/mo`;
  if (t.fromYearly == null) return base;
  return ru ? `${base} ($${t.fromYearly}/мес при оплате за год)` : `${base} ($${t.fromYearly}/mo billed yearly)`;
}

// Cheapest per-month price among the alternatives, counting the yearly price where the site shows one.
export function cheapest(tools: Tool[]): { tool: Tool; price: number } {
  let best: { tool: Tool; price: number } | null = null;
  for (const t of tools) {
    const p = Math.min(t.fromMonthly ?? Infinity, t.fromYearly ?? Infinity);
    if (p !== Infinity && (best == null || p < best.price)) best = { tool: t, price: p };
  }
  if (!best) throw new Error("alternatives: no priced tool");
  return best;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function pageText(slug: AlternativeSlug, locale: Locale) {
  const ru = locale === "ru";
  const target = TOOLS[slug];
  const alts = alternativesFor(slug);
  const low = cheapest(alts);
  const freeOnes = alts.filter((t) => t.free).map((t) => t.name);
  const date = CHECKED_AT_LABEL[locale];

  const title = ru
    ? `Альтернативы ${target.name}: 5 сервисов и цены (ноябрь 2026)`
    : `${target.name} Alternatives: 5 Tools & Prices (Nov 2026)`;
  const description = ru
    ? `Чем заменить ${target.name}: ${alts.map((t) => t.name).join(", ")} и Upgrowplan — что делает каждый и цены с их сайтов на ${date}.`
    : `Alternatives to ${target.name}: ${alts.map((t) => t.name).join(", ")} and Upgrowplan — what each does and prices checked on their sites (${date}).`;

  const faqs: FaqItem[] = ru
    ? [
        {
          question: `Какая самая дешёвая альтернатива ${target.name}?`,
          answer: `Среди сервисов на этой странице самый низкий платный тариф у ${low.tool.name}: $${low.price} в месяц${low.tool.fromYearly === low.price ? " при оплате за год" : ""} (по сайту ${new URL(low.tool.sourceUrl).hostname} на ${date}). Для сравнения: ${target.name} — ${priceLabel(target, "ru")}.`,
        },
        {
          question: `Есть ли бесплатная альтернатива ${target.name}?`,
          answer: freeOnes.length
            ? `Бесплатный тариф есть у ${freeOnes.join(" и ")}, но с ограничениями (см. карточки выше). Исследование рынка Upgrowplan MarketSense AI сейчас бесплатно в бета-версии по приглашению, но это не генератор бизнес-плана.`
            : `Среди этих сервисов постоянного бесплатного тарифа нет. Исследование рынка Upgrowplan MarketSense AI бесплатно в бета-версии по приглашению, но это не генератор бизнес-плана.`,
        },
        {
          question: `Заменяет ли Upgrowplan ${target.name}?`,
          answer: `Пока нет. Полный генератор бизнес-плана Upgrowplan PlanMaster в разработке. Сейчас доступно исследование рынка MarketSense AI: оно собирает конкурентов, их цены и объём рынка из открытых источников — это можно сделать до того, как писать план в ${target.name} или другом сервисе.`,
        },
        {
          question: "Насколько свежие эти цены?",
          answer: `Все цены и тарифы проверены ${date} на сайтах самих сервисов; ссылка на страницу-источник — в каждой карточке. Цены и акции меняются часто — перед оплатой сверьтесь с сайтом.`,
        },
      ]
    : [
        {
          question: `What is the cheapest alternative to ${target.name}?`,
          answer: `Among the tools on this page, the lowest paid plan is ${low.tool.name} at $${low.price}/month${low.tool.fromYearly === low.price ? " billed yearly" : ""} (per ${new URL(low.tool.sourceUrl).hostname} as of ${date}). For comparison, ${target.name} is ${priceLabel(target, "en")}.`,
        },
        {
          question: `Is there a free alternative to ${target.name}?`,
          answer: freeOnes.length
            ? `${freeOnes.join(" and ")} ${freeOnes.length > 1 ? "have" : "has"} a free plan with limits (see the cards above). Upgrowplan's MarketSense AI market research is free in beta by invitation, but it is not a business plan generator.`
            : `None of these tools has a permanent free plan. Upgrowplan's MarketSense AI market research is free in beta by invitation, but it is not a business plan generator.`,
        },
        {
          question: `Does Upgrowplan replace ${target.name}?`,
          answer: `Not yet. Upgrowplan's full business plan generator, PlanMaster, is in development. What is available now is MarketSense AI market research: it collects competitors, their prices and market size from open sources — useful before you write the plan in ${target.name} or any other tool.`,
        },
        {
          question: "How current are these prices?",
          answer: `All plans and prices were checked on ${date} on each tool's own website; every card links to its source page. Prices and promotions change often — confirm on the site before you pay.`,
        },
      ];

  return { target, alts, title, description, faqs, date };
}
