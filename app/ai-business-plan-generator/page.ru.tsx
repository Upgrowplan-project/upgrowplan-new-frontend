"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "../../components/Header";
import IntelligenceLabV3 from "../solutions/planMaster/descriptionPage/IntelligenceLab-v3";

const FONT = '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif';

const INFO_TABS = [
  {
    id: "how",
    icon: "🔍",
    label: "Как это работает",
    title: "Как это работает",
    text: "Сервис формирует бизнес‑план в утверждённом формате. Используются классическая методология планирования, маркетинговый и экономический анализ. Полное исследование и выдача документа занимает 5–10 минут.",
    bullets: [
      "Анализирует идею, формат бизнеса, город, источники финансирования и входные параметры проекта.",
      "Собирает данные по рынку и конкурентам для обоснования ключевых метрик (средний чек, спрос). Предлагает маркетинговую стратегию на основе актуальных данных. Подтягивает свежие данные по аренде, зарплатам и налогам в регионе.",
      "Строит реалистичную финансовую модель: прогноз выручки, расходов, прибыли, налогов, рентабельности и окупаемости.",
      "Если проект недостаточно прибыльный — останавливает генерацию, указывает критическую метрику и предлагает корректировки.",
      "Выдаёт финальный документ с разделами, источниками и выводом, готовый к подаче.",
    ],
    tags: ["Глубокий поиск", "Конкурентный анализ", "Финмодель", "Валидация"],
  },
  {
    id: "inputs",
    icon: "🗂️",
    label: "Какие нужны данные",
    title: "Какие нужны данные",
    text: "Чем точнее и полнее входные данные, тем выше качество анализа рынка, тем точнее находятся прямые конкуренты и тем реалистичнее финансовые расчёты.",
    bullets: [
      "Опишите бизнес‑идею: продукт/услуга, формат, ключевое отличие, специфика продукта или клиента, важные параметры (площадь, локация).",
      "Укажите географию (регион, город и точный адрес при наличии) для корректного анализа конкурентов и аудитории.",
      "Опишите структуру финансирования: собственные средства, поддержка, уже вложенные суммы и период расходов. Укажите текущую долговую нагрузку.",
      "Заполните профиль инициатора: опыт, образование, навыки, достижения — это повышает доверие к документу.",
    ],
    tags: ["Локация", "Формат бизнеса", "ЦА", "Масштаб"],
  },
  {
    id: "result",
    icon: "📬",
    label: "Что вы получаете",
    title: "Что вы получаете",
    text: "Вы получаете готовый бизнес‑план и прозрачную логику расчётов.",
    bullets: [
      "Сводный отчёт с ключевыми метриками: инвестиции, прибыль, рентабельность, налоги, окупаемость.",
      "Разделы по рынку, конкурентам, целевой аудитории, организации, производству и финансам.",
      "Источники данных в тексте и приложении — все выводы можно проверить.",
      "DOCX‑файл для редактирования и подачи.",
    ],
    tags: ["TAM / SAM / SOM", "Профили конкурентов", "Источники", "DOCX"],
  },
];

const PRODUCTS = [
  {
    id: "worldwide",
    icon: "bi-globe-americas",
    title: "Upgrowplan Worldwide",
    subtitle: "Глобальная версия",
    description:
      "Генератор бизнес-планов для проектов в любой юрисдикции. Валюта, налоговые и рыночные вводные подтягиваются под выбранную страну и город. Мультивалютная финмодель, совместимость с требованиями международных банков и фондов.",
    status: "pending" as const,
  },
  {
    id: "soccontract",
    icon: "bi-file-earmark-check",
    title: "Соцконтракт 2026",
    subtitle: "Локальная версия (РФ)",
    description:
      "Бизнес-план под утверждённую форму подачи на соцконтракт. Встроены ориентиры по критериям господдержки и логика проверки согласованности разделов с ожиданиями Минтруда. Время генерации — 5–10 минут.",
    status: "active" as const,
  },
];

const faqs = [
  { q: "Что выдаёт ИИ-генератор бизнес-планов?", a: "PlanMaster AI генерирует полноценный бизнес-план: резюме, анализ рынка с конкурентами, финансовую модель (P&L, денежный поток, точка безубыточности, прогноз на 3 года), маркетинговую стратегию, операционный план и оценку рисков — в формате Word (.docx) плюс питч-презентацию." },
  { q: "Сколько времени занимает генерация?", a: "10–20 минут. Системе нужно время на сбор живых данных из 50+ источников, детерминированные Python-расчёты и проверку через Skeptic Agent перед выдачей документа." },
  { q: "Чем это отличается от ChatGPT или шаблона?", a: "Шаблоны не содержат ваших данных. ChatGPT галлюцинирует числа из обучающей выборки. PlanMaster собирает живые данные рынка, выполняет реальные расчёты и проверяет каждую цифру через Skeptic Agent." },
  { q: "Соответствует ли план стандартам ЮНИДО / ЕБРР?", a: "Да. Структура плана следует стандартам ЮНИДО и ЕБРР — международным методологиям, которые используют банки развития и инвестиционные фонды для оценки проектов." },
  { q: "Включена ли питч-презентация?", a: "Да. Помимо Word-документа PlanMaster генерирует питч-презентацию с инвестиционным тезисом, рынком, финансами и конкурентным позиционированием." },
  { q: "Для каких стран и отраслей работает?", a: "Для любых. Вы указываете страну, город, валюту и тип бизнеса (B2B / B2C / B2B2C). Система автоматически адаптирует налоги, рыночный контекст и финансовые бенчмарки." },
  { q: "Как написать бизнес-план с помощью ИИ?", a: "С PlanMaster AI: опишите бизнес-идею и целевой рынок, укажите страну и тип бизнеса — система соберёт живые рыночные данные, построит финансовую модель на Python-расчётах, проверит каждую цифру через Skeptic Agent и выдаст готовый Word-документ с питч-презентацией за 10–20 минут." },
  { q: "Какой ИИ лучше всего подходит для написания бизнес-плана?", a: "Лучший ИИ-инструмент собирает живые данные (не угадывает из обучающей выборки), выполняет реальные финансовые расчёты и валидирует результат. PlanMaster AI делает всё три: RAG-поиск, детерминированная финмодель на Python и Skeptic Agent — по стандартам ЮНИДО/ЕБРР." },
];

const deliverables = [
  { icon: "📄", title: "Резюме проекта", text: "Ключевые метрики, инвестиции, прибыль, рентабельность, окупаемость — на одной странице для инвестора." },
  { icon: "📊", title: "Анализ рынка", text: "TAM/SAM/SOM, карта конкурентов (до 20 игроков), сегменты клиентов, тренды спроса и ценовые бенчмарки." },
  { icon: "💰", title: "Финансовая модель", text: "P&L, денежный поток, точка безубыточности, прогноз выручки и расходов на 3 года. Python-расчёты без ИИ-угадывания." },
  { icon: "🎯", title: "Маркетинговая стратегия", text: "Позиционирование, каналы привлечения, ключевые сообщения — на основе реальных данных о рынке и конкурентах." },
  { icon: "📑", title: "Word-документ (.docx)", text: "Полноформатный бизнес-план с источниками данных. Готов к подаче в банк, грантовый комитет или инвестору." },
  { icon: "🚀", title: "Питч-презентация", text: "Структурированная презентация с инвестиционным тезисом, рынком, финансами и конкурентным позиционированием." },
];

const steps = [
  { num: "01", title: "Опишите идею", text: "Укажите продукт или услугу, ключевое отличие, целевую аудиторию и страну работы. Чем точнее — тем релевантнее анализ рынка." },
  { num: "02", title: "Задайте параметры", text: "Выберите тип бизнеса (B2B/B2C/B2B2C), масштаб, отрасль и валюту. PlanMaster поддерживает любую страну и автоматически адаптирует контекст." },
  { num: "03", title: "ИИ-агенты собирают данные", text: "Search Agent сканирует 50+ живых источников: цены конкурентов, объём рынка, тренды, данные по аренде и зарплатам в регионе." },
  { num: "04", title: "Skeptic Agent проверяет каждую цифру", text: "Встроенный агент-скептик сверяет все ключевые показатели с живыми источниками. Нереалистичные допущения — помечаются и исправляются до финализации." },
  { num: "05", title: "Скачайте Word + питч", text: "Готовый бизнес-план в формате .docx и питч-презентация — доступны для скачивания без дополнительного редактирования." },
];

function BetaForm() {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Введите корректный Email");
      return;
    }
    if (!isChecked) return;
    setError("");
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";
      await fetch(`${API_BASE}/api/monitoring/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          email,
          message: `запрос на бета-тестирование PlanMaster AI получен`,
        }),
      });
      setSubmitted(true);
      setEmail("");
      setIsChecked(false);
    } catch (err) {
      console.error("Error sending beta request:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#16a34a" }}>
        <span style={{ fontSize: 20 }}>✔</span>
        <span style={{ fontWeight: 600 }}>Спасибо за ваш интерес! Мы свяжемся с вами в ближайшее время.</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
      <div className="mb-3">
        <label htmlFor="beta-email-ru" className="form-label small fw-semibold text-secondary">Email</label>
        <input
          id="beta-email-ru"
          type="email"
          className="form-control form-control-lg rounded-3 border-0 shadow-sm"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        {error && <div className="text-danger small mt-2">{error}</div>}
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="beta-policy-plan-ru"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label className="form-check-label" htmlFor="beta-policy-plan-ru">
          Отправляя данное сообщение, я ознакомился и согласился с{" "}
          <a href="/privacy" target="_blank">Политикой конфиденциальности</a>{" "}и{" "}
          <a href="/privacy" target="_blank">Политикой обработки персональных данных</a>.
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-lg w-100 rounded-3 fw-semibold border-0"
        style={{ backgroundColor: loading ? "#5aabf7" : "#0683f5", color: "#fff", transition: "background-color 0.2s" }}
        disabled={!isChecked || loading}
      >
        {loading ? "Отправка..." : "Подтвердить"}
      </button>
    </form>
  );
}

export default function AiBizPlanGeneratorRu() {
  const [activeTab, setActiveTab] = useState("how");
  const active = INFO_TABS.find((t) => t.id === activeTab) ?? INFO_TABS[0];

  return (
    <div style={{ fontFamily: FONT, color: "#171717" }}>
      <Header />
      <main>

        {/* Hero */}
        <section style={{ background: "#d9ebf5", padding: "4rem 1rem 3.5rem" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-block", background: "#1e6078", color: "#fff", borderRadius: 20, padding: "0.3rem 1rem", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", letterSpacing: "0.05em" }}>
              ИИ · БИЗНЕС-ПЛАН · ЮНИДО/ЕБРР
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 4vw, 3.8rem)", fontWeight: 700, color: "#1e6078", lineHeight: 1.15, marginBottom: "1.25rem" }}>
              ИИ-генератор бизнес-планов
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#171717", maxWidth: 640, margin: "0 auto 0.75rem", lineHeight: 1.65 }}>
              Бизнес-план для инвестора, банка или гранта — с реальными данными рынка, финансовой моделью и питч-презентацией.
            </p>
            <p style={{ fontSize: "1rem", color: "#1e6078", fontWeight: 600, marginBottom: "2rem" }}>
              Стандарты ЮНИДО / ЕБРР · Skeptic Agent · 10–20 минут · Word + питч
            </p>
            <p style={{ fontSize: "0.87rem", color: "#64748b", marginBottom: "1.5rem" }}>
              ⏳ Продукт в разработке. Релиз — лето 2026.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#beta-form" style={{ background: "#0683f5", color: "#fff", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>
                Забронировать место
              </a>
              <Link href="/ru/why-upgrowplan" style={{ background: "transparent", color: "#1e6078", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "1rem", border: "2px solid #1e6078" }}>
                Почему не ChatGPT?
              </Link>
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2rem", textAlign: "center" }}>
              Что входит в готовый бизнес-план
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.2rem" }}>
              {deliverables.map((d) => (
                <div key={d.title} style={{ background: "#f7fbff", borderRadius: 12, padding: "1.4rem", border: "1px solid #d9ebf5" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{d.icon}</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#01346e", marginBottom: "0.4rem" }}>{d.title}</h3>
                  <p style={{ fontSize: "0.92rem", color: "#171717", lineHeight: 1.65, margin: 0 }}>{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section style={{ padding: "2.5rem 1rem", background: "#01346e" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            {[
              { label: "Методология", value: "ЮНИДО / ЕБРР" },
              { label: "Источников данных", value: "50+" },
              { label: "Время генерации", value: "10–20 мин" },
              { label: "Проверка данных", value: "Skeptic Agent" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff" }}>{item.value}</div>
                <div style={{ fontSize: "0.82rem", color: "#d9ebf5", marginTop: "0.2rem" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture diagram */}
        <IntelligenceLabV3 />

        {/* How it works steps */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2.5rem", textAlign: "center" }}>
              Как работает генерация
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {steps.map((step) => (
                <div key={step.num} style={{ display: "flex", gap: "1.25rem", background: "#ffffff", borderRadius: 12, padding: "1.25rem 1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0683f5", minWidth: 36 }}>{step.num}</div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.3rem" }}>{step.title}</h3>
                    <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0 }}>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service principles tabs */}
        <section className="container py-5">
          <section style={{ background: "#f0f7ff", padding: "56px 0", borderRadius: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.3rem)", color: "#1e6078" }}>
                Принципы работы сервиса.
                <span style={{ color: "#0683f5" }}> Мы стараемся не усложнять:</span>
              </h2>
            </div>
            <div
              style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}
            >
              {INFO_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 26px", borderRadius: 40,
                    border: `2px solid ${activeTab === t.id ? "#0683f5" : "#dde8f5"}`,
                    background: activeTab === t.id ? "#0683f5" : "#fff",
                    color: activeTab === t.id ? "#fff" : "#64748b",
                    fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s",
                    boxShadow: activeTab === t.id ? "0 4px 16px rgba(6,131,245,0.28)" : "none",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "32px 36px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                  border: "1px solid #e0eaf6",
                  width: "min(66%, 760px)",
                  margin: "0 auto",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{active.icon}</span>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1e6078", margin: 0 }}>{active.title}</h3>
                </div>
                <p style={{ color: "#475569", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>{active.text}</p>
                <ul style={{ paddingLeft: "1.2rem", marginBottom: 18, color: "#475569", lineHeight: 1.8, fontSize: 15 }}>
                  {active.bullets.map((b) => (
                    <li key={b} style={{ marginBottom: "0.45rem" }}>{b}</li>
                  ))}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "rgba(6,131,245,0.07)", border: "1px solid rgba(6,131,245,0.2)",
                        borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#0683f5", fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </section>
        </section>

        {/* Skeptic Agent callout */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ background: "#f7fbff", border: "2px solid #d9ebf5", borderRadius: 16, padding: "2rem 2.5rem" }}>
              <h2 style={{ fontSize: "clamp(1.4rem, 2vw, 1.9rem)", fontWeight: 700, color: "#01346e", marginBottom: "1rem" }}>
                Skeptic Agent — встроенный контролёр качества
              </h2>
              <p style={{ fontSize: "1.05rem", color: "#171717", lineHeight: 1.7, marginBottom: "1rem" }}>
                Каждый бизнес-план проходит внутреннюю проверку Skeptic Agent — ИИ-агента, который сверяет все ключевые цифры с живыми источниками данных. Если показатель выглядит нереалистично — доля рынка 90%, маржа 300%, окупаемость за 2 месяца — агент помечает раздел и требует корректировки до финализации документа.
              </p>
              <p style={{ fontSize: "1.05rem", color: "#171717", lineHeight: 1.7, margin: 0 }}>
                Это исключает самую частую проблему ИИ-планов: красиво выглядящие, но не выдерживающие проверки цифры.
              </p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-5" style={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #e5e7eb" }}>
          <div className="container">
            <h2 className="fw-bold mb-2" style={{ color: "#0f172a", fontSize: "1.45rem" }}>Наши продукты</h2>
            <p className="mb-4" style={{ color: "#475569", fontSize: "0.95rem", maxWidth: 640, lineHeight: 1.6 }}>
              Продукты доступны по запросу или с использованием персонального кода тестера.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {PRODUCTS.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                  <div style={{ flex: "0 1 calc(75% - 1.25rem)", minWidth: 260, backgroundColor: "#ffffff", border: "1px solid rgba(6,131,245,0.15)", borderRadius: "0.75rem", padding: "1.25rem 1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className={`bi ${p.icon}`} style={{ color: "#0683f5", fontSize: "1.2rem" }} aria-hidden />
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>{p.title}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", backgroundColor: "#f1f5f9", borderRadius: "0.3rem", padding: "0.1rem 0.5rem" }}>{p.subtitle}</span>
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "#475569", marginBottom: 0, lineHeight: 1.55 }}>{p.description}</p>
                  </div>
                  <button
                    disabled
                    style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", backgroundColor: "#e2e8f0", color: "#94a3b8", border: "none", borderRadius: "0.6rem", fontSize: "0.9rem", fontWeight: 600, cursor: "not-allowed", whiteSpace: "nowrap" }}
                  >
                    <span style={{ width: 14, height: 14, border: "2px solid #94a3b8", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spinLoader 0.9s linear infinite" }} />
                    Скоро
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <style>{`@keyframes spinLoader { to { transform: rotate(360deg); } }`}</style>

        {/* FAQ */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2rem", textAlign: "center" }}>
              Часто задаваемые вопросы
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((faq) => (
                <div key={faq.q} style={{ border: "1px solid #d9ebf5", borderRadius: 10, padding: "1.2rem 1.5rem", background: "#ffffff" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.5rem" }}>{faq.q}</h3>
                  <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Другие инструменты */}
        <section style={{ padding: "2.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#01346e", marginBottom: "1.25rem" }}>
              Другие инструменты Upgrowplan
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {[
                { href: "/ru/solutions/synthetic-customer-research", icon: "👥", title: "Synth Focus Lab", desc: "Проверьте бизнес-идею на виртуальных покупателях за 15 минут — без рекрутинга фокус-группы." },
                { href: "/ru/solutions/marketResearch/descriptionPage", icon: "🔍", title: "MarketSense AI", desc: "ИИ-агент для полноценного маркетингового исследования с верификацией данных." },
                { href: "/ru/why-upgrowplan", icon: "⚡", title: "Почему не ChatGPT?", desc: "Чем Upgrowplan отличается от ChatGPT, консультанта и шаблонов — конкретное сравнение." },
              ].map((tool) => (
                <Link key={tool.href} href={tool.href} style={{ display: "block", background: "#f7fbff", border: "1px solid #d9ebf5", borderRadius: 10, padding: "1rem 1.25rem", textDecoration: "none" }}>
                  <div style={{ fontSize: "1.3rem", marginBottom: "0.4rem" }}>{tool.icon}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#01346e", marginBottom: "0.3rem" }}>{tool.title}</div>
                  <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: 1.5 }}>{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Beta form */}
        <section
          id="beta-form"
          className="py-5 px-3"
          style={{ background: "linear-gradient(145deg, #e8f4fc 0%, #f5f9ff 45%, #eef6ff 100%)", boxShadow: "0 8px 32px rgba(6,131,245,0.08)" }}
        >
          <div className="container">
            <h2 className="h5 fw-bold mb-3" style={{ color: "#0f172a" }}>Приглашаем протестировать продукт</h2>
            <p className="mb-4" style={{ color: "#334155", maxWidth: "36rem" }}>
              Оставьте email, чтобы получить приглашение для тестирования бета-версии.
            </p>
            <BetaForm />
          </div>
        </section>

      </main>
    </div>
  );
}
