import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { aboutPageSchema, breadcrumbSchema, breadcrumbs } from "@/lib/seo/jsonld";
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
          breadcrumbSchema(breadcrumbs.about(locale)),
        ]}
      />

      <Header />

      {isRu && (
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
                О платформе
              </p>
              <h1 style={{
                color: "#1e6078",
                fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: "1rem",
                maxWidth: "760px",
                margin: "0 auto 1rem",
              }}>
                Upgrowplan — ИИ-инструменты<br />
                <span style={{ color: "#0683f5" }}>для серьёзного бизнеса</span>
              </h1>
              <p style={{
                fontSize: "1.1rem",
                lineHeight: 1.75,
                color: "#171717",
                maxWidth: "620px",
                margin: "0 auto 1.25rem",
              }}>
                <strong>Upgrowplan</strong> — платформа ИИ-инструментов для предпринимателей, аналитиков и консультантов. Основана в 2024 году в Тель-Авиве. Автоматизирует бизнес-планы, маркетинговые исследования, финансовое моделирование и конкурентный мониторинг.
              </p>
              <p style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "#334155",
                maxWidth: "620px",
                margin: "0 auto 2rem",
              }}>
                Продукты: <strong>PlanMaster AI</strong>, <strong>MarketSense AI Agent</strong>, <strong>Synth Focus Lab</strong>, <strong>FinPilot Free</strong>, <strong>Business Pulse Workspace</strong>, <strong>Relocation Service Free</strong>.
              </p>

              {/* Метрики */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1rem",
                maxWidth: "620px",
                margin: "0 auto",
              }}>
                {[
                  { value: "230+", label: "бизнес-планов" },
                  { value: "$2,45 млн+", label: "привлечено для клиентов" },
                  { value: "7–15 мин", label: "на исследование рынка" },
                  { value: "15+ лет", label: "опыт команды" },
                ].map(({ value, label }) => (
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

            {/* ── 2. Как работает технология ── */}
            <section style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "1.5rem",
            }}>
              <h2 style={{ color: "#1e6078", marginBottom: "1.25rem" }}>
                Как работает технология
              </h2>
              <p style={{ color: "#334155", marginBottom: "1rem" }}>
                Платформа построена на архитектуре <strong>RAG (Retrieval-Augmented Generation)</strong> — ИИ изолирован от сбора данных и работает только с верифицированным контекстом.
              </p>
              <ol style={{ color: "#334155", lineHeight: "1.9", paddingLeft: "1.25rem" }}>
                <li>
                  <strong>Сбор данных без ИИ.</strong> Отдельный агент поиска сканирует реальный рынок: сайты конкурентов, агрегаторы, реестры компаний, налоговые и регуляторные ресурсы. ИИ не участвует в этом этапе и не может ничего «придумать».
                </li>
                <li>
                  <strong>Финансовое моделирование на Python.</strong> Расчёты доходов, расходов, cash flow, точки безубыточности и налоговой нагрузки выполняются детерминированными скриптами — без вероятностных моделей.
                </li>
                <li>
                  <strong>Анализ с ограниченной температурой.</strong> LLM-модель обрабатывает верифицированный контекст при температуре ≤ 0,2 — это гарантирует точную трактовку чисел и исключает манипуляцию данными.
                </li>
                <li>
                  <strong>Проверка артефактов.</strong> Перед финальной генерацией документа встроенный Skeptic Agent проверяет результат на наличие ИИ-галлюцинаций, нереалистичных допущений и цифрового мусора.
                </li>
              </ol>
              <p style={{ color: "#334155", marginTop: "1rem", marginBottom: 0 }}>
                Методология бизнес-планов соответствует стандартам <strong>ЮНИДО (UNIDO)</strong> и <strong>ЕБРР (EBRD)</strong> — фреймворкам, которые используют банки развития и международные инвесторы.
              </p>
            </section>

            {/* ── 3. Сравнение с ChatGPT ── */}
            <section style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "1.5rem",
            }}>
              <h2 style={{ color: "#1e6078", marginBottom: "1.25rem" }}>
                Чем Upgrowplan отличается от ChatGPT и других ИИ-инструментов
              </h2>
              <div className="table-responsive">
                <table className="table table-bordered" style={{ color: "#334155", fontSize: "0.95rem" }}>
                  <thead style={{ backgroundColor: "#f0f7ff" }}>
                    <tr>
                      <th style={{ color: "#1e6078" }}>Параметр</th>
                      <th style={{ color: "#1e6078" }}>ChatGPT / обычный ИИ</th>
                      <th style={{ color: "#1e6078" }}>Upgrowplan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Источник данных</td>
                      <td>Обучающая выборка (может быть устаревшей)</td>
                      <td>Живой поиск в момент запроса, верифицированные источники</td>
                    </tr>
                    <tr>
                      <td>Финансовые расчёты</td>
                      <td>Генерирует цифры на основе вероятностной модели</td>
                      <td>Python-скрипты с детерминированными формулами</td>
                    </tr>
                    <tr>
                      <td>Галлюцинации</td>
                      <td>Возможны; модель не знает, когда ошибается</td>
                      <td>Skeptic Agent проверяет каждый раздел перед выдачей</td>
                    </tr>
                    <tr>
                      <td>Методология</td>
                      <td>Нет фиксированной структуры</td>
                      <td>UNIDO / EBRD — стандарт банков и инвесторов</td>
                    </tr>
                    <tr>
                      <td>Налоги и регуляторика</td>
                      <td>Общие данные, часто устаревшие</td>
                      <td>Актуальные ставки для конкретной страны через агент поиска</td>
                    </tr>
                    <tr>
                      <td>Маркетинговое исследование</td>
                      <td>Общее описание рынка без конкретики</td>
                      <td>Реальные конкуренты, цены, локации — до 50 верифицированных источников</td>
                    </tr>
                    <tr>
                      <td>Время результата</td>
                      <td>Несколько минут на текст без данных</td>
                      <td>7–15 минут для исследования, 30–60 минут для бизнес-плана</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </div>
      )}

      {locale === "ru" ? <AboutPageRu /> : <AboutPageEn />}
    </>
  );
}
