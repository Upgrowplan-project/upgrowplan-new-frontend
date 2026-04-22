import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { aboutPageSchema, aboutFaqSchema, breadcrumbSchema, breadcrumbs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import Header from "@/components/Header";
import AboutPageEn from "../../about/page.en";
import AboutPageRu from "../../about/page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.about;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function AboutLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const isRu = locale === "ru";

  return (
    <>
      <JsonLd
        data={[
          aboutPageSchema(locale),
          aboutFaqSchema(locale),
          breadcrumbSchema(breadcrumbs.about(locale)),
        ]}
      />

      <Header />

      <div style={{ backgroundColor: "#f8f9fa" }}>

        {/* ── Hero ── */}
        <section style={{
          padding: "5rem 0 3rem",
          background: `
            radial-gradient(1200px 600px at 10% 10%, rgba(7, 133, 246, 0.12), transparent 60%),
            linear-gradient(120deg, rgba(30, 96, 120, 0.06), rgba(7, 133, 246, 0.02))
          `,
        }}>
          <div className="container" style={{ textAlign: "center" }}>
            <p style={{
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#1e6078",
              fontWeight: 600,
              marginBottom: "0.75rem",
            }}>
              {isRu ? "О платформе" : "About the platform"}
            </p>
            <h1 style={{
              color: "#1e6078",
              fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: "760px",
              margin: "0 auto 1rem",
            }}>
              {isRu ? (
                <>Upgrowplan — ИИ-инструменты<br /><span style={{ color: "#0683f5" }}>для серьёзного бизнеса</span></>
              ) : (
                <>Upgrowplan — AI tools<br /><span style={{ color: "#0683f5" }}>built for serious business</span></>
              )}
            </h1>
            <p style={{
              fontSize: "1.1rem",
              lineHeight: 1.75,
              color: "#171717",
              maxWidth: "620px",
              margin: "0 auto 1.25rem",
            }}>
              {isRu
                ? <><strong>Upgrowplan</strong> — платформа ИИ-инструментов для предпринимателей, аналитиков и консультантов. Основана в 2024 году в Тель-Авиве. Автоматизирует бизнес-планы, маркетинговые исследования, финансовое моделирование и конкурентный мониторинг.</>
                : <><strong>Upgrowplan</strong> is an AI platform for entrepreneurs, analysts and consultants. Founded in 2024 in Tel Aviv. Automates business plans, market research, financial modelling and competitor monitoring.</>
              }
            </p>
            <p style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#334155",
              maxWidth: "620px",
              margin: "0 auto 2rem",
            }}>
              {isRu
                ? <>Продукты: <strong>PlanMaster AI</strong>, <strong>MarketSense AI Agent</strong>, <strong>Synth Focus Lab</strong>, <strong>FinPilot Free</strong>, <strong>Business Pulse Workspace</strong>, <strong>Relocation Service Free</strong>.</>
                : <>Products: <strong>PlanMaster AI</strong>, <strong>MarketSense AI Agent</strong>, <strong>Synth Focus Lab</strong>, <strong>FinPilot Free</strong>, <strong>Business Pulse Workspace</strong>, <strong>Relocation Service Free</strong>.</>
              }
            </p>

            {/* Метрики / Metrics */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
              maxWidth: "620px",
              margin: "0 auto",
            }}>
              {(isRu
                ? [
                    { value: "230+", label: "бизнес-планов" },
                    { value: "$2,45 млн+", label: "привлечено для клиентов" },
                    { value: "7–15 мин", label: "на исследование рынка" },
                    { value: "15+ лет", label: "опыт команды" },
                  ]
                : [
                    { value: "230+", label: "business plans" },
                    { value: "$2.45M+", label: "raised for clients" },
                    { value: "7–15 min", label: "for market research" },
                    { value: "15+ years", label: "team experience" },
                  ]
              ).map(({ value, label }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(6,131,245,0.2)",
                  borderRadius: "12px",
                  padding: "0.75rem 1rem",
                }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0683f5" }}>
                    {value}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.15rem" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container pb-2" style={{ paddingTop: "2rem" }}>

          {/* ── How the technology works ── */}
          <section style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}>
            <h2 style={{ color: "#1e6078", marginBottom: "1.25rem" }}>
              {isRu ? "Как работает технология" : "How the technology works"}
            </h2>
            <p style={{ color: "#334155", marginBottom: "1rem" }}>
              {isRu
                ? <>Платформа построена на архитектуре <strong>RAG (Retrieval-Augmented Generation)</strong> — ИИ изолирован от сбора данных и работает только с верифицированным контекстом.</>
                : <>The platform uses <strong>RAG (Retrieval-Augmented Generation)</strong> architecture — the AI is isolated from data collection and works only with verified context.</>
              }
            </p>
            <ol style={{ color: "#334155", lineHeight: "1.9", paddingLeft: "1.25rem" }}>
              {isRu ? (
                <>
                  <li><strong>Сбор данных без ИИ.</strong> Отдельный агент поиска сканирует реальный рынок: сайты конкурентов, агрегаторы, реестры компаний, налоговые и регуляторные ресурсы. ИИ не участвует в этом этапе и не может ничего «придумать».</li>
                  <li><strong>Финансовое моделирование на Python.</strong> Расчёты доходов, расходов, cash flow, точки безубыточности и налоговой нагрузки выполняются детерминированными скриптами — без вероятностных моделей.</li>
                  <li><strong>Анализ с ограниченной температурой.</strong> LLM-модель обрабатывает верифицированный контекст при температуре ≤ 0,2 — это гарантирует точную трактовку чисел и исключает манипуляцию данными.</li>
                  <li><strong>Проверка артефактов.</strong> Перед финальной генерацией документа встроенный Skeptic Agent проверяет результат на наличие ИИ-галлюцинаций, нереалистичных допущений и цифрового мусора.</li>
                </>
              ) : (
                <>
                  <li><strong>Data collection without AI.</strong> A dedicated search agent scans the real market — competitor websites, aggregators, company registries, tax and regulatory resources. The AI plays no role at this stage and cannot fabricate anything.</li>
                  <li><strong>Financial modelling in Python.</strong> Revenue, expenses, cash flow, break-even and tax calculations are performed by deterministic scripts — no probabilistic models.</li>
                  <li><strong>Analysis at restricted temperature.</strong> The LLM processes verified context at temperature ≤ 0.2, ensuring precise interpretation of numbers and eliminating data manipulation.</li>
                  <li><strong>Artifact verification.</strong> Before final document generation, the built-in Skeptic Agent checks the output for AI hallucinations, unrealistic assumptions and numerical errors.</li>
                </>
              )}
            </ol>
            <p style={{ color: "#334155", marginTop: "1rem", marginBottom: 0 }}>
              {isRu
                ? <>Методология бизнес-планов соответствует стандартам <strong>ЮНИДО (UNIDO)</strong> и <strong>ЕБРР (EBRD)</strong> — фреймворкам, которые используют банки развития и международные инвесторы.</>
                : <>Business plan methodology follows <strong>UNIDO</strong> and <strong>EBRD</strong> standards — frameworks used by development banks and international investors.</>
              }
            </p>
          </section>

          {/* ── Comparison table ── */}
          <section style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}>
            <h2 style={{ color: "#1e6078", marginBottom: "1.25rem" }}>
              {isRu
                ? "Чем Upgrowplan отличается от ChatGPT и других ИИ-инструментов"
                : "How Upgrowplan differs from ChatGPT and other AI tools"
              }
            </h2>
            <div className="table-responsive">
              <table className="table table-bordered" style={{ color: "#334155", fontSize: "0.95rem" }}>
                <thead style={{ backgroundColor: "#f0f7ff" }}>
                  <tr>
                    <th style={{ color: "#1e6078" }}>{isRu ? "Параметр" : "Parameter"}</th>
                    <th style={{ color: "#1e6078" }}>{isRu ? "ChatGPT / обычный ИИ" : "ChatGPT / generic AI"}</th>
                    <th style={{ color: "#1e6078" }}>Upgrowplan</th>
                  </tr>
                </thead>
                <tbody>
                  {(isRu ? [
                    ["Источник данных", "Обучающая выборка (может быть устаревшей)", "Живой поиск в момент запроса, верифицированные источники"],
                    ["Финансовые расчёты", "Генерирует цифры на основе вероятностной модели", "Python-скрипты с детерминированными формулами"],
                    ["Галлюцинации", "Возможны; модель не знает, когда ошибается", "Skeptic Agent проверяет каждый раздел перед выдачей"],
                    ["Методология", "Нет фиксированной структуры", "UNIDO / EBRD — стандарт банков и инвесторов"],
                    ["Налоги и регуляторика", "Общие данные, часто устаревшие", "Актуальные ставки для конкретной страны через агент поиска"],
                    ["Маркетинговое исследование", "Общее описание рынка без конкретики", "Реальные конкуренты, цены, локации — до 50 верифицированных источников"],
                    ["Время результата", "Несколько минут на текст без данных", "7–15 минут для исследования, 30–60 минут для бизнес-плана"],
                  ] : [
                    ["Data source", "Training data (may be outdated)", "Live web search at query time, 50+ verified sources"],
                    ["Financial calculations", "Generates numbers via probabilistic model", "Python scripts with deterministic formulas"],
                    ["Hallucinations", "Possible; model doesn't know when it's wrong", "Skeptic Agent checks every section before delivery"],
                    ["Methodology", "No fixed structure", "UNIDO / EBRD — the standard for banks and investors"],
                    ["Tax & regulatory data", "Generic, often outdated", "Live rates for the specific country via search agent"],
                    ["Market research", "Generic market description without specifics", "Real competitors, prices, locations — up to 50 verified sources"],
                    ["Time to result", "Minutes for text without real data", "7–15 min for research, 30–60 min for business plan"],
                  ]).map(([param, generic, upgrow]) => (
                    <tr key={param}>
                      <td>{param}</td>
                      <td>{generic}</td>
                      <td>{upgrow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>

      {locale === "ru" ? <AboutPageRu /> : <AboutPageEn />}
    </>
  );
}
