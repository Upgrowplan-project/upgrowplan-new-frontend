import Link from "next/link";
import Header from "../../components/Header";
import {
  ALTERNATIVE_SLUGS,
  TOOLS,
  UPGROWPLAN,
  enPath,
  ruPath,
  pageText,
  priceLabel,
  type AlternativeSlug,
  type Locale,
  type Tool,
} from "@/lib/alternatives/data";

const FONT = '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif';
const H2 = { fontSize: "clamp(1.6rem, 2.3vw, 2.1rem)", fontWeight: 700, color: "#01346e", marginBottom: "1.5rem" } as const;
const MARKET_ARTICLE = "ai-business-plan-generator-market-research-2026";

const UI = {
  en: {
    badge: "ALTERNATIVES",
    h1: (n: string) => `${n} alternatives`,
    lead: (n: string, d: string) =>
      `Five tools to consider instead of ${n} — what each one does, its plans and prices, and who it fits. Every price was checked on ${d} on the tool's own website; each card links to its source.`,
    whatIs: (n: string) => `What ${n} is`,
    table: "Quick comparison",
    cols: ["Tool", "Free plan", "Paid plans", "Trial / refund", "Best for"],
    yes: "yes",
    no: "no",
    beta: "free beta by invitation",
    inDev: "plan generator in development",
    cards: "The alternatives in detail",
    plans: "Plans",
    trial: "Trial / refund",
    bestFor: "Best for",
    limits: "Keep in mind",
    source: "Source",
    checked: "checked",
    site: "Website",
    fitTitle: "Where Upgrowplan fits — honestly",
    fitCtaMarket: "MarketSense AI market research",
    fitCtaPlan: "About the AI business plan generator",
    more: "More comparisons",
    other: (n: string) => `${n} alternatives`,
    article: "AI Business Plan Generators: 18 Competitors and a $79 Price Point (our market research example)",
    faq: "Frequently asked questions",
    home: "Home",
  },
  ru: {
    badge: "АЛЬТЕРНАТИВЫ",
    h1: (n: string) => `Альтернативы ${n}`,
    lead: (n: string, d: string) =>
      `Пять сервисов, которые можно взять вместо ${n}: что делает каждый, тарифы и цены, кому подходит. Все цены проверены ${d} на сайтах самих сервисов; в каждой карточке — ссылка на источник.`,
    whatIs: (n: string) => `Что такое ${n}`,
    table: "Сравнение коротко",
    cols: ["Сервис", "Бесплатный тариф", "Платные тарифы", "Пробный период / возврат", "Кому подходит"],
    yes: "есть",
    no: "нет",
    beta: "бесплатная бета по приглашению",
    inDev: "генератор плана в разработке",
    cards: "Альтернативы подробно",
    plans: "Тарифы",
    trial: "Пробный период / возврат",
    bestFor: "Кому подходит",
    limits: "Учтите",
    source: "Источник",
    checked: "проверено",
    site: "Сайт",
    fitTitle: "Где здесь Upgrowplan — честно",
    fitCtaMarket: "Исследование рынка MarketSense AI",
    fitCtaPlan: "Об ИИ-генераторе бизнес-плана",
    more: "Другие сравнения",
    other: (n: string) => `Альтернативы ${n}`,
    article: "ИИ-генераторы бизнес-планов: 18 конкурентов и чек $79 (пример нашего исследования рынка)",
    faq: "Частые вопросы",
    home: "Главная",
  },
};

function ToolCard({ tool, locale, date }: { tool: Tool; locale: Locale; date: string }) {
  const t = UI[locale];
  return (
    <article id={tool.id} style={{ background: "#ffffff", border: "1px solid #d9ebf5", borderRadius: 14, padding: "1.5rem" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#01346e", margin: "0 0 0.6rem" }}>{tool.name}</h3>
      <p style={{ fontSize: "0.97rem", lineHeight: 1.65, margin: "0 0 1rem" }}>{tool.whatItIs[locale]}</p>
      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e6078", margin: "0 0 0.4rem" }}>{t.plans}</h4>
      <ul style={{ margin: "0 0 1rem", paddingLeft: "1.2rem", lineHeight: 1.6, fontSize: "0.95rem" }}>
        {tool.plans.map((p) => (
          <li key={p.en}>{p[locale]}</li>
        ))}
      </ul>
      <p style={{ margin: "0 0 0.4rem", fontSize: "0.95rem" }}>
        <strong>{t.trial}:</strong> {tool.trial[locale]}
      </p>
      <p style={{ margin: "0 0 0.4rem", fontSize: "0.95rem" }}>
        <strong>{t.bestFor}:</strong> {tool.bestFor[locale]}
      </p>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.95rem" }}>
        <strong>{t.limits}:</strong> {tool.limits[locale]}
      </p>
      <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
        {t.source}:{" "}
        <a href={tool.sourceUrl} rel="nofollow noopener" target="_blank" style={{ color: "#1e6078" }}>
          {tool.sourceLabel}
        </a>
        , {t.checked} {date}
      </p>
    </article>
  );
}

export default function AlternativesPage({ slug, locale }: { slug: AlternativeSlug; locale: Locale }) {
  const t = UI[locale];
  const ru = locale === "ru";
  const { target, alts, faqs, date } = pageText(slug, locale);
  const href = (p: string) => (ru ? `/ru${p}` : p);
  const cell = { padding: "0.7rem 0.9rem", borderBottom: "1px solid #d9ebf5", verticalAlign: "top" } as const;

  return (
    <div style={{ fontFamily: FONT, color: "#171717" }}>
      <Header />
      <main>
        {/* Hero */}
        <section style={{ background: "#d9ebf5", padding: "3.5rem 1rem 3rem" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-block", background: "#1e6078", color: "#fff", borderRadius: 20, padding: "0.3rem 1rem", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.1rem", letterSpacing: "0.05em" }}>
              {t.badge}
            </div>
            <h1 style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)", fontWeight: 700, color: "#1e6078", lineHeight: 1.15, margin: "0 0 1.1rem" }}>
              {t.h1(target.name)}
            </h1>
            <p data-speakable style={{ fontSize: "1.08rem", maxWidth: 680, margin: "0 auto", lineHeight: 1.65 }}>
              {t.lead(target.name, date)}
            </p>
          </div>
        </section>

        {/* What the target is */}
        <section style={{ padding: "3rem 1rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={H2}>{t.whatIs(target.name)}</h2>
            <ToolCard tool={target} locale={locale} date={date} />
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ padding: "2.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={H2}>{t.table}</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse", fontSize: "0.92rem", fontFamily: FONT }}>
                <thead>
                  <tr style={{ background: "#01346e", color: "#fff" }}>
                    {t.cols.map((c) => (
                      <th key={c} style={{ padding: "0.8rem 0.9rem", textAlign: "left", fontWeight: 600 }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alts.map((a, i) => (
                    <tr key={a.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f7fbff" }}>
                      <td style={{ ...cell, fontWeight: 700, color: "#01346e" }}>
                        <a href={`#${a.id}`} style={{ color: "#01346e" }}>{a.name}</a>
                      </td>
                      <td style={cell}>{a.free ? t.yes : t.no}</td>
                      <td style={cell}>{priceLabel(a, locale)}</td>
                      <td style={cell}>{a.trial[locale]}</td>
                      <td style={cell}>{a.bestFor[locale]}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "rgba(7,133,246,0.06)" }}>
                    <td style={{ ...cell, fontWeight: 700, color: "#01346e" }}>
                      <a href="#upgrowplan" style={{ color: "#01346e" }}>Upgrowplan</a>
                    </td>
                    <td style={cell}>{t.beta}</td>
                    <td style={cell}>{t.inDev}</td>
                    <td style={cell}>—</td>
                    <td style={cell}>{UPGROWPLAN.bestFor[locale]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section style={{ padding: "2.5rem 1rem 3rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={H2}>{t.cards}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {alts.map((a) => (
                <ToolCard key={a.id} tool={a} locale={locale} date={date} />
              ))}
            </div>
          </div>
        </section>

        {/* Upgrowplan, honestly */}
        <section id="upgrowplan" style={{ padding: "3rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={H2}>{t.fitTitle}</h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.65, margin: "0 0 1rem" }}>{UPGROWPLAN.whatItIs[locale]}</p>
            <ul style={{ margin: "0 0 1rem", paddingLeft: "1.2rem", lineHeight: 1.6 }}>
              {UPGROWPLAN.plans.map((p) => (
                <li key={p.en}>{p[locale]}</li>
              ))}
            </ul>
            <p style={{ margin: "0 0 0.5rem" }}>
              <strong>{t.bestFor}:</strong> {UPGROWPLAN.bestFor[locale]}
            </p>
            <p style={{ margin: "0 0 1.5rem" }}>
              <strong>{t.limits}:</strong> {UPGROWPLAN.limits[locale]}
            </p>
            <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
              <Link href={href("/solutions/marketResearch/descriptionPage")} style={{ background: "#1e6078", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
                {t.fitCtaMarket}
              </Link>
              <Link href={href("/ai-business-plan-generator")} style={{ color: "#1e6078", padding: "0.75rem 1.5rem", borderRadius: 8, textDecoration: "none", fontWeight: 600, border: "2px solid #1e6078" }}>
                {t.fitCtaPlan}
              </Link>
            </div>
          </div>
        </section>

        {/* More comparisons */}
        <section style={{ padding: "2.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={H2}>{t.more}</h2>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.9 }}>
              {ALTERNATIVE_SLUGS.filter((s) => s !== slug).map((s) => (
                <li key={s}>
                  <Link href={ru ? ruPath(s) : enPath(s)} style={{ color: "#1e6078" }}>{t.other(TOOLS[s].name)}</Link>
                </li>
              ))}
              <li>
                <Link href={href(`/blog/${MARKET_ARTICLE}`)} style={{ color: "#1e6078" }}>{t.article}</Link>
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "3rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <h2 style={H2}>{t.faq}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((f) => (
                <div key={f.question} style={{ border: "1px solid #d9ebf5", borderRadius: 10, padding: "1.1rem 1.4rem" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", margin: "0 0 0.5rem" }}>{f.question}</h3>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.65, margin: 0 }}>{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export { UI as ALTERNATIVES_UI };
