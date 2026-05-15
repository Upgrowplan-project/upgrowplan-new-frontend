"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../../../components/Header";

const FONT = '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif';

const faqs = [
  {
    q: "Что такое синтетические респонденты?",
    a: "Синтетические респонденты — это ИИ-персоны с заданными демографией, доходом, возрастом и поведенческими паттернами. Они симулируют реакцию реальных покупателей на ваш продукт, цену или сообщение — без рекрутинга живых участников.",
  },
  {
    q: "Насколько точны синтетические респонденты?",
    a: "Исследования показывают 85–92% совпадение с реальными фокус-группами по намерению купить и направлению настроений. Лучше всего работают для тестирования концепций и ценового исследования на ранних этапах.",
  },
  {
    q: "Чем это отличается от традиционной фокус-группы?",
    a: "Традиционные фокус-группы — 2–4 недели рекрутинга и 150 000–500 000 руб. за сессию. Синтетические респонденты — за 15 минут, кратно дешевле, без географических ограничений.",
  },
  {
    q: "Можно ли тестировать цену?",
    a: "Да. Вы настраиваете панель под тест готовности платить при разных ценах — аналог Van Westendorp или conjoint-анализа без логистики реального опроса.",
  },
  {
    q: "Для каких задач подходит?",
    a: "Тестирование концепций, product-market fit, ценовая чувствительность, восприятие бренда, тест рекламных текстов и UX — с панелью от 5 до 50+ персон.",
  },
  {
    q: "Как начать?",
    a: "Перейдите в Synth Focus Lab, опишите вашу идею и целевую аудиторию. ИИ создаст персоны и проведёт сессию — результат через 15 минут.",
  },
  {
    q: "Как проверить бизнес-идею без опроса реальных людей?",
    a: "Используйте синтетических респондентов. Настройте ИИ-панель под целевую аудиторию — возраст, доход, образ жизни — опишите концепцию и получите оценку намерения купить, возражения и ценовой порог за 15 минут. Без рекрутинга и расходов на проведение.",
  },
  {
    q: "Как быстро протестировать бизнес-идею перед запуском?",
    a: "Synth Focus Lab позволяет протестировать идею на виртуальной панели покупателей за 15 минут — с точностью 85–92% по сравнению с реальными фокус-группами. Укажите концепцию, цену и аудиторию — и получите структурированный отчёт с инсайтами.",
  },
];

const steps = [
  {
    num: "01",
    title: "Опишите идею и аудиторию",
    text: "Укажите продукт или концепцию для тестирования. Задайте параметры аудитории: возраст, доход, город, образ жизни.",
  },
  {
    num: "02",
    title: "ИИ создаёт персоны",
    text: "Synth Focus Lab строит панель из 5–50+ ИИ-персон с уникальными демографическими и поведенческими профилями.",
  },
  {
    num: "03",
    title: "Персоны отвечают и обсуждают",
    text: "Каждая персона реагирует на вашу концепцию, задаёт вопросы, высказывает возражения — как реальный покупатель.",
  },
  {
    num: "04",
    title: "Получите отчёт с инсайтами",
    text: "Структурированный анализ: намерение купить, топ-возражения, ценовой порог, сильные и слабые стороны продукта.",
  },
];

const comparison = [
  { param: "Время", traditional: "2–4 недели", synthetic: "15 минут" },
  { param: "Стоимость", traditional: "150 000 – 500 000 руб.", synthetic: "В разы дешевле" },
  { param: "Рекрутинг", traditional: "Нужен", synthetic: "Не нужен" },
  { param: "Географические ограничения", traditional: "Да", synthetic: "Нет" },
  { param: "Повторный тест", traditional: "Дорого", synthetic: "Мгновенно" },
  { param: "Точность намерения купить", traditional: "Высокая", synthetic: "85–92%" },
];

const useCases = [
  { icon: "💡", title: "Стартапы", text: "Проверьте, нужен ли рынку ваш продукт, до привлечения инвестиций и разработки MVP." },
  { icon: "💰", title: "Ценообразование", text: "Найдите оптимальную цену — протестируйте 3–5 вариантов на разных сегментах аудитории." },
  { icon: "📣", title: "Маркетинг", text: "Протестируйте заголовки, офферы и рекламные тексты перед запуском кампании." },
  { icon: "🏪", title: "Новый рынок", text: "Оцените спрос в новом городе или стране без физического выхода на рынок." },
];

export default function SyntheticCustomerResearchRu() {
  return (
    <div style={{ fontFamily: FONT, color: "#171717" }}>
      <Header />
      <main>

        {/* Hero */}
        <section style={{ background: "#d9ebf5", padding: "4rem 1rem 3.5rem" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                background: "#1e6078",
                color: "#fff",
                borderRadius: 20,
                padding: "0.3rem 1rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "1.25rem",
                letterSpacing: "0.05em",
                fontFamily: FONT,
              }}
            >
              СИНТЕТИЧЕСКИЕ РЕСПОНДЕНТЫ
            </div>
            <h1
              style={{
                fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
                fontWeight: 700,
                color: "#1e6078",
                lineHeight: 1.15,
                marginBottom: "1.25rem",
                fontFamily: FONT,
              }}
            >
              ИИ-инструмент синтетического customer research для виртуальных покупателей
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#171717",
                maxWidth: 640,
                margin: "0 auto 2rem",
                lineHeight: 1.65,
                fontFamily: FONT,
              }}
            >
              Upgrowplan проводит синтетическое customer research на виртуальных покупателях, построенных по реальным рыночным паттернам, помогая командам проверять спрос, цены, возражения и позиционирование за минуты без рекрутинга участников.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="#beta-form"
                style={{
                  background: "#0683f5",
                  color: "#fff",
                  padding: "0.8rem 2rem",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  fontFamily: FONT,
                }}
              >
                Запустить исследование
              </Link>
              <Link
                href="#how-it-works"
                style={{
                  background: "transparent",
                  color: "#1e6078",
                  padding: "0.8rem 2rem",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  border: "2px solid #1e6078",
                  fontFamily: FONT,
                }}
              >
                Как это работает
              </Link>
            </div>
          </div>
        </section>

        {/* What are synthetic respondents */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "1.25rem",
                fontFamily: FONT,
              }}
            >
              Что такое синтетические респонденты
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#171717", lineHeight: 1.7, marginBottom: "1rem", fontFamily: FONT }}>
              <strong>Синтетический респондент</strong> — это ИИ-персона с детальным профилем: возраст, доход, профессия, ценности, покупательские привычки, отношение к риску. Не аватар и не шаблон — а модель поведения реального человека, построенная на основе рыночных данных.
            </p>
            <p style={{ fontSize: "1.1rem", color: "#171717", lineHeight: 1.7, marginBottom: "1rem", fontFamily: FONT }}>
              Когда вы тестируете продукт, эти персоны реагируют так, как реагировал бы реальный покупатель из вашей целевой аудитории. Они задают вопросы, высказывают сомнения, называют цену, которую готовы заплатить.
            </p>
            <p style={{ fontSize: "1.1rem", color: "#171717", lineHeight: 1.7, fontFamily: FONT }}>
              На этапе первичной валидации идеи, тестирования оффера или выбора ценовой стратегии синтетические респонденты дают достаточно точный сигнал за 15 минут вместо 3 недель.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "2.5rem",
                textAlign: "center",
                fontFamily: FONT,
              }}
            >
              Как работает исследование
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {steps.map((step) => (
                <div
                  key={step.num}
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    padding: "1.5rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  }}
                >
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#0683f5", marginBottom: "0.5rem", fontFamily: FONT }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.5rem", fontFamily: FONT }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0, fontFamily: FONT }}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology deep-dive */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "1.5rem",
                fontFamily: FONT,
              }}
            >
              Как строятся синтетические персоны
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  label: "Генерация персон",
                  text: "На основе продукта и локации ИИ моделирует 5–10 детализированных архетипов с уникальным поведением — от консервативных прагматиков до цифровых новаторов. На их основе создаётся панель из 25+ уникальных виртуальных респондентов.",
                },
                {
                  label: "Живой поиск и контекст",
                  text: "Система не гадает — она проверяет факты. Search Agent сканирует реальный рынок в указанной локации: находит цены конкурентов, читает живые отзывы на картах и изучает актуальные новости региона.",
                },
                {
                  label: "Культурный и социальный слой",
                  text: "Сервис анализирует социально-демографический и культурный контекст локации. Респондент в Тель-Авиве отвечает с учётом местных бизнес-традиций, а в странах со специфическими культурными нормами система автоматически учитывает ценности и табу.",
                },
                {
                  label: "400+ интервью за один цикл",
                  text: "Каждому респонденту задаются десятки глубоких вопросов. Когерентность (логика) ответов достигает 80%+. Весь цикл занимает 15–30 минут — необходимое время для сбора, верификации данных и культурного контекста.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1.1rem 1.4rem",
                    border: "1px solid #d9ebf5",
                    borderRadius: 10,
                  }}
                >
                  <div style={{ minWidth: 8, background: "#0683f5", borderRadius: 4, alignSelf: "stretch" }} />
                  <div>
                    <div style={{ fontWeight: 700, color: "#01346e", marginBottom: "0.3rem", fontFamily: FONT, fontSize: "1rem" }}>
                      {item.label}
                    </div>
                    <p style={{ margin: 0, color: "#171717", lineHeight: 1.65, fontSize: "0.95rem", fontFamily: FONT }}>
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
              <div>
                <h2 style={{ fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 700, color: "#01346e", marginBottom: "1rem", fontFamily: FONT }}>
                  Что нужно для старта
                </h2>
                <ul style={{ paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    "Описание продукта, его ключевой ценности и гипотез",
                    "Тип целевой аудитории (B2B / B2C / B2B2C)",
                    "География: страна, город, параметры выборки",
                    "Цели исследования — что хотите узнать",
                  ].map((item) => (
                    <li key={item} style={{ color: "#171717", lineHeight: 1.6, fontSize: "0.95rem", fontFamily: FONT }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 style={{ fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 700, color: "#01346e", marginBottom: "1rem", fontFamily: FONT }}>
                  Что вы получите
                </h2>
                <ul style={{ paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    "Портреты персон с мотивациями и поведенческими профилями",
                    "Результаты 400+ виртуальных интервью с анализом ответов",
                    "Рекомендации по позиционированию и ключевым сообщениям",
                    "Итоговый отчёт, готовый к презентации инвестору",
                  ].map((item) => (
                    <li key={item} style={{ color: "#171717", lineHeight: 1.6, fontSize: "0.95rem", fontFamily: FONT }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "2rem",
                textAlign: "center",
                fontFamily: FONT,
              }}
            >
              Синтетические vs традиционные фокус-группы
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem", fontFamily: FONT }}>
                <thead>
                  <tr style={{ background: "#01346e", color: "#ffffff" }}>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontWeight: 600 }}>Параметр</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 600 }}>Традиционная фокус-группа</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 600 }}>Synth Focus Lab</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={row.param} style={{ background: i % 2 === 0 ? "#f7fbff" : "#ffffff" }}>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#01346e" }}>{row.param}</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center", color: "#171717" }}>{row.traditional}</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center", color: "#0683f5", fontWeight: 600 }}>{row.synthetic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "2rem",
                textAlign: "center",
                fontFamily: FONT,
              }}
            >
              Кому и когда это нужно
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.2rem" }}>
              {useCases.map((uc) => (
                <div
                  key={uc.title}
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    padding: "1.5rem",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{uc.icon}</div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.4rem", fontFamily: FONT }}>
                    {uc.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0, fontFamily: FONT }}>
                    {uc.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "2rem",
                textAlign: "center",
                fontFamily: FONT,
              }}
            >
              Часто задаваемые вопросы
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  style={{ border: "1px solid #d9ebf5", borderRadius: 10, padding: "1.2rem 1.5rem" }}
                >
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.5rem", fontFamily: FONT }}>
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0, fontFamily: FONT }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#01346e", padding: "3.5rem 1rem", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "1rem",
                fontFamily: FONT,
              }}
            >
              Проверьте идею прямо сейчас
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#d9ebf5", marginBottom: "2rem", lineHeight: 1.65, fontFamily: FONT }}>
              Synth Focus Lab — инструмент Upgrowplan для виртуальных фокус-групп. Опишите идею, настройте аудиторию, получите отчёт за 15 минут.
            </p>
            <Link
              href="#beta-form"
              style={{
                background: "#0683f5",
                color: "#ffffff",
                padding: "0.9rem 2.5rem",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "1.05rem",
                display: "inline-block",
                fontFamily: FONT,
              }}
            >
              Открыть Synth Focus Lab
            </Link>
          </div>
        </section>

        {/* Другие инструменты */}
        <section style={{ padding: "2.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#01346e", marginBottom: "1.25rem", fontFamily: FONT }}>
              Другие инструменты Upgrowplan
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {[
                { href: "/ru/ai-business-plan-generator", icon: "📑", title: "PlanMaster AI", desc: "ИИ-генератор бизнес-планов по стандартам ЮНИДО/ЕБРР с реальными данными рынка и питч-презентацией." },
                { href: "/ru/solutions/marketResearch/descriptionPage", icon: "🔍", title: "MarketSense AI", desc: "ИИ-агент для полноценного маркетингового исследования — поиск, анализ, верификация данных." },
                { href: "/ru/why-upgrowplan", icon: "⚡", title: "Почему Upgrowplan?", desc: "Чем Upgrowplan отличается от ChatGPT, консультанта и шаблонов — конкретное сравнение." },
              ].map((tool) => (
                <Link key={tool.href} href={tool.href} style={{ display: "block", background: "#fff", border: "1px solid #d9ebf5", borderRadius: 10, padding: "1rem 1.25rem", textDecoration: "none" }}>
                  <div style={{ fontSize: "1.3rem", marginBottom: "0.4rem" }}>{tool.icon}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#01346e", marginBottom: "0.3rem", fontFamily: FONT }}>{tool.title}</div>
                  <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: 1.5, fontFamily: FONT }}>{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Beta form */}
        <section id="beta-form" className="py-5 px-3" style={{ background: "linear-gradient(145deg, #e8f4fc 0%, #f5f9ff 45%, #eef6ff 100%)" }}>
          <div className="container">
            <h2 className="h5 fw-bold mb-3" style={{ color: "#0f172a" }}>Приглашаем протестировать продукт</h2>
            <p className="mb-4" style={{ color: "#334155", maxWidth: "36rem" }}>
              Оставьте email, чтобы получить приглашение для тестирования бета-версии.
            </p>
            <SynthBetaForm />
          </div>
        </section>

      </main>
    </div>
  );
}

function SynthBetaForm() {
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
          message: `запрос на бета-тестирование Synth Focus Lab получен`,
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
        <label htmlFor="beta-email-synth-ru" className="form-label small fw-semibold text-secondary">Email</label>
        <input
          id="beta-email-synth-ru"
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
          id="beta-policy-synth-ru"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label className="form-check-label" htmlFor="beta-policy-synth-ru">
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
