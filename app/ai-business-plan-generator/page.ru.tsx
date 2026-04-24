"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const FONT = '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif';

const faqs = [
  { q: "Что выдаёт ИИ-генератор бизнес-планов?", a: "PlanMaster AI генерирует полноценный бизнес-план: резюме, анализ рынка с конкурентами, финансовую модель (P&L, денежный поток, точка безубыточности, прогноз на 3 года), маркетинговую стратегию, операционный план и оценку рисков — в формате Word (.docx) плюс питч-презентацию." },
  { q: "Сколько времени занимает генерация?", a: "10–20 минут. Системе нужно время на сбор живых данных из 50+ источников, детерминированные Python-расчёты и проверку через Skeptic Agent перед выдачей документа." },
  { q: "Чем это отличается от ChatGPT или шаблона?", a: "Шаблоны не содержат ваших данных. ChatGPT галлюцинирует числа из обучающей выборки. PlanMaster собирает живые данные рынка, выполняет реальные расчёты и проверяет каждую цифру через Skeptic Agent." },
  { q: "Соответствует ли план стандартам ЮНИДО / ЕБРР?", a: "Да. Структура плана следует стандартам ЮНИДО и ЕБРР — международным методологиям, которые используют банки развития и инвестиционные фонды для оценки проектов." },
  { q: "Включена ли питч-презентация?", a: "Да. Помимо Word-документа PlanMaster генерирует питч-презентацию с инвестиционным тезисом, рынком, финансами и конкурентным позиционированием." },
  { q: "Для каких стран и отраслей работает?", a: "Для любых. Вы указываете страну, город, валюту и тип бизнеса (B2B / B2C / B2B2C). Система автоматически адаптирует налоги, рыночный контекст и финансовые бенчмарки." },
];

const steps = [
  { num: "01", title: "Опишите идею", text: "Укажите продукт или услугу, ключевое отличие, целевую аудиторию и страну работы. Чем точнее — тем релевантнее анализ рынка." },
  { num: "02", title: "Задайте параметры", text: "Выберите тип бизнеса (B2B/B2C/B2B2C), масштаб, отрасль и валюту. PlanMaster поддерживает любую страну и автоматически адаптирует контекст." },
  { num: "03", title: "ИИ-агенты собирают данные", text: "Search Agent сканирует 50+ живых источников: цены конкурентов, объём рынка, тренды, данные по аренде и зарплатам в регионе." },
  { num: "04", title: "Skeptic Agent проверяет каждую цифру", text: "Встроенный агент-скептик сверяет все ключевые показатели с живыми источниками. Нереалистичные допущения — помечаются и исправляются до финализации." },
  { num: "05", title: "Скачайте Word + питч", text: "Готовый бизнес-план в формате .docx и питч-презентация — доступны для скачивания без дополнительного редактирования." },
];

const deliverables = [
  { icon: "📄", title: "Резюме проекта", text: "Ключевые метрики, инвестиции, прибыль, рентабельность, окупаемость — на одной странице для инвестора." },
  { icon: "📊", title: "Анализ рынка", text: "TAM/SAM/SOM, карта конкурентов (до 20 игроков), сегменты клиентов, тренды спроса и ценовые бенчмарки." },
  { icon: "💰", title: "Финансовая модель", text: "P&L, денежный поток, точка безубыточности, прогноз выручки и расходов на 3 года. Python-расчёты без ИИ-угадывания." },
  { icon: "🎯", title: "Маркетинговая стратегия", text: "Позиционирование, каналы привлечения, ключевые сообщения — на основе реальных данных о рынке и конкурентах." },
  { icon: "📑", title: "Word-документ (.docx)", text: "Полноформатный бизнес-план с источниками данных. Готов к подаче в банк, грантовый комитет или инвестору." },
  { icon: "🚀", title: "Питч-презентация", text: "Структурированная презентация с инвестиционным тезисом, рынком, финансами и конкурентным позиционированием." },
];

export default function AiBizPlanGeneratorRu() {
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
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ru/solutions/planMaster" style={{ background: "#0683f5", color: "#fff", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>
                Создать бизнес-план
              </Link>
              <Link href="/ru/solutions/planMaster/descriptionPage" style={{ background: "transparent", color: "#1e6078", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "1rem", border: "2px solid #1e6078" }}>
                Как это работает
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

        {/* Methodology badge */}
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

        {/* How it works */}
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

        {/* CTA */}
        <section style={{ background: "#01346e", padding: "3.5rem 1rem", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#ffffff", marginBottom: "1rem" }}>
              Создайте бизнес-план прямо сейчас
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#d9ebf5", marginBottom: "2rem", lineHeight: 1.65 }}>
              PlanMaster AI — генератор бизнес-планов Upgrowplan по стандартам ЮНИДО/ЕБРР. Реальные данные, Skeptic Agent, Word + питч.
            </p>
            <Link href="/ru/solutions/planMaster" style={{ background: "#0683f5", color: "#ffffff", padding: "0.9rem 2.5rem", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "1.05rem", display: "inline-block" }}>
              Открыть PlanMaster AI
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
