"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const FONT = '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif';

const faqs = [
  { q: "В чём главное отличие Upgrowplan от ChatGPT?", a: "ChatGPT генерирует текст из обучающих данных — он не может получить актуальные цены конкурентов или реальный объём рынка. Он выдаёт правдоподобные, но часто неточные числа. Upgrowplan использует RAG: агент живого поиска собирает данные из 50+ источников, Python-скрипты выполняют детерминированные расчёты, а Skeptic Agent проверяет каждую цифру." },
  { q: "Как Upgrowplan предотвращает галлюцинации ИИ?", a: "Три уровня защиты: (1) Search Agent собирает живые данные до генерации текста. (2) Финансовые расчёты выполняются детерминированными Python-скриптами. (3) Skeptic Agent проверяет каждый раздел и требует исправлений нереалистичных допущений до финализации." },
  { q: "Как Upgrowplan сравнивается с Upmetrics или LivePlan?", a: "Upmetrics и LivePlan — конструкторы по шаблону: вы вводите данные, они форматируют документ. Upgrowplan активно исследует рынок, находит конкурентов, оценивает возможность, строит финансовую модель и валидирует результат." },
  { q: "Дешевле ли Upgrowplan, чем нанять консультанта?", a: "Консультант берёт 100 000–400 000 руб. и 2–4 недели. Upgrowplan создаёт сопоставимый документ с живыми данными и финансовой моделью за 10–20 минут." },
  { q: "Соответствует ли Upgrowplan международным стандартам?", a: "Да. Планы следуют стандартам ЮНИДО и ЕБРР — международным методологиям, которые используют банки развития, грантовые комитеты и международные инвесторы." },
];

const comparisonRows = [
  { feature: "Актуальные рыночные данные", upgrow: true, chatgpt: false, template: false, consultant: true },
  { feature: "Детерминированная финансовая модель", upgrow: true, chatgpt: false, template: false, consultant: true },
  { feature: "Проверка галлюцинаций (Skeptic Agent)", upgrow: true, chatgpt: false, template: false, consultant: "частично" },
  { feature: "Стандарт ЮНИДО / ЕБРР", upgrow: true, chatgpt: false, template: false, consultant: "зависит" },
  { feature: "Word + питч-презентация", upgrow: true, chatgpt: false, template: "только шаблон", consultant: true },
  { feature: "Время готовности", upgrow: "10–20 мин", chatgpt: "сразу, но неточно", template: "самостоятельно", consultant: "2–4 недели" },
  { feature: "Стоимость", upgrow: "от плана", chatgpt: "~$20/мес", template: "бесплатно", consultant: "100–400 тыс. руб." },
];

const reasons = [
  {
    icon: "🔍",
    title: "RAG-архитектура вместо угадывания",
    text: "Search Agent собирает живые данные из 50+ верифицированных источников — Google Maps, Statista, открытые реестры, отраслевые базы. Только после сбора данных LLM обрабатывает верифицированный контекст при температуре ≤ 0,2.",
  },
  {
    icon: "🧮",
    title: "Python-расчёты вместо ИИ-оценок",
    text: "Все финансовые модели — P&L, денежный поток, точка безубыточности, прогноз на 3 года — рассчитываются детерминированными Python-скриптами. Числа математически точны, а не «похожи на правду».",
  },
  {
    icon: "🕵️",
    title: "Skeptic Agent проверяет каждый раздел",
    text: "Встроенный агент сверяет все ключевые показатели с живыми источниками. Доля рынка 90%? Маржа 300%? Окупаемость 2 месяца? Агент помечает и требует исправлений до выдачи документа.",
  },
  {
    icon: "🏦",
    title: "Методология ЮНИДО / ЕБРР",
    text: "Структура плана соответствует международным стандартам банков развития и инвестиционных фондов. Такой документ принимают банки, грантовые комитеты и инвесторы — без дополнительной доработки.",
  },
];

function CheckIcon() {
  return <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>;
}
function CrossIcon() {
  return <span style={{ color: "#dc2626" }}>✗</span>;
}
function CellVal({ val }: { val: boolean | string }) {
  if (val === true) return <CheckIcon />;
  if (val === false) return <CrossIcon />;
  return <span style={{ color: "#64748b", fontSize: "0.88rem" }}>{val}</span>;
}

export default function WhyUpgrowplanRu() {
  return (
    <div style={{ fontFamily: FONT, color: "#171717" }}>
      <Header />
      <main>

        {/* Hero */}
        <section style={{ background: "#d9ebf5", padding: "4rem 1rem 3.5rem" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-block", background: "#1e6078", color: "#fff", borderRadius: 20, padding: "0.3rem 1rem", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", letterSpacing: "0.05em" }}>
              СРАВНЕНИЕ
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 4vw, 3.8rem)", fontWeight: 700, color: "#1e6078", lineHeight: 1.15, marginBottom: "1.25rem" }}>
              Почему Upgrowplan, а не ChatGPT или консультант?
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#171717", maxWidth: 640, margin: "0 auto 2rem", lineHeight: 1.65 }}>
              ИИ без верификации данных — это дорогой генератор правдоподобных ошибок. Вот как Upgrowplan решает проблему галлюцинаций, которая делает обычные ИИ-планы непригодными для банков и инвесторов.
            </p>
          </div>
        </section>

        {/* 4 reasons */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2.5rem", textAlign: "center" }}>
              4 архитектурных отличия
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.4rem" }}>
              {reasons.map((r) => (
                <div key={r.title} style={{ background: "#f7fbff", borderRadius: 14, padding: "1.5rem", border: "1px solid #d9ebf5" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{r.icon}</div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.5rem" }}>{r.title}</h3>
                  <p style={{ fontSize: "0.93rem", color: "#171717", lineHeight: 1.65, margin: 0 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2rem", textAlign: "center" }}>
              Сравнительная таблица
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.93rem", fontFamily: FONT }}>
                <thead>
                  <tr style={{ background: "#01346e", color: "#fff" }}>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontWeight: 600 }}>Параметр</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 700, color: "#7dd3fc" }}>Upgrowplan</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 600 }}>ChatGPT</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 600 }}>Шаблон</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 600 }}>Консультант</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.feature} style={{ background: i % 2 === 0 ? "#ffffff" : "#f7fbff" }}>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#01346e" }}>{row.feature}</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center", background: "rgba(7,133,246,0.06)" }}><CellVal val={row.upgrow} /></td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><CellVal val={row.chatgpt} /></td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><CellVal val={row.template} /></td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><CellVal val={row.consultant} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2rem", textAlign: "center" }}>
              Часто задаваемые вопросы
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((faq) => (
                <div key={faq.q} style={{ border: "1px solid #d9ebf5", borderRadius: 10, padding: "1.2rem 1.5rem" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.5rem" }}>{faq.q}</h3>
                  <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#01346e", padding: "3.5rem 1rem", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#ffffff", marginBottom: "1rem" }}>
              Убедитесь сами
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#d9ebf5", marginBottom: "2rem", lineHeight: 1.65 }}>
              Создайте бизнес-план с PlanMaster AI и сравните с тем, что даёт ChatGPT. Разница видна с первого раздела.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ru/solutions" style={{ background: "transparent", color: "#d9ebf5", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "1rem", border: "2px solid rgba(217,235,245,0.4)" }}>
                Все инструменты
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
