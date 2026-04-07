"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../../components/Header";
import IntelligenceLabV3 from "./IntelligenceLab-v3";

// ─── ACCESS CODE MODAL ────────────────────────────────────────────────────
function AccessCodeModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "132435") {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(3px)",
          zIndex: 1040,
        }}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          padding: "2.5rem 2rem",
          width: "min(420px, 92vw)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: "1.2rem",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "rgba(6,131,245,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            fontSize: "1.4rem",
          }}
        >
          🔑
        </div>

        <h2
          id="modal-title"
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "0.5rem",
          }}
        >
          Доступ для тестеров
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#64748b",
            marginBottom: "1.75rem",
            lineHeight: 1.5,
          }}
        >
          Введите ваш персональный 6-значный код для активации системы.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="· · · · · ·"
            value={code}
            onChange={(e) => {
              setError(false);
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            }}
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
              fontSize: "2rem",
              letterSpacing: "0.5em",
              fontWeight: 700,
              padding: "0.6rem 1rem",
              border: `2px solid ${error ? "#ef4444" : "rgba(6,131,245,0.3)"}`,
              borderRadius: "0.6rem",
              outline: "none",
              color: "#0f172a",
              marginBottom: error ? "0.4rem" : "1.5rem",
              fontFamily: "ui-monospace, monospace",
            }}
            autoFocus
          />
          {error && (
            <p
              style={{
                fontSize: "0.8rem",
                color: "#ef4444",
                marginBottom: "1rem",
              }}
            >
              Неверный код. Проверьте и попробуйте снова.
            </p>
          )}
          <button
            type="submit"
            disabled={code.length !== 6}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: code.length === 6 ? "#0683f5" : "#e2e8f0",
              color: code.length === 6 ? "#fff" : "#94a3b8",
              border: "none",
              borderRadius: "0.6rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: code.length === 6 ? "pointer" : "default",
              transition: "background-color 0.2s",
            }}
          >
            Войти
          </button>
        </form>
      </div>
    </>
  );
}

// ─── PRODUCTS SECTION ─────────────────────────────────────────────────────
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

const INFO_TABS_RU = [
  {
    id: "how",
    icon: "🔍",
    label: "Как это работает",
    title: "Как это работает",
    text:
      "Сервис формирует бизнес‑план в утверждённом формате. Используются классическая методология планирования, маркетинговый и экономический анализ. Полное исследование и выдача документа занимает 5–10 минут.",
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
    text:
      "Чем точнее и полнее входные данные, тем выше качество анализа рынка, тем точнее находятся прямые конкуренты и тем реалистичнее финансовые расчёты.",
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

// ─── BETA FORM ─────────────────────────────────────────────────────────────
function BetaForm() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<"worldwide" | "soccontract">(
    "worldwide",
  );
  const [isChecked, setIsChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Введите корректный Email");
      return;
    }
    if (!isChecked) return;
    setError("");

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";
      await fetch(`${API_BASE}/api/monitoring/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          email,
          message: `Пользователь (${email}) интересуется продуктом planMaster, опция ${interest === "worldwide" ? "worldwide" : "соцконтракт"}.`,
        }),
      });
      setSubmitted(true);
      setEmail("");
      setIsChecked(false);
    } catch (err) {
      console.error("Error sending beta request:", err);
    }
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#16a34a" }}>
        <span style={{ fontSize: 20 }}>✔</span>
        <span style={{ fontWeight: 600 }}>
          Спасибо за интерес к нашему продукту! Мы сообщим вам о доступе к тестированию посредством email.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
      <div className="mb-3">
        <label
          htmlFor="beta-email"
          className="form-label small fw-semibold text-secondary"
        >
          Email
        </label>
        <input
          id="beta-email"
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
      <div className="mb-4">
        <span className="form-label small fw-semibold text-secondary d-block mb-2">
          Интерес
        </span>
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className="btn flex-fill rounded-start-3 py-2"
            style={{
              borderColor: "rgba(6,131,245,0.35)",
              backgroundColor: interest === "worldwide" ? "#0683f5" : "#fff",
              color: interest === "worldwide" ? "#fff" : "#334155",
              border: "1px solid rgba(6,131,245,0.35)",
            }}
            onClick={() => setInterest("worldwide")}
          >
            Worldwide
          </button>
          <button
            type="button"
            className="btn flex-fill rounded-end-3 py-2"
            style={{
              borderColor: "rgba(6,131,245,0.35)",
              backgroundColor:
                interest === "soccontract" ? "#0683f5" : "#fff",
              color: interest === "soccontract" ? "#fff" : "#334155",
              border: "1px solid rgba(6,131,245,0.35)",
            }}
            onClick={() => setInterest("soccontract")}
          >
            Соцконтракт
          </button>
        </div>
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="beta-policy-ru"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label className="form-check-label" htmlFor="beta-policy-ru">
          Отправляя данное сообщение, я ознакомился и согласился с{" "}
          <a href="/privacy" target="_blank">
            Политикой конфиденциальности
          </a>{" "}
          и{" "}
          <a href="/privacy" target="_blank">
            Политикой обработки персональных данных
          </a>.
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-lg w-100 rounded-3 fw-semibold border-0"
        style={{ backgroundColor: "#0683f5", color: "#fff" }}
        disabled={!isChecked}
      >
        Забронировать место в очереди
      </button>
    </form>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────
export default function PlanMasterDescriptionPageRu() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("how");
  const active = INFO_TABS_RU.find((t) => t.id === activeTab) ?? INFO_TABS_RU[0];

  const handleModalSuccess = () => {
    setShowModal(false);
    window.location.href = "/ru/solutions/socialPlanMaster";
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        <main className="flex-grow-1">
          {/* ══════════ HERO ══════════ */}
          <section
            style={{
              padding: "5rem 0 3.5rem",
              background:
                "radial-gradient(1200px 600px at 10% 10%, rgba(7,133,246,0.10), transparent 60%), linear-gradient(120deg, rgba(30,96,120,0.05), rgba(7,133,246,0.02))",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div className="container">
              {/* Kicker */}
              <p
                style={{
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#1e6078",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                Продукт Upgrowplan
              </p>

              {/* Split-color heading */}
              <h1
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.4rem)",
                  fontWeight: 700,
                  color: "#1e6078",
                  lineHeight: 1.15,
                  marginBottom: "1.25rem",
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                Лаборатория Upgrowplan:{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #0683f5 0%, #0565c8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Генератор&nbsp;бизнес-планов 2.12
                </span>
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#171717",
                  marginBottom: "2.25rem",
                  maxWidth: 620,
                  lineHeight: 1.65,
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                Мы завершаем калибровку нашей системы генерации, обогащённой
                живым поиском (RAG). Прямо сейчас агенты учатся отличать
                гипотезы от фактов, чтобы ваш бизнес-план выдержал любую
                проверку.
              </p>

              {/* Live Calibration badge */}
              <div
                className="d-none d-md-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-5"
                style={{
                  width: "fit-content",
                  fontSize: "0.7rem",
                  fontFamily: "ui-monospace, monospace",
                  letterSpacing: "0.12em",
                  color: "#0683f5",
                  backgroundColor: "rgba(6,131,245,0.08)",
                  border: "1px solid rgba(6,131,245,0.25)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#0683f5",
                    display: "inline-block",
                    animation: "heroCalibPulse 2s infinite",
                  }}
                />
                <span>[ LIVE CALIBRATION ]</span>
              </div>

              {/* Muted release note at bottom of hero */}
              <p
                style={{
                  fontSize: "0.87rem",
                  color: "#94a3b8",
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span aria-hidden>⏳</span>
                Продукт в разработке. Релиз — лето 2026.
              </p>
            </div>
          </section>

          <style>{`
            @keyframes heroCalibPulse {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0.4; }
            }
            @media (max-width: 768px) {
              .pm-tabs {
                padding: 40px 0 !important;
              }
              .pm-tabs-buttons {
                flex-direction: column !important;
                align-items: stretch !important;
              }
              .pm-tabs-buttons button {
                width: 100% !important;
                text-align: center !important;
              }
              .pm-tabs-card {
                width: 100% !important;
                padding: 24px !important;
              }
            }
          `}</style>

          {/* ══════════ ARCHITECTURE (no changes) ══════════ */}
          <IntelligenceLabV3 />

          {/* ══════════ SERVICE PRINCIPLES ══════════ */}
          <section className="container py-5">
            <section className="pm-tabs" style={{ background: "#f0f7ff", padding: "56px 0", borderRadius: 16 }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.3rem)", color: "#1e6078" }}>
                  Принципы работы сервиса.
                  <span style={{ color: "#0683f5" }}> Мы стараемся не усложнять:</span>
                </h2>
              </div>
              <div
                className="pm-tabs-buttons"
                style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}
              >
                {INFO_TABS_RU.map((t) => (
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
                  className="pm-tabs-card"
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
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1e6078", margin: 0 }}>
                      {active.title}
                    </h3>
                  </div>
                  <p style={{ color: "#475569", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
                    {active.text}
                  </p>
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
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          background: "rgba(6,131,245,0.07)",
                          border: "1px solid rgba(6,131,245,0.2)",
                          borderRadius: 8,
                          padding: "8px 16px",
                          fontSize: 13,
                          color: "#0683f5",
                          fontWeight: 600,
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

          {/* ══════════ OUR PRODUCTS ══════════ */}
          <section
            className="py-5"
            style={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #e5e7eb" }}
          >
            <div className="container">
              <h2
                className="fw-bold mb-2"
                style={{ color: "#0f172a", fontSize: "1.45rem" }}
              >
                Наши продукты
              </h2>
              <p
                className="mb-4"
                style={{
                  color: "#475569",
                  fontSize: "0.95rem",
                  maxWidth: 640,
                  lineHeight: 1.6,
                }}
              >
                Продукты доступны по запросу или с использованием персонального
                кода тестера. Если у вас уже есть 6-значный код, введите его
                для получения доступа к полной версии.
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                {PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Card (75% desktop) */}
                    <div
                      style={{
                        flex: "0 1 calc(75% - 1.25rem)",
                        minWidth: 260,
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(6,131,245,0.15)",
                        borderRadius: "0.75rem",
                        padding: "1.25rem 1.5rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div
                        className="d-flex align-items-center gap-2 mb-2"
                      >
                        <i
                          className={`bi ${p.icon}`}
                          style={{ color: "#0683f5", fontSize: "1.2rem" }}
                          aria-hidden
                        />
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "#0f172a",
                          }}
                        >
                          {p.title}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#64748b",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "0.3rem",
                            padding: "0.1rem 0.5rem",
                          }}
                        >
                          {p.subtitle}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.88rem",
                          color: "#475569",
                          marginBottom: 0,
                          lineHeight: 1.55,
                        }}
                      >
                        {p.description}
                      </p>
                    </div>

                    {/* Button */}
                    {p.status === "pending" ? (
                      <button
                        disabled
                        style={{
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.6rem 1.25rem",
                          backgroundColor: "#e2e8f0",
                          color: "#94a3b8",
                          border: "none",
                          borderRadius: "0.6rem",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          cursor: "not-allowed",
                          whiteSpace: "nowrap",
                        }}
                        title="Функционал в процессе деплоя"
                      >
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            border: "2px solid #94a3b8",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            display: "inline-block",
                            animation: "spinLoader 0.9s linear infinite",
                          }}
                        />
                        Скоро
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowModal(true)}
                        style={{
                          flexShrink: 0,
                          padding: "0.6rem 1.25rem",
                          backgroundColor: "#0683f5",
                          color: "#fff",
                          border: "none",
                          borderRadius: "0.6rem",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0565c8")
                        }
                        onMouseOut={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0683f5")
                        }
                      >
                        Попробовать →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <style>{`
            @keyframes spinLoader {
              to { transform: rotate(360deg); }
            }
          `}</style>

          {/* ══════════ BETA FORM ══════════ */}
          <section
            className="py-5 px-3"
            style={{
              background:
                "linear-gradient(145deg, #e8f4fc 0%, #f5f9ff 45%, #eef6ff 100%)",
              boxShadow: "0 8px 32px rgba(6,131,245,0.08)",
              borderRadius: "1rem",
            }}
          >
            <div className="container">
              <h2
                className="h5 fw-bold mb-3"
                style={{ color: "#0f172a" }}
              >
                Станьте бета-тестером
              </h2>
              <p
                className="mb-4"
                style={{ color: "#334155", maxWidth: "36rem" }}
              >
                Продукт почти готов. Оставьте email, чтобы получить приглашение
                в закрытую бету и вечную скидку 50% для первых 100 основателей.
              </p>
              <BetaForm />
            </div>
          </section>
        </main>
      </div>

      {/* ══════════ ACCESS CODE MODAL ══════════ */}
      {showModal && (
        <AccessCodeModal
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  );
}
